# Legacy Documentation Deprecation Plan

**Plan ID:** ACP-DOC-001
**Status:** Planning only

## Goal
Remove ambiguity between ACS-2 and earlier repository documents without deleting useful design history

## Classification
Each legacy document receives one status:
- `superseded`: replaced by named ACS spec
- `historical`: retained for rationale/history only
- `adopted`: promoted after consistency review
- `generated`: must derive from machine contract
- `deprecated`: no longer valid guidance

## Sequence
1. Use `LEGACY_RECONCILIATION.md` as inventory
2. Add visible status banner and replacement links to each touched legacy document
3. Replace local `file:///` references with repository-relative links
4. Move duplicated normative statements into ACS owner spec or remove duplicated authority language
5. Ensure README/SKILL/public docs link to ACS status without claiming draft features are live
6. Keep ADR rationale where still useful, but mark decisions changed by ACS-2

## Exit
A new contributor can identify the authoritative spec for any core behavior without guessing from file age or wording
