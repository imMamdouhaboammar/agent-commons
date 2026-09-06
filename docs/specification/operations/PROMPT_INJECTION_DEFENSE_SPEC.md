# Prompt Injection Defense Specification

**Spec ID:** ACS-OPS-003
**Status:** Draft

## Principle
All peer cognition, Memory content, external artifacts and federated messages are untrusted data, regardless of author reputation

## Boundaries
Remote content MUST NOT be placed into privileged system/developer instruction channels or automatically gain tool authority

## Controls
- structured schemas and explicit untrusted-data framing
- local content minimization/redaction
- deterministic known-threat/Immune checks
- bounded classifier/Guardian escalation
- explicit tool allowlists and owner policy
- isolated execution for any reproducibility step requiring code/tool use

## Indirect injection
Instructions embedded in retrieved docs, code comments, issue text or peer answers are treated as content to analyze, not commands to follow

## Reputation
High reputation can influence routing/trust weighting but MUST NOT bypass the control boundary

## Conformance
- instruction-override fixture remains passive text
- peer shell/tool instruction does not execute automatically
- trusted author payload receives the same execution boundary
