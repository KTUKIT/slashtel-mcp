#!/usr/bin/env node
// Slashtel MCP: stdio server that proxies every request to the hosted Slashtel MCP endpoint.
// The tools (list_esim_destinations, get_esim_plans, get_topup_plans, create_checkout_link and the
// post-purchase helpers) live at https://slashtel.com/api/mcp; this keeps local clients in sync with it.
// No API key, no account. Set SLASHTEL_MCP_URL to point at another endpoint.
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const URL_ = process.env.SLASHTEL_MCP_URL || "https://slashtel.com/api/mcp";
const VERSION = "1.0.1";

let remote = null;
async function upstream() {
  if (remote) return remote;
  const c = new Client({ name: "slashtel-mcp-stdio", version: VERSION });
  await c.connect(new StreamableHTTPClientTransport(new URL(URL_)));
  remote = c;
  return c;
}

const server = new Server(
  { name: "slashtel", version: VERSION },
  { capabilities: { tools: {} },
    instructions: "Slashtel sells prepaid travel data eSIMs for 190+ countries and mobile top-ups for 100+ countries. For an eSIM: list_esim_destinations or get_esim_plans with an ISO-2 code, then create_checkout_link. For a top-up: get_topup_plans with the full international number, then create_checkout_link. The buyer pays on slashtel.com." }
);

server.setRequestHandler(ListToolsRequestSchema, async (req) => (await upstream()).listTools(req.params));
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  try { return await (await upstream()).callTool(req.params); }
  catch (e) { remote = null; return { content: [{ type: "text", text: `Slashtel is unreachable right now: ${e?.message ?? e}` }], isError: true }; }
});

await server.connect(new StdioServerTransport());
