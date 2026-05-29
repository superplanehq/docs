---
title: Memory
description: Persistent, app-scoped storage you can read and write from workflows using dedicated components.
sidebar:
  label: Memory
---

**Memory** stores structured JSON data on an app, scoped by **namespace**. It persists across runs so workflows can keep state, pass data between branches, or look up records by matching fields.

## How it works

- **App-scoped** — Data belongs to one app.
- **Namespaces** — You choose a namespace string per use case (for example `deployments` or `incidents`).
- **Rows** — Each write can add or update rows; each row holds JSON **values** (object).
- **Matching** — Read, update, delete, and upsert operations can match rows by field values (JSON containment).

## Persisting data across runs

Runs on the same app are independent: payloads from one run do not automatically appear in the next. Memory is where you **store facts that should survive** until a later run needs them.

| Pattern | How |
| ------- | --- |
| Staged rollout | **Upsert** the current stage; next run **Read** (latest) to decide whether to advance. |
| Incident handoff | Run 1 **Add** IDs; Run 2 **Read** by key to continue the same incident. |
| Deduplication | **Upsert** on a stable key; branch on `found` / `notFound`. |
| Counters | **Update** to merge new values (e.g. attempt count); later runs read the totals. |

## Components

SuperPlane provides five memory components:

| Component | Purpose |
| --------- | ------- |
| **Add Memory** | Append a new row in a namespace. |
| **Read Memory** | Find rows by namespace and match criteria; emits on `found` or `notFound`. |
| **Update Memory** | Update matching rows by merging new fields; emits on `found` or `notFound`. |
| **Delete Memory** | Delete matching rows; emits on `deleted` or `notFound`. |
| **Upsert Memory** | Update the first match, or insert if none match. |

**Read Memory** supports:

- **Result mode** — `all` (every match) or `latest` (most recent).
- **Emit mode** — `allAtOnce` (one event with all matches) or `oneByOne` (one event per row).

See the [Components](/components/core) reference for field-level configuration.

## API

Memory can also be listed or cleared via the REST API (see [Public API Reference](/concepts/api-reference)). Managing memory records requires permissions to read or update the app.
