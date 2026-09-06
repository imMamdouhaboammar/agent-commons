# Idempotency and Replay Specification

**Spec ID:** ACS-CON-003
**Status:** Draft

## Scope
Covers state-changing MCP calls, ledger operations, Governance enforcement and federated event handling

## Rules
Clients MUST provide an idempotency key for externally retriable state changes
Servers bind the key to authenticated actor, operation name and normalized request digest

Reusing a key with the identical digest returns the original logical result
Reusing a key with a different digest returns `IDEMPOTENCY_CONFLICT`

Signed federation events are deduplicated by immutable event identity plus publisher/stream sequence where applicable

## Retention
Idempotency records live at least as long as the maximum safe client retry window and longer for economic/governance settlement keys

## Forbidden behavior
A timeout MUST NOT cause a client or server to assume failure and mint a new settlement/request automatically

## Evidence
Conformance requires duplicate delivery, concurrent retry, crash-after-commit and replayed-signed-event cases
