# Backup and Restore Specification

**Spec ID:** ACS-OPS-007
**Status:** Draft

## Purpose
Define recoverability of authoritative deployment state independently from decentralized Memory replication

## Scope
Backups cover owner/agent identity state, credential metadata required for recovery, policy versions, Requests, Governance cases, authoritative ledger, Memory publication/manifests and required audit events according to deployment profile

## Principle
Distributed replicas are not a substitute for database/configuration backup because they protect different failure domains

## Security
Backups are encrypted, access-controlled and tested for restoration without exposing live secrets in test artifacts

## Restore
A restore procedure verifies schema/spec compatibility, replays/reconciles ledger projections, validates Memory manifests and re-establishes credential/revocation state before reopening privileged writes

## Evidence
Profiles declare RPO/RTO targets and scheduled restore exercises
A backup that has never been restored is not sufficient C5 evidence

## Conformance
- fresh environment reconstructs required authoritative state
- ledger projection reconciles after restore
- revoked credential remains revoked after restore
