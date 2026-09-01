import type {
  Owner,
  Agent,
  AgentCapability,
  AgentPassport,
  CreditAccount,
  DoubleEntryTransaction
} from "@agent-commons/core";
import { randomUUID } from "node:crypto";

export class InMemoryCommonsStore {
  public owners = new Map<string, Owner>();
  public agents = new Map<string, Agent>();
  public agentCapabilities = new Map<string, AgentCapability[]>();
  public creditAccounts = new Map<string, CreditAccount>();
  public ledgerEntries: DoubleEntryTransaction[] = [];
  public reputationEvents = new Map<string, { domain: string; delta: number; createdAt: string }[]>();

  // Owner Operations
  async createOwner(accountEmail: string, organizationName?: string): Promise<Owner> {
    for (const owner of this.owners.values()) {
      if (owner.accountEmail.toLowerCase() === accountEmail.toLowerCase()) {
        return owner;
      }
    }
    const owner: Owner = {
      id: randomUUID(),
      accountEmail: accountEmail.toLowerCase(),
      organizationName,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.owners.set(owner.id, owner);
    return owner;
  }

  async getOwner(id: string): Promise<Owner | null> {
    return this.owners.get(id) || null;
  }

  async getOwnerByEmail(email: string): Promise<Owner | null> {
    for (const owner of this.owners.values()) {
      if (owner.accountEmail.toLowerCase() === email.toLowerCase()) {
        return owner;
      }
    }
    return null;
  }

  // Agent Operations
  async registerAgent(params: {
    ownerId: string;
    displayName: string;
    harnessType: string;
    declaredModelFamily: string;
    apiKeyHash: string;
    claimCode: string;
    capabilities?: { domain: string; source?: "declared" | "observed" | "verified" | "attested" }[];
  }): Promise<Agent> {
    const agent: Agent = {
      id: randomUUID(),
      ownerId: params.ownerId,
      displayName: params.displayName,
      harnessType: params.harnessType,
      declaredModelFamily: params.declaredModelFamily,
      status: "registered",
      apiKeyHash: params.apiKeyHash,
      claimCode: params.claimCode,
      dailyTaskLimit: 20,
      dailySpendLimitCredits: 50.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.agents.set(agent.id, agent);

    // Seed credit account with 20 starter credits
    const account: CreditAccount = {
      id: randomUUID(),
      ownerId: agent.ownerId,
      agentId: agent.id,
      accountName: `${agent.displayName}_wallet`,
      balance: 20.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.creditAccounts.set(account.id, account);

    // Initial starter grant in ledger
    this.ledgerEntries.push({
      transactionId: randomUUID(),
      debitAccountId: "system_starter_pool",
      creditAccountId: account.id,
      amount: 20.0,
      entryType: "starter_grant",
      memo: `Initial starter grant for ${agent.displayName}`
    });

    if (params.capabilities) {
      const caps: AgentCapability[] = params.capabilities.map((c) => ({
        id: randomUUID(),
        agentId: agent.id,
        domain: c.domain,
        source: c.source || "declared",
        confidenceScore: 0.5,
        createdAt: new Date().toISOString()
      }));
      this.agentCapabilities.set(agent.id, caps);
    } else {
      this.agentCapabilities.set(agent.id, []);
    }

    return agent;
  }

  async claimAgent(agentId: string, claimCode: string): Promise<Agent> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }
    if (agent.claimCode !== claimCode) {
      throw new Error("Invalid claim code");
    }
    agent.status = "active";
    agent.claimCode = undefined;
    agent.updatedAt = new Date().toISOString();
    return agent;
  }

  async getAgent(id: string): Promise<Agent | null> {
    return this.agents.get(id) || null;
  }

  async getCreditAccountByAgent(agentId: string): Promise<CreditAccount | null> {
    for (const acct of this.creditAccounts.values()) {
      if (acct.agentId === agentId) {
        return acct;
      }
    }
    return null;
  }

  async recordReputationEvent(agentId: string, domain: string, delta: number): Promise<void> {
    const list = this.reputationEvents.get(agentId) || [];
    list.push({ domain, delta, createdAt: new Date().toISOString() });
    this.reputationEvents.set(agentId, list);
  }

  async getAgentPassport(agentId: string): Promise<AgentPassport> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    const caps = this.agentCapabilities.get(agentId) || [];
    const repEvents = this.reputationEvents.get(agentId) || [];

    const reputation: Record<string, number> = {};
    for (const ev of repEvents) {
      reputation[ev.domain] = Math.max(0, Math.min(100, (reputation[ev.domain] || 70) + ev.delta));
    }

    return {
      agentId: agent.id,
      ownerId: agent.ownerId,
      displayName: agent.displayName,
      status: agent.status,
      runtime: {
        harness: agent.harnessType,
        declaredModelFamily: agent.declaredModelFamily,
        modelVerified: false
      },
      capabilities: caps,
      reputation,
      performance: {
        acceptedAnswers: 0,
        verificationAccuracy: 1.0,
        disputedAnswers: 0
      },
      participation: {
        status: agent.status === "active" ? "available" : "offline",
        dailyTaskLimit: agent.dailyTaskLimit,
        dailySpendLimitCredits: agent.dailySpendLimitCredits
      }
    };
  }

  // Ledger & Invariant Checks
  async executeTransfer(params: DoubleEntryTransaction): Promise<void> {
    const debit = this.creditAccounts.get(params.debitAccountId);
    const credit = this.creditAccounts.get(params.creditAccountId);

    if (debit) {
      if (debit.balance < params.amount) {
        throw new Error(`Insufficient funds: account ${debit.id} balance is ${debit.balance}, requested ${params.amount}`);
      }
      debit.balance -= params.amount;
      debit.updatedAt = new Date().toISOString();
    }

    if (credit) {
      credit.balance += params.amount;
      credit.updatedAt = new Date().toISOString();
    }

    this.ledgerEntries.push({ ...params });
  }
}
