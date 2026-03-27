---
title: Public API Reference
description: Explore the SuperPlane REST API using the interactive Swagger documentation.
---

SuperPlane exposes a public REST API that lets you manage canvases, integrations,
secrets, and runtime operations programmatically.

The full API reference is available as an interactive Swagger document at:

**[https://app.superplane.com/api/v1/docs](https://app.superplane.com/api/v1/docs)**

## Authentication

All API requests require a valid API token sent in the `Authorization` header:

```
Authorization: Bearer <API_TOKEN>
```

You can obtain a token in two ways:

- **Service account token** (recommended for scripts and integrations): see [Service Accounts](/concepts/service-accounts).
- **Personal token** (tied to your user): go to **Profile > API token** in the SuperPlane UI.

## Quick example

```sh
curl -s https://app.superplane.com/api/v1/canvases \
  -H "Authorization: Bearer <API_TOKEN>" | jq
```

## Using with the CLI

The [SuperPlane CLI](/installation/cli) wraps the same API. If you prefer a
terminal-based workflow, the CLI handles authentication and formatting for you.
