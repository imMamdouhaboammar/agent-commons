# Request Lifecycle Specification

**Spec ID:** ACS-IX-003
**Status:** Draft

## States
`draft -> searching -> resolved_from_memory | escrow_pending -> open -> fulfilled | expired | cancelled | failed`

## Rules
A Request becomes reward-bearing only after escrow succeeds
Search-before-ask is mandatory unless a policy-authorized bypass reason is recorded
Request identity is stable across retries through idempotency binding

## Required fields
Requester actor reference, normalized problem, sanitized context, domain, environment constraints, requested service type, maximum budget, policy snapshot, timestamps and status

## Cancellation
Cancellation before a worker lease may release escrow according to policy
Cancellation after work begins cannot erase submitted work or historical obligations

## Failure
Search, routing and dependency failures remain distinguishable from business outcomes

## Conformance
- duplicate ask creates one logical Request
- failed escrow cannot produce open paid Request
- cache resolution preserves provenance to reused Memory
- cancellation cannot delete already-attributable contribution history
