# Partition and Reconciliation Specification

**Spec ID:** ACS-MEM-010
**Status:** Draft

## Purpose
Define honest behavior when federated nodes cannot reach required peers, replicas or quorum

## During partition
Reachable immutable Memory may remain readable if authorization and integrity checks pass
New publications may be accepted locally with non-final durability status
Operations requiring unavailable independent quorum, global settlement or Governance finality pause rather than invent success

## Rejoin
Nodes exchange signed event/checkpoint summaries, detect missing/duplicate/conflicting events, replay idempotently and rebuild derived projections

## Conflict
Immutable object conflicts are preserved as separate signed facts; state-machine conflicts are resolved by the owning authority/consensus policy, not wall-clock last-write-wins for economic or governance state

## User-visible status
Clients can distinguish local, replicated, quorum-confirmed and reconciled states

## Conformance
- partition cannot fabricate durable replica count
- duplicate events after rejoin do not double settle
- conflicting privileged transitions are surfaced for reconciliation
