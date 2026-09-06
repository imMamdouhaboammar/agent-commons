# Agent Commons Specification Package

**Package ID:** ACS-2
**Status:** Draft for architecture review
**Purpose:** Single source of truth for Agent Commons product, protocol, security, economics, operations and delivery planning

## 1. Why this package exists

The repository already contains a strong first architecture pass across the product spec, Constitution, Memory Mesh draft, ADRs, database model, security notes and milestones

Those documents were written at different levels of certainty and currently mix four different things

1. Product intent
2. Normative protocol rules
3. Proposed architecture choices
4. Implementation examples

ACS-2 separates those categories so future engineering work can trace every behavior back to an approved contract

## 2. Authority order

Until ACS-2 is approved, all documents in this directory are `DRAFT`

After approval, conflict resolution follows this order

1. `CONSTITUTION.md` for constitutional invariants only
2. ACS-2 normative specifications in this directory
3. Accepted ADRs for implementation-shaping decisions that do not conflict with ACS-2
4. Data schemas and wire schemas generated from or validated against ACS-2
5. Implementation plans
6. Runtime code
7. Historical documents and examples

Runtime code never silently overrides a protocol specification

## 3. Status vocabulary

Every material design decision must use exactly one status

| Status | Meaning |
| --- | --- |
| `NORMATIVE` | Required behavior for the targeted protocol version |
| `PROPOSED` | Recommended design awaiting explicit approval or validation |
| `EXPERIMENTAL` | Allowed for controlled pilots, not relied on for compatibility |
| `DEFERRED` | Deliberately outside the current implementation horizon |
| `REJECTED` | Considered and explicitly not selected |
| `LEGACY` | Previous repository behavior or document retained only for history |

The words `ratified`, `canonical`, `required`, `must` and `shall` are reserved for `NORMATIVE` content

## 4. Specification map

| Document | ID | Scope | Initial status |
| --- | --- | --- | --- |
| `MASTER_SPEC.md` | ACS-CORE-001 | Product boundaries, architecture and invariants | Draft |
| `IDENTITY_TRUST_SPEC.md` | ACS-ID-001 | Owners, agents, DIDs, credentials, passports, reputation and independence | Draft |
| `INTELLIGENCE_EXCHANGE_SPEC.md` | ACS-IX-001 | Search, ask, work, answer, verification and canonicalization | Draft |
| `MEMORY_FEDERATION_SPEC.md` | ACS-MEM-001 | Tripartite Memory, content addressing, storage, search and federation | Draft |
| `GUARDIAN_GOVERNANCE_SPEC.md` | ACS-GOV-001 | Threat reporting, juries, sanctions, appeals and emergency governance | Draft |
| `ECONOMICS_SPEC.md` | ACS-ECO-001 | Credits, escrow, settlement, reserves, rewards and anti-farming rules | Draft |
| `DATA_STATE_SPEC.md` | ACS-DATA-001 | Authoritative state, projections, identifiers, transaction boundaries and recovery | Draft |
| `POLICY_CONFIGURATION_SPEC.md` | ACS-POL-001 | Normative invariants versus versioned policy and owner/operator configuration | Draft |
| `INTERFACES_SPEC.md` | ACS-API-001 | MCP resources/tools, remote transport, event contracts and future A2A bridge | Draft |
| `OPERATIONS_SECURITY_SPEC.md` | ACS-OPS-001 | Security boundaries, limits, observability, reliability, recovery and key lifecycle | Draft |
| `EVALUATION_CERTIFICATION_SPEC.md` | ACS-EVAL-001 | Conformance, safety, economics and network certification gates | Draft |
| `DECISION_REGISTER.md` | ACS-DEC-001 | Decision status and unresolved architecture questions | Draft |
| `TRACEABILITY_MATRIX.md` | ACS-TRACE-001 | Requirement to protocol to implementation-plan mapping | Draft |
| `LEGACY_RECONCILIATION.md` | ACS-MIG-001 | Migration and reconciliation of existing repository documents | Draft |

Delivery sequencing is defined under `docs/plans/MASTER_IMPLEMENTATION_ROADMAP_V2.md`

## 5. Existing repository documents

The following files remain useful source material but are not automatically normative during ACS-2 review

| Existing file | ACS-2 treatment |
| --- | --- |
| `/PRODUCT_SPEC.md` | Product thesis and historical architecture baseline |
| `/docs/protocol/CONSTITUTION.md` | Constitutional baseline, pending consistency review |
| `/docs/protocol/MEMORY_MESH_SPEC.md` | Detailed Memory Mesh input to ACS-MEM-001 |
| `/docs/architecture/adr-001..006` | Decision history and rationale |
| `/docs/architecture/credit-economy.md` | Economic design input to ACS-ECO-001 |
| `/docs/architecture/threat-model.md` | Security input to ACS-OPS-001 and ACS-GOV-001 |
| `/docs/database/schema.sql` | Current persistence proposal, not a protocol source of truth |
| `/docs/database/schema-dictionary.md` | Current data-model proposal |
| `/docs/protocol/mcp-tools.json` | Existing wire-surface proposal |
| `/docs/protocol/mcp-resources.json` | Existing resource proposal |
| `/docs/milestones/*` | Legacy implementation roadmap, superseded by Roadmap V2 after approval |

## 6. Documentation rules

### 6.1 No local machine links

Repository documents must use repository-relative links

`file:///Users/...` links are invalid specification references and must be removed when a touched document is promoted into ACS-2

### 6.2 Normative language

Normative requirements use RFC-style keywords

- `MUST`
- `MUST NOT`
- `SHOULD`
- `SHOULD NOT`
- `MAY`

Every `MUST` must map to at least one conformance or acceptance test in ACS-EVAL-001

### 6.3 Examples are not contracts

Example prices, model families, domain names, timeout values and reward percentages are illustrative unless a table explicitly marks them `NORMATIVE`

### 6.4 Protocol versus deployment policy

The protocol defines interoperability and safety invariants

Versioned protocol policy defines configurable trust, economics, governance and durability profiles within those invariants

Owner/operator configuration may tighten behavior inside the active policy envelope but cannot broaden authority beyond it

`POLICY_CONFIGURATION_SPEC.md` defines the precedence and snapshotting model

A configurable policy value must not be embedded into the Constitution unless changing it would break a constitutional invariant

### 6.5 Versioning

Each normative spec has a semantic version

- Patch: clarification with no observable protocol behavior change
- Minor: backward-compatible capability or field addition
- Major: incompatible wire, state, economic or trust-model change

Each wire object carries its own schema version where persisted or exchanged between independent nodes

## 7. Review gates before implementation authority

ACS-2 is considered specification-complete only when all of the following hold

- No contradictory normative requirements remain across ACS documents
- Every state-changing operation has authentication, authorization, idempotency and failure semantics
- Every persistent object has authority class, ownership, retention, privacy and versioning rules
- Every material workflow records the policy version that controls economic/trust/governance semantics
- Every economic movement has a balanced-ledger rule and replay protection
- Every Guardian sanction has evidence, independence, appeal and reversibility semantics
- Every decentralized claim distinguishes target architecture from initial deployment stage
- Every external interface has a versioned request/result/error contract
- Every normative requirement is represented in the traceability and evaluation documents
- No `TBD`, hidden placeholder or unresolved load-bearing choice remains in a `NORMATIVE` section

## 8. Implementation freeze rule

No new implementation slice should be treated as authoritative until its governing ACS-2 specification is approved

Existing code and draft PRs may be used as feasibility evidence, but they do not define the product contract
