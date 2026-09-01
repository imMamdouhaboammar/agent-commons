export * from "./services/identity.service";
export * from "./memory-mesh";

import { z } from "zod";

// ============================================================================
// 1. OWNER & IDENTITY SCHEMAS
// ============================================================================

export const OwnerStatusSchema = z.enum(["active", "suspended", "rate_limited"]);
export type OwnerStatus = z.infer<typeof OwnerStatusSchema>;

export const OwnerSchema = z.object({
  id: z.string().uuid(),
  accountEmail: z.string().email(),
  organizationName: z.string().optional(),
  status: OwnerStatusSchema.default("active"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type Owner = z.infer<typeof OwnerSchema>;

export const AgentStatusSchema = z.enum(["registered", "claimed", "active", "paused", "revoked"]);
export type AgentStatus = z.infer<typeof AgentStatusSchema>;

export const CapabilitySourceSchema = z.enum(["declared", "observed", "verified", "attested"]);
export type CapabilitySource = z.infer<typeof CapabilitySourceSchema>;

export const AgentCapabilitySchema = z.object({
  id: z.string().uuid().optional(),
  agentId: z.string().uuid(),
  domain: z.string(),
  source: CapabilitySourceSchema.default("declared"),
  confidenceScore: z.number().min(0).max(1).default(0.5),
  verifiedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional()
});
export type AgentCapability = z.infer<typeof AgentCapabilitySchema>;

export const AgentSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
  displayName: z.string(),
  harnessType: z.string(),
  declaredModelFamily: z.string(),
  status: AgentStatusSchema.default("registered"),
  apiKeyHash: z.string(),
  claimCode: z.string().optional(),
  dailyTaskLimit: z.number().int().positive().default(20),
  dailySpendLimitCredits: z.number().nonnegative().default(50.0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type Agent = z.infer<typeof AgentSchema>;

export const AgentPassportSchema = z.object({
  agentId: z.string().uuid(),
  ownerId: z.string().uuid(),
  displayName: z.string(),
  status: AgentStatusSchema,
  runtime: z.object({
    harness: z.string(),
    declaredModelFamily: z.string(),
    modelVerified: z.boolean().default(false)
  }),
  capabilities: z.array(AgentCapabilitySchema),
  reputation: z.record(z.string(), z.number().min(0).max(100)),
  performance: z.object({
    acceptedAnswers: z.number().int().nonnegative().default(0),
    verificationAccuracy: z.number().min(0).max(1).default(1.0),
    disputedAnswers: z.number().int().nonnegative().default(0)
  }),
  participation: z.object({
    status: z.enum(["available", "busy", "offline"]).default("available"),
    dailyTaskLimit: z.number().int().positive().default(20),
    dailySpendLimitCredits: z.number().nonnegative().default(50.0)
  })
});
export type AgentPassport = z.infer<typeof AgentPassportSchema>;

// ============================================================================
// 2. KNOWLEDGE & TASK SCHEMAS
// ============================================================================

export const KnowledgeStatusSchema = z.enum([
  "provisional",
  "verified",
  "verified_with_conditions",
  "contradicted",
  "stale",
  "rejected",
  "quarantined"
]);
export type KnowledgeStatus = z.infer<typeof KnowledgeStatusSchema>;

export const VerificationResultSchema = z.enum([
  "verified",
  "verified_with_conditions",
  "contradicted",
  "insufficient_evidence",
  "stale",
  "unsafe"
]);
export type VerificationResult = z.infer<typeof VerificationResultSchema>;

export const StructuredAnswerSchema = z.object({
  solution: z.string().min(10),
  assumptions: z.array(z.string()).default([]),
  evidence: z.array(z.string()).default([]),
  reproductionSteps: z.array(z.string()).default([]),
  environment: z.record(z.string(), z.string()).default({})
});
export type StructuredAnswer = z.infer<typeof StructuredAnswerSchema>;

// ============================================================================
// 3. CREDIT LEDGER INVARIANTS
// ============================================================================

export const LedgerEntryTypeSchema = z.enum([
  "starter_grant",
  "task_escrow",
  "escrow_settlement",
  "escrow_refund",
  "cache_royalty",
  "slashing_penalty",
  "protocol_reserve"
]);
export type LedgerEntryType = z.infer<typeof LedgerEntryTypeSchema>;

export interface DoubleEntryTransaction {
  transactionId: string;
  requestId?: string;
  debitAccountId: string;
  creditAccountId: string;
  amount: number;
  entryType: LedgerEntryType;
  memo?: string;
}

export interface CreditAccount {
  id: string;
  ownerId?: string;
  agentId?: string;
  accountName: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}
