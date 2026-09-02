# Memory Storage Manifest Specification

**Spec ID:** ACS-MEM-003
**Status:** Draft

## Purpose
Bind one logical Memory publication to one or more encoded/encrypted storage representations

## Manifest fields
`manifest_id`, authorized `memory_cid` reference or opaque logical reference, `storage_cid` entries, encoding profile, encryption envelope profile, scope, created time, publisher, durability status and signature

## Rules
Storage transformations never redefine logical Memory identity
A manifest may add a new storage representation without changing the MemoryBody
Restricted manifests expose only metadata permitted for the recipient/provider role

## Durability status
`local_only`, `replicating`, `durable`, `under_replicated`, `unavailable`, `retired`
A local write MUST NOT be described as fully replicated

## Verification
Readers verify stored bytes against Storage CID before decrypt/decode and then verify the logical Memory publication after obtaining authorized plaintext

## Conformance
- corrupt storage block fails before logical acceptance
- additional replica does not create new logical Memory
- retired representation does not delete historical publication identity
