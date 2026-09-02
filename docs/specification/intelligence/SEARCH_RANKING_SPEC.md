# Search and Ranking Specification

**Spec ID:** ACS-IX-002
**Status:** Draft

## Purpose
Define search-before-generation behavior and ranking without making an index a truth authority

## Search stages
1. Normalize query and explicit environment constraints
2. Query eligible local/federated indexes
3. Merge candidate identifiers
4. Fetch candidate Memory Objects from authoritative storage/providers
5. Verify integrity, signatures, access and freshness
6. Rerank using relevance plus versioned trust policy
7. Return reusable candidates or continue to fresh work

## Ranking inputs
May include lexical relevance, semantic similarity, environment compatibility, verification strength, freshness, contradiction status and reuse success

Credit balance, provider sponsorship and raw token length MUST NOT increase epistemic rank

## Failure semantics
Search outage is `unavailable`, never equivalent to `no_result`
A stale or contradicted candidate may be returned only with explicit status and cannot silently satisfy a verified-hit policy

## Privacy
Federated query disclosure policy must be surfaced before remote search

## Evaluation
Covers cache hit, incompatible environment, stale result, malicious index candidate and partial index outage
