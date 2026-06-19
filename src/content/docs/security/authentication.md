---
title: Authentication and accounts
description: Manage your user account, authenticate via the UI and CLI, and configure API tokens.
---

This page explains how to authenticate with SuperPlane as a human user or an automated system. It covers UI login methods, account management, API tokens, and CLI authentication.

## Log in to the UI

When logging into the SuperPlane UI, choose between two primary methods:

- **Email and password**: Standard login using your registered email and password.
- **Passwordless sign-in**: Log in without a password by requesting a magic link or access code sent to your email. Use this if you forget your password or prefer not to use one.

The login screen remembers your last-used login method to speed up future sign-ins.

## Manage your account

Access your **Profile** settings in the UI to manage your account details:

- **Change your password**: Update your password at any time.
- **Manage API tokens**: Generate and revoke personal API tokens.

## Create personal API tokens

Personal API tokens are tied to your user account and inherit your permissions. Use them to authenticate the SuperPlane CLI or make direct API requests on your behalf.

To create a personal token:

1. Go to **Profile > API token** in the SuperPlane UI.
2. Generate a new token. Configure the token's validity period (for example, 30 days, 90 days, or no expiration). You can extend the validity period later if needed.
3. Copy the token immediately. It will not be shown again.

**Note:** If you need a token for an automated script or integration that shouldn't be tied to a specific human user, use a [Service account](/security/service-accounts) instead.

## Authenticate the CLI

The SuperPlane CLI requires an API token to communicate with your organization. Authenticate using either a personal API token or a service account token.

Choose between interactive login or environment variables.

### Connect interactively

Run the `connect` command and follow the prompts:

```sh
superplane connect <SUPERPLANE_URL> <API_TOKEN>
```

This saves your credentials locally and sets up your CLI context.

### Use environment variables

For automated environments like CI/CD pipelines, authenticate the CLI via environment variables without running `superplane connect`.

Set the following variables in your environment:

```sh
export SUPERPLANE_URL="https://app.superplane.com"
export SUPERPLANE_TOKEN="your-api-token"
```

When these variables are present, the CLI automatically uses them for all commands.

## Authenticate automated systems

For programmatic access by external systems, scripts, or integrations, use service accounts. Service accounts are non-human identities that you can assign specific roles via RBAC.

See the [Service accounts](/security/service-accounts) documentation for more details.
