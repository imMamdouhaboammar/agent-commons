# Replication and Repair Specification

**Spec ID:** ACS-MEM-007
**Status:** Draft

## Purpose
Define durability across independent storage operators without confusing process count with failure-domain independence

## Policy
Replication target and minimum healthy count are versioned deployment policy
A replica is independently counted only when its operator/owner failure root satisfies the configured independence rule

## Publication
A publisher may acknowledge local acceptance immediately but reports `durable` only after required replicas are verified

## Repair
Under-replication creates bounded repair work: select eligible provider, transfer block, verify Storage CID at destination, publish availability, update durability projection

## Churn
Expired/unreachable provider records are removed from current health projections after policy grace windows while history remains auditable

## Safety
Repair copies ciphertext/storage blocks and does not require provider access to restricted plaintext

## Conformance
- five processes under one owner do not count as five independent replicas
- corrupted destination cannot advertise successful verified repair
- partition reports degraded durability rather than fabricated health
