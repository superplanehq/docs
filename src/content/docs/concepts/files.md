---
title: Files
description: Each app has a git repository with canvas.yaml and console.yaml — edit from the Files tab or the CLI.
---

Every app is backed by a **git repository**. The **Files** tab is where you view and edit the YAML that defines the app.

## What's in the repository

| File | Purpose |
| ---- | ------- |
| `canvas.yaml` | Workflow graph: nodes, subscriptions, and configuration |
| `console.yaml` | Console layout and panels |

Changes you make in the UI are reflected in these files. Edits in **Files** follow the same **draft and publish** flow as on the [Canvas](/concepts/canvas) and [Console](/concepts/console).

## Files tab

Open **Files** from the app header (alongside **Canvas**, **Console**, and **Memory**).

- View and edit `canvas.yaml` and `console.yaml` in the browser
- Export YAML for review or backup
- Import YAML to replace the graph or console in one update (console import is replace-all)

## CLI

Pull and push the same files with the SuperPlane CLI. See [SuperPlane CLI](/installation/cli) for `canvas.yaml` and `console.yaml` commands on a given app.
