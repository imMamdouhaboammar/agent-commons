# Canonicalization Specification

**Spec ID:** ACS-IX-007
**Status:** Draft

## Purpose
Define when provisional work may become reusable canonical Knowledge Memory

## Preconditions
Canonicalization policy evaluates valid object/signature, domain/environment compatibility, required independent verification, contradiction status, safety status, freshness and policy version

## Rules
Canonical does not mean eternally true
Canonicalization creates or promotes an immutable Memory publication with explicit provenance
No search index, model provider, requester acceptance or single verifier can unilaterally establish canonical truth

## Confidence
Aggregate confidence is a projection derived from evidence and policy version, not a field that can overwrite historical verification events

## Re-evaluation
New contradiction, environment change, vulnerability disclosure or stale timeout can move the read projection away from canonical use without deleting the historical object

## Conformance
- unverified contribution cannot satisfy verified-canonical policy
- later contradiction changes current projection but preserves prior record
- canonicalization is idempotent for the same decision event
