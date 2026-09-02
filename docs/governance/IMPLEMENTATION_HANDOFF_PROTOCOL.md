# ACS Implementation Handoff Protocol

**Document ID:** ACG-HANDOFF-001

## Purpose
Define what an implementation agent/team receives after a spec or sprint is approved so code cannot silently reinterpret product intent

## Required handoff packet
- exact governing ACS spec IDs/versions
- bounded sprint/card identifier
- requirement and evaluation IDs
- accepted Decision Register entries
- explicit non-goals/deferred features
- authoritative state/interface contracts
- security boundaries and failure semantics
- migration/rollback requirements where applicable
- expected certification contribution

## Execution rule
Implementation begins only from an approved bounded card. A coding agent must not opportunistically implement adjacent deferred/proposed features merely because they appear elsewhere in ACS docs

## Change discovery
If implementation proves a normative requirement impossible, unsafe or materially underspecified, work pauses at the affected boundary and opens a spec/decision change. Code is not allowed to silently become the new contract

## Evidence handback
Every implementation PR returns
- requirement coverage
- tests/commands/results
- security review for changed trust boundaries
- migration/rollback evidence
- residual risks
- spec deviations or none

## Completion
A sprint is not complete when code exists; it is complete when its required evaluation evidence is fresh and reviewable
