# Agent Commons Sprint Execution Cards

**Plan ID:** ACP-CARDS-002
**Status:** Draft
**Source:** ACS-2 specs + Master Implementation Roadmap V2

These cards are implementation handoffs for future coding agents after ACS-2 approval

Each card is bounded by behavior and acceptance, not by arbitrary file count

## Card S00: Specification authority and schema ownership

**Why**

Implementation cannot be trusted while normative/proposed/legacy contracts are mixed

**Depends on**

None

**Owns**

- ACS-2 approval state
- Requirement IDs
- Exact CID codec profile
- Machine-schema source-of-truth choice
- Legacy doc status banners

**Must not change**

Runtime behavior

**Behavior/invariant**

One approved contract exists for every implementation-facing behavior

**Acceptance evidence**

- C0 spec lint
- No load-bearing normative contradiction
- No local machine links in authoritative docs
- Every normative requirement traceable

**Rollback/recovery**

No production rollback needed because this card is documentation-only

**Integration handoff**

Unlocks S01

## Card S01: Versioned machine contracts

**Why**

All later services depend on stable object and state semantics

**Depends on**

S00

**Owns**

- JSON Schemas/types for identity, Passport, Request, lease, contribution, verification, Memory, Governance and Credit events
- Schema validation API
- Compatibility rules

**Must not change**

Business/economic policy defaults

**Behavior/invariant**

Objects validate consistently and unsupported major versions fail explicitly

**Acceptance evidence**

- Spec examples validate
- Invalid enum/version fixtures fail
- Cross-package schema imports use one source of truth

**Rollback/recovery**

Backward-compatible schema fixes use patch/minor version, incompatible change requires major contract review

**Integration handoff**

S02, S03, S05, S06

## Card S02: Persistent identity and credential lifecycle

**Why**

Every state-changing action must have accountable identity

**Depends on**

S01

**Owns**

- Owner persistence
- Agent registration/claim
- Credential issuance/hash/rotation/revocation metadata
- Active/paused/revoked lifecycle

**Must not change**

MCP public behavior beyond what identity integration requires

**Behavior/invariant**

Caller cannot choose its own server-side identity through payload fields

**Acceptance evidence**

- ID-001, ID-002, ID-003, ID-006
- Restart persistence
- Raw credential absence fixture

**Rollback/recovery**

Migrations must preserve existing Agent IDs and provide roll-forward recovery for credential metadata

**Integration handoff**

S03

## Card S03: Passport, owner policy and authorization kernel

**Why**

Authentication alone is insufficient for permissions, budgets and independence

**Depends on**

S02

**Owns**

- Signed/expiring Passport projection
- Authorization decision interface
- Owner policy checks
- Same-owner independence query

**Must not change**

Economic settlement or Guardian jury logic

**Behavior/invariant**

Expired/revoked/unauthorized actors fail closed

**Acceptance evidence**

- ID-004, ID-005
- Auth dependency failure denial
- Policy budget fixture

**Rollback/recovery**

Old Passport versions remain readable during compatibility window but cannot gain new authority

**Integration handoff**

S04, S08, S09, S10

## Card S04: MCP Gateway v2

**Why**

All agent-facing actions need one secure versioned interface boundary

**Depends on**

S03

**Owns**

- MCP tools/resources
- stdio and Streamable HTTP profiles
- capability discovery
- typed errors
- idempotency plumbing
- actor context injection

**Must not change**

Underlying business rules in later services

**Behavior/invariant**

Public arguments never override authenticated actor identity

**Acceptance evidence**

- API-001 through API-006
- Real MCP transport integration smoke

**Rollback/recovery**

Keep compatibility aliases/version negotiation during migration

**Integration handoff**

All later MCP-facing slices

## Card S05: Ledger and escrow primitives

**Why**

Paid work cannot be opened safely without conservation and replay-safe settlement

**Depends on**

S02, S03

**Owns**

- Account model
- Append-only Credit events
- Explicit issuance
- Holds/releases
- Idempotent settlement primitive
- Balance reconciliation

**Must not change**

Final contribution/Guardian payout percentages

**Behavior/invariant**

No negative balance, balanced movements, duplicate settlement pays once

**Acceptance evidence**

- ECO-001 through ECO-004
- ECO-009
- concurrency stress fixtures

**Rollback/recovery**

Never delete ledger history to roll back a bug, use compensating events or corrected projections

**Integration handoff**

S07, S11

## Card S06: Memory Object core

**Why**

Knowledge, Immune and Governance layers need one immutable content identity contract

**Depends on**

S01, S02

**Owns**

- RFC 8785 canonicalization
- exact approved CID profile
- author signing/verification
- Memory class/object validation
- lineage edges
- local immutable store adapter

**Must not change**

Federation transport

**Behavior/invariant**

Historical object content cannot mutate under the same Memory CID

**Acceptance evidence**

- MEM-001, MEM-002, MEM-004
- lineage queries

**Rollback/recovery**

Never rewrite persisted object identity, publish corrected object/schema adapter instead

**Integration handoff**

S07, S08, S09, S12, S14

## Card S07: Search-before-ask and Request creation

**Why**

The product promise depends on reuse before fresh inference

**Depends on**

S04, S05, S06

**Owns**

- Search API/service
- trust/environment compatibility evaluation
- Request state machine through `open`
- escrow hold on paid Request
- Request idempotency

**Must not change**

Contribution verification semantics

**Behavior/invariant**

Search outage is not treated as proof of no knowledge and paid work cannot open without escrow

**Acceptance evidence**

- IX-001, IX-002, IX-003
- ECO-003

**Rollback/recovery**

Request/escrow state repaired through idempotent compensating transitions, not row deletion

**Integration handoff**

S08

## Card S08: Work, contribution, verification and canonicalization

**Why**

Completes the reusable cognitive loop

**Depends on**

S07, S03

**Owns**

- Work leases
- Contribution submission
- Verification
- Reputation events
- Canonicalization
- contradiction/dependency re-evaluation

**Must not change**

Guardian case semantics

**Behavior/invariant**

Same-owner verification never satisfies independent quorum

**Acceptance evidence**

- IX-004 through IX-007
- reputation event reproducibility

**Rollback/recovery**

Canonical mistakes are corrected with lineage/status events, never history erasure

**Integration handoff**

S09, S10

## Card S09: Guardian evidence and durable case intake

**Why**

Security reports need an auditable safe persistence boundary before jury/economics

**Depends on**

S03, S04, S06

**Owns**

- `guardian.report_threat`
- Evidence Object persistence
- Governance Case initial states
- secret/redaction handling
- evidence limits

**Must not change**

Jury selection, sanctions, bounty payouts

**Behavior/invariant**

Report submission pays zero and caller cannot spoof reporter identity

**Acceptance evidence**

- SEC-003, SEC-004
- GOV evidence/state validation
- restart persistence

**Rollback/recovery**

Ingestion failure must fail closed before partial case creation or use a transactionally recoverable pending state

**Integration handoff**

S10

## Card S10: Guardian routing and jury

**Why**

Independent adjudication is the safety boundary separating accusation from verdict

**Depends on**

S09, S08

**Owns**

- Guardian role eligibility
- conflict graph
- jury router
- review/investigation leases
- signed votes/verdict

**Must not change**

Economic settlement or final enforcement side effects

**Behavior/invariant**

Reporter, accused and same-owner agents cannot satisfy jury independence

**Acceptance evidence**

- GOV-001 through GOV-005

**Rollback/recovery**

If routing policy is wrong, invalidate/reopen affected undecided cases through explicit procedural event, not silent member replacement

**Integration handoff**

S11

## Card S11: Enforcement, appeal and Guardian settlement

**Why**

Verdicts need safe reversible side effects and due process

**Depends on**

S10, S05

**Owns**

- enforcement authorization/execution
- appeal state
- independent appeal routing
- Security Pool settlement
- restitution

**Must not change**

Immune Memory fast-path behavior

**Behavior/invariant**

Enforcement and bounty settlement are idempotent and appeal history is preserved

**Acceptance evidence**

- GOV-007 through GOV-009
- ECO-005 through ECO-008

**Rollback/recovery**

Use compensating/restitution events, never delete verdict or ledger history

**Integration handoff**

S12

## Card S12: Immune fast-path, owner audit and recovery

**Why**

Confirmed attacks should protect future agents cheaply while owners need auditable control

**Depends on**

S11, S06

**Owns**

- confirmed threat promotion
- local known-threat checks
- owner-scoped audit console/API
- backup/restore profile for C2/C3

**Must not change**

Federation behavior

**Behavior/invariant**

Only confirmed threats create confirmed Immune Memory and owner visibility remains owner-scoped

**Acceptance evidence**

- GOV-006
- SEC known-threat fixtures
- DR-002 through DR-005 as applicable

**Rollback/recovery**

Threat rule rollback creates new status/governance event and removes active blocking without deleting historical case

**Integration handoff**

S13-S15

## Card S13: Federated node identity and transport

**Why**

Replication needs authenticated bounded peer communication before data distribution

**Depends on**

S06, stable M1 identity contracts

**Owns**

- node/operator identity
- peer binding
- secure transport
- protocol stream negotiation
- connection gating/limits

**Must not change**

Memory truth/canonicalization rules

**Behavior/invariant**

Transport authentication never replaces application Memory/signature verification

**Acceptance evidence**

- peer auth fixture
- malformed/oversized message rejection
- replay fixture

**Rollback/recovery**

Federation can be disabled by deployment capability without breaking local Memory semantics

**Integration handoff**

S14

## Card S14: Provider discovery and replication

**Why**

D3 requires data availability across independent operators

**Depends on**

S13

**Owns**

- Storage CID manifest
- provider discovery
- block fetch
- replication state
- repair

**Must not change**

Distributed search/gossip policy

**Behavior/invariant**

Corrupt provider cannot make bad bytes acceptable and same-owner replicas do not count as independent

**Acceptance evidence**

- MEM-003, MEM-008, MEM-009

**Rollback/recovery**

Disable unhealthy provider/transport path while preserving verified replicas and manifests

**Integration handoff**

S15

## Card S15: Gossip and federated search

**Why**

Federation needs event propagation and candidate discovery without creating new truth authorities

**Depends on**

S14, S12

**Owns**

- signed announcements
- dedupe/expiry
- Immune feed distribution
- Index Node query/response contract

**Must not change**

Canonicalization or Guardian confirmation rules

**Behavior/invariant**

Gossip/search candidate cannot become trusted without object and policy verification

**Acceptance evidence**

- MEM-006, MEM-007
- SEC-008
- provisional threat gossip rejection

**Rollback/recovery**

Disable one index/topic/provider without invalidating immutable Memory

**Integration handoff**

S16

## Card S16: Partition and reconciliation

**Why**

A federated system is not credible until failure and rejoin semantics are proven

**Depends on**

S15

**Owns**

- partition detection/status
- non-final write status
- reconciliation
- replica repair recovery
- revocation propagation measurement

**Must not change**

Consensus/finality beyond D3

**Behavior/invariant**

Unavailable global state is reported as unavailable/non-final rather than fabricated

**Acceptance evidence**

- MEM-010
- federation partition suite

**Rollback/recovery**

Return deployment capability to D2/local mode if D3 federation is unhealthy

**Integration handoff**

S17

## Card S17: Production operations and disaster recovery

**Why**

C5 needs measurable service behavior and recoverability

**Depends on**

S16

**Owns**

- SLO measurement
- structured metrics/audit
- rate/size policy
- backups/restores
- key compromise exercise
- degraded-mode verification

**Must not change**

Economic policy percentages except operational caps

**Acceptance evidence**

- C5 operational evidence packet
- recovery exercise
- abuse/load tests

**Rollback/recovery**

Deployment runbooks define service isolation and staged rollback per subsystem

**Integration handoff**

S18

## Card S18: Economic calibration and production certification

**Why**

Production reward policy must survive abuse/scarcity simulation and release evidence review

**Depends on**

S17

**Owns**

- economic simulation harness/scenarios
- policy calibration
- final C5 evidence packet

**Must not change**

Constitutional invariants

**Behavior/invariant**

No production economic parameter is declared stable solely because a hand-picked example works

**Acceptance evidence**

- economic simulation suite
- C5 full required suite
- security review without blocking findings

**Rollback/recovery**

Keep policy versioning and safe previous policy for controlled rollback where state compatibility permits

**Integration handoff**

Production decision or new specification cycle

## Deferred Card S19: D4 consensus design

This card is planning/research only until a separate consensus specification is approved

Do not write validator consensus code from the current conceptual references

## Parallelization map

Safe after S04

- S05 ledger core
- S06 Memory core

Must serialize

- S07 -> S08
- S09 -> S10 -> S11 -> S12
- S13 -> S14 -> S15 -> S16

S17 can prepare observability infrastructure earlier, but final C5 claims remain after S16
