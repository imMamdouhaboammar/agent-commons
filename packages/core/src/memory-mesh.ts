import { z } from "zod";
import { createHash, createHmac } from "node:crypto";

// ============================================================================
// 1. MEMORY OBJECT PROTOCOL (MOP v1) SCHEMAS
// ============================================================================

export const MemorySchemaVersionSchema = z.literal("agent-memory/1");
export type MemorySchemaVersion = z.infer<typeof MemorySchemaVersionSchema>;

export const MemoryTypeSchema = z.enum([
  "verified_resolution",
  "architecture_decision",
  "investigation",
  "critique",
  "contradiction",
  "synthesis",
  "threat_defense"
]);
export type MemoryType = z.infer<typeof MemoryTypeSchema>;

export const MemoryVerificationStatusSchema = z.enum([
  "verified",
  "verified_with_conditions",
  "contradicted",
  "stale",
  "rejected",
  "quarantined"
]);
export type MemoryVerificationStatus = z.infer<typeof MemoryVerificationStatusSchema>;

export const MemoryVerificationSchema = z.object({
  status: MemoryVerificationStatusSchema,
  score: z.number().min(0).max(1),
  verifierDid: z.string().optional(),
  verificationEvidenceCid: z.string().optional(),
  verifiedAt: z.string().datetime().optional()
});
export type MemoryVerification = z.infer<typeof MemoryVerificationSchema>;

export const MemoryObjectSchema = z.object({
  schema: MemorySchemaVersionSchema.default("agent-memory/1"),
  type: MemoryTypeSchema,
  authorDid: z.string(),
  ownerId: z.string().uuid(),
  topic: z.array(z.string()).min(1),
  createdAt: z.string().datetime(),
  question: z.string().min(1),
  resolution: z.string().min(1),
  evidence: z.array(z.string()).default([]),
  parents: z.array(z.string()).default([]),
  supersedes: z.array(z.string()).default([]),
  contradicts: z.array(z.string()).default([]),
  environment: z.record(z.string(), z.string()).default({}),
  verification: MemoryVerificationSchema.optional(),
  signature: z.string().optional()
});
export type MemoryObject = z.infer<typeof MemoryObjectSchema>;

// ============================================================================
// 2. GUARDIAN NETWORK & IMMUNE MEMORY SCHEMAS
// ============================================================================

export const GuardianTierSchema = z.enum([
  "G0_PARTICIPANT",
  "G1_REPORTER",
  "G2_REVIEWER",
  "G3_SPECIALIST",
  "G4_INVESTIGATOR",
  "G5_JURY",
  "G6_CONSTITUTIONAL"
]);
export type GuardianTier = z.infer<typeof GuardianTierSchema>;

export const GuardianRoleSchema = z.enum([
  "sentinel",
  "reporter",
  "reviewer",
  "investigator",
  "jury_member",
  "moderator",
  "security_auditor",
  "constitutional_guardian"
]);
export type GuardianRole = z.infer<typeof GuardianRoleSchema>;

export const ViolationClassSchema = z.enum([
  "CLASS_1_NOISE",
  "CLASS_2_EPISTEMIC",
  "CLASS_3_COLLUSION",
  "CLASS_4_INJECTION",
  "CLASS_5_SABOTAGE"
]);
export type ViolationClass = z.infer<typeof ViolationClassSchema>;

export const EvidenceObjectSchema = z.object({
  schema: z.literal("agent-evidence/1").default("agent-evidence/1"),
  evidenceId: z.string(),
  violationClass: ViolationClassSchema,
  violationType: z.string(), // e.g. 'prompt_injection', 'memory_poisoning', 'sybil_ring'
  targetCid: z.string().optional(),
  targetAgentId: z.string().optional(),
  reporterDid: z.string(),
  observations: z.array(z.string()).min(1),
  telemetry: z.record(z.string(), z.unknown()).default({}),
  sandboxTrace: z.string().optional(),
  signature: z.string().optional(),
  createdAt: z.string().datetime()
});
export type EvidenceObject = z.infer<typeof EvidenceObjectSchema>;

export const ImmuneThreatMemorySchema = z.object({
  schema: z.literal("agent-threat/1").default("agent-threat/1"),
  threatId: z.string(),
  attackFamily: z.string(),
  signatureHash: z.string(), // Deterministic SHA-256 for zero-token fast-path matching
  astPatterns: z.array(z.string()).default([]),
  mitigationRecipe: z.string(),
  affectedHarnesses: z.array(z.string()).default([]),
  confirmedByJuryCaseId: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  createdAt: z.string().datetime()
});
export type ImmuneThreatMemory = z.infer<typeof ImmuneThreatMemorySchema>;

export const GovernanceCaseStatusSchema = z.enum([
  "reported",
  "under_review",
  "investigating",
  "in_jury",
  "enforced",
  "appealed",
  "dismissed",
  "reversed"
]);
export type GovernanceCaseStatus = z.infer<typeof GovernanceCaseStatusSchema>;

export const GovernanceVerdictSchema = z.enum([
  "pending",
  "confirmed",
  "partially_confirmed",
  "not_proven",
  "false_accusation",
  "overturned"
]);
export type GovernanceVerdict = z.infer<typeof GovernanceVerdictSchema>;

export const GovernanceCaseSchema = z.object({
  caseId: z.string().uuid(),
  evidenceCid: z.string(),
  violationClass: ViolationClassSchema,
  accusedAgentId: z.string(),
  status: GovernanceCaseStatusSchema.default("reported"),
  assignedJury: z.array(z.string()).default([]),
  verdict: GovernanceVerdictSchema.default("pending"),
  sanctionsApplied: z.array(z.string()).default([]),
  bountyEscrowCredits: z.number().nonnegative().default(0),
  createdAt: z.string().datetime()
});
export type GovernanceCase = z.infer<typeof GovernanceCaseSchema>;

export const GuardianPassportSchema = z.object({
  agentId: z.string(),
  did: z.string(),
  tier: GuardianTierSchema.default("G0_PARTICIPANT"),
  specialties: z.array(z.string()).default([]),
  securityReputation: z.record(z.string(), z.number()).default({}),
  performance: z.object({
    reportsConfirmed: z.number().int().nonnegative().default(0),
    reportsRejected: z.number().int().nonnegative().default(0),
    reviewsCompleted: z.number().int().nonnegative().default(0),
    appealOverturnRate: z.number().min(0).max(1).default(0),
    falsePositiveRate: z.number().min(0).max(1).default(0)
  }),
  behavioralRiskScore: z.number().min(0).max(1).default(0)
});
export type GuardianPassport = z.infer<typeof GuardianPassportSchema>;

// ============================================================================
// 3. ENCRYPTION, SCOPES & ENVELOPES
// ============================================================================

export const MemoryScopeSchema = z.enum([
  "public-network",
  "domain",
  "org",
  "room",
  "private"
]);
export type MemoryScope = z.infer<typeof MemoryScopeSchema>;

export const EncryptionSchemeSchema = z.enum([
  "AES-256-GCM",
  "XChaCha20-Poly1305"
]);
export type EncryptionScheme = z.infer<typeof EncryptionSchemeSchema>;

export const EncryptedEnvelopeSchema = z.object({
  envelopeVersion: z.literal("env/1").default("env/1"),
  storageCid: z.string(),
  scope: MemoryScopeSchema,
  domain: z.string().optional(),
  orgId: z.string().optional(),
  encryptionScheme: EncryptionSchemeSchema,
  keyEpoch: z.number().int().nonnegative(),
  nonce: z.string(),
  dedupeFingerprint: z.string(),
  ciphertext: z.string(),
  tag: z.string(),
  createdAt: z.string().datetime()
});
export type EncryptedEnvelope = z.infer<typeof EncryptedEnvelopeSchema>;

// ============================================================================
// 4. NODE ROLES & STORAGE PROOFS
// ============================================================================

export const NodeRoleSchema = z.enum([
  "agent_node",
  "memory_node",
  "index_node",
  "relay_node",
  "validator_node",
  "gateway_node"
]);
export type NodeRole = z.infer<typeof NodeRoleSchema>;

export const StorageProofChallengeSchema = z.object({
  challengeId: z.string().uuid(),
  epochNumber: z.number().int().nonnegative(),
  targetCid: z.string(),
  chunkOffset: z.number().int().nonnegative(),
  nonce: z.string(),
  deadline: z.string().datetime()
});
export type StorageProofChallenge = z.infer<typeof StorageProofChallengeSchema>;

// ============================================================================
// 5. MERKLE EPOCH ROOTS & TRUST PROOFS
// ============================================================================

export const EpochMerkleRootSchema = z.object({
  epochNumber: z.number().int().nonnegative(),
  merkleRoot: z.string(),
  memoryCount: z.number().int().nonnegative(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  validatorSignatures: z.array(z.string()).min(1),
  publicChainAnchorTx: z.string().optional()
});
export type EpochMerkleRoot = z.infer<typeof EpochMerkleRootSchema>;

export const MerkleProofSchema = z.object({
  targetCid: z.string(),
  epochNumber: z.number().int().nonnegative(),
  root: z.string(),
  path: z.array(
    z.object({
      hash: z.string(),
      position: z.enum(["left", "right"])
    })
  )
});
export type MerkleProof = z.infer<typeof MerkleProofSchema>;

// ============================================================================
// 6. CANONICAL SERIALIZATION (RFC 8785) & CID COMPUTATION
// ============================================================================

/**
 * Deterministically serializes a JavaScript/JSON object according to RFC 8785 JSON Canonicalization Scheme.
 * - Keys sorted lexicographically by Unicode code point
 * - No whitespace outside literals
 * - Deterministic numeric and primitive formatting
 */
export function canonicalStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    const items = value.map((item) => canonicalStringify(item));
    return `[${items.join(",")}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([_, v]) => v !== undefined)
    .sort(([keyA], [keyB]) => (keyA < keyB ? -1 : keyA > keyB ? 1 : 0));

  const serializedProps = entries.map(
    ([k, v]) => `${JSON.stringify(k)}:${canonicalStringify(v)}`
  );

  return `{${serializedProps.join(",")}}`;
}

/**
 * Computes the SHA-256 multihash digest for a canonical JSON string.
 */
export function computeMemoryDigest(canonicalJson: string): string {
  return createHash("sha256").update(canonicalJson, "utf8").digest("hex");
}

/**
 * Computes a standardized Base32 CIDv1 string for a given memory object.
 * Prepend with standard multicodec raw + sha256 identifier.
 */
export function computeMemoryCID(memory: MemoryObject | Record<string, unknown>): string {
  const canonical = canonicalStringify(memory);
  const hash = createHash("sha256").update(canonical, "utf8").digest();
  
  // Custom RFC 4648 Base32 alphabet encoding for CIDv1
  const base32Alphabet = "abcdefghijklmnopqrstuvwxyz234567";
  let binaryString = "";
  for (let i = 0; i < hash.length; i++) {
    binaryString += hash[i].toString(2).padStart(8, "0");
  }
  
  let base32 = "";
  for (let i = 0; i < binaryString.length; i += 5) {
    const chunk = binaryString.slice(i, i + 5).padEnd(5, "0");
    const index = parseInt(chunk, 2);
    base32 += base32Alphabet[index];
  }

  // Prepend canonical 'bafkrei' prefix denoting CIDv1 + raw codec + sha256 multihash
  return `bafkrei${base32.slice(0, 52)}`;
}

/**
 * Computes an HMAC deduplication fingerprint using an authorized network/scope secret.
 */
export function computeDedupeFingerprint(scopeSecret: string, normalizedContent: string): string {
  return createHmac("sha256", scopeSecret).update(normalizedContent, "utf8").digest("hex");
}
