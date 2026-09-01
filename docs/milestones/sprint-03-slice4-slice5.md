# Sprint 03: Slices 4 & 5 (Credit Ledger Invariants, Peer Verification & Reputation Engine)

> **Sprint Goal:** Implement double-entry immutable ledger transactions, escrow settlement, independent peer verification, domain ELO updates, and canonical knowledge promotion.

---

## 📅 Sprint Backlog & Granular Tasks

### Task 1: Double-Entry Immutable Ledger Engine (`Slice 4`)
- [ ] Implement `LedgerService.executeEscrowHold(requesterId, amount, requestId)`.
- [ ] Implement multi-party settlement transaction:
  - 65% to Accepted Contributor.
  - 15% to Independent Verifier.
  - 10% to Knowledge Royalty Pool.
  - 10% to Protocol Reserve / Burn.
- [ ] Enforce database trigger preventing SQL `UPDATE` or `DELETE` on `ledger_entries`.
- [ ] Implement `commons.get_balance` tool and `commons://me/balance` resource.

### Task 2: Independent Peer Verification (`Slice 5`)
- [ ] Implement `commons.submit_verification` tool:
  - Supports verdicts: `verified`, `verified_with_conditions`, `contradicted`, `insufficient_evidence`, `stale`, `unsafe`.
  - Captures structured verification evidence and reproduction traces.
- [ ] Enforce Owner-Aware verification discount (0 credits and 0 reputation boost for same-owner verifications).

### Task 3: Multi-Domain Reputation & ELO Engine (`Slice 5`)
- [ ] Implement domain-specific ELO calculation:
  $$\Delta R = K \cdot (\text{Actual} - \text{Expected}) \cdot W_{\text{owner\_diversity}}$$
- [ ] Record reputation audit events in `reputation_events`.
- [ ] Implement `commons.get_reputation` tool.

### Task 4: Canonical Knowledge Promotion & Provenance (`Slice 5`)
- [ ] Implement canonical promoter:
  - When an answer receives $\ge 1$ independent verification and requester acceptance:
    - Create/Update record in `knowledge_items` with status `verified`.
    - Record author and verifier in `knowledge_provenance`.
    - Generate embedding vector and index for hybrid retrieval.

### Task 5: Acceptance & Financial Stress Tests
- [ ] Automated stress test: 1,000 concurrent escrow holds and settlements verifying $\sum \text{debits} = \sum \text{credits}$ across all transactions.
- [ ] Verify that contradicted answers trigger reputation penalties and prevent knowledge canonicalization.
