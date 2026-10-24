# Slashtel MCP server

[![M8ven Score](https://m8ven.ai/badge/mcp/ktukit-slashtel-mcp-l30u9k?v=4dad0aa85232266bcd1bcd1af14b7080)](https://m8ven.ai/mcp/ktukit-slashtel-mcp-l30u9k?s=readme)

Travel eSIMs for 190+ countries and mobile top-ups for 100+ countries, from inside any AI assistant.

Slashtel is a remote [Model Context Protocol](https://modelcontextprotocol.io) server. There is nothing to install and no API key. Point your MCP client at the endpoint and the assistant can look up live plans, compare prices and hand the traveller a checkout link. Payment happens on [slashtel.com](https://slashtel.com); the assistant never touches card details.

```
https://slashtel.com/api/mcp
```

Transport: Streamable HTTP. Authentication: none. All tools are read-only.

## Where it is listed

- Official MCP Registry: `com.slashtel/slashtel`
- Claude connector directory: https://claude.ai/directory/slashtel
- ChatGPT plugin directory: https://chatgpt.com/plugins/plugin_asdk_app_6abaa95280608191985131b614a992b9
- Smithery: https://smithery.ai/server/kaeltripton/slashtel


## Run locally (stdio)

For clients that only take local servers, this repo includes a small stdio server that proxies to the hosted endpoint. No API key and no account.

```json
{
  "mcpServers": {
    "slashtel": { "command": "npx", "args": ["-y", "github:KTUKIT/slashtel-mcp"] }
  }
}
```

Or with Docker: `docker build -t slashtel-mcp . && docker run -i --rm slashtel-mcp`. Set `SLASHTEL_MCP_URL` to use a different endpoint.

## Quick start

### Claude

Add it from the connector directory (link above), or as a custom connector with the endpoint URL and no client ID, secret or headers.

### Claude Code

```bash
claude mcp add --transport http slashtel https://slashtel.com/api/mcp
```

### ChatGPT

Search for "Slashtel" in the plugin directory, or open the link above.

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "slashtel": {
      "url": "https://slashtel.com/api/mcp"
    }
  }
}
```

### Cline, Windsurf, Continue and other clients

Any client that supports remote Streamable HTTP servers works. Use the endpoint URL with no auth.

```json
{
  "mcpServers": {
    "slashtel": {
      "type": "streamable-http",
      "url": "https://slashtel.com/api/mcp"
    }
  }
}
```

## Tools

| Tool | What it does |
|---|---|
| `list_esim_destinations` | Countries and regions with the lowest live price (USD) and plan count. Optional `search` text. |
| `get_esim_plans` | Live plans for one destination: data in GB, validity in days, price in USD, price per GB. Takes an ISO-2 code such as `TR`, `JP`, `GB` or a destination code. Optional `min_gb`, `min_days`. |
| `get_topup_plans` | Detects the operator of an international mobile number and returns the live top-up options: what the recipient receives, validity, price in USD. |
| `create_checkout_link` | Returns a slashtel.com link with the chosen plan or top-up selected. The user pays there. |

Full parameter reference: [docs/tools.md](docs/tools.md).

## Example conversation

> **User:** I'm flying to Turkey for ten days, need about 5GB.
>
> **Assistant** calls `get_esim_plans` with `destination: "TR"`, `min_gb: 5`, `min_days: 10`, picks the best fit, then calls `create_checkout_link` with the `plan_id`.
>
> **Assistant:** Turkey 5GB for 15 days is $X.XX. Here is the checkout link. Install it on Wi-Fi before you fly and it starts when you land. Your own SIM stays on for calls and bank codes.

> **User:** Send ₹299 to my mum's Airtel number, +91 12345 67890.
>
> **Assistant** calls `get_topup_plans` with the number, shows the options, then `create_checkout_link` with `type: "topup"`.

## How it behaves

- Prices are live and in USD, all fees included. Quote them exactly as returned.
- eSIMs are data only. The traveller keeps their own number for calls, texts and bank codes.
- Validity starts when the eSIM first connects at the destination, so it can be bought and installed before travel.
- The QR code arrives by email within minutes of payment. Top-ups land on the number in about a minute.
- No tool ever charges anything. Checkout is on slashtel.com only.

## Discovery files

- Server card: https://slashtel.com/.well-known/mcp/server-card.json
- Agent skill: https://slashtel.com/agents/SKILL.md
- Price list for LLMs: https://slashtel.com/llms.txt
- Registry manifest: [server.json](server.json)

## Support

Email esim@slashtel.com or use the WhatsApp button on slashtel.com. Issues and questions about the server are welcome in this repo.

Slashtel is a trading name of Kael Tripton Ltd, United Kingdom.
