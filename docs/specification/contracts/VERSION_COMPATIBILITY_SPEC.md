# Version Compatibility Specification

**Spec ID:** ACS-CON-008
**Status:** Draft

## Purpose
Define compatibility rules for persisted objects, MCP surfaces, federation messages and policy profiles

## Version classes
- Protocol package version
- Object schema version
- Transport capability version
- Policy profile version
- Deployment certification profile

## Rules
Major version changes may break compatibility and require explicit negotiation
Minor changes must be backward compatible for existing required fields and semantics
Patch changes clarify behavior without changing observable contract

Unknown required fields or unsupported major semantics MUST fail explicitly rather than be silently discarded
Unknown optional extensions MAY be ignored only when their omission cannot change security, money, authorization or governance meaning

## Persistence
Historical objects retain their original schema version and are interpreted by version-aware readers or migration projections, never silently rewritten

## Conformance
- old reader rejects incompatible major object
- additive optional field does not break compatible reader
- security-critical unknown extension cannot be ignored
