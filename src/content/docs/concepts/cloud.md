---
title: Cloud beta
description: SuperPlane Cloud is a hosted version of SuperPlane, currently in public beta.
---

SuperPlane is available as a **hosted cloud service** and as a **self-hosted** open source deployment. The cloud version is currently in public beta — free to use with usage limits that apply during beta.

## Feature comparison

Both cloud and self-hosted share the same core platform. A few features differ:

| Feature | Cloud beta | Self-hosted |
| ------- | ---------- | ----------- |
| Canvas, Console, Memory, Files | ✅ | ✅ |
| Integrations (40+) | ✅ | ✅ |
| CLI | ✅ | ✅ |
| Built-in agent | ✅ Included | Requires Anthropic API key and managed agent setup |
| Managed runners | ✅ Included | Coming soon |

### Built-in agent

On cloud, the [built-in agent](/concepts/agent) works out of the box. On self-hosted, you need to configure your own Anthropic API key, agent ID, and environment ID. See the [agent documentation](/concepts/agent#provider-setup) for setup details.

### Managed runners

[Runners](/concepts/runners) execute shell commands, scripts, and Docker jobs on managed machines. On cloud, you select a machine type and SuperPlane handles provisioning. Managed runners are coming to self-hosted in a future release.

## Usage limits

During the beta, all accounts are free. The following limits apply:

### Retention window

Run history, event payloads, and execution data are retained for **14 days**. After 14 days, this data is automatically cleaned up. This includes:

- Events on trigger and action nodes
- Run chains and run item details
- Execution payloads and configuration snapshots

Canvas definitions, console layouts, memory, and files are not affected by the retention window.

### Event budget

Each organization has a budget of **50,000 events per month**. An event is created each time a node executes — whether it is a trigger firing, an action running, or a component emitting a payload.

### Increased limits

Increased usage limits will be available on paid accounts after general availability. If you need higher limits during the beta, contact [support@superplane.com](mailto:support@superplane.com).

## Getting started

Sign up at [app.superplane.com](https://app.superplane.com) to start using SuperPlane Cloud. No credit card required during the beta.

For self-hosted deployments, see the [installation guide](/installation/overview).
