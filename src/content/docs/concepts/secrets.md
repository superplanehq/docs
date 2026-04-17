---
title: Secrets
description: How to store and use secrets in SuperPlane workflows.
---

Secrets let you securely store sensitive credentials like API keys, passwords, and tokens for use in component configurations.

## How It Works

Secrets are key-value stores scoped to your organization. Each secret contains one or more named keys that hold sensitive values.

- **Organization-scoped**: Accessible to all workflows in the organization
- **Encrypted at rest**: Secret data is encrypted before storage
- **Referenced in configurations**: Components reference secrets by name and key, not by value
- **Resolved at runtime**: Secret values are decrypted and resolved when components execute

## Creating Secrets

Create secrets in **Organization Settings > Secrets**.

**Example secret structure:**

A secret named `production-ssh-keys` containing:
- `private_key` = `-----BEGIN OPENSSH PRIVATE KEY-----...`
- `passphrase` = `my-passphrase`

Each secret can contain multiple key-value pairs.

## Using Secrets in Components

In the **core** component set, organization secrets are used by the **SSH Command** component for authentication (SSH key or password). Select a secret and key from your organization's secrets when configuring SSH.

Integrations may store their own credentials separately from organization secrets. If a component supports organization secrets in the future, it will be called out in that component’s documentation.

## Secret Resolution

During workflow execution, SuperPlane:

1. **Looks up the secret** by name in the organization
2. **Decrypts the secret data** using the encryption key
3. **Extracts the specific key** from the secret's key-value pairs
4. **Provides the value** to the component for execution

If a secret or key doesn't exist, the component execution fails with an error.

## Best Practices

- **Use descriptive names**: Name secrets clearly (e.g. `production-keys` and `staging-keys`)
- **Organize by service**: Group related credentials in a single secret with multiple keys
- **Rotate regularly**: Update secret values when credentials change
- **Don't hardcode**: Always use secret key fields instead of entering values directly

## Permissions

Secret management requires specific permissions:

- `secrets.read` - View organization secrets (but not their values)
- `secrets.create` - Create new secrets
- `secrets.update` - Update existing secrets
- `secrets.delete` - Delete secrets

By default, only `Admin` and `Owner` roles have these permissions. See [Access Control](/concepts/access-control) for details.
