---
title: Built-in App Agent
description: How to use the built-in AI agent to build and operate SuperPlane apps.
---

SuperPlane includes a built-in AI agent that helps you build workflows and console UI, debug executions, and manage repository files. The agent is context-aware, persistent, and operates safely within your app's permission boundaries.

## Agent modes

The agent adapts to your current task using different modes:

- **Build**: Helps you design workflows on the [canvas](/concepts/canvas), configure [nodes](/concepts/component-nodes), design [console](/concepts/console) UI, and make changes to the app.
- **Ask**: A read-only mode to help you monitor runs, analyze data, and troubleshoot apps.

You can switch modes in the chat interface to focus the agent's tools and context on your immediate goal.

## Chat persistence and streaming

Each canvas has a single, permanent chat session. Your conversation history persists across browser reloads and sessions.

When you send a message, the agent's responses stream back asynchronously. Because the agent performs actions in the background, you can continue working on the canvas while it processes your request.

### Interrupting the agent

If the agent is heading in the wrong direction or taking too long, you can interrupt it mid-execution. Click **Stop** to send an interrupt event that halts the agent's current operation and returns control to you.

## Outcomes and rubrics

For complex tasks, the agent uses a **rubric** to confirm its plan before building. 

When you ask the agent to build something broad or ambiguous (like "add health checking"), it will first ask you questions to clarify the requirements. Once it has enough information, it presents a rubric — a clear specification of what it intends to build, including the flow, components, and integrations needed.

You can review the rubric and either request changes or click **Start Building** to approve the plan. The agent will not modify your canvas until you approve the rubric.

## Tools and capabilities

The agent has built-in tools to interact with your app's configuration and runtime state.

### Repository file tools

The agent can manage files in your app's repository:

- **List and read**: Discover and read files like `README.md` or custom scripts.
- **Stage changes**: Write or delete files in a draft branch.
- **Commit**: Commit staged file changes to the repository.
- **Update drafts**: Modify the `canvas.yaml` and `console.yaml` configurations directly.

### Runtime read tools

When troubleshooting, the agent can inspect the live state of your app. It can read memory values, inspect recent [runs](/concepts/data-flow#runs-and-run-items), view event payloads, and check execution queues to help you diagnose issues.

### Node mentions

You can explicitly reference canvas nodes in your messages by typing `@` followed by the node's name. This provides the agent with the exact ID and context of the node, ensuring it targets the correct component when answering questions or making updates.

## Permissions and safety boundaries

The agent operates safely within strict boundaries:

- **RBAC enforcement**: The agent shares your user session's permissions. It cannot perform any action that you do not have permission to do. See [RBAC](/security/access-control).
- **Canvas isolation**: The agent is strictly bound to its parent canvas. It cannot read or modify data from other apps.
- **Drafts only**: The agent can only update draft versions of your app. It cannot publish changes directly to production.
- **File safety**: The agent cannot access sensitive system paths (like `.superplane/`) or traverse outside the repository workspace.

## Limits

To ensure performance and stability, the agent operates with specific limits:

- **Query limits**: Runtime reads and file listings are paginated (e.g., returning up to 40 components per query).
- **Context management**: Long conversations are automatically rewound and truncated to fit within the provider's context window, preserving the most relevant recent messages.

## Provider setup

The built-in agent is powered by Anthropic's Claude Managed Agents. To enable the agent in a self-hosted SuperPlane deployment, an administrator must configure the following environment variables:

- `ANTHROPIC_API_KEY`: Your Anthropic API key.
- `ANTHROPIC_AGENT_ID`: The ID of your managed Anthropic agent.
- `ANTHROPIC_ENVIRONMENT_ID`: The ID of your Anthropic environment.

If these variables are not set, the agent interface remains disabled.
