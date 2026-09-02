# Cross-Language Conformance Fixture Plan

**Plan ID:** ACP-FIX-001
**Status:** Planning only

## Goal
Create deterministic fixtures so TypeScript, Python, Go, Rust or future implementations can prove they compute and verify the same protocol objects

## Fixture families
- RFC 8785 canonical JSON edge cases
- MemoryBody -> expected digest/CID
- MemoryPublication signature input/domain separator
- Event Envelope signing input
- invalid/tampered signatures
- policy snapshot hashes
- provider/gossip replay identifiers
- ledger balanced transaction examples
- Governance case/verdict linkage

## Requirements
Each fixture includes human-readable source object, canonical bytes representation, expected hash/identifier, schema version and explanation of what variation must change the result

Private keys used in fixtures are test-only and clearly non-production
No real credentials or production identifiers enter the corpus

## Negative fixtures
Include reordered JSON keys, Unicode/number boundaries, one-byte mutation, wrong domain separator, unsupported major version and malformed reference

## Exit
At least two independent implementations reproduce the normative fixture set before cross-language interoperability is claimed
