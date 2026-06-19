---
title: Welcome
description: Get up and running with SuperPlane, the open source automation engine for AI-driven engineering.
---

SuperPlane is an open source automation engine for AI-driven engineering.

As AI accelerates engineering throughput, traditional manual approvals and fragile scripts break down. To safely scale AI, you must automate every manual check and enforce strict quality guardrails across your software development lifecycle.

SuperPlane lets you model these high-velocity workflows as fully operational [apps](/concepts/superplane-apps). Apps execute your processes deterministically using graphs, providing the exact guardrails AI needs to safely interact with your tools—like Git, CI/CD, and observability.

![Run chain view showing end-to-end workflow execution history](../../assets/superplane-canvas-example.png)

## What you can build

SuperPlane is built for workflows that are too complex for a single script or CI job. You can build:

- **AI-driven code review**: Automatically review pull requests, enforce style guides, perform QA, fill documentation gaps, and calculate change risk scores using LLMs.
- **Release management**: Coordinate complex, multi-regional deployments that span hours or days, incorporating automatic health checks, manual approvals, and instant rollback paths.
- **Operational dashboards**: Unify data from any engineering event into a custom live UI. Track DORA metrics, active incidents, or deployment health across your entire stack—generated in minutes by the built-in AI agent.
- **Incident response**: Pull context from observability tools, page the on-call engineer, create a dedicated chat channel, and track the resolution state.
- **Infrastructure provisioning**: Provide a self-serve portal for developers to request databases or create on-demand ephemeral environments, all with built-in policy checks.

## Try it locally (fastest path)

If you want to click around and run a workflow, start the demo container:

```bash
docker pull ghcr.io/superplanehq/superplane-demo:stable
docker run --rm -p 3000:3000 -v spdata:/app/data -ti ghcr.io/superplanehq/superplane-demo:stable
```

Then open `http://localhost:3000`.

For more details and options, see the [installation guide](/installation/overview).

## Project status: beta

- **Cloud beta**: We are launching our managed cloud offering soon.
- **Self-hostable**: SuperPlane is designed to run on your own infrastructure.
- **Stabilizing**: Core primitives and integrations are maturing. Breaking changes are possible, but we'll do our best to avoid them.

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
