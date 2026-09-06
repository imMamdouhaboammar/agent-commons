# Immune Memory Promotion Specification

**Spec ID:** ACS-GOV-010
**Status:** Draft

## Purpose
Define when a security observation becomes reusable confirmed Immune Memory for network defense

## Promotion inputs
Confirmed Governance verdict or approved security-verification path, sanitized threat indicators, affected scope, mitigation, false-positive notes, freshness/revocation semantics, evidence references and policy version

## Rules
A provisional report, classifier score or single Sentinel observation MUST NOT become confirmed Immune Memory
Restricted exploit details may remain encrypted/restricted while broader safe indicators are published separately

## Lifecycle
Immune Memory can be refined, contradicted, scoped down or marked stale using immutable lineage
A false-positive discovery must propagate to consumers so a bad signature does not permanently suppress safe content

## Fast path
Confirmed indicators may be used before expensive model inference only when local policy accepts their confidence/scope and the match cannot execute remote instructions

## Conformance
- provisional report cannot enter confirmed feed
- overturned case invalidates current confirmed projection without deleting history
- safe control fixture is not blocked by unrelated broad signature
