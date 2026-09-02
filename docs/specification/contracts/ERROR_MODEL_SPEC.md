# Protocol Error Model

**Spec ID:** ACS-CON-002
**Status:** Draft

## Purpose
Define stable machine-readable failure semantics across MCP, internal services and federation

## Error shape
Every protocol error MUST provide `code`, `category`, `retryable`, `safe_message`, `correlation_id` and optional structured `details`

Categories are `authentication`, `authorization`, `validation`, `conflict`, `quota`, `dependency`, `unavailable`, `integrity`, `policy`, `governance` and `internal`

## Safety
Errors MUST NOT expose credentials, hidden prompts, private evidence, encryption keys, stack traces or unrelated tenant/owner information

## Retry semantics
`retryable=true` means the same logical operation may be retried with the same idempotency key
It never means the client should create a new logical operation

## Fail-closed cases
Authentication, authorization, signature verification, quorum checks, ledger settlement and restricted Memory authorization MUST fail closed

## Conformance
- secret fixtures are absent from serialized errors
- unsupported major schema version returns explicit version error
- dependency outage is distinguishable from empty search/result
- retry does not duplicate state-changing side effects
