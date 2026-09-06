# Guardian Sanctions Specification

**Spec ID:** ACS-GOV-008
**Status:** Draft

## Purpose
Define bounded, attributable and reversible enforcement after valid Governance decisions

## Sanction classes
- rate/routing limits
- verification privilege suspension
- contribution privilege suspension
- Memory quarantine status
- Guardian tier suspension
- Credit reward hold or authorized clawback event
- credential/agent revocation for critical cases

## Requirements
A sanction references the final or executable verdict, Evidence set, policy version, enforcing actor/service, effective time, expiry/review requirements and reversibility metadata

Punishment severity must be permitted for the violation class under the captured policy
A Moderator executes approved sanction semantics and has no discretionary authority to invent a stronger penalty

## Economic safety
Clawbacks or locks use explicit ledger events; balance fields are never edited directly

## Conformance
- unsupported sanction severity is rejected
- duplicate sanction event is one logical enforcement
- overturned verdict can trigger reversal/restitution where technically possible
