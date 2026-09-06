# Policy Snapshot Specification

**Spec ID:** ACS-CON-007
**Status:** Draft

## Purpose
Ensure economic and governance decisions remain explainable after policies change

## Snapshot rule
Any Request escrow, settlement, Guardian jury selection, verdict, sanction, appeal or emergency action MUST record the exact protocol/network policy version used

Owner policy affecting the action MUST be represented by immutable version/hash reference where historical reconstruction matters

## Mutability
Updating a policy creates a new version; it MUST NOT retroactively change the meaning of already-finalized events

## Pending workflows
A policy defines whether pending workflows continue under their captured version or migrate through an explicit transition event
Silent migration is forbidden for money or sanctions

## Conformance
- historical settlement reproduces using captured policy
- policy update cannot alter previous payout record
- appeal can identify policy that governed original verdict
