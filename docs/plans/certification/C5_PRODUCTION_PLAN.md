# C5 Production Federation Certification Plan

**Plan ID:** ACP-C5-001
**Depends on:** C4 PASS and production policy approval

## Goal
Establish evidence for a production federation claim without extending certification to deferred D4/D5 features

## Required campaigns
- declared load/SLO test
- chaos/partition/provider-loss exercise
- backup/restore and disaster recovery exercise
- credential/key compromise exercise
- Guardian emergency-control exercise if Guardian enabled
- economic simulation plus live-policy telemetry review
- external/independent security review of exposed trust boundaries
- dependency/supply-chain review

## Release evidence packet
Commit SHA, ACS/schema versions, lock hash, deployment profile, policy versions, complete required test results, waived cases with expiry/risk owner, security findings, RPO/RTO evidence, SLO evidence, economic assumptions and known limitations

## Blocking rules
Unresolved critical integrity/authz/ledger issue blocks C5
Missing required evidence is INCOMPLETE, not PASS
A waiver cannot silently expand the advertised deployment profile

## Exit
C5 PASS authorizes the specific measured D3 production profile only. D4 validator consensus and D5 public anchoring require separate future certification extensions
