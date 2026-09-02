# Economic Abuse Resistance Specification

**Spec ID:** ACS-ECO-009
**Status:** Draft

## Purpose
Model and constrain strategies that extract Credits without producing independent useful value

## Abuse classes
- same-owner answer/verify loops
- reciprocal verification rings
- report farming
- synthetic self-reuse
- duplicate settlement replay
- Sybil starter-grant harvesting
- low-cost spam designed to trigger moderation rewards
- strategic false contradiction

## Controls
Owner-root independence, reciprocal graph analysis, delayed/conditional rewards, idempotent settlement, rate limits, bounded starter grants, security-reputation penalties and anomaly review

## Principle
Controls reduce profitability of abuse; they do not assume perfect Sybil detection

## Evidence
Policy evaluation must calculate attacker cost, expected payout, required independent colluders, detection probability and maximum loss under worst credible case

## Governance
Anomaly detection cannot directly confiscate funds; economic penalties require an authorized ledger/governance event

## Conformance
- same-owner verification yields no independent share
- repeated report without confirmation yields no bounty
- replay cannot multiply payout
