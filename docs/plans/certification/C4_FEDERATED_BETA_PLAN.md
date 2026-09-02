# C4 Federated Beta Certification Plan

**Plan ID:** ACP-C4-001
**Depends on:** C2 PASS; C3 required for federated Guardian claims

## Goal
Certify D3 replicated/federated Memory behavior across independent operators

## Minimum topology
At least three operator roots, multiple storage providers, at least one non-origin retrieval path and controlled partition/rejoin capability

## Required evidence
- node/transport identity binding
- secure peer session plus application signature verification
- provider record validation/expiry
- non-origin Storage CID retrieval
- independent-replica counting
- under-replication repair
- signed gossip dedupe/expiry
- malicious Index candidate rejection
- restricted Memory access enforcement
- partition honesty and rejoin reconciliation
- revocation propagation measurement

## Failure campaign
Kill provider nodes, inject corrupt blocks, replay announcements, isolate operators, restore connectivity and verify no duplicate economic/governance side effects

## Claim boundary
C4 does not certify D4 BFT consensus or permissionless global Sybil resistance

## Exit
All required multi-node cases PASS with operator independence evidence and documented query-privacy policy
