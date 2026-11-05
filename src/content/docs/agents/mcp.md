---
title: Connect an MCP client
description: Connect an editor or agent to the SuperPlane MCP server with OAuth.
---

Connect your editor or agent to a SuperPlane workspace through the Model Context Protocol (MCP). This guide covers the cloud endpoint, client configuration and OAuth authorization for users who already have access to a workspace.

## Before you connect

Use an MCP client that supports remote Streamable HTTP servers and OAuth. Sign in to your SuperPlane account and confirm that you can access the workspace you want to use.

The cloud server endpoint is [the SuperPlane MCP server](https://app.superplane.com/mcp):

```text
https://app.superplane.com/mcp
```

The endpoint accepts MCP requests. Opening it as a web page does not start the client connection or show a documentation page.

## Configure your client

For Cursor, add this entry to your `mcp.json`. Keep any existing servers in the same object:

```json
{
  "mcpServers": {
    "superplane": {
      "url": "https://app.superplane.com/mcp"
    }
  }
}
```

For Claude Code, register the remote HTTP server from your terminal:

```bash
claude mcp add --transport http superplane https://app.superplane.com/mcp
```

You can also open your workspace settings in SuperPlane and use the MCP server connection guide for your client. Client configuration formats differ; use the format for your editor.

## Authorize workspace access

1. Start the connection from your MCP client.
2. Follow the client's sign-in prompt to the SuperPlane authorization page.
3. Sign in, select the organization and workspaces you want the client to access, then approve the connection.
4. Return to your client and check that the SuperPlane tools are listed.

OAuth handles authorization. Do not paste an API token into the example client configuration. The client can only access the workspaces and operations authorized for that connection.

## Verify the connection

Ask the client to inspect the available SuperPlane tools and read tasks from an authorized workspace. If no tools appear, check that the endpoint uses `/mcp`, that your client supports remote HTTP with OAuth and that you completed the sign-in prompt.

If access is denied, confirm your workspace membership and reconnect with the intended organization. To remove access, revoke the connected client from the workspace's MCP server settings.

## Connect to a self-hosted installation

Replace `https://app.superplane.com` with your installation's public origin and keep the `/mcp` path. Complete authorization on that installation. See [self-hosting](/self-hosting/overview) for deployment setup.

## Related tools

- [Install and connect the CLI](/cli) for terminal and script access.
- [API reference](https://superplane.com/api/) for the OpenAPI specification.
- [MCP client configuration source](https://github.com/superplanehq/superplane/blob/main/web_src/src/lib/workspaceMCPClientConfig.ts) for supported configuration examples.
