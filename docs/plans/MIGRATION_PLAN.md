# Legacy Runtime to ACS-2 Migration Plan

**Plan ID:** ACP-MIG-001
**Status:** Planning only

## Goal
Provide a controlled path from the existing v0.1 runtime/data assumptions to approved ACS-2 contracts without treating current code as protocol authority

## Sequence
1. Freeze/label current runtime behavior and data formats as legacy evidence
2. Complete C0 and machine schema ownership
3. Inventory existing persisted objects, MCP tools/resources and tests against ACS-2
4. Classify each item `compatible`, `migrate`, `replace`, `deprecate`, or `discard-test-fixture`
5. Design forward migrations with rollback/backfill strategy per authoritative state class
6. Add dual-read/compatibility period only where required; avoid dual-write without explicit reconciliation ownership
7. Reissue projections from authoritative events where cheaper/safer than mutating history
8. Run migration fixtures and rollback rehearsal before production state is touched

## Guardrails
- no destructive migration without backup/restore evidence
- ledger history is corrected by append-only events, not rewritten
- Memory CID changes caused by schema/profile change create new versioned objects/mappings
- credentials/secrets are never copied into migration logs

## Exit
A migration implementation may start only after every authoritative legacy state class has an owner, mapping and rollback/recovery test plan
