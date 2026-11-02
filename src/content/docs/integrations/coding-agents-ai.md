---
title: Coding agents and AI
description: Connect AI providers and coding agents to planning and implementation automations.
---

AI integrations let an automation plan work, change code, analyze output, or generate a structured response. The line and task scope provide the guardrails around each agent run.

## Available integrations

- [Claude](/components/claude) runs Claude models in workflows.
- [Cursor](/components/cursor) runs Cursor AI agents and tracks usage.
- [OpenAI](/components/openai) generates responses with OpenAI models.
- [OpenRouter](/components/openrouter) provides access to supported models from multiple providers.
- [Perplexity](/components/perplexity) runs research-oriented AI tasks.

## Choose access

Use SuperPlane-hosted credit when it is available, or connect provider credentials through the integration flow. Do not put API keys in a canvas value, repository, or task description.

## Control agent work

Give the agent a focused task, explicit repository, validation commands and scope limits. Require human attention when a decision is ambiguous or can affect production.

During a run, the agent changes its task through [agent tools](/integrations/agent-tools): owners, checks, artifacts, plans and visual evidence.
