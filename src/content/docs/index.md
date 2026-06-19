---
title: Welcome
description: Get up and running with SuperPlane, the open source platform for building internal developer tools and operational workflows.
---

SuperPlane is an open source platform for building internal developer tools and long-lived, event-driven workflows. It works across the tools your team already uses—like Git, CI/CD, incident response, observability, infrastructure, and notifications.

Most teams end up stitching these systems together with a mix of scripts, one-off CI jobs, and manual steps. That works until a workflow needs to span multiple tools, wait for human approval, or run over hours and days.

SuperPlane gives you a place to model these workflows as fully operational **Apps**.

![Run chain view showing end-to-end workflow execution history](../../assets/superplane-canvas-example.png)

## The SuperPlane App

Instead of writing isolated scripts, you build a SuperPlane App. Each app brings together five core building blocks to create a complete operational tool:

- **[Canvas](/concepts/canvas)**: Design event-driven workflows with durable execution. Connect tools, define how events flow, and safely pause for human input.
- **[Console](/concepts/console)**: Build operational dashboards. Turn workflow state into an at-a-glance view with tables, charts, KPIs, and actionable runbooks.
- **[Memory](/concepts/canvas-memory)**: Store persistent JSON state across workflow runs to track ongoing processes like incidents or staged rollouts.
- **[Files](/concepts/files)**: Manage your app as code. Every app is backed by a Git repository for safe drafting, committing, and publishing.
- **[Agent](/concepts/agent)**: A built-in AI assistant that can help you design workflows, make canvas changes, and troubleshoot failed executions.

## What you can build

Use SuperPlane when the workflow is bigger than a single pipeline or script:

- **Cross-tool automation with guardrails**: coordinate releases with approvals, time windows, checks, and rollback paths.
- **Human-in-the-loop operations**: pause for sign-off, collect decisions, and resume exactly where you left off.
- **Incident and on-call workflows**: pull context from multiple systems, fan out notifications, and keep a work log.
- **“Glue work” you don’t want to re-build**: webhooks, retries, routing, payload transforms, and a unified run history.

## Try it locally (fastest path)

If you want to click around and run a workflow, start the demo container:

```bash
docker pull ghcr.io/superplanehq/superplane-demo:stable
docker run --rm -p 3000:3000 -v spdata:/app/data -ti ghcr.io/superplanehq/superplane-demo:stable
```

Then open `http://localhost:3000`.

For more details and options, see the [installation guide](/installation/overview).

## Project status: alpha

- **Self-hostable**: SuperPlane is designed to run on your own infrastructure.
- **Expect rough edges**: we’re still stabilizing the core primitives and integrations.
- **Breaking changes are possible**: but we'll do our best to avoid them.

## LLM and agent tooling

For **agent-first engineering**, use the [SuperPlane skills repository](https://github.com/superplanehq/skills). It provides skills that help AI agents operate SuperPlane efficiently (CLI usage, canvas design, workflow debugging). Install all skills or a specific one:

```bash
npx skills add superplanehq/skills
# or a single skill, e.g.:
npx skills add superplanehq/skills --skill superplane-cli
```

For **docs context** in your AI tooling, you can point at:

- [`/llms.txt`](/llms.txt): compact docs index organized by docs sections.
- [`/llms-full.txt`](/llms-full.txt): expanded companion with full page content.

## Get help / share feedback

- Submit project issues and feature requests at [github.com/superplanehq/superplane](https://github.com/superplanehq/superplane).
- Submit documentation issues at [github.com/superplanehq/docs](https://github.com/superplanehq/docs).
- Talk to the devs in the [Discord server](https://discord.superplane.com).