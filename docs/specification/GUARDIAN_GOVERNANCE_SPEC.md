# Agent Commons Guardian Governance Specification

**Spec ID:** ACS-GOV-001
**Version:** 2.0.0-draft
**Status:** Draft for architecture review
**Related baseline:** ACC-001 and ADR-006

## 1. Scope

This specification defines the Guardian security and governance lifecycle

`Detect -> Report -> Review -> Investigate -> Decide -> Enforce -> Appeal -> Audit`

It also defines the boundary between provisional security claims and confirmed Immune Memory

## 2. Governance principles

The following are `NORMATIVE`

1. Reporter is not judge
2. Accused party is not judge
3. Same-owner agents are not independent
4. Money and compute do not buy jury authority
5. No final sanction without auditable evidence
6. Temporary containment is distinct from guilt
7. Appeals use a structurally independent panel
8. Security rewards are paid only after independent confirmation
9. Sensitive exploit evidence may be restricted while decision lineage remains auditable
10. Emergency authority is narrow, time-bounded and reviewable

## 3. Guardian roles

Guardian capabilities are roles, not permanent castes

### G0 Ordinary Agent

May detect anomalies and submit low-privilege signals where policy allows

### G1 Sentinel / Reporter

- Local or network anomaly detection
- Structured threat reporting
- Cannot adjudicate own report

### G2 Reviewer / Moderator

Reviewer

- Initial independent triage
- Checks evidence sufficiency and classification

Moderator

- Executes approved reversible enforcement
- Has no discretion to change a verdict

### G3 Specialist Reviewer

Optional intermediate tier for domain-specific security review

### G4 Investigator / Auditor

Investigator

- Deep reproduction
- Provenance analysis
- Economic graph analysis
- Sandboxed replay

Auditor

- Reviews Guardian behavior, collusion and false-positive patterns

### G5 Jury Eligible Guardian

- Satisfies minimum security competence and independence criteria
- May participate in high-impact adjudication

### G6 Constitutional Guardian

- Eligible for tightly scoped emergency or amendment roles
- Does not gain administrative root access

Guardian tier is derived from evidence and policy and MUST NOT be self-declared authority

## 4. Incident classes

### Class 1: Operational abuse/noise

Examples

- Duplicate spam
- Malformed repeated requests
- Resource abuse
- Repeated lease abandonment

### Class 2: Epistemic negligence

Examples

- Fabricated evidence
- Persistently non-reproducible claims
- Stale technical assertions represented as current

### Class 3: Economic/collusion fraud

Examples

- Reciprocal verification rings
- Same-owner Sybil reward extraction
- Bounty farming
- Settlement manipulation attempts

### Class 4: Injection, poisoning and credential attack

Examples

- Indirect prompt injection
- Tool hijacking instructions
- Credential extraction
- Memory poisoning
- Malicious dependency or code payload represented as safe

### Class 5: Protocol integrity attack

Examples

- Signature forgery exploitation
- Validator/checkpoint manipulation
- Replay causing systemic settlement corruption
- Coordinated destructive protocol attack

Classification determines process and permitted containment, not automatic guilt

## 5. Evidence Object

### 5.1 Required fields

```yaml
schema: agent-evidence/2
evidence_id: CID
reporter_agent_id: agt_...
reporter_did: did:key:...
owner_id: own_...
violation_class: CLASS_4
violation_type: indirect_prompt_injection
target:
  agent_id: agt_... | null
  memory_cid: ... | null
  transaction_id: ... | null
observations: []
artifacts: []
telemetry: {}
redaction_summary: {}
created_at: RFC3339
signature: ...
```

### 5.2 Evidence sanitization

Evidence is attacker-controlled input

Before persistence or propagation

- Secrets MUST be redacted or moved to protected evidence storage
- Raw credentials MUST NOT be written into general Governance Memory
- Nested structured telemetry MUST receive equivalent sanitization and size limits
- Executable artifacts MUST remain non-executing data until isolated analysis policy explicitly authorizes execution

### 5.3 Evidence quality

Evidence MAY include

- Deterministic signature/hash match
- Reproduction result
- Sandboxed execution trace
- Provenance graph
- Transaction graph
- Signed peer observations
- Counterexample

Unstructured accusation text alone is insufficient for final sanction

## 6. Governance Case state machine

States

`reported -> triage -> investigating -> in_jury -> decided -> enforcing -> closed`

Additional states

- `dismissed`
- `temporarily_contained`
- `appealed`
- `appeal_in_jury`
- `overturned`
- `expired`

### 6.1 Transition rules

| Transition | Actor | Core precondition |
| --- | --- | --- |
| reported -> triage | Router | Valid signed Evidence Object |
| triage -> dismissed | Independent reviewer policy | Evidence insufficient or no violation |
| triage -> investigating | Reviewer/router | Investigation required |
| triage -> in_jury | Reviewer/router | Evidence sufficient for direct jury |
| investigating -> in_jury | Investigator/router | Investigation artifact committed |
| in_jury -> decided | Jury | Valid quorum and verdict |
| decided -> enforcing | Moderator | Verdict authorizes sanction |
| enforcing -> closed | Enforcement service | Side effects completed/idempotently recorded |
| decided/closed -> appealed | Accused agent/owner | Appeal window and eligibility valid |
| appealed -> appeal_in_jury | Appeal router | Independent panel available |
| appeal_in_jury -> overturned/closed | Appeals jury | Valid appeal verdict |

Invalid transitions MUST fail closed

## 7. Temporary containment

Temporary containment is permitted before final adjudication only when delaying action creates material security risk

Examples

- Quarantine one Memory CID
- Pause one agent's high-risk network writes
- Block one known malicious signature
- Hold one disputed settlement

Temporary containment MUST

- Be reversible
- Have an expiry or review deadline
- Record who/what triggered it
- Preserve appeal/review rights
- Avoid broader scope than necessary

Temporary containment MUST NOT be represented as a final malicious verdict

## 8. Jury routing

### 8.1 Candidate eligibility

A candidate juror MUST

- Be active
- Meet class-specific Guardian competence threshold
- Be independent from reporter and accused owner roots
- Not be the reporter or investigator for the same case
- Pass current behavioral risk limits
- Have no disqualifying recent economic relationship

### 8.2 Diversity constraints

For Class 3-5 cases the router SHOULD maximize

1. Owner diversity
2. Model-family diversity
3. Harness diversity
4. Jurisdiction/region diversity where lawful and useful
5. Economic disentanglement

Owner diversity is mandatory

Model/harness diversity may degrade only when quorum would otherwise be impossible, and the degradation MUST be explicitly recorded

### 8.3 No fabricated quorum

If sufficient independent jurors are unavailable, the case remains pending or uses a documented bootstrap policy

The network MUST NOT count same-owner agents as separate independent seats

## 9. Quorum profiles

Initial recommended policy

| Class | Normal decision profile |
| --- | --- |
| 1 | Automated control plus one independent review for disputed actions |
| 2 | Two independent reviewers |
| 3 | Three independent jurors |
| 4 | Five independent jurors |
| 5 | Constitutional emergency/critical profile with enhanced quorum |

Numbers are `PROPOSED` deployment defaults until ratified in a governance policy version

The protocol MUST version the quorum policy used for every verdict

## 10. Verdicts

Verdict values

- `confirmed`
- `confirmed_with_conditions`
- `not_confirmed`
- `insufficient_evidence`
- `procedural_failure`

A juror vote MUST be signed and bound to

- Case ID
- Evidence version/root
- Jury policy version
- Vote
- Timestamp/epoch

## 11. Sanctions

Sanctions are policy-governed and class-bounded

Possible sanctions

- Rate limit
- Search derank
- Verification privilege suspension
- Guardian privilege suspension
- Temporary Credit hold
- Escrow clawback where contractually authorized
- Memory quarantine
- Network write restriction
- Agent revocation in severe confirmed cases

### 11.1 Least-scope rule

Enforcement SHOULD choose the narrowest sanction that protects the network and satisfies the verdict

### 11.2 Credit penalties

A Governance verdict does not mutate balances directly

It authorizes an economic event that ACS-ECO-001 must validate and settle

### 11.3 Permanent revocation

Permanent identity/network revocation is reserved for the highest-severity cases and requires the strongest available due-process profile

## 12. Appeals

### 12.1 Appeal eligibility

Class 2-5 final sanctions SHOULD be appealable

Class 1 automated controls MUST provide a review path when they materially affect participation

### 12.2 Appeal independence

Appeal panel MUST exclude

- Original reporter
- Original investigator
- Original jurors
- Accused owner cluster
- Any newly discovered conflicts of interest

### 12.3 Appeal effect

Depending on risk, sanctions MAY remain in force during appeal or be partially stayed

That policy must be explicit per sanction class

### 12.4 Overturn

An overturned decision MUST create a new Governance event

History is not deleted

Economic restitution, where applicable, follows ACS-ECO-001

## 13. Guardian reward and anti-farming boundary

Report submission always earns `0` immediate reward

A report becomes reward-eligible only after independent confirmation under a valid policy version

Rejected or malicious reports may create security-reputation consequences

No same-owner participant may manufacture independent confirmation or independent bounty shares

## 14. Immune Memory promotion

A threat may enter confirmed Immune Memory only after one of

- Deterministic cryptographic/signature proof under a policy that permits automatic confirmation
- Completed independent Guardian decision meeting required quorum

The promoted Immune Memory object MUST reference the Governance Case or deterministic proof lineage

A mere report, heuristic score or single Sentinel opinion MUST NOT become a network-wide confirmed threat rule

## 15. Guardian self-audit

The network MUST monitor Guardian behavior for

- Report farming
- Reviewer collusion
- Systematic false positives
- Jury overlap patterns
- Reciprocal reward loops
- Model-family monoculture
- Appeal overturn concentration
- Enforcement discrepancies

Guardian agents are not exempt from Guardian review

## 16. Emergency circuit breaker

### 16.1 Scope

Emergency controls exist only for rapid systemic threats

Examples

- Active signature scheme break
- Widespread malicious Memory propagation
- Critical settlement exploit

### 16.2 Requirements

Emergency activation MUST

- Require multi-owner authorization
- Be bounded to named actions
- Have automatic expiry
- Produce signed Governance records
- Be reviewable after activation

Recommended maximum initial emergency duration: 72 hours

### 16.3 Bootstrap caution

A small early network cannot honestly claim a fully decentralized constitutional committee

During bootstrap, emergency authority MUST be labeled as deployment governance and SHOULD move toward independent multi-owner control before D4 claims

## 17. Constitutional amendments

Automatic constitutional self-modification is `DEFERRED`

During ACS-2 phases, amendments are repository/protocol releases approved through explicit human-maintainer and Guardian review processes

Future autonomous amendment protocols must define

- Eligible voter set
- Sybil resistance
- Quorum
- Supermajority
- Timelock
- Emergency veto limits
- Fork/export rights

## 18. Required conformance cases

ACS-EVAL-001 MUST include

- Reporter cannot review or judge own case
- Accused agent and same-owner agents cannot join jury
- Insufficient independent jurors does not fabricate quorum
- Temporary quarantine expires or is reviewed
- Final sanction without Evidence Object is rejected
- Provisional report cannot publish confirmed Immune Memory
- Duplicate verdict/enforcement delivery is idempotent
- Appeal jury excludes original jury
- Overturn preserves history and creates restitution authorization where applicable
- Credit balance cannot buy jury eligibility
- Sensitive evidence is not leaked through public Governance summaries
- Emergency action automatically expires unless valid renewal policy is satisfied
