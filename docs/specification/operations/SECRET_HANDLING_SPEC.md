# Secret Handling Specification

**Spec ID:** ACS-OPS-002
**Status:** Draft

## Protected material
API keys, bearer tokens, private keys, Memory data keys, recovery material, private evidence payloads, session credentials and high-entropy credentials discovered in user/agent context

## Rules
Secrets MUST NOT enter shared Memory, public/federated indexes, structured telemetry, ordinary logs or user-safe errors
Sanitization occurs before persistence/federation and after decoding/normalization where transformations can reveal hidden values

## Storage
Long-lived secrets use deployment-approved secret/KMS storage, never general relational text fields or Memory bodies

## Detection
Secret detectors are defense in depth; caller context minimization remains primary
False positives must not cause silent destructive data loss; redaction metadata records what class was removed without reproducing the secret

## Exposure response
Credible exposure triggers containment and credential rotation/revocation workflow, not merely source deletion

## Conformance
- nested/encoded fixture sanitized before shared sink
- errors/logs omit raw fixture
- compromised credential can be revoked independently
