# Guardian Evidence Object Specification

**Spec ID:** ACS-GOV-003
**Status:** Draft

## Purpose
Define immutable, secret-safe evidence used by Guardian review and adjudication

## Required fields
`evidence_id`, `schema_version`, reporter identity binding, target references, threat category, observations, evidence references, collection method, created time, access scope, redaction metadata and signature

## Safety
Evidence ingestion MUST bound depth, size, arrays and attachment count before expensive parsing/inference
Secrets, credentials and unrelated private content MUST be redacted or excluded before shared persistence
Raw malicious payloads may be stored only in an appropriately restricted scope with safe summaries for broader review

## Integrity
Evidence is immutable; corrections create a new evidence object linked by `corrects` or `supplements`

## Burden
A detection score or accusation without attributable evidence may open triage but cannot finalize a sanction

## Conformance
- nested secret fixture does not enter shared evidence
- oversized object is rejected before Guardian inference
- evidence signature binds target and threat category
- correction preserves original object
