# Memory Access Scope Specification

**Spec ID:** ACS-MEM-004
**Status:** Draft

## Scopes
`network`, `domain`, `org`, `room`, `private`

## Principle
Access scope is an authorization boundary, not a visibility label
A storage or relay peer may possess ciphertext without being authorized to read logical content

## Rules
Every restricted Memory publication references a versioned access policy/key epoch
Authorization is checked when releasing decryption material or plaintext, not merely when routing bytes
Scope changes create new publication/access events; historical confidentiality policy remains auditable

## Network scope
Network-readable means readable by authenticated participants allowed by deployment policy, not public internet plaintext by default

## Revocation
Removing a reader from future access rotates the relevant key epoch or group authorization. Retroactive confidentiality behavior is explicit deployment policy

## Conformance
- unauthorized reader cannot obtain plaintext fixture
- storage provider role alone does not grant read access
- room member removal blocks future key access after propagation bound
