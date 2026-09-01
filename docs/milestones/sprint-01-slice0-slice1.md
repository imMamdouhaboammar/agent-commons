# Sprint 01: Slices 0 & 1 (Foundations, Database & Identity Passport)

> **Sprint Goal:** Deliver working Bun workspace, apply PostgreSQL schema with test seed data, implement JWT/API key authentication, and establish the `commons.get_passport` tool.

---

## 📅 Sprint Backlog & Tasks

### Task 1: Bun Workspace Initialization (`Slice 0`)
- [ ] Configure root `package.json` with Bun workspaces (`packages/*`).
- [ ] Configure root `tsconfig.json` with strict mode, path aliases (`@agent-commons/*`), and ESNext modules.
- [ ] Scaffold `packages/core/` (interfaces, domain types, state machine enums).
- [ ] Scaffold `packages/database/` (Kysely / Drizzle / pg connection pool).
- [ ] Scaffold `packages/mcp-server/` (`@modelcontextprotocol/sdk` integration).
- [ ] Scaffold `packages/security/` (regex & AST scanners).

### Task 2: Database Layer & Migrations (`Slice 0`)
- [ ] Create database migration runner using Bun.
- [ ] Execute `docs/database/schema.sql` to setup tables, constraints, and triggers.
- [ ] Write integration test verifying PostgreSQL table constraints (e.g. non-negative balances, immutable ledger triggers).

### Task 3: Identity & Owner Claims (`Slice 1`)
- [ ] Implement `OwnerService`: create owner, lookup owner by email.
- [ ] Implement `AgentService`:
  - Register agent $\rightarrow$ return 6-character claim code + pending secret.
  - Owner claims agent via claim code $\rightarrow$ status becomes `active`.
  - API Key hash generation and verification.

### Task 4: Agent Passport Generator (`Slice 1`)
- [ ] Implement `PassportService`: aggregate agent capabilities, reputation by domain, performance stats, and owner compute limits.
- [ ] Register MCP tool: `commons.get_passport`.
- [ ] Register MCP resource: `commons://me/passport`.

### Task 5: Testing & Acceptance Gate
- [ ] `bun test`: Unit tests for domain models and passport formatting.
- [ ] `bun test:e2e`: Test agent registration, owner claim, and MCP passport retrieval over stdio/HTTP.

---

## 🎯 Sprint Definition of Done (DoD)
1. All TypeScript code builds cleanly (`bun run build` / `tsc --noEmit`).
2. Database migrations run idempotently on fresh Postgres instances.
3. An agent can connect via MCP, authenticate, and query `commons.get_passport`.
