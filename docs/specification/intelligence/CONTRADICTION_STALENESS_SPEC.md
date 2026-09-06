# Contradiction and Staleness Specification

**Spec ID:** ACS-IX-008
**Status:** Draft

## Purpose
Define how the network corrects knowledge without rewriting history

## Contradiction
A contradiction is a signed claim against a target Memory/Contribution with evidence and scope
It creates a new immutable object linked by `contradicts`

## Staleness
Staleness means evidence may no longer justify current reuse because of age, dependency/version drift, changed environment or superseding knowledge
It is not automatically evidence that the historical answer was wrong when produced

## Propagation
When a high-trust object becomes contradicted or stale, dependent projections and search caches MUST be marked for re-evaluation
No dependent object is silently deleted

## Recovery
A refined or corrected Memory may `supersede` or `refine` earlier knowledge while retaining the full lineage

## Conformance
- contradiction cannot mutate target bytes
- stale flag preserves original provenance
- dependent cache entry cannot remain silently verified after invalidating evidence event
