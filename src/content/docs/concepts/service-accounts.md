---
title: Service Accounts
description: Use service accounts and API tokens for programmatic and automation access.
---

Service accounts are non-human identities for API access. Use them for scripts
and integrations that need a dedicated set of permissions.

## When to use

- **Scripts**: Call the SuperPlane API from automation.
- **Integrations**: Let external systems call the SuperPlane API with their own identity and role.

## Creating and using a service account token

1. In the SuperPlane UI, go to **Organization Settings > Service accounts**.
2. Create a service account (or select an existing one) and assign it a role.
3. Generate an API token. Copy and store it securely; it is shown only once.

Send the token in the `Authorization` header as `Bearer <token>`.

## Permissions

The token can only do what the service account’s role allows. Permissions are
organization-scoped and governed by [RBAC](/concepts/access-control).

- **Viewer**: Read-only (e.g. list canvases, read run history).
- **Admin** or custom roles: Create or update canvases, integrations, or secrets when required.

## Best practices

- **One service account per external system**: Create a dedicated service
  account per integration or script so you can revoke access or rotate credentials
  without impacting others.
- **Rotate**: Regenerate tokens periodically and update any stored copies.
- **Least privilege**: Use the minimum role that satisfies the use case (e.g. Viewer for read-only).
