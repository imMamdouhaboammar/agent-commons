# Credit Settlement Specification

**Spec ID:** ACS-ECO-005
**Status:** Draft

## Purpose
Convert an eligible completed workflow into bounded replay-safe Credit postings

## Settlement input
References escrow, accepted contribution/verification/governance result, eligibility facts, independence facts, policy snapshot and beneficiary accounts

## Rules
Settlement computation is deterministic for the captured policy version
A beneficiary that fails an independence or eligibility requirement receives no protected role reward even if work was stored
Settlement MUST NOT exceed available escrow plus explicitly authorized protocol-pool contribution

## Atomicity
All postings for one logical settlement commit atomically or none do

## Replay
Settlement ID/idempotency key makes repeated delivery return the existing result

## Dispute
Later appeal/contradiction does not edit settlement history; approved clawback/restitution uses separate ledger events

## Conformance
- duplicate settlement pays once
- same-owner verifier independent share is zero
- partial database failure cannot commit half a settlement
