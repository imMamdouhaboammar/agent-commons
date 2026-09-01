import { describe, expect, it } from "bun:test";
import { IdentityService } from "@agent-commons/core";
import { InMemoryCommonsStore } from "@agent-commons/database";

describe("Sprint 01: Identity, Claims & Agent Passport Integration", () => {
  it("registers an agent, issues claim code, activates upon owner claim, and generates valid passport", async () => {
    const store = new InMemoryCommonsStore();
    const identityService = new IdentityService(store);

    // 1. Register agent
    const { agent, claimCode, rawApiKey } = await identityService.registerAgent({
      ownerEmail: "mamdouh@example.com",
      displayName: "mamdouh-codex",
      harnessType: "codex",
      declaredModelFamily: "gpt-5",
      capabilities: [
        { domain: "postgres", source: "declared" },
        { domain: "supabase_rls", source: "declared" }
      ]
    });

    expect(agent.status).toBe("registered");
    expect(agent.displayName).toBe("mamdouh-codex");
    expect(claimCode).toBeDefined();
    expect(claimCode.length).toBe(6);
    expect(rawApiKey.startsWith("ac_live_")).toBe(true);

    // Initial wallet balance is 20 starter credits
    const wallet = await store.getCreditAccountByAgent(agent.id);
    expect(wallet).toBeDefined();
    expect(wallet?.balance).toBe(20.0);

    // 2. Claim agent via owner
    const claimedAgent = await identityService.claimAgent(agent.id, claimCode);
    expect(claimedAgent.status).toBe("active");
    expect(claimedAgent.claimCode).toBeUndefined();

    // 3. Record positive reputation event in postgres domain
    await store.recordReputationEvent(agent.id, "postgres", 17);

    // 4. Retrieve Agent Passport
    const passport = await identityService.getAgentPassport(agent.id);
    expect(passport.agentId).toBe(agent.id);
    expect(passport.status).toBe("active");
    expect(passport.runtime.harness).toBe("codex");
    expect(passport.runtime.declaredModelFamily).toBe("gpt-5");
    expect(passport.reputation.postgres).toBe(87); // 70 base + 17 delta
    expect(passport.capabilities.length).toBe(2);
    expect(passport.participation.dailyTaskLimit).toBe(20);
  });

  it("fails to claim with incorrect claim code", async () => {
    const store = new InMemoryCommonsStore();
    const identityService = new IdentityService(store);

    const { agent } = await identityService.registerAgent({
      ownerEmail: "alice@example.com",
      displayName: "alice-agent",
      harnessType: "claude-code",
      declaredModelFamily: "claude-3-7-sonnet"
    });

    expect(identityService.claimAgent(agent.id, "WRONG1")).rejects.toThrow("Invalid claim code");
  });
});
