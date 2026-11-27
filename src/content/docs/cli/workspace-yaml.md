---
title: Workspace YAML reference
description: Syntax, examples, and keyword definitions for workspace manifests and custom automation files.
---

Use this reference when editing workspace manifests and custom [automations](/fundamentals/automations). It defines the public YAML fields and shows built-in and custom examples. For the CLI workflow, see [Manage workspace configuration](/cli/workspace-configuration).

:::caution[Planned YAML contract]
These examples describe the format planned in [the YAML contract update](https://github.com/superplanehq/superplane/issues/9569) and [custom stage support](https://github.com/superplanehq/superplane/issues/9570). Current releases do not support the full format. After the update, start from a fresh export; old YAML is not backward compatible.
:::

## Workspace manifest

A manifest declares the workspace display name, ordered stages, and automations. It uses `kind: Factory`, although the CLI calls the destination a workspace.

This excerpt places a custom automation in Backlog. Keep the other stages and automations from your export in the complete manifest:

```yaml
apiVersion: v2
kind: Factory
name: Engineering

stages:
  - id: backlog
    name: Backlog
    automations:
      - id: review-task
        uses: automations/review.yml
```

### Manifest fields

| Field | Meaning |
| --- | --- |
| `apiVersion` | YAML contract version. Use `v2`. |
| `kind` | Document type. Use `Factory` for a workspace manifest. |
| `name` | Desired workspace display name. Does not select or create the destination. |
| `stages` | Ordered stages. Keep Backlog first, Done last, and existing execution phases intact. |
| `stages[].id` | Stable public stage ID, unique within the workspace. |
| `stages[].name` | Stage display name. |
| `stages[].run` | Existing execution phase's runner automation ID. Preserve the exported binding. Custom board stages do not use it. |
| `stages[].automations` | Automation declarations for a stage. Use `[]` for an empty list. |
| `automations[].id` | Stable public automation ID, unique across all workspace stages. |
| `automations[].name` | Automation display name. Custom entries can omit it and use their definition's name. |
| `automations[].uses` | Built-in template such as `@superplane/implement`, or a relative custom automation file path. |
| `automations[].with` | Supported built-in options. Put custom automation settings in the referenced file instead. |
| `automations[].binding` | Connection or resource selection for a supported built-in. Use the destination's authorized connections. |
| `repositories` | Optional informational repository settings. Must match the destination; YAML cannot change them. |

### Stable IDs

Use explicit IDs such as `review-task` or `security-review`. Stage and automation IDs have separate namespaces, so a stage and an automation can share the same text.

Keep IDs when renaming resources, moving source files, or changing supported placement. Changing an ID means removing one resource and adding another, subject to required-resource protections. Copying IDs into another workspace creates independent records; database UUIDs remain internal.

### File references

`uses` paths resolve relative to the manifest. References must stay inside the file boundary selected by the CLI or GitHub repository. Absolute paths, root escapes, symlinks, and non-YAML reference files are not supported.

Any manifest filename is valid. Multiple manifests can reference the same custom definition. Each workspace keeps independent runtime state.

## Built-in automation options

Built-in entries use an `@superplane/` template name. For example, an exported Implement automation can use these agent options:

```yaml
id: implement
name: Implement
uses: '@superplane/implement'
with:
  agent:
    additional_instructions: Keep changes focused.
    thinking_level: high
    timeout: 2h
```

Keep the exported automation ID and any required binding fields. Use singular `with.agent` for ordinary agent options; internal execution-node IDs are not part of this syntax.

| Field under `with.agent` | Meaning |
| --- | --- |
| `additional_instructions` | Extra instructions for the logical agent. |
| `thinking_level` | Supported agent reasoning level, such as `high`. |
| `timeout` | Agent execution duration, such as `2h`, `90m`, or `30s`. |

## Custom automation definition

Save this definition as `.superplane/automations/review.yml` for the manifest example above:

```yaml
apiVersion: v2
kind: Automation
name: Review task
timeout: 30m

triggers:
  - uses: task_enters_stage

steps:
  - name: Review requirements
    prompt: |
      Review the task description.
      Identify missing requirements and suggest acceptance criteria.
```

The manifest supplies the stable automation ID. The definition supplies its display name and behavior. Omit `agent` to inherit the workspace agent configuration.

### Custom fields

| Field | Meaning |
| --- | --- |
| `apiVersion` | Use `v2`. |
| `kind` | Use `Automation`. |
| `name` | Automation display name. |
| `timeout` | Duration for the whole automation. Built-in `with.agent.timeout` instead covers agent execution. |
| `agent` | Optional agent settings. Omitted settings inherit where supported. |
| `agent.harness` | Agent harness selection, such as `codex` or `claude-code`. |
| `agent.model` | Explicit model selection instead of the inherited model. |
| `agent.credentials` | Credential source selection. References existing authorization rather than storing secret values. |
| `agent.skip_setup_commands` | Skip repository setup commands when `true`. |
| `agent.skip_repository_checkout` | Skip repository checkout when `true`. |
| `run_context` | `task` or `workspace`. Use when triggers do not determine the context; placement alone does not select it. |
| `triggers` | Events that start the automation. |
| `triggers[].uses` | Trigger type. See the list below. |
| `triggers[].config` | Trigger-specific settings, such as schedule `cron` and `timezone`. |
| `steps` | Ordered execution steps. |
| `steps[].name` | Step display name. |
| `steps[].prompt` | Instructions for an agent step. |
| `steps[].bash` | Shell commands for a shell step. Use either `prompt` or `bash` per step. |

Duration values must resolve to whole seconds within the supported limits. Negative durations and fractional seconds are invalid.

### Trigger types

| `uses` value | Starts when |
| --- | --- |
| `manual` | You explicitly start the automation. |
| `task_enters_stage` | A task enters the configured stage. |
| `task_leaves_stage` | A task leaves the configured stage. |
| `pull_request_updated` | A relevant pull request update occurs in Verify. |
| `schedule` | The configured schedule fires. |
| `webhook` | The configured webhook receives an event. |

Trigger availability depends on the stage and execution context. Validation rejects incompatible combinations before applying the configuration.

### Schedule configuration

Use this trigger to run at 09:00 Monday through Friday at a fixed UTC+1 offset:

```yaml
triggers:
  - uses: schedule
    config:
      cron: '0 9 * * 1-5'
      timezone: '1'
```

`cron` accepts five fields, or six with seconds first. `timezone` uses an offset string, including negative or fractional offsets. It does not accept IANA timezone names or adjust for daylight saving time.

## Fields replaced by this format

| Previous field | New form |
| --- | --- |
| Stage `key` | Stage `id`. |
| Trigger `use` | Trigger `uses`. |
| Schedule `config.utc_offset` | `config.timezone`, as an offset string. |
| `runs_on_task` | `run_context: task` or `workspace`, when inference is insufficient. |
| `with.agents.<node-id>` | `with.agent` for ordinary built-in options. |
| `timeout_seconds` | `timeout` with a duration string. |
| Custom root-level `skip_setup_commands` | `agent.skip_setup_commands`. |
| Custom root-level `skip_repository_checkout` | `agent.skip_repository_checkout`. |
| Stage `max_parallelism` | No YAML replacement. Manage concurrency through existing settings; omission preserves the live limit. |

Export again after the update to get the new IDs and syntax. Existing workspace records and execution settings remain intact.
