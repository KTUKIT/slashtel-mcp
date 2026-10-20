#!/usr/bin/env sh
# Lists Turkey eSIM plans straight from the MCP endpoint (no key needed).
curl -s https://slashtel.com/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_esim_plans","arguments":{"destination":"TR"}}}'
