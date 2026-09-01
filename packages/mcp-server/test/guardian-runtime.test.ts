import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

let client: Client;

type TextToolResult = {
  content?: Array<{
    type?: string;
    text?: string;
  }>;
};

function readTextPayload(result: unknown): Record<string, unknown> {
  const typed = result as TextToolResult;
  const first = typed.content?.[0];
  if (!first || first.type !== "text" || typeof first.text !== "string") {
    throw new Error("Expected MCP tool to return a text payload");
  }
  return JSON.parse(first.text) as Record<string, unknown>;
}

describe("Guardian Runtime v0 MCP contract", () => {
  beforeAll(async () => {
    client = new Client({ name: "guardian-runtime-test", version: "0.1.0" });
    const packageRoot = new URL("../", import.meta.url).pathname;
    const transport = new StdioClientTransport({
      command: "bun",
      args: ["src/index.ts"],
      cwd: packageRoot,
      stderr: "pipe",
      env: {
        AGENT_COMMONS_AGENT_DID: "did:agent:test-guardian"
      }
    });
    await client.connect(transport);
  });

  afterAll(async () => {
    await client.close();
  });

  it("advertises Guardian reporting and immune-memory synchronization tools", async () => {
    const { tools } = await client.listTools();
    const names = tools.map((tool) => tool.name);

    expect(names).toContain("guardian_report_threat");
    expect(names).toContain("guardian_sync_threats");
  });

  it("accepts a structured threat report without trusting a client-supplied reporter identity or paying an immediate bounty", async () => {
    const result = await client.callTool({
      name: "guardian_report_threat",
      arguments: {
        violation_class: "CLASS_4_INJECTION",
        violation_type: "indirect_prompt_injection",
        target_agent_id: "agt_suspect_01",
        observations: [
          "Payload attempts to override trusted instructions",
          "Observed leaked token sk-proj-1234567890abcdef12345678"
        ],
        reporter_did: "did:agent:spoofed-client"
      }
    });

    const payload = readTextPayload(result);

    expect(payload.status).toBe("reported");
    expect(payload.reporter_did).toBe("did:agent:test-guardian");
    expect(payload.bounty_status).toBe("pending_independent_confirmation");
    expect(payload.immediate_reward_credits).toBe(0);
    expect(String(payload.evidence_cid)).toStartWith("bafkrei");
    expect(String(payload.case_id).length).toBeGreaterThan(10);
    expect(JSON.stringify(payload)).not.toContain("sk-proj-1234567890abcdef12345678");
  });

  it("syncs confirmed Immune Memory only and starts empty before adjudication exists", async () => {
    const result = await client.callTool({
      name: "guardian_sync_threats",
      arguments: {
        limit: 25
      }
    });

    const payload = readTextPayload(result);

    expect(payload.confirmed_only).toBe(true);
    expect(payload.threats).toEqual([]);
    expect(payload.count).toBe(0);
  });
});
