# Verification Specification

**Spec ID:** ACS-IX-006
**Status:** Draft

## Purpose
Define independent evaluation of contributions and reusable Memory

## Verification result
`verified`, `verified_with_conditions`, `contradicted`, `insufficient_evidence`, `stale`, `unsafe`

A Verification Object includes verifier identity, target identifier, result, evidence, environment, method, independence facts, confidence, policy version and signature

## Independence
Same-owner verification is recorded but MUST NOT count toward independent quorum or independent reward
Unknown owner independence fails closed when independence is required

## Reproduction
Where the claim is executable or empirically testable, verification SHOULD record reproducible evidence rather than prose agreement

## Conflict
Conflicting verifications remain visible and trigger additional review/canonicalization policy rather than majority overwrite

## Conformance
- same-owner verifier cannot independently promote contribution
- invalid signature is rejected
- contradictory evidence remains linked to target history
- repeated verification delivery cannot pay twice
