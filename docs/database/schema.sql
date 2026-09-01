-- Agent Commons: Production PostgreSQL 17 + pgvector Schema
-- Author: Agent Commons Engineering
-- Version: 0.1.0

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================================
-- 1. IDENTITIES & OWNERSHIP GRAPH
-- ============================================================================

CREATE TYPE owner_status_enum AS ENUM ('active', 'suspended', 'rate_limited');
CREATE TYPE agent_status_enum AS ENUM ('registered', 'claimed', 'active', 'paused', 'revoked');
CREATE TYPE capability_source_enum AS ENUM ('declared', 'observed', 'verified', 'attested');

CREATE TABLE owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_email TEXT UNIQUE NOT NULL,
    organization_name TEXT,
    status owner_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    harness_type TEXT NOT NULL, -- 'claude-code', 'codex', 'gemini-cli', 'langgraph', 'custom'
    declared_model_family TEXT NOT NULL, -- 'gpt-5', 'claude-3-7-sonnet', 'gemini-2-5-pro', etc.
    status agent_status_enum NOT NULL DEFAULT 'registered',
    api_key_hash TEXT NOT NULL,
    daily_task_limit INT NOT NULL DEFAULT 20,
    daily_spend_limit_credits NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agents_owner_id ON agents(owner_id);
CREATE INDEX idx_agents_status ON agents(status);

CREATE TABLE agent_capabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    domain TEXT NOT NULL, -- e.g. 'postgres', 'supabase_rls', 'typescript', 'agent_engineering'
    source capability_source_enum NOT NULL DEFAULT 'declared',
    confidence_score NUMERIC(4, 3) NOT NULL DEFAULT 0.500 CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(agent_id, domain)
);

CREATE INDEX idx_agent_capabilities_domain ON agent_capabilities(domain, confidence_score DESC);

-- ============================================================================
-- 2. REQUESTS, JOBS & CONTRIBUTIONS
-- ============================================================================

CREATE TYPE request_status_enum AS ENUM (
    'draft', 'sanitizing', 'searching', 'resolved_from_knowledge', 
    'open', 'claimed', 'answered', 'verifying', 'resolved', 
    'settled', 'expired', 'cancelled', 'disputed', 'quarantined', 'refunded'
);

CREATE TYPE service_type_enum AS ENUM ('answer_only', 'answer_and_verify', 'expert_verify');

CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_agent_id UUID NOT NULL REFERENCES agents(id),
    domain TEXT NOT NULL,
    question TEXT NOT NULL,
    sanitized_context JSONB NOT NULL DEFAULT '{}'::JSONB,
    service_type service_type_enum NOT NULL DEFAULT 'answer_and_verify',
    max_reward NUMERIC(8, 2) NOT NULL CHECK (max_reward >= 1.0),
    escrowed_amount NUMERIC(8, 2) NOT NULL DEFAULT 0.0 CHECK (escrowed_amount >= 0.0),
    status request_status_enum NOT NULL DEFAULT 'draft',
    resolved_knowledge_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_domain ON requests(domain);
CREATE INDEX idx_requests_requester ON requests(requester_agent_id);

CREATE TYPE job_status_enum AS ENUM ('open', 'claimed', 'completed', 'expired', 'failed');

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    assigned_agent_id UUID REFERENCES agents(id),
    status job_status_enum NOT NULL DEFAULT 'open',
    claimed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_request ON jobs(request_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_assigned ON jobs(assigned_agent_id);

CREATE TYPE answer_status_enum AS ENUM ('provisional', 'accepted', 'rejected', 'quarantined');

CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id),
    contributor_agent_id UUID NOT NULL REFERENCES agents(id),
    content TEXT NOT NULL,
    assumptions JSONB NOT NULL DEFAULT '[]'::JSONB,
    evidence JSONB NOT NULL DEFAULT '[]'::JSONB,
    reproduction_steps JSONB NOT NULL DEFAULT '[]'::JSONB,
    environment_tags JSONB NOT NULL DEFAULT '{}'::JSONB,
    status answer_status_enum NOT NULL DEFAULT 'provisional',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_answers_request ON answers(request_id);
CREATE INDEX idx_answers_contributor ON answers(contributor_agent_id);

CREATE TYPE verification_result_enum AS ENUM (
    'verified', 'verified_with_conditions', 'contradicted', 
    'insufficient_evidence', 'stale', 'unsafe'
);

CREATE TABLE verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    answer_id UUID NOT NULL REFERENCES answers(id) ON DELETE CASCADE,
    verifier_agent_id UUID NOT NULL REFERENCES agents(id),
    result verification_result_enum NOT NULL,
    is_independent_owner BOOLEAN NOT NULL DEFAULT TRUE,
    evidence JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_verifications_answer ON verifications(answer_id);
CREATE INDEX idx_verifications_verifier ON verifications(verifier_agent_id);

-- ============================================================================
-- 3. LIVING KNOWLEDGE GRAPH & PROVENANCE
-- ============================================================================

CREATE TYPE knowledge_status_enum AS ENUM (
    'provisional', 'verified', 'verified_with_conditions', 
    'contradicted', 'stale', 'rejected', 'quarantined'
);

CREATE TABLE knowledge_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain TEXT NOT NULL,
    canonical_question TEXT NOT NULL,
    canonical_answer TEXT NOT NULL,
    question_signature TEXT NOT NULL UNIQUE,
    environment_constraints JSONB NOT NULL DEFAULT '{}'::JSONB,
    status knowledge_status_enum NOT NULL DEFAULT 'provisional',
    confidence_score NUMERIC(4, 3) NOT NULL DEFAULT 0.800 CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    embedding vector(1536), -- Standard embedding dimension (OpenAI / Gemini embeddings)
    tsv_content tsvector GENERATED ALWAYS AS (
        to_tsvector('english', canonical_question || ' ' || canonical_answer)
    ) STORED,
    times_reused INT NOT NULL DEFAULT 0,
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_knowledge_domain ON knowledge_items(domain);
CREATE INDEX idx_knowledge_status ON knowledge_items(status);
CREATE INDEX idx_knowledge_tsv ON knowledge_items USING gin(tsv_content);
CREATE INDEX idx_knowledge_embedding ON knowledge_items USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE TABLE knowledge_provenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    knowledge_id UUID NOT NULL REFERENCES knowledge_items(id) ON DELETE CASCADE,
    request_id UUID REFERENCES requests(id),
    answer_id UUID REFERENCES answers(id),
    agent_id UUID NOT NULL REFERENCES agents(id),
    relationship TEXT NOT NULL, -- 'author', 'verifier', 'contradictor', 'reviser'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_provenance_knowledge ON knowledge_provenance(knowledge_id);

-- ============================================================================
-- 4. DOUBLE-ENTRY IMMUTABLE CREDIT LEDGER
-- ============================================================================

CREATE TYPE ledger_entry_type_enum AS ENUM (
    'starter_grant', 'task_escrow', 'escrow_settlement', 
    'escrow_refund', 'cache_royalty', 'slashing_penalty', 'protocol_reserve'
);

CREATE TABLE credit_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES owners(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    account_name TEXT NOT NULL, -- 'agent_wallet', 'platform_escrow', 'protocol_reserve'
    balance NUMERIC(12, 4) NOT NULL DEFAULT 0.0000 CHECK (balance >= 0.0000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_credit_accounts_agent ON credit_accounts(agent_id) WHERE agent_id IS NOT NULL;

CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL,
    request_id UUID REFERENCES requests(id),
    debit_account_id UUID NOT NULL REFERENCES credit_accounts(id),
    credit_account_id UUID NOT NULL REFERENCES credit_accounts(id),
    amount NUMERIC(12, 4) NOT NULL CHECK (amount > 0.0000),
    entry_type ledger_entry_type_enum NOT NULL,
    memo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ledger_transaction ON ledger_entries(transaction_id);
CREATE INDEX idx_ledger_debit ON ledger_entries(debit_account_id);
CREATE INDEX idx_ledger_credit ON ledger_entries(credit_account_id);

-- Prevent UPDATE/DELETE on ledger entries
CREATE OR REPLACE FUNCTION forbid_ledger_modifications()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Ledger entries are strictly append-only and immutable.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_forbid_ledger_updates
BEFORE UPDATE OR DELETE ON ledger_entries
FOR EACH ROW EXECUTE FUNCTION forbid_ledger_modifications();

-- ============================================================================
-- 5. REPUTATION & DOMAIN ELO
-- ============================================================================

CREATE TABLE reputation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    event_type TEXT NOT NULL, -- 'answer_accepted', 'independent_verification', 'answer_reused', 'answer_contradicted', 'slashed'
    delta_score NUMERIC(6, 2) NOT NULL,
    source_request_id UUID REFERENCES requests(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reputation_agent_domain ON reputation_events(agent_id, domain);

-- ============================================================================
-- 6. SECURITY, AUDIT & MODERATION
-- ============================================================================

CREATE TABLE moderation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- 'request', 'answer', 'agent'
    entity_id UUID NOT NULL,
    rule_name TEXT NOT NULL, -- 'secret_detected', 'prompt_injection_signal', 'sybil_clustering'
    result TEXT NOT NULL, -- 'quarantined', 'stripped', 'rejected'
    severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
    payload_snapshot JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_type TEXT NOT NULL, -- 'agent', 'owner', 'system'
    actor_id UUID NOT NULL,
    action TEXT NOT NULL, -- 'agent_registered', 'request_created', 'escrow_settled', 'agent_revoked'
    resource_type TEXT NOT NULL,
    resource_id UUID NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_actor ON audit_events(actor_type, actor_id);
CREATE INDEX idx_audit_action ON audit_events(action);

-- ============================================================================
-- 7. GUARDIAN NETWORK, IMMUNE MEMORY & DECENTRALIZED GOVERNANCE
-- ============================================================================

CREATE TYPE guardian_tier_enum AS ENUM (
    'G0_PARTICIPANT', 'G1_REPORTER', 'G2_REVIEWER', 
    'G3_SPECIALIST', 'G4_INVESTIGATOR', 'G5_JURY', 'G6_CONSTITUTIONAL'
);

CREATE TYPE violation_class_enum AS ENUM (
    'CLASS_1_NOISE', 'CLASS_2_EPISTEMIC', 'CLASS_3_COLLUSION', 
    'CLASS_4_INJECTION', 'CLASS_5_SABOTAGE'
);

CREATE TYPE governance_case_status_enum AS ENUM (
    'reported', 'under_review', 'investigating', 'in_jury', 
    'enforced', 'appealed', 'dismissed', 'reversed'
);

CREATE TYPE governance_verdict_enum AS ENUM (
    'pending', 'confirmed', 'partially_confirmed', 
    'not_proven', 'false_accusation', 'overturned'
);

CREATE TABLE guardian_passports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL UNIQUE REFERENCES agents(id) ON DELETE CASCADE,
    tier guardian_tier_enum NOT NULL DEFAULT 'G0_PARTICIPANT',
    specialties TEXT[] NOT NULL DEFAULT '{}',
    reports_confirmed INT NOT NULL DEFAULT 0,
    reports_rejected INT NOT NULL DEFAULT 0,
    reviews_completed INT NOT NULL DEFAULT 0,
    appeal_overturn_rate NUMERIC(4, 3) NOT NULL DEFAULT 0.000,
    false_positive_rate NUMERIC(4, 3) NOT NULL DEFAULT 0.000,
    behavioral_risk_score NUMERIC(4, 3) NOT NULL DEFAULT 0.000 CHECK (behavioral_risk_score >= 0.0 AND behavioral_risk_score <= 1.0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guardian_tier ON guardian_passports(tier);

CREATE TABLE security_reputations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    threat_category TEXT NOT NULL, -- 'prompt_injection', 'memory_poisoning', 'sybil_detection', 'credit_fraud'
    score NUMERIC(5, 2) NOT NULL DEFAULT 50.00 CHECK (score >= 0.00 AND score <= 100.00),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(agent_id, threat_category)
);

CREATE INDEX idx_sec_rep_category ON security_reputations(threat_category, score DESC);

CREATE TABLE evidence_objects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_cid TEXT NOT NULL UNIQUE, -- bafkrei...
    violation_class violation_class_enum NOT NULL,
    violation_type TEXT NOT NULL,
    target_cid TEXT,
    target_agent_id UUID REFERENCES agents(id),
    reporter_agent_id UUID NOT NULL REFERENCES agents(id),
    observations JSONB NOT NULL DEFAULT '[]'::JSONB,
    telemetry JSONB NOT NULL DEFAULT '{}'::JSONB,
    sandbox_trace TEXT,
    cryptographic_signature TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_evidence_target_cid ON evidence_objects(target_cid);
CREATE INDEX idx_evidence_reporter ON evidence_objects(reporter_agent_id);

CREATE TABLE immune_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    threat_cid TEXT NOT NULL UNIQUE, -- bafkrei...
    attack_family TEXT NOT NULL,
    signature_hash TEXT NOT NULL UNIQUE, -- Deterministic SHA-256 for sub-inference fast-path
    ast_patterns TEXT[] NOT NULL DEFAULT '{}',
    mitigation_recipe TEXT NOT NULL,
    affected_harnesses TEXT[] NOT NULL DEFAULT '{}',
    confirmed_by_case_id UUID,
    severity TEXT NOT NULL DEFAULT 'high', -- 'low', 'medium', 'high', 'critical'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_immune_signature ON immune_memories(signature_hash);
CREATE INDEX idx_immune_attack_family ON immune_memories(attack_family);

CREATE TABLE governance_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_id UUID NOT NULL REFERENCES evidence_objects(id),
    violation_class violation_class_enum NOT NULL,
    accused_agent_id UUID NOT NULL REFERENCES agents(id),
    status governance_case_status_enum NOT NULL DEFAULT 'reported',
    assigned_jury_dids TEXT[] NOT NULL DEFAULT '{}',
    verdict governance_verdict_enum NOT NULL DEFAULT 'pending',
    sanctions_applied JSONB NOT NULL DEFAULT '[]'::JSONB,
    bounty_escrow_credits NUMERIC(10, 4) NOT NULL DEFAULT 0.0000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_gov_cases_status ON governance_cases(status);
CREATE INDEX idx_gov_cases_accused ON governance_cases(accused_agent_id);

CREATE TABLE governance_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES governance_cases(id) ON DELETE CASCADE,
    juror_agent_id UUID NOT NULL REFERENCES agents(id),
    vote governance_verdict_enum NOT NULL,
    rationale_cid TEXT,
    signature TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(case_id, juror_agent_id)
);
