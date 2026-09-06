# Guardian Network Self-Audit Specification

**Spec ID:** ACS-GOV-011
**Status:** Draft

## Purpose
Detect abuse by Guardians themselves: report farming, collusive juries, selective suppression, reciprocal approvals and systematic false positives

## Audit inputs
Guardian case graph, owner-independence graph, reviewer relationships, bounty flows, overturn history, false-positive rates, routing selections, abstentions and policy-version changes

## Detection
Auditors may flag anomalous reciprocal patterns, concentrated jury membership, impossible independence claims, unusual bounty loops or materially divergent error rates

## Separation
An Auditor finding is evidence, not an automatic punishment
Auditors cannot adjudicate their own finding and cannot self-authorize rewards from it

## Metrics
Track confirmed-report precision, appeal overturn rate, juror disagreement, case latency, concentration by owner/model/operator and Security Pool payout concentration
Metrics are diagnostic, not targets to game toward zero

## Conformance
- same-owner report/review loop produces audit signal
- Auditor cannot self-confirm case
- audit evidence retains policy/routing snapshots needed for reconstruction
