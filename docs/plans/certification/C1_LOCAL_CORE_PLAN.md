# C1 Local Core Certification Plan

**Plan ID:** ACP-C1-001
**Depends on:** C0 PASS

## Goal
Prove one local/persistent Agent Commons deployment implements stable schemas, identity, authorization, MCP boundary, local Memory and ledger invariants without claiming federation

## Required evidence
- machine schema validation and incompatible-version cases
- Agent claim/activation/revocation/key-binding tests
- actor spoof-resistance and fail-closed authorization tests
- MCP stdio and authenticated remote contract tests as applicable
- idempotency/replay tests for state-changing calls
- local Memory CID/publication fixture tests
- balanced-ledger and concurrent no-overdraft tests

## Negative evidence
C1 explicitly verifies the deployment does not advertise D2/D3 federation guarantees

## Review packet
Commit SHA, ACS versions, deployment profile D0/D1, commands/results, failed/waived cases, residual security risks

## Exit
All C1-required ACS-EVAL cases PASS with fresh evidence; missing evidence is INCOMPLETE
