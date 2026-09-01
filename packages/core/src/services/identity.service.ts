import { createHash, randomBytes } from "node:crypto";
import type { Agent, AgentPassport, Owner } from "../index";

export interface IdentityStore {
  createOwner(accountEmail: string, organizationName?: string): Promise<Owner>;
  getOwner(id: string): Promise<Owner | null>;
  getOwnerByEmail(email: string): Promise<Owner | null>;
  registerAgent(params: {
    ownerId: string;
    displayName: string;
    harnessType: string;
    declaredModelFamily: string;
    apiKeyHash: string;
    claimCode: string;
    capabilities?: { domain: string; source?: "declared" | "observed" | "verified" | "attested" }[];
  }): Promise<Agent>;
  claimAgent(agentId: string, claimCode: string): Promise<Agent>;
  getAgent(id: string): Promise<Agent | null>;
  getAgentPassport(agentId: string): Promise<AgentPassport>;
}

export class IdentityService {
  constructor(private store: IdentityStore) {}

  static hashApiKey(key: string): string {
    return createHash("sha256").update(key).digest("hex");
  }

  static generateClaimCode(): string {
    return randomBytes(3).toString("hex").toUpperCase(); // 6 character hex
  }

  static generateApiKey(): { rawKey: string; keyHash: string } {
    const rawKey = `ac_live_${randomBytes(24).toString("hex")}`;
    const keyHash = IdentityService.hashApiKey(rawKey);
    return { rawKey, keyHash };
  }

  async createOrGetOwner(email: string, organizationName?: string): Promise<Owner> {
    const existing = await this.store.getOwnerByEmail(email);
    if (existing) return existing;
    return this.store.createOwner(email, organizationName);
  }

  async registerAgent(params: {
    ownerEmail: string;
    displayName: string;
    harnessType: string;
    declaredModelFamily: string;
    capabilities?: { domain: string; source?: "declared" | "observed" | "verified" | "attested" }[];
  }): Promise<{ agent: Agent; claimCode: string; rawApiKey: string }> {
    const owner = await this.createOrGetOwner(params.ownerEmail);
    const { rawKey, keyHash } = IdentityService.generateApiKey();
    const claimCode = IdentityService.generateClaimCode();

    const agent = await this.store.registerAgent({
      ownerId: owner.id,
      displayName: params.displayName,
      harnessType: params.harnessType,
      declaredModelFamily: params.declaredModelFamily,
      apiKeyHash: keyHash,
      claimCode,
      capabilities: params.capabilities
    });

    return { agent, claimCode, rawApiKey: rawKey };
  }

  async claimAgent(agentId: string, claimCode: string): Promise<Agent> {
    return this.store.claimAgent(agentId, claimCode);
  }

  async getAgentPassport(agentId: string): Promise<AgentPassport> {
    return this.store.getAgentPassport(agentId);
  }
}
