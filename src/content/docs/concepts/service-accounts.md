---
title: Service Accounts
description: Use service accounts and API tokens for programmatic and automation access.
---

Service accounts are non-interactive identities for API access. Authentication uses API tokens (Bearer tokens) instead of user login.

## When to use

- **API access**: Scripts or external systems calling the SuperPlane API.
- **Integrations**: External systems that need a dedicated identity and scoped permissions.

## Creating and using an API token

1. In the SuperPlane UI, go to **Profile > API token**.
2. Click **Regenerate Token** to create or replace your API token.
3. Copy the token and store it securely (it is shown only once).

Send the token in the `Authorization` header as `Bearer <token>` when calling the API.

## Permissions

Tokens inherit the permissions of the identity they belong to. Access is scoped to the organization and governed by [RBAC](/concepts/access-control).

- **Viewer**: Read-only (e.g. list canvases, read run history).
- **Admin** or custom roles: Create or update canvases, integrations, or secrets when required.

## Best practices

- **One token per use case**: Use separate tokens per integration or script so you can revoke or rotate them independently.
- **Rotate regularly**: Regenerate tokens periodically and update any systems that store them.
- **Least privilege**: Assign the minimum role that satisfies the use case (e.g. Viewer for read-only automation).
