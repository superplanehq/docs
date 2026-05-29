---
title: Console
description: Per-canvas operational view for status, runbooks, and live workflow data.
---

The **console** is a per-canvas view for day-to-day operations: release status, preview environments, incident summaries, and other cases where the workflow graph is not the right surface.

It uses the same canvas as the graph editor but replaces the graph with a **12-column grid** of panels you can drag and resize.

## Opening the console

From a canvas, open the **Console** tab in the header (or use `?view=console` in the URL). Other views on the same canvas include **Canvas** (graph), **Memory**, and **Files**.

**Templates** do not include an editable console.

## Panels

| Panel | Purpose |
| ----- | ------- |
| **Markdown** | Runbooks, notes, and status copy (GFM markdown) |
| **Node** | One pinned node with live status; optional **Run** |
| **Key Nodes** | Multiple pinned nodes with live status |
| **Table** | Rows from canvas memory, executions, or runs |
| **Chart** | Bar, stacked bar, line, area, or donut charts |
| **Number** | A single KPI (count, sum, average, and similar) |

Table panels can filter rows and define **row actions** that trigger nodes on the canvas (for example destroy or retry).

Data panels read from **canvas memory**, **executions**, or **runs**. See [Memory](/concepts/canvas-memory) for the memory model and memory components.

## Console vs canvas notes

[Notes](/concepts/canvas#notes) are sticky notes on the graph for in-flow documentation. **Markdown panels** on the console are separate: they live on the operational grid, not on the graph.

## Editing and versioning

Users with `canvases:update` can add, move, resize, edit, delete, import, and export console layout. Viewers can read the console and export YAML.

Console changes are part of the canvas **draft** and publish with canvas versions, together with graph and memory edits. A dot on the **Console** tab indicates unpublished console changes.

Importing console YAML **replaces** all panels and layout in one update. See [Files](/concepts/files) for `canvas.yaml`, `console.yaml`, and CLI workflows.

## Permissions

- **View** — Same as reading the canvas.
- **Edit layout** — `canvases:update`.
- **Run** (node panels, table row actions) — `canvases:update`.

See [Access Control](/concepts/access-control) for role details.
