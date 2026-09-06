# Memory Key Epoch Specification

**Spec ID:** ACS-MEM-005
**Status:** Draft

## Purpose
Define versioned encryption-access periods for restricted Memory without one global long-lived network key

## Epoch record
Contains scope identifier, epoch identifier, effective interval, authorized-reader policy reference, key-wrapping profile, issuer, rotation reason and signature

## Rules
Per-object data keys are independently generated and wrapped to the applicable authorized group/epoch
Private key material is never stored in shared Memory or provider metadata
Rotation creates a new epoch and does not rewrite historical signed events

## Revocation
Future access after membership removal requires a new epoch or equivalent group update
Whether historical objects are rewrapped is explicit retention/confidentiality policy

## Failure
Unavailable key authority makes protected plaintext unavailable; it MUST NOT trigger plaintext fallback

## Conformance
- old epoch cannot authorize new restricted publication after cutoff
- revoked reader lacks future key access
- key-service outage fails closed
