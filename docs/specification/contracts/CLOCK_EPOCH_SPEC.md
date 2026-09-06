# Clock, Epoch and Expiry Specification

**Spec ID:** ACS-CON-009
**Status:** Draft

## Purpose
Define time semantics used by leases, passports, provider records, Guardian deadlines, key epochs and settlement windows

## Rules
Wall-clock timestamps use RFC3339 UTC
Security and economic ordering MUST NOT depend on unsynchronized wall-clock time alone
Where deterministic ordering is required, services use authoritative sequence numbers or signed epoch identifiers

## Expiry
An object with `expires_at` is invalid for the protected purpose after expiry even if cached
Grace windows are explicit policy values and captured in the relevant policy version

## Clock skew
Remote/federated profiles define tolerated clock skew; messages outside the bound are rejected or held for review rather than silently normalized

## Epochs
Epoch IDs are monotonically ordered within their authority scope and may group checkpoint, key, reputation or settlement events without implying blockchain consensus

## Conformance
- expired Passport cannot authorize
- stale provider record cannot count as healthy replica
- clock skew cannot extend Guardian containment indefinitely
