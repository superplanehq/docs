---
title: Install and connect the CLI
description: Install the SuperPlane CLI, authenticate with an API token and inspect workspace tasks.
---

Use the SuperPlane command-line interface (CLI) to inspect workspaces and tasks from your terminal or scripts. This guide covers installation, API token authentication and read-only commands for users who already have access to a SuperPlane organization.

## Install the CLI

The npm package supports macOS and Linux on x64 and arm64. With Node.js and npm installed, run:

```bash
npm install -g @superplane/cli
superplane --help
```

The package downloads the matching platform binary from [the SuperPlane installer service](https://install.superplane.com/install.sh). For installation without npm, download and review the installer, then run it:

```bash
curl -fsSL https://install.superplane.com/install.sh -o install-superplane.sh
sh install-superplane.sh
superplane --help
```

Windows is not supported by the npm distribution. See [the CLI distribution instructions](https://github.com/superplanehq/superplane/blob/main/release/superplane-cli-npm/README.md) for supported platforms and installation alternatives.

## Authenticate with an API token

Obtain an API token for the organization you intend to use. Set the installation URL and token in your shell; replace `your_access_token_here` with your token:

```bash
export SUPERPLANE_URL=https://app.superplane.com
export SUPERPLANE_TOKEN=your_access_token_here
superplane whoami
```

For unattended scripts, inject the token through your secret manager or CI secret configuration. Do not commit tokens to source control or include them in shared logs.

To save the organization as your current CLI context, run:

```bash
superplane connect "$SUPERPLANE_URL" "$SUPERPLANE_TOKEN"
```

The command validates the token and saves a local context. Environment variables override the saved context. To use the saved context in later commands, remove the environment overrides:

```bash
unset SUPERPLANE_URL SUPERPLANE_TOKEN
superplane whoami
```

## Inspect workspaces and tasks

List the workspaces you can access:

```bash
superplane workspace list
```

Select an active workspace, replacing `your_workspace_key` with a key from the list, then list its tasks:

```bash
superplane workspace active your_workspace_key
superplane tasks list
```

For structured output in a script, request JSON:

```bash
superplane tasks list --output json
```

Use command help to inspect the options supported by your installed version:

```bash
superplane workspace --help
superplane tasks --help
```

## Connect to a self-hosted installation

Set `SUPERPLANE_URL` to your installation's public origin and use a token issued by that installation. Do not append `/api/v1` to the base URL. See [self-hosting](/self-hosting/overview) for deployment setup.

## Related tools

- [Connect an MCP client](/agents/mcp) for editor and agent access through OAuth.
- [API reference](https://superplane.com/api/) for endpoint definitions and client generation.
