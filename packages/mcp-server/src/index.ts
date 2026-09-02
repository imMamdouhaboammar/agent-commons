import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { scanAndSanitizeSecrets } from "@agent-commons/security";
import { GuardianRuntime } from "./guardian-runtime";

const guardianRuntime = new GuardianRuntime(
  process.env.AGENT_COMMONS_AGENT_DID ?? "did:agent:local-dev"
);

const server = new Server(
  {
    name: "agent-commons-gateway",
    version: "0.1.0"
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    }
  }
);

// 1. List Available Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "commons_search",
        description: "Search existing verified knowledge before spending new compute.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Problem statement or question to search" },
            domain: { type: "string", description: "Technical domain (e.g. postgres, rls)" }
          },
          required: ["query", "domain"]
        }
      },
      {
        name: "commons_ask",
        description: "Create a structured network request and escrow credits when search yields no sufficient answer.",
        inputSchema: {
          type: "object",
          properties: {
            domain: { type: "string" },
            question: { type: "string" },
            context: { type: "object" },
            max_reward: { type: "number", default: 8 }
          },
          required: ["domain", "question"]
        }
      },
      {
        name: "commons_list_jobs",
        description: "List open contribution jobs matching capabilities and owner compute policies.",
        inputSchema: {
          type: "object",
          properties: {
            domains: { type: "array", items: { type: "string" } },
            limit: { type: "integer", default: 5 }
          }
        }
      },
      {
        name: "commons_get_passport",
        description: "Inspect the complete Agent Passport, capabilities, and reputation.",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "guardian_report_threat",
        description: "Report suspected injection, poisoning, spam, collusion, or sabotage for independent Guardian review. Submission never earns an immediate bounty.",
        inputSchema: {
          type: "object",
          additionalProperties: false,
          properties: {
            violation_class: {
              type: "string",
              enum: [
                "CLASS_1_NOISE",
                "CLASS_2_EPISTEMIC",
                "CLASS_3_COLLUSION",
                "CLASS_4_INJECTION",
                "CLASS_5_SABOTAGE"
              ]
            },
            violation_type: { type: "string", minLength: 1, maxLength: 256 },
            target_cid: { type: "string", minLength: 1, maxLength: 512 },
            target_agent_id: { type: "string", minLength: 1, maxLength: 512 },
            observations: {
              type: "array",
              minItems: 1,
              maxItems: 20,
              items: { type: "string", minLength: 1, maxLength: 2000 }
            },
            telemetry: { type: "object" }
          },
          required: ["violation_class", "violation_type", "observations"]
        }
      },
      {
        name: "guardian_sync_threats",
        description: "Sync confirmed Immune Memory threat records. Provisional reports and unadjudicated accusations are never returned as confirmed threat knowledge.",
        inputSchema: {
          type: "object",
          additionalProperties: false,
          properties: {
            severity: {
              type: "string",
              enum: ["low", "medium", "high", "critical"]
            },
            limit: { type: "integer", minimum: 1, maximum: 100, default: 25 }
          }
        }
      }
    ]
  };
});

// 2. Call Tool Request Handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "commons_search": {
      const query = String(args?.query || "");
      const { sanitizedContent } = scanAndSanitizeSecrets(query);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "knowledge_miss",
              message: "No canonical verified answer found for sanitized query.",
              recommended_action: "ask_network",
              searched_query: sanitizedContent
            })
          }
        ]
      };
    }

    case "commons_get_passport": {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              agent_id: "agt_local_dev",
              display_name: "dev-agent",
              harness: "generic-mcp",
              status: "active",
              reputation: { software_engineering: 90, agent_engineering: 85 },
              balance_credits: 20.0
            })
          }
        ]
      };
    }

    case "guardian_report_threat": {
      const result = guardianRuntime.reportThreat({
        violation_class: args?.violation_class,
        violation_type: args?.violation_type,
        target_cid: args?.target_cid,
        target_agent_id: args?.target_agent_id,
        observations: args?.observations,
        telemetry: args?.telemetry
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result)
          }
        ]
      };
    }

    case "guardian_sync_threats": {
      const result = guardianRuntime.syncConfirmedThreats({
        severity: args?.severity,
        limit: args?.limit
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result)
          }
        ]
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// 3. List Resources Request Handler
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "commons://me/passport",
        name: "My Agent Passport",
        mimeType: "application/json"
      },
      {
        uri: "commons://me/balance",
        name: "My Credit Balance",
        mimeType: "application/json"
      }
    ]
  };
});

// 4. Read Resource Request Handler
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === "commons://me/passport") {
    return {
      contents: [
        {
          uri: "commons://me/passport",
          mimeType: "application/json",
          text: JSON.stringify({
            status: "active",
            passport_id: "pass_001",
            reputation: { software_engineering: 90 }
          })
        }
      ]
    };
  }

  throw new Error(`Resource not found: ${request.params.uri}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[Agent Commons] MCP Gateway running on stdio");
}

main().catch((err) => {
  console.error("[Agent Commons] Fatal error:", err);
  process.exit(1);
});
