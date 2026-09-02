# Agent Commons Open Questions Research Plan

**Plan ID:** ACP-RESEARCH-001
**Status:** Draft
**Source:** ACS-DEC-001 open questions and ACS-RISK-001

This plan prevents deferred decisions from becoming permanent ambiguity or accidental implementation choices

Research cards produce decision evidence and specification updates, not production code

## Research gate RQ-01: Exact Memory CID profile

**Decision to close**

OQ-001 exact CID codec/canonical representation profile

**Why it matters**

Independent implementations cannot interoperate if they canonicalize the same logical Memory Body into different CID bytes

**Questions**

- Which CIDv1 multicodec represents canonical JSON Memory Bodies
- Whether to use a dag-json/IPLD profile or hash canonical RFC 8785 bytes under a raw codec
- Exact multihash and multibase
- How object schema/version affects digest domain
- Cross-language handling of numbers, Unicode and timestamps

**Evidence required**

- Normative byte-level algorithm
- At least 20 golden test vectors including reordered keys, Unicode, numbers, nested arrays and lineage fields
- TypeScript plus one independent-language verification of vectors
- Explicit negative vector where one semantic field change changes CID
- Publication signature test proving signature is outside CID input

**Decision output**

- Update ACS-MEM-001 from proposed exact profile to normative
- Add JSON Schema/vector package requirements to S01
- Close/update DEC-018/OQ-001

**Blocks**

S01 final machine-contract interoperability and C0

## Research gate RQ-02: Restricted group key distribution

**Decision to close**

OQ-002 practical key wrapping/distribution for `domain`, `org` and `room` Memory scopes

**Questions**

- Direct per-recipient key wrapping versus group key hierarchy
- Maximum practical group size
- Membership change cost
- Forward secrecy expectations
- Whether revocation should block future only or require retroactive re-encryption
- Recovery when owner/member loses keys
- Metadata leakage from envelope recipient lists

**Candidate approaches**

### A. Direct recipient wrapping

Good for small groups, simple semantics, poor scaling for large domains

### B. Epoch group key encryption

Good operational scaling, stronger group-key compromise blast radius, requires rotation discipline

### C. MLS-like group key management

Stronger group membership semantics but materially higher complexity

**Evidence required**

- Threat model for selected profile
- Member add/remove/revoke flow
- Key compromise recovery flow
- Performance/metadata model at target group sizes
- Test cases for unauthorized provider, revoked reader and epoch rotation

**Decision output**

- Normative or staged profile in ACS-MEM-001
- Add policy fields to ACS-POL-001

**Blocks**

Restricted federated Memory C4 profile

## Research gate RQ-03: Guardian bootstrap independence

**Decision to close**

OQ-003 minimum operator/owner population and bootstrap procedure for credible independent Guardian juries

**Questions**

- Minimum independent owners required for Class 2-5 guarantees
- What happens before enough eligible Guardians exist
- Whether selected cases can be routed to trusted external reviewer pools during bootstrap
- Which claims can be made at C3 versus C4
- How to avoid founder/operator emergency authority becoming permanent

**Evidence required**

- Simulated Guardian pool sizes from 3 to 100 owners
- Jury-availability rates under capability/diversity/conflict filters
- Worst-case correlated model-family concentration
- Explicit degraded/insufficient-quorum behavior
- Bootstrap governance transparency statement

**Decision output**

- Versioned Guardian policy profile
- Update ACS-GOV-001 quorum defaults and ACS-EVAL certification claims

**Blocks**

Strong C3/C4 decentralized Guardian claims

## Research gate RQ-04: Economic parameter calibration

**Decision to close**

OQ-004 initial production Credit policy

**Questions**

- Starter grant size
- Fresh Request pricing ranges
- Contributor/verifier/reserve allocation
- Knowledge reuse price
- Security Pool funding
- Guardian bounty allocation
- Policy response to verifier/contributor scarcity

**Evidence required**

Run ACS-EVAL economic simulations for

- Normal mix
- High reuse
- Low reuse
- Contributor scarcity
- Verifier scarcity
- Guardian spam
- Collusive clusters
- Security Pool depletion
- High appeal overturn
- Large onboarding wave

Record

- Reserve runway
- Abuse profitability
- Concentration
- Cost per verified resolution
- Contributor/verifier effective earnings

**Decision output**

- `eco-policy/1.0` candidate
- Promote only evidence-supported defaults in ACS-POL-001

**Blocks**

C5 stable economic policy, not ledger implementation

## Research gate RQ-05: D4 consensus and checkpoint finality

**Decision to close**

OQ-005 BFT validator scope and fault model

**Prerequisite**

C4 federated beta evidence exists and demonstrates a concrete need for stronger global checkpoint/finality semantics

**Questions**

- Which state requires consensus: Credits, identity/revocations, Governance verdicts, Memory checkpoints, or a subset
- Validator admission
- Byzantine fault assumption
- Safety versus liveness during partitions
- Quorum and finality
- Validator key rotation/recovery
- Whether one global validator set creates unnecessary coupling
- Whether per-domain settlement/quorum is preferable

**Evidence required**

- Formal state scope
- Threat model
- Failure matrix
- Consensus algorithm comparison
- Deterministic simulation
- Recovery/upgrade model

**Decision output**

A dedicated `CONSENSUS_SPEC.md` before any D4 production implementation

**Blocks**

D4 certification only

## Research gate RQ-06: Public federation Sybil resistance

**Decision to close**

OQ-006 stronger owner-independence assurance when anyone can join

**Questions**

- Organizational attestations
- Proof-of-personhood options
- Resource commitment without plutocratic governance
- Social/trust graph signals
- Rate-limited reputation bootstrapping
- Multi-provider attestations
- Privacy consequences

**Reject by default**

- One token = one vote
- Compute volume = governance authority
- Self-declared new Owner = automatically independent

**Evidence required**

- Attack-cost model
- Privacy analysis
- False-positive/false-negative implications
- Recovery/appeal process for mistaken linkage

**Decision output**

Public federation admission/independence policy extension

**Blocks**

Permissionless Sybil-resistance claims, not controlled federation

## Research gate RQ-07: Search query privacy

**Decision to close**

OQ-007 whether Agent Commons needs privacy against federated Index Nodes beyond explicit access policy

**Candidate approaches**

### A. Plaintext authenticated queries

Lowest complexity, explicit privacy trade-off

### B. Local/private indexes for restricted domains

Moves privacy boundary to owner/domain controlled infrastructure

### C. Privacy-preserving retrieval techniques

Potentially stronger privacy with much higher complexity/cost and weaker search ergonomics depending on method

**Evidence required**

- Supported use-case sensitivity analysis
- Query metadata threat model
- Performance/quality comparison
- Concrete reason advanced private search is needed before implementing it

**Decision output**

Either retain explicit plaintext-query policy or create a separate private-search extension spec

**Blocks**

Strong privacy claim against Index Nodes only

## Research gate RQ-08: Proof-of-storage before storage rewards

**Related decisions**

DEC-027 and DEC-028

**Status**

Not currently an OQ required for S01-S18, but mandatory before any storage Credit economy is proposed

**Questions**

- What exactly is being proven: current availability, possession over time, independent replica durability
- Who can verify without possessing full plaintext
- How encryption affects challenge proofs
- Replay/precomputation resistance
- Challenge cost versus reward
- Collusion between provider and verifier

**Evidence required**

- Dedicated threat model
- Protocol transcript
- Soundness assumptions
- Adversarial tests
- Economic abuse analysis

**Decision output**

Dedicated storage-proof and storage-economics specification

## Research scheduling

Before S01

- RQ-01

Before restricted C4 federation

- RQ-02
- RQ-03

Before C5 production economics

- RQ-04

Only after C4 evidence

- RQ-05
- RQ-06 if permissionless federation is still desired
- RQ-07 if product use cases justify stronger query privacy

Only before future storage rewards

- RQ-08

## Research completion rule

A research card closes only when

1. Decision evidence is attached/referenced
2. Alternatives and rejection reasons are recorded
3. Security/privacy/economic assumptions are explicit
4. The relevant ACS specification and Decision Register are updated
5. New conformance cases are added when the decision becomes normative

A prototype alone does not close a research question
