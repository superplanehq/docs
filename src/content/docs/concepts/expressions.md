---
title: Expressions
description: How to write expressions and access payload data in SuperPlane workflows.
---

SuperPlane uses [Expr](https://expr-lang.org) for expressions. Expressions let you access payload data,
transform values, and evaluate conditions.

### Accessing Payload Data

Use `$['Node Name']` to access payload data from any upstream node in the message chain:

```
$['Node Name'].field
$['Node Name'].nested.field
$['Node Name'].array[0].value
```

**Examples:**

```
$['GitHub onPush'].ref                              // Branch ref
$['GitHub onPush'].head_commit.message              // Commit message
$['Deploy 10%'].workflow_run.html_url               // Workflow URL
```

### SuperPlane Functions

These functions are specific to SuperPlane workflows:

| Function      | Description                                      | Example                    |
| ------------- | ------------------------------------------------ | -------------------------- |
| `root()`      | Returns the root payload that started the run    | `root().data.ref`          |
| `previous()`  | Returns payload from the immediate upstream node | `previous().data.status`   |
| `previous(n)` | Walk n levels upstream                           | `previous(2).data.version` |

### Common Functions

Expr provides a rich set of built-in functions:

**String**
`lower()`, `upper()`, `trim()`, `split()`, `replace()`, `indexOf()`, `hasPrefix()`, `hasSuffix()`

**Array**
`filter()`, `map()`, `first()`, `last()`, `len()`, `any()`, `all()`, `count()`, `join()`

**Date**
`now()`, `date()`, `duration()` — with methods like `.Year()`, `.Month()`, `.Day()`, `.Hour()`

**Type Conversion**
`int()`, `float()`, `string()`, `toJSON()`, `fromJSON()`, `toBase64()`, `fromBase64()`

For the complete function reference, see the [Expr language documentation](https://expr-lang.org/docs/language-definition).

### Using Expressions in Configuration

Expressions can be used in component configuration fields using double curly braces:

**Dynamic message:**

```
Deployment of {{$['Listen to new Releases'].data.release.name}} has failed.
```

**Filter expression:**

```
$['GitHub onPush'].ref == "refs/heads/main"
```

**String manipulation:**

```
indexOf(lower($['Slack Message'].data.text), "p1") != -1
```

**Conditional logic:**

```
$['Check for alerts'].data.status != "clear" || $['Health Check'].data.body.healthy == false
```
