---
title: External agents
description: Use coding agents like Claude Code, Cursor, or Windsurf to build and operate SuperPlane apps.
---

External coding agents can operate SuperPlane through the CLI and published skills. This lets you use tools like Claude Code, Cursor, or Windsurf to build workflows, debug executions, and manage apps — all from your terminal or IDE.

## Setup

### 1. Create a service account

The agent needs its own identity to authenticate with SuperPlane. Create a [service account](/security/service-accounts) with the appropriate role:

1. Go to **Organization Settings > Service accounts**
2. Create a service account (e.g., `coding-agent`)
3. Assign it a role — `org_admin` for full access, or a custom role scoped to specific apps
4. Generate an API token and copy it

### 2. Install the CLI

Install the SuperPlane CLI on the machine where your agent runs:

```bash
curl -fsSL https://install.superplane.com/install.sh | sh
```

See [CLI documentation](/cli/overview) for platform-specific options.

### 3. Connect the CLI

Authenticate the CLI with the service account token:

```bash
superplane connect <your-superplane-url> <service-account-token>
```

Verify the connection:

```bash
superplane apps list
```

### 4. Install skills

Skills teach the agent how to use SuperPlane. They are published at [superplanehq/skills](https://github.com/superplanehq/skills). Install them with:

```bash
npx skills add superplanehq/skills
```

Or install specific skills:

```bash
npx skills add superplanehq/skills --skill superplane-cli
npx skills add superplanehq/skills --skill superplane-app-builder
npx skills add superplanehq/skills --skill superplane-monitor
```

### Available skills

| Skill | What it does |
| ----- | ------------ |
| `superplane-cli` | Operate SuperPlane via CLI — list apps, manage canvases, handle secrets, inspect runs |
| `superplane-app-builder` | Design and build workflow apps from plain-language descriptions |
| `superplane-monitor` | Debug failed executions, inspect run chains, check queues |

## What you can do

Once the CLI is connected and skills are installed, your coding agent can work with SuperPlane directly.

### Build workflows from descriptions

Ask the agent to build a workflow and it will generate the canvas YAML and apply it:

```
"Build a SuperPlane app that listens for GitHub PRs, runs a license
check, and posts a commit status"
```

The agent uses the `superplane-app-builder` skill to translate your description into a canvas with the right triggers, components, and connections.

### Inspect and debug runs

Point the agent at a failing workflow and it will dig into the execution history:

```
"The deploy pipeline failed on the last run, check what happened"
```

The agent uses `superplane-monitor` to inspect run chains, read payloads, check error messages, and suggest fixes.

### Manage apps and configuration

The agent can perform any CLI operation:

```
"List all apps and show me the canvas for the preview environments app"
"Add a secret called deploy-key with the SSH private key"
"Check the memory namespace preview-envs for stale entries"
```

### Modify existing apps

Install an app from a template, then ask the agent to customize it:

```
"I installed the Preview Environments app but I want to add a Slack
notification when a new environment is ready"
```

The agent reads the current canvas, adds the node, wires the connection, and applies the update.

## Tips

- **Use the right skill for the task.** `superplane-cli` is the general-purpose skill. `superplane-app-builder` is best for creating new workflows. `superplane-monitor` is best for debugging.
- **Be specific about which app** you want to work with. The agent can list apps, but naming the app in your prompt saves a round-trip.
- **The agent works through the CLI**, so anything you can do with `superplane` commands, the agent can do too.
- **Service account permissions matter.** If the agent gets permission errors, check the role assigned to the service account.
- **Combine with the built-in agent.** Use external agents for heavy lifting (building complex canvases, bulk operations) and the [built-in agent](/concepts/agent) for interactive edits in the UI.
