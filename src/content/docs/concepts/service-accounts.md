---
title: Service Accounts
description: Use service accounts and API tokens for programmatic and automation access.
---

Service accounts are non-human identities for API access. Use them for scripts
and integrations that need a dedicated set of permissions.

## When to use

- **Scripts**: Call the SuperPlane API from automation.
- **Integrations**: Let external systems call the SuperPlane API with their own identity and role.

## Create a service account and token

1. In the SuperPlane UI, go to **Organization Settings > Service accounts**.
2. Create a service account and assign it a role.
3. Generate an API token and copy it (it is shown only once).

## Use the token to configure the SuperPlane CLI

```sh
superplane connect <SUPERPLANE_URL> <SERVICE_ACCOUNT_TOKEN>
```

## Permissions

The token can only do what the service account’s role allows. Permissions are
organization-scoped and governed by [RBAC](/concepts/access-control).

- **Operator**: Read-only (for example, list canvases and read run history).
- **Maintainer**, **Admin**, or a custom role: Create or update canvases, integrations, or secrets when required.

API keys cannot be owners. Ownership is a membership flag for human members only. See [Access Control](/concepts/access-control).

## Best practices

- **One service account per external system**: Create a dedicated service
  account per integration or script so you can revoke access or rotate credentials
  without impacting others.
- **Rotate**: Regenerate tokens periodically and update any stored copies.
- **Least privilege**: Use the minimum role that satisfies the use case (for example, Operator for read-only).
