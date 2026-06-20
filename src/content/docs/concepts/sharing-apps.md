---
title: Sharing apps
description: Export a SuperPlane app as a Git repository so anyone can install it with one click.
---

A SuperPlane app is backed by a Git repository. You can export that repository, push it to GitHub, and let others install the app into their own organization with a single click. Install parameters let you customize the app at install time without editing YAML by hand.

## How app sharing works

Every app stores its definition in two files: `canvas.yaml` for the workflow and `console.yaml` for the dashboard. These files, together with any helper files (scripts, READMEs, agent instructions), form a complete, portable app.

To share an app:

1. Export the app files from the **Files** tab or the CLI.
2. Push them to a public GitHub repository.
3. Add a **Launch in SuperPlane** badge to the README.
4. Optionally, add a `params.json` file to make the app configurable at install time.

When someone clicks the badge, SuperPlane reads the repository, copies all files into the new app (scripts, READMEs, helper files), detects which integrations the app needs, and walks the user through naming the app, connecting integrations, and filling in any parameters before creating it.

## Repository structure

A shareable app repository contains at minimum a `canvas.yaml`. Everything else is optional.

| File | Required | Purpose |
| ---- | -------- | ------- |
| `canvas.yaml` | Yes | Workflow definition: nodes, connections, and configuration |
| `console.yaml` | No | Console layout and panels |
| `params.json` | No | Install parameters shown in the install wizard |
| Other files | No | Scripts, READMEs, agent instructions, or any file your workflows reference |

During install, SuperPlane copies every file from the repository into the new app's git repository — except `canvas.yaml`, `console.yaml`, and `params.json`, which are handled separately. This means helper scripts, documentation, and agent instruction files are available to the app from the start.

## Install parameters

Install parameters let users customize an app when they install it. For example, a monitoring app might ask for an SSH host address, or a deploy pipeline might ask which repository to watch.

### Defining parameters

Create a `params.json` file in the root of your repository:

```json
{
  "install_params": [
    {
      "name": "ssh_host",
      "label": "SSH Host",
      "type": "string",
      "placeholder": "192.168.1.100",
      "description": "IP address of the server to monitor",
      "required": true
    },
    {
      "name": "deploy_region",
      "label": "Region",
      "type": "string",
      "default": "nyc1",
      "description": "Cloud region for new deployments",
      "required": false
    }
  ]
}
```

Each parameter has these fields:

| Field | Required | Description |
| ----- | -------- | ----------- |
| `name` | Yes | Identifier used in `{{ install_params.<name> }}` placeholders across all files |
| `label` | Yes | Display label shown in the install wizard |
| `type` | Yes | `string`, `secret_picker`, or `integration-resource` |
| `placeholder` | No | Hint text shown in the input field |
| `description` | No | Help text shown below the input |
| `default` | No | Pre-filled value (user can override) |
| `required` | Yes | Whether the user must provide a value |

### Parameter types

**`string`** — A plain text input. Use for hosts, names, regions, or any free-form value.

**`secret_picker`** — Lets the user select an existing [secret](/security/secrets) from their organization. SuperPlane validates that the selected secret exists before completing the install. Use for credentials, API keys, or SSH keys that should not be stored in plain text.

**`integration-resource`** — Lets the user pick a resource from a connected integration. Requires two additional fields:

```json
{
  "name": "droplet_region",
  "label": "Droplet Region",
  "type": "integration-resource",
  "integration": "digitalocean",
  "resourceType": "region",
  "required": true
}
```

| Field | Description |
| ----- | ----------- |
| `integration` | Integration type name (e.g., `digitalocean`, `github`) |
| `resourceType` | Resource type to list (e.g., `region`, `size`, `image`, `repository`) |
| `useNameAsValue` | When `true`, substitute the resource display name instead of its ID. Use this when the component expects a name (e.g., GitHub repository name) rather than a numeric ID. Optional, defaults to `false`. |

### Using parameters in canvas.yaml and files

Reference parameters in your `canvas.yaml` and any other files using the `{{ install_params.<name> }}` syntax. SuperPlane substitutes placeholders in both the canvas definition and all repository files (scripts, READMEs, etc.) during install.

```yaml
- component: ssh
  configuration:
    host: {{ install_params.ssh_host }}
    port: 22
    username: {{ install_params.ssh_user }}
    authentication:
      authMethod: password
      password:
        key: pw
        secret: {{ install_params.ssh_secret_name }}
```

At install time, SuperPlane replaces every `{{ install_params.<name> }}` placeholder with the value the user provided. If a parameter has a default and the user does not override it, the default value is used.

## Launch in SuperPlane badge

Add this badge to your README so users can install the app with one click:

```markdown
[![Launch in SuperPlane](https://superplane.com/badges/launch-in-superplane.svg)](https://app.superplane.com/install?repo=github.com/<owner>/<repo>)
```

Replace `<owner>/<repo>` with your GitHub repository path. When a user clicks the badge, SuperPlane opens the install wizard, which:

1. Reads `canvas.yaml` from the repository.
2. Lets the user name the app (pre-filled from the template).
3. Detects which integrations the app uses and asks the user to connect them.
4. Reads `params.json` (if present) and shows the parameter form.
5. Creates the app with all placeholders resolved and all repository files copied in.

## Exporting an existing app

To export an app you have already built:

**From the UI:**
1. Open the app and go to the **Files** tab.
2. Download `canvas.yaml`, `console.yaml`, and any scripts or helper files.

**From the CLI:**

```bash
# Export the canvas
superplane apps canvas get <app-name-or-id> -o yaml > canvas.yaml

# Export the console
superplane apps console get <app-name-or-id> -o yaml > console.yaml

# List all files in the app repository
superplane apps files tree <app-name-or-id>
```

To turn the export into a shareable template:

1. Remove hardcoded values (integration IDs, secrets, repo names) and replace them with `{{ install_params.<name> }}` placeholders.
2. Create a `params.json` to define the install parameters.
3. Add a `README.md` with a Launch in SuperPlane badge and setup instructions.
4. Push everything to a GitHub repository.

## Best practices

**Write a clear README.** Explain what the app does, list prerequisites, and describe how to customize it after install. Include the Launch in SuperPlane badge so users can install with one click.

**Parameterize your app.** Even though `params.json` is optional, it makes installing the app much easier. Users should not have to open canvas nodes and update hardcoded values. Anything that varies between installations — repository names, secrets, regions, hostnames — should be a parameter.

**Include an AGENTS.md.** The [built-in agent](/concepts/agent) and external agents (like Cursor) can read this file to understand how your canvas works. Document the main flows, what is safe to change, what should not be touched, and common issues. This helps agents give accurate advice instead of guessing.

**Add annotations to the canvas.** Use notes on the canvas to explain key sections, especially parts that users will need to customize. For example, an annotation above an SSH node can explain which secret it expects and how to update the setup script. Annotations make the canvas self-documenting for both humans and agents.

## Examples

### Preview Environments on DigitalOcean

The [Preview Environments](https://github.com/superplanehq/app_preview-env-digitalocean) app is a complete example of a shareable app with install parameters, a file-based SSH script, and an `AGENTS.md`.

```
canvas.yaml                    # Workflow: provision, deploy, teardown, TTL
console.yaml                   # Dashboard (optional)
params.json                    # Install params: repository, SSH secret, region, size, image
scripts/preview-setup.sh       # Setup script executed by the SSH node
AGENTS.md                      # Instructions for AI agents
README.md                      # Documentation with Launch in SuperPlane badge
```

### Coolify Watcher

The [Coolify Watcher](https://github.com/superplanehq/app_coolify-watcher) app monitors a Coolify host, stores metrics in [memory](/concepts/canvas-memory), renders a live dashboard on the [console](/concepts/console), and includes install parameters for the SSH connection.

```
canvas.yaml          # Workflow: poll host, store metrics, restart containers
console.yaml         # Dashboard: host stats, container table, trend charts
params.json          # Install params: SSH host, user, secret
coolify-health.sh    # Helper script executed by the SSH runner
README.md            # Documentation with Launch in SuperPlane badge
```
