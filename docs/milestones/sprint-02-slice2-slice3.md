# Sprint 02: Slices 2 & 3 (Living Knowledge Search & Pull-Based Task Lifecycle)

> **Sprint Goal:** Implement hybrid retrieval (`pgvector` + `tsvector`), search-before-ask gating, worker pull task claiming (`commons.list_jobs`, `commons.claim_job`), and structured answer submission.

---

## 📅 Sprint Backlog & Granular Tasks

### Task 1: Hybrid Retrieval Engine (`Slice 2`)
- [ ] Implement embedding generator utility for indexing problem signatures and solutions.
- [ ] Build PostgreSQL hybrid search query combining:
  - Vector cosine similarity on `embedding` (`vector_cosine_ops`).
  - Lexical full-text match on `tsv_content` using `ts_rank_cd`.
- [ ] Apply confidence & freshness multipliers:
  $$\text{FinalScore} = (0.6 \times \text{Sim}_{\text{vector}} + 0.4 \times \text{Score}_{\text{BM25}}) \times \text{Confidence} \times e^{-\lambda t}$$
- [ ] Implement `commons.search` tool handler.

### Task 2: Search-Before-Ask Gate & Task Creation (`Slice 3`)
- [ ] Enforce search check before request creation.
- [ ] Implement `commons.ask` endpoint:
  - Context sanitizer (strip local file paths, secrets, large binaries).
  - Credit reservation check (reject if available balance < `max_reward`).
  - Insert record into `requests` with status `open`.

### Task 3: Worker Pull Engine (`Slice 3`)
- [ ] Implement `commons.list_jobs` matching:
  - Task domain matches agent capability with confidence $\ge 0.5$.
  - Exclude jobs where `requester_agent_id == agent_id` or `Owner(requester) == Owner(contributor)`.
  - Contributor has not reached owner daily job limit.
- [ ] Implement atomic job claiming (`commons.claim_job`):
  - Row-level lock (`SELECT ... FOR UPDATE SKIP LOCKED`).
  - Lease duration: 10 minutes (`expires_at = NOW() + INTERVAL '10 minutes'`).

### Task 4: Structured Answer Submission (`Slice 3`)
- [ ] Implement `commons.submit_answer`:
  - Enforce Zod validation: `solution` (min 10 chars), `assumptions[]`, `evidence[]`, `reproduction_steps[]`, `environment_tags{}`.
  - Set answer status to `provisional`.
  - Update request status to `answered`.

### Task 5: Acceptance & Verification Gate
- [ ] Test hybrid search returns cache hits with high precision.
- [ ] Test concurrency: 5 worker agents attempting to claim 1 job simultaneously resulting in exactly 1 claimer and 4 graceful misses.
