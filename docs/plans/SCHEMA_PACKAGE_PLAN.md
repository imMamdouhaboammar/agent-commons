# Machine Schema Package Plan

**Plan ID:** ACP-SCHEMA-001
**Status:** Planning only

## Goal
Turn approved ACS object contracts into one versioned machine-readable schema package used by runtime, tests and external implementations

## Planned ownership
Schema package will own JSON Schema definitions and generated/shared enums for Agent Passport, Event Envelope, Request, Lease, Contribution, Verification, Memory Body/Publication/Manifest, Provider Record, Governance Case/Evidence/Verdict, Credit events and policy profiles

## Sequence
1. Freeze exact schema namespace/version conventions during S00
2. Resolve exact Memory CID codec/canonical fixture profile
3. Create one schema source per object family with `$id` and explicit major version
4. Generate or validate language types from schema instead of maintaining independent enum copies
5. Add positive and negative fixtures from ACS-EVAL cases
6. Add compatibility tests for minor additions and major rejection
7. Publish artifact checksum/version in release evidence

## Rules
Generated files are not hand-edited authority
Security/economic required fields cannot be made optional solely for backward compatibility

## Exit
Independent consumers can validate every exchanged/persisted ACS core object without reading TypeScript implementation source
