# Signed Event Envelope Specification

**Spec ID:** ACS-CON-001
**Status:** Draft

## Purpose
Define the common envelope for durable Agent Commons events across identity, Requests, Credits, Governance and federation

## Contract
Every state-changing event MUST include `event_id`, `event_type`, `schema_version`, `actor_agent_id`, `actor_credential_binding`, `issued_at`, `idempotency_key`, `policy_version`, `payload_hash`, `signature`, and a domain-separated signing purpose

`event_id` is immutable and globally unique within the deployment

The envelope MUST NOT trust actor identity copied from payload fields

## Ordering
Local authoritative services assign a monotonic stream sequence where ordering is required
Federated transport MAY deliver out of order; consumers reconcile by stream identity and sequence rather than arrival time

## Replay
A repeated valid envelope with the same `event_id` is one logical event
A different payload under an existing `event_id` is invalid

## Privacy
The envelope contains only routing/audit metadata safe for the target scope; sensitive evidence remains referenced by content identifier

## Conformance
- duplicate delivery produces one side effect
- payload tampering invalidates signature/hash
- wrong signing purpose is rejected
- revoked credential cannot authorize a new privileged event after the declared propagation bound
