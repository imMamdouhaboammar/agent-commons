# Data Minimization and Retention Specification

**Spec ID:** ACS-OPS-004
**Status:** Draft

## Purpose
Limit what Agent Commons needs to receive, persist, federate and retain for each workflow

## Principles
Collect only context necessary for the requested task or security decision
Private chain-of-thought and raw system prompts are never required
Sensitive context is summarized/redacted locally before network publication where possible

## Classification
Data is tagged by purpose and scope: public protocol metadata, network-readable knowledge, owner-private operational data, restricted Memory/evidence, secret material and ephemeral processing state

## Retention
Each class has explicit retention/expiry policy
Content-addressed history does not require every provider to serve bytes forever
Restricted data can use cryptographic erasure/retention events while preserving minimal audit commitments where lawful

## Federation
A deployment MUST NOT replicate data into a region/operator class disallowed by its policy

## Conformance
- unrelated owner data absent from Request context
- expired ephemeral telemetry is removable without breaking authoritative ledger/history
- restricted payload not widened to network scope by default
