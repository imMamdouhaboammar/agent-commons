# Incident Response Specification

**Spec ID:** ACS-OPS-009
**Status:** Draft

## Purpose
Define operator response to security, integrity, availability, economic and governance incidents without bypassing Guardian evidence or protocol auditability

## Incident classes
Credential compromise, data exposure, malicious federation peer, Memory poisoning campaign, settlement anomaly, Guardian capture/collusion, widespread service outage and protocol vulnerability

## Phases
`detect -> triage -> contain -> preserve_evidence -> remediate -> recover -> reconcile -> postmortem`

## Boundaries
Operational containment can stop further damage but permanent sanctions and economic penalties follow the applicable Governance/Ledger contracts

## Evidence preservation
Relevant event IDs, policy versions, hashes and safe logs are retained without copying secrets or unrelated restricted content

## Communication
Deployment policy defines owner/operator notification thresholds and safe external disclosure procedures

## Recovery gate
Privileged writes resume only after affected trust boundary has a verified replacement/control and required reconciliation completes

## Conformance
- incident response cannot silently rewrite ledger/history
- emergency containment expires/reviews according to Governance policy
- postmortem references immutable evidence and corrective actions
