---
title: Expressions
description: How to write expressions and access payload data in SuperPlane workflows.
---

SuperPlane uses [Expr](https://expr-lang.org) for expressions. Expressions let you reference data from upstream nodes, transform values, and control workflow logic.

**Don't want to write expressions by hand?** 
- **Ask the agent**: You can ask the built-in AI agent to write expressions for you. Just describe what you want to extract or calculate in the chat.
- **Use the Preview tool**: When typing `{{` in a text field or `$` in a condition field, the Canvas editing UI provides an autocomplete dropdown based on actual payload data from previous runs. You can also use the **Preview** tab in the node configuration to test your expressions against real data before running the workflow.

## The message chain (`$`)

As a run executes, each node's output is added to the message chain. Access it through `$`, referencing nodes by **display name**:

```
{{$['Node Name'].data.field}}
{{$['Node Name'].data.nested.field}}
{{$['Node Name'].data.array[0].value}}
```

Every entry also includes a **`.config`** property — the node's resolved configuration at run time:

```
{{$['HTTP Request'].config.url}}
{{$['HTTP Request'].config.method}}
```

### `root()` and `previous()`

| Function | Returns |
| -------- | ------- |
| `root()` | The payload that started the run (the trigger event). |
| `previous()` | The immediate upstream node's payload. |
| `previous(n)` | Walk **n** levels upstream. |

```
{{root().data.ref}}
{{previous().data.status}}
```

`previous()` is not available when a node has multiple inputs (e.g. after a Merge). Use `$['Node Name']` instead.

### `memory`

The `memory` namespace lets you query [canvas memory](/concepts/canvas-memory) records directly in any expression, without adding a Read Memory node.

| Function | Returns |
| -------- | ------- |
| `memory.find(namespace, matches)` | All records in `namespace` whose fields contain `matches`. |
| `memory.findFirst(namespace, matches)` | The first matching record, or `nil` if none. |

```
{{memory.find("machines", {"sandbox_id": "12121"})}}
{{memory.findFirst("machines", {"creator": "igor"}).sandbox_id}}
```

---

## Syntax: text fields vs conditions

Expressions appear in two contexts with slightly different syntax:

**Text fields** (URLs, message bodies, labels) — wrap each expression in `{{ }}`:

```
Deployment of {{$['Release'].data.name}} failed. See: {{$['Deploy'].data.workflow_run.html_url}}
```

**Condition fields** (If, Filter) — the entire field is one bare expression that must return `true` or `false`:

```
$['Get cat fact'].data.body.length <= 160 && $['Health Check'].data.body.healthy
```

---

## Operators

Beyond standard arithmetic (`+`, `-`, `*`, `/`, `%`, `**`) and comparison (`==`, `!=`, `<`, `>`, `<=`, `>=`):

| Operator | What it does | Example |
| -------- | ------------ | ------- |
| `&&` `\|\|` `!` | Logical (aliases: `and`, `or`, `not`) | `{{$['a'].data.ok && !$['b'].data.failed}}` |
| `contains` | String contains substring | `{{$['node'].data.body contains "error"}}` |
| `startsWith` | String prefix check | `{{$['node'].data.ref startsWith "refs/heads/"}}` |
| `endsWith` | String suffix check | `{{$['node'].data.branch endsWith "-hotfix"}}` |
| `matches` | Regex match ([RE2](https://github.com/google/re2/wiki/Syntax)) | `{{$['node'].data.msg matches "^fix\\(.*\\)"}}` |
| `in` / `not in` | Membership test | `{{$['node'].data.env in ["staging", "prod"]}}` |
| `??` | Nil coalescing (fallback) | `{{$['node'].data.label ?? "default"}}` |
| `? :` | Ternary | `{{$['node'].data.ok ? "pass" : "fail"}}` |
| `?.` | Optional chaining | `{{$['node'].data?.user?.name}}` |

---

## Closures (`#`)

Array functions accept a closure where **`#`** is the current element:

```
{{filter($['node'].data.items, # > 10)}}
{{map($['node'].data.users, #.name)}}
{{any($['node'].data.tags, # == "critical")}}
{{sortBy($['node'].data.alerts, #.severity, "desc")}}
```

`reduce()` adds **`#acc`** for the accumulator:

```
{{reduce($['node'].data.items, #acc + #.price, 0)}}
```

---

## Common patterns

**Fallback for missing fields:**

```
{{$['Webhook'].data.user.name ?? "unknown"}}
```

**Ternary in a text field:**

```
Status: {{$['Deploy'].data.success ? "Deployed" : "Failed"}}
```

**Check array membership:**

```
{{"production" in $['node'].data.environments}}
```

**Filter and join:**

```
{{join(filter($['node'].data.tags, # startsWith "env:"), ", ")}}
```

**Date comparison (event in the last hour):**

```
{{now().Sub(date($['node'].data.timestamp)).Hours() < 1}}
```

**Build a JSON string:**

```
{{toJSON({status: $['Deploy'].data.result, ref: root().data.ref})}}
```

---

## Function reference

SuperPlane expressions have access to the full set of Expr built-in functions for strings, arrays, dates, math, and type conversion. See the [Expression Functions Reference](/concepts/expression-functions) for the complete list with signatures and examples.

For the Expr language specification, see the [Expr documentation](https://expr-lang.org/docs/language-definition).
