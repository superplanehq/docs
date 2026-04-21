---
title: Public API Reference
description: Explore the SuperPlane REST API using the interactive Swagger documentation.
---

import { Aside } from "@astrojs/starlight/components";

SuperPlane exposes a REST API covering all resources (canvases, integrations, secrets, service accounts, and more). The interactive docs list every route and schema.

The full API reference is available as an interactive Swagger document at:

**[https://app.superplane.com/api/v1/docs](https://app.superplane.com/api/v1/docs)**

<Aside type="caution" title="Strict request validation (unknown fields are errors)">
API requests are **strictly validated**. If you send a JSON body containing an unrecognized field name, the API returns an error instead of silently ignoring the field.

You should expect an **HTTP 400** response with a JSON body that includes an error `message` similar to:

```json
{ "code": 3, "message": "unknown field \"hello\"" }
```

(The exact `message` text may include additional context, but should include `unknown field "..."`.)
</Aside>

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
