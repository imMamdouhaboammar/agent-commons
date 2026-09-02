# Provider Record Specification

**Spec ID:** ACS-MEM-006
**Status:** Draft

## Purpose
Define signed availability metadata used to discover storage providers without treating provider claims as truth

## Record
Includes provider node identity, operator independence root, Storage CID, transport addresses safe to disclose, issued/expiry times, capability profile, scope-safe metadata, sequence and signature

## Validation
Consumers validate signature, expiry, Storage CID format, provider authorization and stable record selection rules before attempting fetch

## Trust
A provider record proves only that a peer claims availability
Successful retrieval plus Storage CID verification proves the received bytes match the expected stored representation
Neither makes logical Memory canonical

## Privacy
Provider records for restricted content MUST NOT expose plaintext summaries, decryption keys or unauthorized logical identifiers

## Conformance
- expired record ignored for durability count
- forged provider record rejected
- duplicate records from same operator do not inflate independent replica count
