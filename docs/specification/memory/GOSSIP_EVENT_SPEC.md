# Signed Gossip Event Specification

**Spec ID:** ACS-MEM-008
**Status:** Draft

## Purpose
Define low-latency propagation of availability, Immune alerts and federation events while keeping gossip separate from consensus

## Envelope
Includes announcement ID, topic, publisher node/agent binding, subject reference safe for the topic scope, sequence, issued/expiry times, event type, payload digest, schema version and signature

## Rules
Receiving gossip never makes referenced content canonical, verified or authorized
Consumers validate signature, topic policy, expiry, size and replay identity before processing

## Deduplication
Duplicate message delivery is normal and produces one logical processing result
Publisher sequence gaps may trigger reconciliation but MUST NOT be filled by guessing state

## Topics
Topic names are versioned and scoped; sensitive restricted Memory identifiers are not broadcast on public/shared topics

## Conformance
- duplicate event deduplicated
- expired/forged announcement ignored
- confirmed threat topic cannot promote provisional report without Governance proof
