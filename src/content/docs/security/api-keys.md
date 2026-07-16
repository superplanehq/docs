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

- **Viewer**: Read-only (e.g. list canvases, read run history).
- **Admin** or custom roles: Create or update canvases, integrations, or secrets when required.

## Best practices

- One API key per external system: Create a dedicated API key per integration or script so you can revoke access or rotate credentials without impacting others.
- Rotate: Regenerate tokens periodically and update any stored copies.
- Least privilege: Use the minimum role that satisfies the use case (e.g. Viewer for read-only).
