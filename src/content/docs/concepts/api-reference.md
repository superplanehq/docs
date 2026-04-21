---
title: Public API Reference
description: Explore the SuperPlane REST API using the interactive Swagger documentation.
---

:::caution[Strict request validation (unknown fields are errors)]
API requests containing **unknown fields** are rejected with an error response (they are not silently ignored).

This is most useful when you’re building tooling around the API or generating requests with an LLM: a misspelled
field will fail fast instead of being dropped.
:::

SuperPlane exposes a REST API covering all resources (canvases, integrations, secrets, service accounts, and more). The interactive docs list every route and schema.

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

## Errors for unknown fields

If you send a request body with an unrecognized field, SuperPlane returns **`400 Bad Request`** and an error message
that includes the offending field (for example `unknown field "hello"`).

## Using with the CLI

The [SuperPlane CLI](/installation/cli) wraps the same API. If you prefer a
terminal-based workflow, the CLI handles authentication and formatting for you.
