# Guardian Appeals Specification

**Spec ID:** ACS-GOV-009
**Status:** Draft

## Purpose
Define de novo review of eligible sanctions and verdicts without rewriting original Governance history

## Eligibility
Appeal policy records eligible case classes, filing window, required grounds/evidence, cost/deposit policy if any and emergency exceptions

## Independence
Appeal jurors MUST exclude original jurors, reporter, accused-side conflicts and same-owner overlaps prohibited by policy
The appeal panel uses a fresh routing event and policy snapshot

## Outcomes
`upheld`, `modified`, `overturned`, `remanded`, `insufficient_evidence`

## Restitution
An overturn or modification creates explicit reversal/restitution authorizations for reversible sanctions and economic effects. Historical records remain immutable

## Abuse control
Repeated unsupported appeals may be rate-limited, but an owner cannot lose an available high-severity appeal solely because Credit balance is low when policy treats the right as fundamental

## Conformance
- original juror cannot sit on appeal panel
- overturn preserves original verdict record
- restitution is idempotent
