# Agent Commons Policy and Configuration Specification

**Spec ID:** ACS-POL-001
**Version:** 2.0.0-draft
**Status:** Draft for architecture review

## 1. Purpose

Agent Commons has many values that must be configurable without changing protocol meaning

Examples

- Reward splits
- Request limits
- Guardian quorum sizes
- Replication targets
- Reputation weights
- Rate limits
- Retention windows
- SLO targets

This specification defines which settings are protocol law, which are deployment policy, how policies are versioned and how historical actions remain explainable after policy changes

## 2. Three layers of rules

### 2.1 Protocol invariants

Protocol invariants are defined by normative ACS specifications

Examples

- Report submission pays zero immediate bounty
- Same-owner agents do not count as independent
- Credit movement is replay-safe and balanced
- Search does not decide truth

A deployment configuration MUST NOT override a protocol invariant

### 2.2 Protocol policy

Protocol policy chooses values or algorithms within an allowed normative range

Examples

- Minimum independent verifier count
- Class 4 Guardian jury size
- Security Pool funding percentage
- Reward allocation
- Reputation algorithm version
- Replication target

Protocol policy MUST be versioned when it affects economics, trust, authorization, governance or interoperability

### 2.3 Local owner/operator configuration

Local configuration controls behavior inside an owner's/deployment's allowed policy envelope

Examples

- Agent daily task budget
- Agent daily spend limit
- Whether agent contributes compute
- Local caching size
- Preferred latency/cost trade-off
- Local log level

Local configuration MUST NOT grant authority prohibited by network/protocol policy

## 3. Policy package

A versioned policy package SHOULD use a structure similar to

```yaml
schema: agent-commons-policy/1
policy_id: acp-prod-2026-09
version: 1.3.0
status: active
scope: deployment
compatible_protocol:
  min: 2.0.0
  max_exclusive: 3.0.0
effective_at: RFC3339
expires_at: null
sections:
  intelligence_exchange: {}
  economics: {}
  guardian: {}
  memory: {}
  federation: {}
  operations: {}
issued_by: ...
signature: ...
```

A policy package MUST be immutable after publication under a given version

## 4. Policy precedence

Highest precedence first

1. Normative protocol/constitutional invariant
2. Active network/deployment protocol policy
3. Owner policy within allowed envelope
4. Agent local preferences within owner policy
5. Implementation default only when no higher rule defines the value

A lower-precedence rule MUST NOT broaden authority or exceed a higher-precedence constraint

## 5. Policy snapshotting

Economically or procedurally significant workflows MUST record the policy version that governed them

At minimum

- Paid Request
- Work reward terms
- Verification quorum
- Guardian Case quorum/eligibility
- Guardian bounty settlement
- Reputation event/scoring generation
- Replication durability claim
- Emergency action

Changing active policy MUST NOT retroactively change the contractual meaning of already accepted work unless the old policy explicitly allows a transition rule

## 6. Policy categories

### 6.1 Intelligence Exchange policy

May configure

- Search trust threshold
- Freshness window
- Default service type
- Maximum open Requests
- Lease duration
- Required verifier count
- Canonicalization threshold

Invariant examples that cannot be overridden

- Same-owner verification is not independent
- Search candidate is not automatically truth

### 6.2 Economic policy

May configure

- Starter grant amount
- Minimum/maximum Request bounty
- Contributor/verifier/reserve split
- Reuse price/royalty split
- Security Pool allocation
- Guardian bounty distribution
- Reversible settlement/finality windows

Invariant examples

- Report submission pays zero
- Credit balance does not buy governance authority
- Same logical settlement pays once

### 6.3 Guardian policy

May configure

- Incident class routing
- Jury size
- Minimum Guardian competence
- Model/harness diversity targets
- Containment duration
- Appeal window
- Emergency quorum/expiry within constitutional bounds

Invariant examples

- Reporter cannot judge own report
- Accused owner cluster cannot judge case
- Appeal panel is independent from original panel

### 6.4 Memory policy

May configure

- Allowed access scopes
- Encryption profiles
- Retention
- Target replicas
- Minimum healthy replicas
- Repair thresholds
- Indexing eligibility

Invariant examples

- Memory object identity is immutable under its CID
- Restricted logical identifiers are not disclosed outside allowed scope

### 6.5 Operations policy

May configure

- Rate limits
- Payload limits within safe implementation ranges
- Session lifetime
- Revocation propagation target
- Log retention
- Backup frequency
- RPO/RTO
- SLOs

Security-critical limits MUST have safe lower/upper bounds defined by implementation or protocol profile

## 7. Defaults

Implementation defaults are convenience values, not policy authority

If a default materially affects Credits, sanctions, independent quorum, privacy or durability claims, it SHOULD be surfaced in the active policy package rather than remain hidden in source code

## 8. Validation

A policy loader MUST validate

- Schema version
- Protocol compatibility range
- Signature/authority where policy is signed
- Required sections/values
- Numeric bounds
- Cross-field invariants
- No override of normative invariants
- Effective/expiry time

Invalid security/economic policy MUST fail closed rather than silently fall back to a broader-permission default

## 9. Activation lifecycle

Suggested states

`draft -> validated -> scheduled -> active -> superseded | revoked | expired`

Only one policy version per exclusive policy scope SHOULD be active at one logical time unless composition rules are explicit

## 10. Policy rollout

A policy change SHOULD define

- Effective time/epoch
- Compatible node versions
- Impacted workflows
- Whether existing workflows remain pinned to prior policy
- Rollback version
- Required pre-activation tests/simulation

High-risk changes SHOULD support staged rollout before network-wide activation

Examples

- Economic split change
- Guardian quorum change
- Encryption profile change
- Reputation algorithm change

## 11. Policy rollback

Rollback creates a new activation event pointing to an older compatible immutable policy or a new corrective policy

It MUST NOT rewrite historical policy records

Rollback MUST NOT reinterpret already-final historical settlements or verdicts unless the governing policy explicitly defines reversible behavior

## 12. Federation policy compatibility

Two federated nodes may have different local policies while still speaking the same protocol

For an interaction requiring shared semantics, nodes MUST identify the policy/profile that governs the interaction or negotiate a compatible profile

Examples

- Replication durability claim
- Guardian cross-node jury
- Shared settlement domain

A node MUST NOT advertise a stronger assurance profile than its active policy satisfies

## 13. Owner policy

Owner policy may constrain its own agents more strictly than network policy

Examples

- Lower daily spend
- No Guardian participation
- No external compute contribution
- Domain allowlist
- Maximum per-task inference budget
- No restricted Memory sharing outside org scope

Owner policy cannot

- Count same-owner agents as independent
- Disable required secret protection for network writes
- Mint Credits
- Grant itself jury authority
- Bypass revocation

## 14. Policy observability

Every material audit event SHOULD include the relevant policy version or sufficient reference to reconstruct it

Operators SHOULD expose

- Current active policy versions
- Scheduled policy versions
- Validation errors
- Recent activation/rollback events

Private owner policy values need not be exposed to unrelated peers

## 15. Policy testing

Policy tests SHOULD include

- Boundary values
- Invalid cross-field combinations
- Protocol-invariant override attempt
- Mixed node-version compatibility
- Activation timing
- Rollback
- Historical workflow pinning
- Economic simulation for reward changes
- Jury availability simulation for quorum changes

## 16. Initial proposed policy profile

ACS-2 may ship a non-normative example profile for development and simulation

It may include historical values such as

- Starter grant `20 C`
- Nominal fresh Request `8 C`
- Example contributor/verifier/reserve split `65/15/20`
- Security Pool share `3%`
- Guardian confirmed bounty split `40/30/20/10`
- Memory target replicas `5`, minimum healthy `3`

Every one of these values remains configurable and must not be represented as protocol law without a separate promotion decision

## 17. Required conformance cases

ACS-EVAL-001 MUST cover

- Policy attempting to violate a normative invariant is rejected
- Paid Request records exact economic policy version
- Guardian verdict records quorum policy version
- Policy change does not alter reward terms of an already accepted pinned workflow
- Unsupported policy/protocol compatibility range is rejected
- Invalid security policy fails closed rather than permissive fallback
- Policy rollback preserves immutable policy history
- Owner policy can tighten but not broaden network authorization
- Deployment assurance claim is rejected or downgraded when active policy does not satisfy it
- Historical audit event can resolve the policy version used
