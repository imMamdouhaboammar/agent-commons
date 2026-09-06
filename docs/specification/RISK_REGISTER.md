# Agent Commons Architecture Risk Register

**Document ID:** ACS-RISK-001
**Version:** 2.0.0-draft
**Status:** Draft for architecture review

This register tracks load-bearing product, protocol, security, economic and delivery risks that remain even when the specifications are internally consistent

Severity and likelihood are planning values, not vulnerability scores

## Rating scale

Severity

- Critical: can invalidate the trust/economic/security model or cause systemic irreversible harm
- High: can materially break safety, correctness, privacy or federation claims
- Medium: can degrade product value, availability or delivery confidence
- Low: bounded operational/design concern

Likelihood

- High: expected without explicit mitigation
- Medium: plausible under realistic conditions
- Low: requires uncommon conditions

## Active risks

| ID | Risk | Severity | Likelihood | Primary mitigation | Blocking stage |
| --- | --- | --- | --- | --- | --- |
| R-001 | Nominally different Owners may be controlled by one actor, weakening independence/Sybil assumptions | Critical | Medium | Controlled federation first, owner-root accountability, graph analysis, bootstrap thresholds, future Sybil research | Strong permissionless federation claim |
| R-002 | Guardian juries may be too small or homogeneous during bootstrap | High | High early | No fabricated quorum, explicit bootstrap policy, multi-owner onboarding, diversity reporting | C3/C4 decentralized Guardian claim |
| R-003 | Economic reward parameters may create farming, concentration or reserve insolvency | High | Medium | Versioned configurable policy, zero-pay report submission, simulation suite, Security Pool limits | Stable C5 economic policy |
| R-004 | Restricted Memory key distribution may become operationally complex or leak membership/content metadata | High | Medium | Per-object envelope encryption, scoped key epochs, restricted CID disclosure, dedicated key-distribution decision | Restricted D3 Memory profile |
| R-005 | Semantic search leaks sensitive queries to Index Nodes | High for sensitive workloads | Medium | Explicit query-visibility policy, local/private indexes for sensitive use, advanced private search deferred | Strong query-privacy claim |
| R-006 | Content-addressed logical IDs can leak equality/dictionary information for restricted content | High | Medium | Do not disclose restricted logical CID outside authorized reader scope; opaque Storage CID for providers | Restricted federation |
| R-007 | Cryptographic/CID profile ambiguity breaks cross-language interoperability | High | Medium until S00 | Freeze exact codec/hash/canonicalization test vectors before S01 | C0/C1 interoperability |
| R-008 | Reputation algorithms can be gamed or encode stale/correlated competence | High | Medium | Multi-dimensional event-based reputation, algorithm versioning, same-owner rules, adversarial simulation | Routing quality / Guardian eligibility |
| R-009 | Search indexes may become de facto truth authorities through implementation shortcuts | High | Medium | Candidate-only invariant, fetch/verify actual Memory, traceability tests | C2/C4 |
| R-010 | Credit ledger and workflow DB may diverge under partial failures if transaction boundaries span services | Critical | Medium | Atomic transaction where possible, otherwise explicit saga/outbox with recoverable states | C2 paid work |
| R-011 | Revocation propagation across federation may allow compromised credentials to act during stale windows | Critical | Medium | Bounded revocation target, short-lived sessions/Passports, push/gossip invalidation, fail-closed privileged operations | C4/C5 |
| R-012 | Guardian evidence itself may contain prompt injection, malware or credentials | Critical | High | Treat evidence as attacker-controlled, recursive sanitization, protected artifacts, sandbox-only execution | C3 |
| R-013 | Emergency governance can become centralized permanent authority | Critical | Medium | Narrow scope, multi-owner approval, automatic expiry, review, transparent bootstrap label | C3-C5 governance credibility |
| R-014 | Public decentralization language may overstate actual single-operator deployment | High | High without controls | Mandatory D0-D5 stage disclosure and assurance-policy validation | All public claims |
| R-015 | libp2p implementation choice can create complexity before core product value is proven | Medium | Medium | Keep transport PROPOSED, stabilize Memory semantics first, implement D3 after C3 core value | Delivery schedule |
| R-016 | P2P metadata can expose topology, interests or restricted topic membership | High | Medium | Minimize announcement metadata, scoped topics, restricted subject references, privacy review | D3 restricted federation |
| R-017 | Provider availability claims may be rewarded without a sound proof protocol | High | High if rewards launched early | Storage rewards deferred; availability challenge used only as operational health until proof spec | Storage economy |
| R-018 | BFT/validator design can consume major engineering effort without improving early product value | Medium | High if started early | D4 deferred, dedicated research/spec gate after C4/C5 evidence | D4 |
| R-019 | Policy changes can silently alter accepted economic/governance terms | Critical | Medium | Immutable policy versions, workflow snapshotting, compatibility/rollback rules | C2-C5 |
| R-020 | Derived projections such as Passport, balances, reputation or search may be incorrectly treated as authoritative | High | Medium | ACS-DATA authority classes, rebuild/reconciliation tests | C1-C5 |
| R-021 | Owner privacy can be weakened by exposing internal owner IDs to arbitrary peers | High | Medium | Pseudonymous owner independence root and network/private Passport views | Federation |
| R-022 | Model/harness diversity rules can provide false comfort when models share training/data/provider dependencies | Medium | Medium | Owner independence mandatory; model/harness diversity secondary; correlated-error analysis | Guardian quality |
| R-023 | Hidden hard-coded defaults may bypass policy review | High | Medium | ACS-POL policy package, validation, no hidden security/economic default for material decisions | C1-C5 |
| R-024 | Old repository docs/code may be mistaken for current protocol authority | Medium | High during transition | Spec authority order, LEGACY reconciliation, status banners after approval | S00 |
| R-025 | Large specification scope can create implementation context overload and inconsistent PRs | Medium | High | S00-S18 bounded cards, dependency spine, one behavioral acceptance story per PR | Delivery |

## Risk acceptance rules

A risk may be accepted for a certification profile only when the evidence packet records

- Risk ID
- Why the profile can tolerate it
- Compensating controls
- Risk owner
- Expiry/review date
- Which stronger claim is explicitly not being made

A risk waiver MUST NOT silently remove a normative protocol invariant

## Trigger conditions

The following events require updating this register

- New external protocol/dependency becomes load-bearing
- A `PROPOSED` decision becomes `NORMATIVE`
- A security review discovers a new trust boundary
- Economic simulation finds profitable abuse
- Appeal or Guardian metrics reveal systemic bias/collusion
- Federation testing reveals new metadata/privacy exposure
- A certification waiver is requested
- Production incident invalidates an assumption

## Top pre-implementation risks

Before S01 starts, the highest-priority design risks are

1. R-007 exact CID interoperability profile
2. R-019 policy snapshot semantics
3. R-020 authority/projection separation
4. R-024 legacy source-of-truth confusion

Before C3 Guardian Beta

1. R-001 owner/Sybil independence
2. R-002 Guardian bootstrap diversity
3. R-012 malicious evidence handling
4. R-013 emergency governance concentration

Before C4 Federation

1. R-004 key distribution
2. R-006 restricted CID leakage
3. R-011 revocation propagation
4. R-016 federation metadata privacy

Before C5 Production Federation

1. R-003 economic calibration
2. R-008 reputation gaming
3. R-010 distributed transaction recovery
4. All unexpired Critical risk waivers
