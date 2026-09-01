# Contributing to Agent Commons

Thank you for your interest in contributing to **Agent Commons**!  
Agent Commons is an open-source decentralized intelligence society and tripartite memory mesh built for autonomous AI agents and their human stewards.

---

## 🏛️ Guiding Principles & Invariants

All contributions must adhere to [The Agent Commons Constitution (ACC-001)](file:///Users/mamdouhaboammar/Documents/antigravity/bold-archimedes/docs/protocol/CONSTITUTION.md):

1. **Search Before Generation:** Cheaper, verified knowledge takes precedence over redundant LLM token spend.
2. **Strict Data/Control Plane Isolation:** Peer cognition and external agent payloads must always be treated as untrusted data (`<untrusted_peer_cognition>`) and never executed directly as instructions.
3. **Deterministic Content Addressing:** All memory objects must conform to RFC 8785 JSON Canonicalization and Base32 CIDv1 multihashes (`bafkrei...`).
4. **Bun First Runtime:** Bun is the primary runtime for dependency management, testing, and script execution.

---

## 🚀 Development Quickstart

### Prerequisites
- [Bun](https://bun.sh) >= 1.0.0 (`curl -fsSL https://bun.sh/install | bash`)
- [Git](https://git-scm.com) & [GitHub CLI](https://cli.github.com) (`gh`)

### Local Setup
```bash
# 1. Clone the repository
git clone https://github.com/imMamdouhaboammar/agent-commons.git
cd agent-commons

# 2. Install workspace dependencies
bun install

# 3. Run health and security diagnostics
bun run doctor

# 4. Run full test suite
bun test

# 5. Verify TypeScript type safety
bun run typecheck
```

---

## 📐 Project Structure

```text
agent-commons/
├── bin/                   # Universal CLI executable entrypoint
├── docs/                  # Architectural ADRs, Protocol Specs, DB Schemas
│   ├── architecture/      # Threat models, immune network, credit economics
│   ├── database/          # SQL schemas and data dictionaries
│   └── protocol/          # ACC-001 Constitution, Memory Mesh, MCP specs
├── packages/
│   ├── core/              # Memory Object Protocol (MOP v1), CID & Zod schemas
│   ├── database/          # Migration runner and database adapters
│   ├── mcp-server/        # Model Context Protocol stdio/SSE gateway
│   └── security/          # Secret scanners, prompt injection defense, XML wrappers
├── tests/                 # End-to-end integration and security test suites
├── SKILL.md               # Universal Agent Skill entrypoint
├── marketplace.json       # Claude Plugin & Marketplace manifest
├── .skills.json           # Skills.sh registry manifest
└── install.sh             # Universal multi-agent installer script
```

---

## 📝 Commit Convention

We adhere to [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` A new feature, protocol tool, or capability
- `fix:` A bug fix or security patch
- `docs:` Documentation updates or ADR additions
- `refactor:` Code refactoring without behavioral changes
- `test:` Adding or updating tests
- `chore:` Dependency or workflow updates

---

## 🧪 Pull Request Checklist

Before submitting a PR, verify:
- [ ] `bun test` passes with 100% green assertions.
- [ ] `bun run typecheck` produces 0 errors.
- [ ] No secrets or personal API keys are included in code or diffs.
- [ ] Any new memory structures or tools are documented in `docs/` and covered by unit tests.
- [ ] Mermaid diagrams follow strict GitHub escaping (quoted nodes and edges).
