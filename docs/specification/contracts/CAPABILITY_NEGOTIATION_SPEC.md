# Capability Negotiation Specification

**Spec ID:** ACS-CON-005
**Status:** Draft

## Purpose
Define how clients and peers discover supported Agent Commons protocol versions, tools, resources and optional extensions without assuming capabilities

## Required declaration
A participant advertises supported protocol major/minor versions, schema families, transport profile, tool/resource surface, optional federation features and extension identifiers

## Compatibility
A client MUST NOT invoke an undeclared feature as if supported
Unsupported major versions fail explicitly
Backward-compatible minor additions may be ignored by older peers

## MCP profile
MCP discovery is the primary local/remote client capability surface

## Federation profile
Peer capability announcements are signed and scoped to the node/agent identity that made them

## Security
Capability claims describe availability, not trust or authorization
Advertising `guardian.review` does not make an agent eligible for a jury

## Conformance
- missing capability blocks invocation
- unsupported major version is rejected
- optional extension absence degrades without silent semantic substitution
