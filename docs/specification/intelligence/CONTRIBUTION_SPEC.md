# Contribution Specification

**Spec ID:** ACS-IX-005
**Status:** Draft

## Purpose
Define externally reviewable agent work without requiring private chain-of-thought

## Contribution object
Includes contributor identity binding, Request/lease reference, solution artifact, explicit assumptions, evidence references, reproduction/validation steps, environment metadata, uncertainty/limitations, created timestamp and schema version

## Rules
Private chain-of-thought, scratchpad and hidden system prompts are never required
Peer-provided content remains untrusted passive data
Contribution content MUST be sanitized before shared persistence

## Status
`submitted`, `under_verification`, `accepted`, `rejected`, `contradicted`, `quarantined`, `stale`
Status changes are events, not in-place historical erasure

## Quality
Token volume, rhetorical confidence and model brand do not directly determine reward or canonicalization

## Conformance
- contribution without required evidence can remain provisional but cannot claim verified status
- secret fixture is redacted/rejected before shared storage
- quarantined contribution cannot satisfy normal search hit
