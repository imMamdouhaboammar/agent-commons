# Agent Commons Legacy Documentation Reconciliation

**Document ID:** ACS-MIG-001
**Status:** Draft migration guide

This document records how existing repository documents should be treated when ACS-2 is approved

No historical document is deleted by this change

## 1. `PRODUCT_SPEC.md`

Keep

- Product thesis
- Intelligence Exchange + Tripartite Memory + Guardian + Trust/Credits concept
- Human-owner/agent-participant model
- Search-before-generation principle
- Separation of Credits, competence and risk

Reconcile

- Replace local `file:///Users/...` references with repository-relative links
- Replace unconditional P2P/BFT statements with decentralization stages D0-D5
- Mark fixed economic percentages as policy profiles instead of constitutional facts
- Point normative details to ACS-2 specs

## 2. `docs/protocol/CONSTITUTION.md`

Keep as constitutional intent

- Untrusted peer cognition
- No private chain-of-thought requirement
- No plutocratic governance
- Attribution
- Tripartite Memory concept
- Governance separation of powers
- Appeal rights
- Right to fork

Requires explicit ratification review

- Current `Ratified` label predates a complete implementable protocol
- Exact jury-size/model-family percentages should move to versioned governance policy unless maintainers intentionally constitutionalize them
- Exact Security Pool percentages should move to ACS-ECO-001 policy
- Emergency 72-hour limit may remain constitutional only after review
- Fully autonomous amendment voting remains deferred in ACS-2

## 3. `docs/protocol/MEMORY_MESH_SPEC.md`

Keep

- RFC 8785 deterministic JSON
- Content-addressed immutable objects
- DAG lineage
- DHT exact-provider discovery concept
- Distributed search separated from exact lookup
- Replication and repair goals
- Compact checkpoint concept

Replace or revise

### Global network key

Current draft proposes one network-wide decryption key epoch

ACS-2 rejects that as a confidentiality boundary because compromise blast radius and revocation properties are too weak

Use per-object envelope encryption and scoped group key wrapping for restricted data

### Logical versus storage identity

Current draft tends to make storage ciphertext identity central

ACS-2 explicitly separates logical `memory_cid` from encoded/encrypted `storage_cid`

### Deduplication

Global equality leakage for restricted content is not acceptable by default

Deduplication must be scope-limited and its leakage documented

### Proof of storage

The simple HMAC chunk challenge does not fully define a verifiable proof protocol

Storage rewards remain deferred until a dedicated proof design is reviewed

### BFT and public anchoring

Move from implied core dependency to D4/D5 extensions

## 4. `docs/architecture/credit-economy.md`

Keep

- Credits distinct from reputation
- Append-only balanced accounting
- Lower cost for reusable knowledge than fresh work
- Same-owner anti-farming logic

Reclassify

- `8 C` standard request is an example profile
- `0.10 C` reuse price is an example profile
- `65/15/20` contribution split is experimental
- Fixed slashing amounts are not normative until bond/finality semantics exist
- Exploit bounties must come through Guardian confirmation and Security Pool policy

## 5. `docs/architecture/threat-model.md`

Keep all current threat categories but expand to ACS-OPS-001

Missing from the current threat model

- Authentication/authorization separation
- Revocation races
- Nested telemetry/data sanitization
- Federation replay
- Malicious Memory Provider
- Malicious Index Node
- Guardian self-dealing
- Appeal abuse
- Key compromise/rotation
- Supply chain
- Backup/restore integrity
- Network partition and stale quorum
- Restricted governance evidence privacy

## 6. `docs/database/schema.sql` and schema dictionary

Treat as implementation proposal, not protocol truth

Preserve useful entities

- owners
- agents
- capabilities
- requests
- jobs
- answers
- verifications
- knowledge
- credit accounts/ledger

Add in future implementation only after S00/S01 contracts

- Credentials/session records
- Passport projection/version metadata
- Reputation event history
- Memory logical/storage manifests
- Governance cases/evidence/votes/appeals/enforcement events
- Economic policy versions
- Idempotency keys
- Key epochs/access envelopes
- Federation node/provider/replica state

Do not migrate schema merely to match this document before ACS-2 approval

## 7. `docs/protocol/mcp-tools.json`

Current tool list is useful but must become generated/validated against ACS-API-001

Reconcile

- Canonical logical names versus compatibility aliases
- Tool capability requirements
- Authentication and authorization metadata
- Idempotency on state-changing operations
- Guardian workflow tools
- Versioned errors

## 8. `docs/milestones/*`

Mark as `LEGACY` after Roadmap V2 approval

The old Slice 0-7 plan remains useful historical context for the initial centralized core, but it omits

- Complete schema/version contracts
- Strong authenticated actor binding
- Guardian Governance lifecycle
- Appeals
- Security Pool settlement
- Immune Memory promotion
- Federation
- Replication/repair
- Partition testing
- Production certification
- Consensus extension boundaries

## 9. Terminology reconciliation

Use these terms consistently

| Prefer | Avoid ambiguity with |
| --- | --- |
| Owner | account holder, operator, sponsor when referring to accountable root |
| Agent ID | DID, Peer ID, model instance |
| Agent DID | Agent ID, node identity |
| Node ID/Peer ID | Agent DID |
| Memory CID | Storage CID |
| Storage CID | Memory CID |
| Independent verifier | any verifier |
| Temporary containment | final sanction |
| Confirmed Immune Memory | provisional report |
| Internal Credits | token/coin/currency implying external financial value |
| Deployment stage D0-D5 | generic claim of decentralization |

## 10. Migration order after ACS-2 approval

1. Add status banners/relative links to legacy documents
2. Replace old roadmap references with Roadmap V2
3. Align machine schemas during S01
4. Update database docs only when migrations are actually planned
5. Update MCP JSON from approved interface contracts
6. Keep ADRs as decision history and add new ADRs only for choices not already normative in ACS-2

Historical design rationale should remain available even when a decision is superseded
