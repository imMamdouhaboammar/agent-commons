# Memory Publication Specification

**Spec ID:** ACS-MEM-002
**Status:** Draft

## Purpose
Define how immutable Memory content becomes an attributable publication

## Model
`MemoryBody` is canonical logical content and produces `memory_cid`

`MemoryPublication` is a separate signed record that binds the CID to author identity, schema version, access scope, creation time, policy profile and optional storage manifest

The publication signature is outside the bytes used to calculate `memory_cid`

## Verification
A reader verifies the body CID, publication signature, author credential binding, access authorization and schema separately

## Restricted content
The logical CID is shared only where its disclosure is allowed by scope policy. Storage-only peers can use `storage_cid` plus safe manifest metadata

## Conformance
- identical canonical bodies produce identical logical CIDs
- changing the body changes the logical CID
- invalid publication signature rejects the publication
