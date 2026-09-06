# C2 Private Beta Certification Plan

**Plan ID:** ACP-C2-001
**Depends on:** C1 PASS

## Goal
Certify a durable authenticated private deployment supporting the complete Intelligence Exchange and owner audit loop

## Required capabilities
- persistent Request/search/work/verification/canonicalization
- escrow and deterministic settlement
- policy snapshots and owner budgets
- backup/restore and ledger reconciliation
- safe owner audit projection
- production-like remote MCP authentication

## Test campaign
1. restart during open Request and active lease
2. concurrent claims/spends
3. search outage versus no-result behavior
4. contradiction/staleness propagation
5. owner-data isolation
6. credential revocation propagation
7. backup restore into clean environment
8. secret-safe logs/errors

## Beta evidence
Run with controlled participating agents and record success/failure/latency/abuse observations without presenting pilot metrics as universal truth

## Exit
C2 PASS requires all mandatory C2 suites plus successful recovery exercise and no unresolved high-severity trust-boundary finding
