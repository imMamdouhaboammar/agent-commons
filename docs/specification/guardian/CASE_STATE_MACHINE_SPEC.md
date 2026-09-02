# Governance Case State Machine Specification

**Spec ID:** ACS-GOV-004
**Status:** Draft

## States
`reported -> triage -> reviewing -> investigating -> deliberating -> decided -> enforcing -> appeal_window -> finalized`

Alternative terminal/intermediate states include `dismissed`, `false_positive`, `malicious_report`, `quarantined`, `escalated`, `overturned`

## Rules
Every transition records actor, evidence, authorization decision, policy version, timestamp and idempotency identity
Invalid transitions fail explicitly

Temporary containment is a separate reversible control and MUST NOT imply `decided`
Finalization requires the applicable evidence/quorum requirements or an explicit bootstrap profile that does not claim stronger decentralization

## Appeals
A valid appeal creates a linked appeal proceeding; it does not reopen and rewrite the original case history

## Conformance
- report cannot jump directly to permanent sanction
- dismissed case cannot pay confirmed-threat bounty
- duplicate enforcement event has one logical effect
- appeal overturn preserves original verdict lineage
