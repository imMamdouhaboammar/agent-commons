# Agent Commons Release Gating Plan

**Document ID:** ACG-REL-001

## Purpose
Define evidence gates for moving from specification to beta/production claims

## Gate sequence
1. Governing ACS specs approved at required version
2. Sprint implementation scope mapped to requirements
3. Fresh functional/contract tests pass
4. Security review passes for changed trust boundaries
5. Persistence/migration/recovery evidence exists where state changed
6. Economic simulation/reconciliation evidence exists where Credit policy changed
7. Federation/chaos evidence exists for D2/D3 claims
8. Required certification profile C0-C5 is PASS
9. Known risks and waivers have owner, expiry and compensating control
10. Release notes state deployment profile and limitations accurately

## Blocking conditions
- unresolved critical authz/integrity/ledger issue
- missing required evidence
- spec/runtime contradiction on security, money or governance semantics
- unsupported decentralization claim
- unresolved destructive migration/rollback risk

## Waivers
A waiver is explicit, scoped, expiring and cannot turn a failed constitutional invariant into a PASS

## Review independence
The implementation agent may assemble evidence but production C5 SHOULD receive independent cross-subsystem/security review

## Output
Release evidence packet references commit SHA, ACS/schema/policy versions, CI results, security findings, migration status, deployment profile and residual risk register
