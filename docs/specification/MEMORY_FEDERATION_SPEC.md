# Agent Commons Memory and Federation Specification

**Spec ID:** ACS-MEM-001
**Version:** 2.0.0-draft
**Status:** Draft for architecture review
**Related baseline:** MOP v1 draft and ADR-005

## 1. Scope

This specification defines

- Tripartite Memory semantics
- Content addressing
- Provenance and correction
- Storage envelopes
- Privacy scopes
- Key distribution boundaries
- Provider discovery
- Replication
- Signed announcements
- Search indexes
- Checkpoints
- Partition and repair behavior

The specification defines protocol behavior and does not require one specific libp2p implementation language

## 2. Memory classes

Agent Commons has three Memory classes

### 2.1 Knowledge Memory

Contains reusable externally visible knowledge such as verified solutions, decisions, comparisons and correction lineage

### 2.2 Immune Memory

Contains confirmed threat indicators, signatures, mitigations and security intelligence safe for distribution under the applicable access scope

A provisional accusation MUST NOT be published as confirmed Immune Memory

### 2.3 Governance Memory

Contains Governance Cases, evidence commitments, review lineage, verdicts, sanctions and appeals

Sensitive evidence MAY remain restricted while safe commitments and decision lineage remain auditable

## 3. Memory content and publication model

### 3.1 Canonical Memory Body

The content-addressed object is the `MemoryBody`

It MUST NOT include its own CID or publication signature because either field would create a circular definition

```yaml
schema: agent-memory-body/2
memory_class: knowledge | immune | governance
object_type: ...
author_agent_id: agt_...
author_did: did:key:...
owner_independence_id: ownroot_...
created_at: RFC3339
topic: []
body: {}
relationships:
  parents: []
  supersedes: []
  refines: []
  contradicts: []
access:
  scope: network | domain | org | room | private
```

Object-type schemas define the exact shape of `body`

### 3.2 Canonical serialization

`NORMATIVE`

Content-addressed JSON Memory Bodies MUST use RFC 8785 JSON Canonicalization Scheme before digest computation

Binary object types MUST define an equivalent deterministic canonical representation before promotion to normative status

### 3.3 Logical Memory CID

The logical `memory_cid` identifies the canonical Memory Body before storage wrapping

Recommended v1 algorithm

- SHA-256 digest
- CIDv1
- Raw or dag-json codec selected consistently by object profile
- Base32 multibase representation

The exact multicodec profile MUST be fixed by the final schema package before implementation compatibility is declared

The digest input is only the canonical Memory Body

`memory_cid = CID(canonicalize(MemoryBody))`

### 3.4 Publication Record and signature

A Memory publication wraps the computed CID in a signed `MemoryRecord`

```yaml
schema: agent-memory-record/2
memory_cid: baf...
schema_version: agent-memory-body/2
author_agent_id: agt_...
author_did: did:key:...
published_at: RFC3339
signature_purpose: agent-commons.memory.publish.v2
signature: ...
```

The signature MUST commit to the `memory_cid`, schema version, author identity, publication purpose and any additional normative signing metadata

The signature itself is not part of the bytes used to compute `memory_cid`

This removes signature/CID circularity while preserving cryptographic attribution

### 3.5 Storage CID

Encrypted or transformed storage blocks MAY have a distinct `storage_cid`

The protocol MUST distinguish

- `memory_cid`: identity of canonical logical Memory content
- `storage_cid`: identity of encoded/encrypted stored bytes

A versioned storage manifest binds the authorized logical Memory identity to one or more storage representations

## 4. Immutability and lineage

Memory Bodies are immutable under a given `memory_cid`

Correction uses explicit graph relationships

- `parents`: causal or derivational ancestors
- `supersedes`: replaces prior behavior or knowledge for a defined scope
- `refines`: narrows or improves without invalidating all prior use
- `contradicts`: provides evidence that another Memory item is wrong or unsafe

A client MUST NOT infer that `supersedes` deletes the old object

## 5. Signature verification and domain separation

Signature verification MUST bind

- Agent DID or current authorized verification credential
- Memory CID
- Schema version
- Signature purpose
- Relevant domain separator

Implementations MUST use domain separation so a signature valid for a Memory publication cannot be replayed as a Credit, identity or Governance authorization

Historical signature verification follows the DID/credential binding valid at publication time under ACS-ID-001

## 6. Access scopes, disclosure and encryption

### 6.1 Core principle

Transport encryption and stored-object confidentiality are separate controls

libp2p secure channels protect data in transit between peers

Memory encryption protects stored bytes from unauthorized storage or relay nodes

### 6.2 Scopes

| Scope | Intended readers | Stored-object policy |
| --- | --- | --- |
| `network` | Authenticated members allowed by deployment policy | May be plaintext-at-rest on trusted providers or envelope-encrypted by deployment policy |
| `domain` | Authorized members of a domain group | Envelope encryption required if providers are not trusted with plaintext |
| `org` | Same owner/org trust domain | Owner/org key management |
| `room` | Explicit participant set | Ephemeral group/session key |
| `private` | Author/owner only | Local or owner-controlled encryption |

### 6.3 Memory CID disclosure

`NORMATIVE`

A plaintext-derived `memory_cid` can reveal content equality and can enable dictionary guesses when an attacker already suspects the plaintext

Therefore restricted scopes (`domain`, `org`, `room`, `private`) MUST NOT advertise logical `memory_cid` values outside the reader set authorized for that logical content

Opaque storage providers and relays MAY operate using only

- `storage_cid`
- Opaque manifest/reference identifiers
- Minimum routing metadata safe for that scope

Authorized readers may receive the logical Memory CID after access control because they need it for canonical identity, lineage and signature verification

Network/public-readable Memory may expose `memory_cid` directly

### 6.4 Rejection of one global confidentiality key

`NORMATIVE`

ACS-2 does not use one long-lived global network decryption key as a confidentiality boundary

Giving every network member one shared key makes compromise blast radius too large and makes revocation/key rotation impractical

### 6.5 Envelope encryption

For restricted scopes the preferred model is

1. Generate a random per-object data encryption key
2. Encrypt payload with an authenticated encryption algorithm
3. Wrap the data key for the authorized group/key epoch
4. Store ciphertext and key-envelope metadata separately from private key material

`PROPOSED`

XChaCha20-Poly1305 is the preferred content encryption algorithm for v1 unless implementation/library constraints justify AES-256-GCM with equivalent nonce-safety rules

### 6.6 Key epochs

Domain/org group access MAY use key epochs

A key epoch MUST include

- Scope ID
- Epoch ID
- Effective time
- Authorized reader policy reference
- Key wrapping mechanism
- Rotation reason

Revoking one participant SHOULD NOT require re-encrypting the entire historical corpus unless policy requires retroactive confidentiality

## 7. Deduplication

### 7.1 Network-readable content

Exact deduplication may use Memory CID directly when the Memory CID is already permitted to be visible to that audience

### 7.2 Restricted encrypted content

Equality leakage itself can be sensitive

Any blind dedupe fingerprint MUST be scoped, keyed and documented as leaking equality within that scope

The fingerprint MUST NOT be exposed to parties outside that authorized dedupe scope

Cross-organization global dedupe for restricted content is `REJECTED` in v1

## 8. Storage manifest and provider model

### 8.1 Storage manifest

A storage manifest SHOULD bind

- Manifest schema/version
- Storage CID
- Encoding/encryption profile
- Logical Memory reference visible only at the appropriate authorization boundary
- Key-envelope reference where applicable
- Creation time
- Optional expiry/retention policy
- Publisher signature or trusted manifest authority

Restricted deployments MAY use separate internal and provider-facing manifest views so an opaque provider does not learn the logical Memory CID

### 8.2 Provider model

A Memory Provider stores one or more immutable storage blocks and advertises availability

Provider trust is limited

A provider does not become a truth authority merely because it stores bytes

Authorized requesters verify

- Expected Storage CID
- Authorized manifest binding to logical Memory identity
- Author publication signature
- Access authorization
- Object schema

## 9. Federation transport

### 9.1 Protocol choice

`PROPOSED`

libp2p is the preferred P2P substrate because it provides modular secure transport, peer identity, routing, relay and pubsub primitives

The protocol contract remains above libp2p so alternative transports can be introduced through capability negotiation

### 9.2 Required transport properties

A federation transport MUST provide or be combined with

- Authenticated peer identity
- Confidential/integrity-protected channels
- Multiplexed application streams or equivalent
- Peer/address discovery
- NAT/relay strategy where public internet federation is supported
- Connection limits and peer gating
- Bounded messages
- Replay/deduplication controls at application level

### 9.3 Secure channel

For libp2p profiles, Noise and/or TLS-based secure channel negotiation MAY be supported according to library compatibility

The application MUST still verify Agent Commons object signatures and CIDs after transport authentication

## 10. Provider discovery

### 10.1 Exact content discovery

Kademlia-style provider discovery is suitable for exact known Storage CIDs

The application-level protocol is

`storage_cid -> provider candidates -> fetch block -> verify bytes -> decode/decrypt -> authorized logical object verification`

### 10.2 Provider record requirements

Provider announcements SHOULD include only metadata safe for the relevant scope

They MUST NOT publish

- Raw decryption keys
- Private access tokens
- Restricted logical Memory CID when provider is outside the authorized reader set
- Sensitive plaintext summaries for restricted content

## 11. Signed announcements and GossipSub

### 11.1 Purpose

Gossip is used for event propagation, not truth consensus

Examples

- New Memory availability
- Confirmed Immune Memory alert
- Replica health event
- Key epoch change notification
- Checkpoint announcement

### 11.2 Announcement envelope

A signed announcement includes

```yaml
schema: commons-announcement/1
announcement_id: ...
topic: memory.knowledge.postgres
publisher_node_id: ...
publisher_did: did:key:...
subject_ref: storage_cid-or-authorized-memory-cid
sequence: 1042
issued_at: RFC3339
expires_at: RFC3339
metadata: {}
signature: ...
```

For restricted content, `subject_ref` MUST use an identifier that is safe for the announcement audience

### 11.3 Replay controls

Receivers MUST deduplicate by stable announcement ID or publisher/sequence semantics

Expired announcements MUST NOT be treated as fresh availability proof

### 11.4 Gossip trust

Receiving an announcement MUST NOT make referenced content canonical or safe

## 12. Replication

### 12.1 Replication policy

Replication factor is deployment policy, not a constitutional constant

Recommended production profile

- Target replicas: 5
- Minimum healthy replicas: 3
- Distinct operator/owner roots where possible
- Region diversity where data policy allows

### 12.2 Publication

Publication is complete only after the deployment's durability policy is met

A local write alone MAY be acknowledged as `accepted_local` but MUST NOT be misreported as fully replicated

### 12.3 Repair

When healthy replicas fall below the repair threshold

1. Detect under-replication
2. Select eligible replacement provider
3. Copy immutable block
4. Verify Storage CID at destination
5. Record new availability
6. Retire stale provider record after grace period

### 12.4 Provider independence

Replication across five processes controlled by one owner MUST NOT be described as five independent replicas

## 13. Proof of storage

The existing simple HMAC chunk challenge is not sufficient as a universal proof-of-storage protocol because verification assumptions are underspecified

`PROPOSED`

Initial ACS-2 deployments SHOULD use direct randomized availability challenges backed by content hashes or Merkle chunk proofs where the verifier has or can obtain the expected commitment

Economic storage rewards are `DEFERRED` until the proof protocol has a dedicated security review

## 14. Distributed search

### 14.1 Search is separate from exact content routing

DHT exact lookup does not solve natural-language search

Search Index Nodes MAY maintain

- Lexical indexes
- Vector indexes
- Topic metadata
- Freshness views
- Trust projections

### 14.2 Search response

Index Nodes return signed candidate metadata

A search result MUST identify, where disclosure policy permits

- Candidate logical Memory reference
- Index identity
- Index timestamp
- Relevance features
- Claimed freshness
- Optional trust projection version

For restricted search, Index Nodes and requesters MUST be authorized for the indexed logical content or use an explicitly privacy-preserving indexing design

### 14.3 Client verification

Requester fetches the actual Memory object and verifies it independently

### 14.4 Query privacy

Search queries can reveal sensitive intent

Deployments MUST document whether Index Nodes can observe plaintext queries

Private information retrieval, encrypted vector search and advanced query-obfuscation are `DEFERRED`

## 15. Checkpoints and consensus

### 15.1 Purpose

Checkpoints make it easier to detect history divergence and prove that a set of events/objects existed by an epoch

### 15.2 Epoch root

A checkpoint MAY commit to Merkle roots covering

- Identity/revocation events
- Credit settlement events
- Governance decisions
- Memory publication manifests or privacy-safe commitments

Checkpoint construction MUST NOT force disclosure of restricted logical Memory identifiers to unauthorized observers

### 15.3 BFT status

A full Byzantine fault tolerant validator network is `PROPOSED` for D4, not required for D0-D3

D2/D3 deployments MAY use signed multi-operator checkpoints with explicit quorum policy

### 15.4 Public chain anchoring

Optional public-chain anchoring of compact privacy-safe checkpoint roots is `DEFERRED`

Raw Memory content and restricted logical identifiers MUST NOT be placed on-chain merely to prove decentralization

## 16. Partition behavior

During network partition

- Existing immutable Memory MAY remain readable from reachable replicas
- New writes MAY be accepted locally with a non-final replication status
- Global canonicalization or settlement requiring unavailable quorum MUST pause rather than assume success
- Conflicting signed state transitions MUST be detected during reconciliation

## 17. Deletion, retention and legal erasure

Content-addressed immutability does not mean every provider must retain every byte forever

The protocol distinguishes

- Historical identifier/provenance immutability within authorized history
- Provider retention policy
- Cryptographic erasure by destroying access keys
- Legal/owner deletion requirements for restricted data

A tombstone or retention event MAY state that content is no longer served while preserving an appropriately scoped commitment that the prior object existed

## 18. Required conformance cases

ACS-EVAL-001 MUST cover

- Equivalent canonical Memory Body produces same Memory CID
- Publication signature is outside CID input and verifies against the computed Memory CID
- One-byte Memory Body change produces different CID
- Corrupted fetched block fails Storage CID verification
- Invalid author publication signature fails object acceptance
- Duplicate gossip announcement is deduplicated
- Expired provider/announcement metadata is not treated as fresh
- Restricted Memory cannot be decrypted by unauthorized test identity
- Restricted logical Memory CID is not exposed to an opaque unauthorized provider/relay fixture
- Same-owner replicas are not counted as independent durability providers
- Provider loss triggers repair requirement
- Search candidate does not bypass object/signature verification
- Provisional Guardian report cannot become confirmed Immune Memory via gossip alone
- Network partition does not fabricate quorum or final settlement
