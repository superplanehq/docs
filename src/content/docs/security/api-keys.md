---
title: API keys
description: Use API keys for programmatic and automation access.
---

API keys are non-human credentials for API access. Use them for scripts and integrations that need a dedicated set of permissions.

## When to use

- **Scripts**: Call the SuperPlane API from automation.
- **Integrations**: Let external systems call the SuperPlane API with their own identity and role.

## Create an API key

1. In the SuperPlane UI, go to **Organization Settings > API keys**.
2. Create an API key and assign it a role.
3. Copy the generated token immediately. It is shown only once.

## Use the token to configure the SuperPlane CLI

```sh
superplane connect <superplane_url> <api_key_token>
```

## Permissions

The token can only do what the API key's role allows. Permissions are organization-scoped and governed by [RBAC](/security/access-control).

- **Operator**: Read-only (for example, list canvases and read run history).
- **Maintainer**, **Admin**, or a custom role: Create or update canvases, integrations, or secrets when required.

API keys cannot be owners. Ownership is a membership flag for human members only. See [Access Control](/security/access-control).

## Best practices

- One API key per external system: Create a dedicated API key per integration or script so you can revoke access or rotate credentials without impacting others.
- Rotate: Regenerate tokens periodically and update any stored copies.
- Least privilege: Use the minimum role that satisfies the use case (for example, Operator for read-only).
