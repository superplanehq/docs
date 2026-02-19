---
title: Welcome
description: Get up and running with SuperPlane, the open source DevOps control plane for event-driven workflows.
---

SuperPlane is an open source DevOps control plane for running long-lived, event-driven workflows.
It works across the tools teams already use such as Git, CI/CD, incident response, observability, infra, notifications, and more.

Most teams end up stitching these systems together with a mix of scripts, one-off CI jobs, and manual steps. That works
until the workflow needs to span multiple tools, wait for humans, or run over hours and days.

SuperPlane gives you a place to model these workflows as a system: connect your tools, define how events flow, and get a
complete, queryable execution history for debugging, audit, and shared understanding.

![Run chain view showing end-to-end workflow execution history](../../assets/superplane-canvas-example.png)

## What you can build with SuperPlane

Use SuperPlane when the workflow is bigger than a single pipeline or script:

- **Cross-tool automation with guardrails**: coordinate releases with approvals, time windows, checks, and rollback paths.
- **Human-in-the-loop operations**: pause for sign-off, collect decisions, and resume exactly where you left off.
- **Incident and on-call workflows**: pull context from multiple systems, fan out notifications, and keep a work log.
- **“Glue work” you don’t want to re-build**: webhooks, retries, routing, payload transforms, and a unified run history.

## Try it locally (fastest path)

If you just want to click around and run a workflow, start the demo container:

```bash
docker pull ghcr.io/superplanehq/superplane-demo:stable
docker run --rm -p 3000:3000 -v spdata:/app/data -ti ghcr.io/superplanehq/superplane-demo:stable
```

Then open `http://localhost:3000`.

For more details and options, see [installation guide](/installation/overview).

## Project status: alpha

- **Self-hostable**: SuperPlane is designed to run on your own infrastructure.
- **Expect rough edges**: we’re still stabilizing the core primitives and integrations.
- **Breaking changes are possible**: but we'll do our best to avoid them.

## LLM context files

If you use SuperPlane docs in AI tooling, you can point your tool at:

- [`/llms.txt`](/llms.txt): compact docs index organized by docs sections.
- [`/llms-full.txt`](/llms-full.txt): expanded companion with full page content.

## Get help / share feedback

- Submit project issues and feature requests at [github.com/superplanehq/superplane](https://github.com/superplanehq/superplane).
- Submit documentation issues at [github.com/superplanehq/docs](https://github.com/superplanehq/docs).
- Talk to the devs in the [Discord server](https://discord.superplane.com).
