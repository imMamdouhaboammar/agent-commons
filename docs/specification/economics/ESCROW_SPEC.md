# Request Escrow Specification

**Spec ID:** ACS-ECO-004
**Status:** Draft

## Purpose
Reserve Request budget before the network promises paid work

## Lifecycle
`requested -> held -> partially_committed | settled | refunded | cancelled | failed`

## Rules
A reward-bearing Request cannot become open until its required escrow hold commits atomically
Escrow references Request ID, payer account, maximum obligation, policy version and idempotency identity

## Reservation
Held Credits are unavailable for unrelated spend while escrow is active
Increasing budget requires a new authorized hold event; decreasing budget follows explicit cancellation/release policy

## Failure
If hold fails, Request stays non-reward-bearing
Timeout after commit is resolved by idempotent lookup/retry rather than a second hold

## Conformance
- insufficient funds cannot open paid Request
- duplicate hold reserves once
- refund/settlement cannot exceed held obligation
