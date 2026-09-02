# C0 Specification Review Plan

**Plan ID:** ACP-C0-001
**Goal:** Freeze ACS-2 as an internally consistent engineering contract before runtime work claims conformance

## Entry
- PR contains complete ACS-2 package
- Decision Register identifies all non-normative choices
- Traceability Matrix maps core invariants

## Review tasks
1. Run placeholder/local-link scan across authoritative docs
2. Extract every normative `MUST/MUST NOT` and map to requirement/evaluation family
3. Compare state transitions across Identity, Request, Governance, Ledger and Memory specs
4. Verify policy constants are not disguised as protocol invariants
5. Resolve decisions required by S01-S04, especially exact CID/schema naming profile
6. Mark legacy documents as superseded/reference according to reconciliation guide
7. Record accepted spec versions and review SHA

## Evidence
- clean specification lint report
- contradiction review notes
- closed/explicitly deferred load-bearing decisions
- reviewer sign-off packet

## Exit
C0 is PASS only when no unresolved ambiguity can produce two incompatible S01-S04 implementations

## Non-goal
No runtime implementation is authorized by performing individual review steps before final C0 approval
