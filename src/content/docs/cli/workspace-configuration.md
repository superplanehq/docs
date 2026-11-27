---
title: Manage workspace configuration
description: Export, preview, and apply workspace YAML with the CLI, or sync configuration from GitHub.
---

Use the command-line interface (CLI) to manage an existing workspace from YAML files. This guide covers export, plan, apply, and sharing automation definitions across workspaces. For field definitions and examples, see the [workspace YAML reference](/cli/workspace-yaml).

:::caution[Planned functionality]
This guide describes the target behavior for [workspace configuration through GitHub](https://github.com/superplanehq/superplane/issues/9568). The CLI already has export, plan, and apply commands. The new YAML format, `--root` option, custom stage lifecycle, and GitHub sync are planned. Check your installed version before using these examples.
:::

## Before you start

- [Install and connect the CLI](/cli).
- Create a workspace and configure its repository connections in SuperPlane.
- Use an account with permission to edit the workspace.

YAML does not create a workspace or grant repository access. These examples use `your_workspace_key` as the destination workspace key or UUID.

## Export the workspace

List the available workspaces and inspect your destination:

```bash
superplane workspaces list
superplane workspaces describe your_workspace_key
```

From your repository directory, export the configuration:

```bash
superplane workspaces export --workspace your_workspace_key
```

Export writes `.superplane/main.yml` and its referenced custom automation files. Start from this export to preserve required stages, runner bindings, and existing automations.

To export elsewhere, set `--output-dir`. The CLI creates the `.superplane` folder inside that directory:

```bash
superplane workspaces export --workspace your_workspace_key \
  --output-dir ./workspace-config
```

Export refuses to replace existing files unless you pass `--overwrite`.

## Edit and preview changes

Edit `.superplane/main.yml` or a referenced automation file using the [YAML reference](/cli/workspace-yaml). Keep existing IDs when you rename resources or move source files.

Preview the changes without changing the workspace:

```bash
superplane workspaces plan --workspace your_workspace_key
```

Review the proposed additions, updates, and removals. Correct any reported file or field errors before applying. An unchanged export should produce no configuration changes or new automation revisions.

The `--workspace` argument selects the destination. A manifest's `name` changes the workspace display name, not its key or UUID. Export, plan, and apply require `--workspace`, even when you have an active workspace.

## Apply the configuration

Apply the edited files:

```bash
superplane workspaces apply --workspace your_workspace_key
```

The command creates a fresh plan and asks for confirmation. It does not apply a saved result from an earlier `plan` command. Invalid configuration leaves the workspace unchanged.

For unattended scripts, pass `--yes` to skip confirmation. Validation still runs:

```bash
superplane workspaces apply --workspace your_workspace_key --yes
```

:::caution[Review removals]
The manifest describes the desired configuration, not a partial patch. Keep required stages and runner bindings from the export. Removing a custom stage deletes automations that execute there; display-only automations remain without that placement.
:::

## Share automation files across workspaces

Use separate manifests for existing workspaces that share custom automation definitions:

```text
.superplane/
  workspace-1.yml
  workspace-2.yml
  automations/
    review.yml
```

Both manifests can reference `automations/review.yml` with the same automation ID. Each destination gets independent automation records and runtime state.

Select a manifest with `-f` and use the repository directory as the file boundary with `--root .`:

```bash
superplane workspaces plan --workspace your_first_workspace_key \
  --root . -f .superplane/workspace-1.yml

superplane workspaces apply --workspace your_first_workspace_key \
  --root . -f .superplane/workspace-1.yml

superplane workspaces apply --workspace your_second_workspace_key \
  --root . -f .superplane/workspace-2.yml
```

Any YAML filename is valid. Paths in `uses` resolve relative to the manifest. Without `--root`, referenced files must stay inside the manifest directory. With an explicit root, parent-directory references are allowed if they stay inside that root.

Configure each destination's repositories separately. Keep matching informational `repositories` values or omit that optional section. Copying a manifest does not configure repositories or copy connection authorization.

## Sync configuration from GitHub

1. Export the workspace and commit the manifest and referenced files.
2. In workspace settings, select the authorized GitHub repository, branch, and manifest path.
3. Enable sync. SuperPlane immediately applies valid differences.
4. Push later changes to the selected branch.

To enable or change sync, you need workspace edit permission and verified write access to the source repository. The source can be any authorized repository on the existing GitHub App connection; it does not need to be a task repository.

Changes to shared automation files also trigger evaluation. Each workspace updates independently, and one workspace's failure does not block another. Sync uses the latest branch state and can skip intermediate commits.

While sync is enabled, GitHub controls the covered workspace name, stages, and automations. Direct edits to that configuration, including CLI apply, are blocked. Export and plan remain available. Tasks, approvals, runs, secrets, repository settings, and connection authorization remain usable.

Invalid files, missing files, or lost source access preserve the last valid configuration and keep direct editing locked. Fix the source and push again, or select **Sync now** in workspace settings. Use **Sync now** after a missed webhook. Select **Disable sync** to preserve the configuration and restore direct editing. Workspace editors can retry or disable sync without GitHub access.

After changing repositories manually, refresh the informational YAML from a new export or omit `repositories`. Stale repository information fails validation without reverting the live settings.

## Command options

| Command or option | Meaning |
| --- | --- |
| `export` | Write the workspace configuration to local YAML files. |
| `plan` | Validate files and show changes without applying them. |
| `apply` | Show a fresh plan and apply it after confirmation. |
| `--workspace` | Required destination workspace key or UUID. |
| `-f`, `--file` | Manifest path for plan/apply. Defaults to `.superplane/main.yml`. Use `-` for stdin only without local file references. |
| `--root` | Directory boundary for plan/apply file reads. Defaults to the manifest directory when omitted. |
| `--output-dir` | Export directory. Defaults to the current directory. |
| `--overwrite` | Allow export to replace existing configuration files. |
| `--yes` | Apply without interactive confirmation. |
| `-o`, `--output` | Command output format: `text`, `json`, or `yaml`. Export still writes its files. |

See the [workspace YAML reference](/cli/workspace-yaml) for manifest keywords, built-in agent options, and custom automation examples.
