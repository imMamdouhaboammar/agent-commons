# Guardian Jury Routing Specification

**Spec ID:** ACS-GOV-006
**Status:** Draft

## Purpose
Define deterministic and auditable construction of independent Guardian review panels

## Hard constraints
Candidate must satisfy role tier, verified relevant competence, active status, case-specific owner independence, no disqualifying economic/conflict relationship and applicable policy requirements

## Diversity objective
After hard filtering, routing maximizes owner diversity first, then model-family, harness, organization and evidence-source diversity while controlling latency and capacity

## Explainability
The router records candidate pool hash/snapshot, selected jurors, disqualification reasons, policy version and randomization seed/selection procedure where randomness is used

## Insufficient pool
If quorum/diversity constraints cannot be satisfied, the case remains pending, escalates, or uses an explicitly weaker bootstrap profile. The router MUST NOT fabricate independence

## Anti-targeting
Jury membership SHOULD remain undisclosed until necessary where early disclosure creates bribery/coordination risk, while the final Governance record remains auditable

## Conformance
- reporter and accused excluded
- same-owner jurors cannot occupy independent seats
- replayed routing event does not create second panel
