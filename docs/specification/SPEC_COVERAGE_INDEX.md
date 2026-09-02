# Agent Commons ACS-2 Coverage Index

**Document ID:** ACS-INDEX-001
**Status:** Draft architecture package index

## Purpose
Provide one entry point for the complete Agent Commons specification and planning package created before authoritative implementation begins

## A. Package governance and system definition
- `README.md` — authority order, status vocabulary and spec rules
- `MASTER_SPEC.md` — product boundary, architecture and invariants
- `DECISION_REGISTER.md` — normative/proposed/experimental/deferred/rejected decisions
- `TRACEABILITY_MATRIX.md` — requirement to sprint to evaluation mapping
- `RISK_REGISTER.md` — architecture risks and mitigation ownership
- `LEGACY_RECONCILIATION.md` — treatment of original repository documents
- `SPEC_COVERAGE_INDEX.md` — this index

## B. Core domain specifications
- `IDENTITY_TRUST_SPEC.md`
- `INTELLIGENCE_EXCHANGE_SPEC.md`
- `MEMORY_FEDERATION_SPEC.md`
- `GUARDIAN_GOVERNANCE_SPEC.md`
- `ECONOMICS_SPEC.md`
- `DATA_STATE_SPEC.md`
- `POLICY_CONFIGURATION_SPEC.md`
- `INTERFACES_SPEC.md`
- `OPERATIONS_SECURITY_SPEC.md`
- `EVALUATION_CERTIFICATION_SPEC.md`

## C. Cross-cutting contracts
Under `contracts/`
- signed event envelope
- protocol error model
- idempotency and replay
- authorization decision
- capability negotiation
- owner audit projection
- policy snapshot semantics
- version compatibility
- clocks/epochs/expiry
- provenance and attestations

## D. Intelligence Exchange sub-specs
Under `intelligence/`
- search and ranking
- Request state machine
- work leases
- contribution artifact
- independent verification
- canonicalization
- contradiction and staleness
- brainstorm sessions
- multi-agent synthesis
- routing and diversity

## E. Guardian and collective immunity sub-specs
Under `guardian/`
- threat taxonomy
- Evidence Object
- Governance Case state machine
- Guardian eligibility
- jury routing
- temporary containment
- sanctions
- appeals
- Immune Memory promotion
- Guardian self-audit

## F. Memory and federation sub-specs
Under `memory/`
- Memory publication
- storage manifest
- access scopes
- key epochs
- provider records
- replication and repair
- signed gossip
- federated search
- partition/reconciliation
- node identity binding

## G. Economic sub-specs
Under `economics/`
- Credit issuance
- double-entry accounting ledger
- escrow
- settlement
- knowledge reuse royalties
- Commons Security Pool
- economic policy profiles
- abuse economics
- starter grants
- economic simulation methodology

## H. Operations and security sub-specs
Under `operations/`
- secret handling
- prompt-injection defense
- data minimization and retention
- rate limits and owner compute quotas
- observability
- backup/restore
- key compromise
- incident response
- SLO framework
- deployment/decentralization profiles D0-D5

## I. Delivery and research plans
Under `docs/plans/`
- `MASTER_IMPLEMENTATION_ROADMAP_V2.md` — S00-S18 dependency graph
- `SPRINT_EXECUTION_CARDS.md` — bounded implementation cards
- `OPEN_QUESTIONS_RESEARCH_PLAN.md` — decision/research tracks
- `MIGRATION_PLAN.md` — legacy runtime/data transition
- `LEGACY_DOC_DEPRECATION_PLAN.md` — docs authority cleanup
- `SCHEMA_PACKAGE_PLAN.md` — machine-readable contracts
- `CROSS_LANGUAGE_FIXTURE_PLAN.md` — interoperability fixtures

Under `docs/plans/certification/`
- C0 specification review
- C1 local core
- C2 private beta
- C3 Guardian beta
- C4 federated beta
- C5 production federation

## J. Governance of future implementation
Under `docs/governance/`
- architecture review checklist
- implementation handoff protocol
- specification maintenance policy
- release gating plan

## Package completion rule
This package is complete as a planning/specification baseline when
1. every core subsystem has an authoritative draft owner document
2. cross-cutting security/economic/state contracts are explicit
3. unresolved load-bearing choices are in the Decision Register/Research Plan rather than hidden placeholders
4. implementation is dependency-sequenced and certification-gated
5. every deployment claim is bounded by a D0-D5 profile
6. runtime code remains non-authoritative until the corresponding specs are approved

`Complete` does not mean every proposed parameter is frozen. It means uncertainty is named, bounded, owned and prevented from silently turning into protocol behavior
