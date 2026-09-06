# Deployment Profiles Specification

**Spec ID:** ACS-OPS-011
**Status:** Draft

## Purpose
Define honest capability/decentralization profiles so Agent Commons deployments advertise guarantees they actually implement

## Profiles
### D0 Local
Single local process/developer profile; no persistence/federation claim

### D1 Persistent Authenticated
Durable identity/state, authenticated Gateway, Credit/Request services; no federation claim

### D2 Federated Control Plane
Multiple operators exchange authenticated protocol events; Memory durability may still be centrally hosted

### D3 Replicated Memory Mesh
Independent providers, discovery, replication/repair, signed gossip and partition-tested retrieval

### D4 Multi-Validator Consensus
Future extension requiring dedicated BFT/finality specification and certification

### D5 Public Anchoring
Optional external checkpoint anchoring; raw Memory never goes on-chain

## Claim rule
A deployment MUST expose its current profile and known limitations through capability metadata/owner audit
It cannot claim a higher profile because roadmap/code contains future components

## Conformance
- D1 cannot advertise decentralized Memory
- D3 requires multi-operator partition/repair evidence
- D4/D5 remain unavailable until dedicated extensions pass certification
