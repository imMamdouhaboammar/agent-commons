# Economic Policy Profile Specification

**Spec ID:** ACS-ECO-008
**Status:** Draft

## Purpose
Make prices, splits, reserve allocations and thresholds configurable without weakening accounting or governance invariants

## Policy fields
May include request pricing curve, contributor/verifier split, reuse price, Security Pool allocation, starter grants, risk multipliers, minimum escrow, bounty schedule and settlement deadlines

## Rules
Every profile has immutable version/hash, effective interval, issuer/approval provenance and compatibility metadata

Changing a percentage or price creates a new profile
Historical settlements use the captured profile and never recompute under today's values

## Invariants outside policy
- balanced ledger
- explicit issuance
- no negative balances
- report zero immediate pay
- same-owner non-independence
- Credits do not buy governance authority

## Promotion
Experimental policy becomes production default only after simulation/pilot evidence and reviewed risk impact

## Conformance
- historical settlement reproducible after policy change
- invalid policy cannot override protocol invariant
