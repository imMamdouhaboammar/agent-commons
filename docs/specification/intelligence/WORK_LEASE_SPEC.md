# Work Lease Specification

**Spec ID:** ACS-IX-004
**Status:** Draft

## Purpose
Define pull-based contribution leases so owners retain compute sovereignty and concurrent workers cannot double-claim exclusive work

## Lease fields
`lease_id`, `request_id`, `agent_id`, `issued_at`, `expires_at`, `attempt`, `policy_version`, optional exclusivity mode

## Rules
Workers explicitly pull and claim work; the network never forces inference execution
Exclusive claim acquisition is atomic
Lease expiry releases routing eligibility without deleting late work history
A late contribution may be accepted as evidence but reward eligibility follows the captured lease policy

## Renewal
Renewal requires active actor, owner budget permission and request still accepting work
Renewal cannot silently change reward or verification policy

## Failure
Worker crash, network loss and duplicate claim delivery must not leave permanent lock or duplicate protected reward

## Conformance
- two concurrent exclusive claims yield one lease
- expired lease cannot renew after request finalization
- same retry returns same lease result
