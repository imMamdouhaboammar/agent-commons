import { randomUUID } from "node:crypto";
import {
  EvidenceObjectSchema,
  GovernanceCaseSchema,
  ImmuneThreatMemorySchema,
  ViolationClassSchema,
  computeMemoryCID,
  type EvidenceObject,
  type GovernanceCase,
  type ImmuneThreatMemory,
  type ViolationClass
} from "@agent-commons/core";
import { scanAndSanitizeSecrets } from "@agent-commons/security";

const MAX_OBSERVATIONS = 20;
const MAX_OBSERVATION_LENGTH = 2_000;
const MAX_SYNC_LIMIT = 100;
const MAX_TELEMETRY_BYTES = 16_384;
const MAX_TELEMETRY_DEPTH = 5;
const MAX_TELEMETRY_KEYS = 50;
const MAX_TELEMETRY_ARRAY_ITEMS = 50;

export interface GuardianThreatReportInput {
  violation_class: unknown;
  violation_type: unknown;
  target_cid?: unknown;
  target_agent_id?: unknown;
  observations: unknown;
  telemetry?: unknown;
}

export interface GuardianThreatReportResult {
  status: "reported";
  evidence_cid: string;
  case_id: string;
  reporter_did: string;
  violation_class: ViolationClass;
  bounty_status: "pending_independent_confirmation";
  immediate_reward_credits: 0;
  secrets_redacted: number;
}

export interface GuardianThreatSyncInput {
  severity?: unknown;
  limit?: unknown;
}

export interface GuardianThreatSyncResult {
  confirmed_only: true;
  count: number;
  threats: ImmuneThreatMemory[];
}

function requiredString(value: unknown, field: string, maxLength = 256): string {
  if (typeof value !== "string") {
    throw new Error(`${field} must be a string`);
  }

  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new Error(`${field} must not be empty`);
  }
  if (normalized.length > maxLength) {
    throw new Error(`${field} exceeds maximum length ${maxLength}`);
  }
  return normalized;
}

function optionalString(value: unknown, field: string, maxLength = 512): string | undefined {
  if (value === undefined || value === null) return undefined;
  return requiredString(value, field, maxLength);
}

function parseObservations(value: unknown): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("observations must contain at least one item");
  }
  if (value.length > MAX_OBSERVATIONS) {
    throw new Error(`observations exceeds maximum item count ${MAX_OBSERVATIONS}`);
  }

  return value.map((entry, index) =>
    requiredString(entry, `observations[${index}]`, MAX_OBSERVATION_LENGTH)
  );
}

function recordDetectedTypes(types: string[], detectedSecretTypes: Set<string>): void {
  for (const secretType of types) {
    detectedSecretTypes.add(secretType);
  }
}

function sanitizeTelemetryValue(
  value: unknown,
  detectedSecretTypes: Set<string>,
  depth: number
): unknown {
  if (depth > MAX_TELEMETRY_DEPTH) {
    throw new Error(`telemetry exceeds maximum depth ${MAX_TELEMETRY_DEPTH}`);
  }

  if (value === null || typeof value === "boolean" || typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const scan = scanAndSanitizeSecrets(value);
    recordDetectedTypes(scan.detectedTypes, detectedSecretTypes);
    return scan.sanitizedContent;
  }

  if (Array.isArray(value)) {
    if (value.length > MAX_TELEMETRY_ARRAY_ITEMS) {
      throw new Error(`telemetry array exceeds maximum item count ${MAX_TELEMETRY_ARRAY_ITEMS}`);
    }
    return value.map((item) => sanitizeTelemetryValue(item, detectedSecretTypes, depth + 1));
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length > MAX_TELEMETRY_KEYS) {
      throw new Error(`telemetry object exceeds maximum key count ${MAX_TELEMETRY_KEYS}`);
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, nestedValue] of entries) {
      const keyScan = scanAndSanitizeSecrets(key);
      if (keyScan.hasSecrets) {
        throw new Error("telemetry keys must not contain secrets");
      }
      sanitized[key] = sanitizeTelemetryValue(nestedValue, detectedSecretTypes, depth + 1);
    }
    return sanitized;
  }

  throw new Error("telemetry contains unsupported value type");
}

function sanitizeTelemetry(
  value: unknown,
  detectedSecretTypes: Set<string>
): Record<string, unknown> {
  if (value === undefined || value === null) return {};
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error("telemetry must be an object");
  }

  let serialized: string;
  try {
    serialized = JSON.stringify(value);
  } catch {
    throw new Error("telemetry must be JSON serializable");
  }

  if (Buffer.byteLength(serialized, "utf8") > MAX_TELEMETRY_BYTES) {
    throw new Error(`telemetry exceeds maximum size ${MAX_TELEMETRY_BYTES} bytes`);
  }

  return sanitizeTelemetryValue(value, detectedSecretTypes, 0) as Record<string, unknown>;
}

export class GuardianRuntime {
  private readonly evidence = new Map<string, EvidenceObject>();
  private readonly cases = new Map<string, GovernanceCase>();
  private readonly confirmedThreats = new Map<string, ImmuneThreatMemory>();

  constructor(private readonly reporterDid: string) {
    if (!reporterDid.trim()) {
      throw new Error("GuardianRuntime requires a server-authoritative reporter DID");
    }
  }

  reportThreat(input: GuardianThreatReportInput): GuardianThreatReportResult {
    const violationClass = ViolationClassSchema.parse(input.violation_class);
    const violationType = requiredString(input.violation_type, "violation_type");
    const targetCid = optionalString(input.target_cid, "target_cid");
    const targetAgentId = optionalString(input.target_agent_id, "target_agent_id");

    if (!targetCid && !targetAgentId) {
      throw new Error("threat report requires target_cid or target_agent_id");
    }

    const observations = parseObservations(input.observations);
    const sanitizedObservations: string[] = [];
    const detectedSecretTypes = new Set<string>();

    for (const observation of observations) {
      const scan = scanAndSanitizeSecrets(observation);
      sanitizedObservations.push(scan.sanitizedContent);
      recordDetectedTypes(scan.detectedTypes, detectedSecretTypes);
    }

    const sanitizedTelemetry = sanitizeTelemetry(input.telemetry, detectedSecretTypes);
    const createdAt = new Date().toISOString();
    const evidencePayload = {
      schema: "agent-evidence/1" as const,
      violationClass,
      violationType,
      targetCid,
      targetAgentId,
      reporterDid: this.reporterDid,
      observations: sanitizedObservations,
      telemetry: sanitizedTelemetry,
      createdAt
    };
    const evidenceCid = computeMemoryCID(evidencePayload);

    const evidence = EvidenceObjectSchema.parse({
      ...evidencePayload,
      evidenceId: evidenceCid
    });

    const governanceCase = GovernanceCaseSchema.parse({
      caseId: randomUUID(),
      evidenceCid,
      violationClass,
      accusedAgentId: targetAgentId ?? `cid:${targetCid}`,
      status: "reported",
      assignedJury: [],
      verdict: "pending",
      sanctionsApplied: [],
      bountyEscrowCredits: 0,
      createdAt
    });

    this.evidence.set(evidenceCid, evidence);
    this.cases.set(governanceCase.caseId, governanceCase);

    return {
      status: "reported",
      evidence_cid: evidenceCid,
      case_id: governanceCase.caseId,
      reporter_did: this.reporterDid,
      violation_class: violationClass,
      bounty_status: "pending_independent_confirmation",
      immediate_reward_credits: 0,
      secrets_redacted: detectedSecretTypes.size
    };
  }

  syncConfirmedThreats(input: GuardianThreatSyncInput = {}): GuardianThreatSyncResult {
    const requestedLimit =
      typeof input.limit === "number" && Number.isInteger(input.limit) ? input.limit : 25;
    const limit = Math.max(1, Math.min(MAX_SYNC_LIMIT, requestedLimit));

    const severity =
      typeof input.severity === "string" && input.severity.length > 0
        ? input.severity
        : undefined;

    const threats = [...this.confirmedThreats.values()]
      .filter((threat) => !severity || threat.severity === severity)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);

    return {
      confirmed_only: true,
      count: threats.length,
      threats
    };
  }

  /**
   * Internal boundary for a future independently adjudicated Guardian jury flow.
   * This is deliberately not exposed as an MCP tool in Guardian Runtime v0.
   */
  addConfirmedThreatMemory(threat: ImmuneThreatMemory): void {
    const parsed = ImmuneThreatMemorySchema.parse(threat);
    this.confirmedThreats.set(parsed.threatId, parsed);
  }
}
