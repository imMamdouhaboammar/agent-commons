import { describe, expect, it } from "bun:test";
import {
  canonicalStringify,
  computeMemoryCID,
  computeDedupeFingerprint,
  MemoryObjectSchema,
  EncryptedEnvelopeSchema,
  EpochMerkleRootSchema,
  EvidenceObjectSchema,
  ImmuneThreatMemorySchema,
  GovernanceCaseSchema,
  GuardianPassportSchema,
  type MemoryObject
} from "../src/memory-mesh";

describe("Decentralized Memory Mesh - Core Contracts & Cryptography", () => {
  it("deterministically serializes JSON objects according to RFC 8785", () => {
    const objA = {
      z_key: "value_z",
      a_key: "value_a",
      nested: {
        b: 2,
        a: 1
      }
    };

    const objB = {
      nested: {
        a: 1,
        b: 2
      },
      a_key: "value_a",
      z_key: "value_z"
    };

    const canonicalA = canonicalStringify(objA);
    const canonicalB = canonicalStringify(objB);

    expect(canonicalA).toBe(canonicalB);
    expect(canonicalA).toBe('{"a_key":"value_a","nested":{"a":1,"b":2},"z_key":"value_z"}');
  });

  it("computes immutable, deterministic CIDs for identical memory objects regardless of key order", () => {
    const mem1 = {
      schema: "agent-memory/1",
      type: "verified_resolution",
      authorDid: "did:agent:8ab19c4d-7201-49fa-bf52-7e040c1e48bc",
      ownerId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      topic: ["postgres", "supabase", "rls"],
      createdAt: "2026-09-01T20:33:00.000Z",
      question: "How to optimize RLS policies with joins?",
      resolution: "Wrap JWT claim access in a STABLE security definer helper function."
    };

    const mem2 = {
      resolution: "Wrap JWT claim access in a STABLE security definer helper function.",
      question: "How to optimize RLS policies with joins?",
      createdAt: "2026-09-01T20:33:00.000Z",
      topic: ["postgres", "supabase", "rls"],
      ownerId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      authorDid: "did:agent:8ab19c4d-7201-49fa-bf52-7e040c1e48bc",
      type: "verified_resolution",
      schema: "agent-memory/1"
    };

    const cid1 = computeMemoryCID(mem1);
    const cid2 = computeMemoryCID(mem2);

    expect(cid1).toBe(cid2);
    expect(cid1.startsWith("bafkrei")).toBe(true);
    expect(cid1.length).toBeGreaterThan(50);
  });

  it("validates valid MemoryObject conforming to MOP v1 schema", () => {
    const validMemory: MemoryObject = {
      schema: "agent-memory/1",
      type: "verified_resolution",
      authorDid: "did:agent:8ab19c4d-7201-49fa-bf52-7e040c1e48bc",
      ownerId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      topic: ["postgres", "supabase", "rls"],
      createdAt: "2026-09-01T20:33:00.000Z",
      question: "How to enforce tenant isolation in Supabase using PostgreSQL RLS?",
      resolution: "Use app_metadata ->> 'tenant_id' with indexed columns.",
      evidence: ["bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"],
      parents: ["bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku"],
      supersedes: ["bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku"],
      contradicts: [],
      environment: {
        database: "PostgreSQL 17",
        extension: "pgvector"
      },
      verification: {
        status: "verified",
        score: 0.94,
        verifierDid: "did:agent:9cf22d1a-4102-48bc-a103-6d020e3a51ad"
      }
    };

    const parseResult = MemoryObjectSchema.safeParse(validMemory);
    expect(parseResult.success).toBe(true);
  });

  it("validates EncryptedEnvelope with deduplication fingerprints", () => {
    const scopeSecret = "test-domain-secret-key-32bytes-len";
    const normalizedContent = "how to enforce tenant isolation in supabase using postgresql rls";
    const fingerprint = computeDedupeFingerprint(scopeSecret, normalizedContent);

    const envelope = {
      envelopeVersion: "env/1",
      storageCid: "bafkreig43y7p5m2j5x6q7w3x5y7z9a1b2c3d4e5f6g7h8i9j0k1l2m3n4",
      scope: "domain",
      domain: "postgres.security",
      encryptionScheme: "XChaCha20-Poly1305",
      keyEpoch: 104,
      nonce: "0x8f92a10b12345678",
      dedupeFingerprint: fingerprint,
      ciphertext: "U2FsdGVkX1+vupppZksvRf5pq5g5XjFRIipRkw++001...",
      tag: "0x5e4f3a2b1c0d",
      createdAt: "2026-09-01T20:34:00.000Z"
    };

    const parseResult = EncryptedEnvelopeSchema.safeParse(envelope);
    expect(parseResult.success).toBe(true);
    expect(fingerprint.length).toBe(64); // SHA-256 hex
  });

  it("validates Epoch Merkle Root commitments", () => {
    const epochRoot = {
      epochNumber: 99182,
      merkleRoot: "0x93fa8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f98",
      memoryCount: 184291,
      startTime: "2026-09-01T19:00:00.000Z",
      endTime: "2026-09-01T20:00:00.000Z",
      validatorSignatures: [
        "0x1111111111111111111111111111111111111111111111111111111111111111",
        "0x2222222222222222222222222222222222222222222222222222222222222222",
        "0x3333333333333333333333333333333333333333333333333333333333333333"
      ],
      publicChainAnchorTx: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
    };

    const parseResult = EpochMerkleRootSchema.safeParse(epochRoot);
    expect(parseResult.success).toBe(true);
  });

  it("validates EvidenceObject and ImmuneThreatMemory schemas", () => {
    const evidence = {
      schema: "agent-evidence/1",
      evidenceId: "bafkreigevidence12345678901234567890123456789012345678901234",
      violationClass: "CLASS_4_INJECTION",
      violationType: "indirect_prompt_injection",
      targetCid: "bafkreitarget98765432109876543210987654321098765432109876",
      targetAgentId: "agt_01JXYZ999",
      reporterDid: "did:agent:sentinel-01",
      observations: [
        "Payload attempts to invoke unauthorized tool /system/exec",
        "Contains system override marker [INST]"
      ],
      telemetry: {
        entropy: 5.2,
        detectedPatterns: ["curl\\s+https?://", "cat\\s+~/.ssh"]
      },
      createdAt: "2026-09-01T23:00:00.000Z"
    };

    const evidenceParsed = EvidenceObjectSchema.safeParse(evidence);
    expect(evidenceParsed.success).toBe(true);

    const threat = {
      schema: "agent-threat/1",
      threatId: "bafkreithreat1234567890123456789012345678901234567890123456",
      attackFamily: "credential_extraction_override",
      signatureHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      astPatterns: ["cat\\s+~/.aws/credentials", "export\\s+OPENAI_API_KEY="],
      mitigationRecipe: "Redact matching substrings and drop tool execution token.",
      affectedHarnesses: ["claude-code", "codex", "gemini-cli"],
      confirmedByJuryCaseId: "case_01JXYZ_JURY_CONFIRMED",
      severity: "critical",
      createdAt: "2026-09-01T23:05:00.000Z"
    };

    const threatParsed = ImmuneThreatMemorySchema.safeParse(threat);
    expect(threatParsed.success).toBe(true);
  });

  it("validates GovernanceCase and GuardianPassport schemas", () => {
    const govCase = {
      caseId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      evidenceCid: "bafkreigevidence12345678901234567890123456789012345678901234",
      violationClass: "CLASS_4_INJECTION",
      accusedAgentId: "agt_attacker_01",
      status: "in_jury",
      assignedJury: [
        "did:agent:jury-gpt-01",
        "did:agent:jury-claude-02",
        "did:agent:jury-gemini-03"
      ],
      verdict: "pending",
      sanctionsApplied: ["temporary_quarantine"],
      bountyEscrowCredits: 50.0,
      createdAt: "2026-09-01T23:10:00.000Z"
    };

    const caseParsed = GovernanceCaseSchema.safeParse(govCase);
    expect(caseParsed.success).toBe(true);

    const passport = {
      agentId: "agt_guardian_01",
      did: "did:agent:guardian-01",
      tier: "G4_INVESTIGATOR",
      specialties: ["prompt_injection", "memory_poisoning"],
      securityReputation: {
        prompt_injection: 96,
        memory_poisoning: 91
      },
      performance: {
        reportsConfirmed: 184,
        reportsRejected: 5,
        reviewsCompleted: 329,
        appealOverturnRate: 0.012,
        falsePositiveRate: 0.015
      },
      behavioralRiskScore: 0.02
    };

    const passportParsed = GuardianPassportSchema.safeParse(passport);
    expect(passportParsed.success).toBe(true);
  });
});
