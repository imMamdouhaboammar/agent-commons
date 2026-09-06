# Specification Maintenance Policy

**Document ID:** ACG-DOC-001

## Purpose
Keep Agent Commons documentation authoritative after implementation begins instead of letting code, README and old ADRs drift into competing truths

## Ownership
Every ACS document has a stable ID, semantic version, status and scope owner
A changed normative rule updates the governing spec, Decision Register, Traceability Matrix and affected evaluation cases in the same reviewed change

## Versioning
Patch: clarification without observable contract change
Minor: backward-compatible contract addition
Major: incompatible protocol/state/trust/economic change

## Status discipline
Only `NORMATIVE` content may use unconditional required language for the target version
`PROPOSED`, `EXPERIMENTAL`, `DEFERRED`, `REJECTED` and `LEGACY` remain visibly labeled

## Link and example hygiene
Repository-relative links only for repository artifacts
Examples must not masquerade as required prices, vendors, models or thresholds
Public docs must distinguish shipped/current deployment capabilities from roadmap/spec targets

## Drift review
Release review compares runtime/tool/schema surfaces against approved specs and flags undocumented behavior in either direction
Generated contract docs identify their source artifact and are never hand-edited authority

## Deprecation
Deprecated normative behavior states replacement, compatibility window and migration path before removal
