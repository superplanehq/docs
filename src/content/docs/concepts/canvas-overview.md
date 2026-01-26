---
title: Canvas Overview
description: Learn about canvases and how to use the canvas page to design and manage workflows.
---

A **canvas** is the workspace where you design and run workflows in SuperPlane. It's a visual
graph of nodes connected by subscriptions that define how events flow between steps.

Think of a canvas as:

- **A workspace** for designing workflows visually
- **A live system** where multiple runs can execute simultaneously
- **A graph** that defines all possible execution paths
- **A unified view** of your automation logic

A single canvas can represent multiple possible workflows, depending on which paths events take
through the graph. The canvas provides a place to model complex, event-driven workflows that span
multiple tools, wait for human input, and run over extended periods of time.

## Visual Layout

The canvas page displays nodes, connections, status indicators, and provides tools for building and
managing your workflows.

![Canvas interface](../../../assets/canvas-overview-canvas.png)

The canvas consists of:

1. **Nodes** — They are a single instance of a component — the core building blocks of Canvas. See
   [Component Nodes Overview](./component-nodes-overview) for more details.
2. **Connections** — These connect components and indicate which node listens to which. See [Data
   Flow](./data-flow) for more details.
3. **Add new elements buttons** — Add annotations and new components to the Canvas.
4. **Helper toolbar** — Contains useful tools for navigating Canvas as well as switching between
   select/pan mode, search, etc.
5. **Console** — Displays warnings and errors and contains log of changes and events happening on the
   canvas.

## Editing and Updating Canvases

You can edit and update canvases in two ways:

### Visual Editor (UI)

Use the visual editor to build and modify canvases interactively:

- **Add nodes**: Drag components from the component palette onto the canvas
- **Connect nodes**: Create subscriptions by connecting nodes together
- **Configure nodes**: Click on any node to edit its configuration
- **Delete elements**: Remove nodes or connections as needed

Changes are saved automatically, and you can see your workflow update in real-time.

### Command Line (CLI)

Use the SuperPlane CLI to manage canvases programmatically:

```sh
# Export a canvas
superplane get canvas <canvas_name> > my_canvas.yaml

# Edit the YAML file
# ... make your changes ...

# Apply updates
superplane update -f my_canvas.yaml
```

## The Canvas Page

The canvas page is the main interface for working with SuperPlane. It provides a visual workspace
where you can see your entire workflow at a glance.

### Nodes and Connections

**Nodes** are instances of components that perform work in your workflow. Each node can receive
events, execute actions, and emit payloads. To add a node:

- Click the **"+ Components"** button in the top right
- Select a component from the list
- Place it on the canvas

**Connections** (subscriptions) define how events flow between nodes. To create a connection:

- Click on a source node
- Drag to a target node
- Optionally specify an output channel if the source has multiple channels

Nodes show status badges indicating their current execution state (running, succeeded, failed) and
display key information from their latest payload.

For detailed information about components and how to configure them, see [Components
Overview](./components-overview).

### Payloads and Events

Every node emits a **payload** — JSON data containing the results of its execution. You can inspect
payloads by clicking on any node and viewing the Payload tab in the inspector.

![Inspecting a node payload](../../../assets/canvas-overview-payload.png)

When configuring nodes, you can access payload data from upstream nodes using expressions. Type
`{{` in any expression field to see available data from connected nodes.

![Selecting payload data in expressions](../../../assets/canvas-overview-selecting-payload.png)

The `$` variable provides access to all upstream payloads in the message chain. Use expressions
like `$['Node Name'].field` to reference data from any connected node.

For more details on how data flows through workflows, see [Data Flow](./data-flow).

### Workflows and Runs

A single canvas can express multiple workflows. The workflow that executes depends on which trigger
fires and which paths events take through the graph.

**Multiple runs execute simultaneously** on the canvas. Each run represents a complete workflow
execution from start to finish. When you look at the canvas:

- You see the **workflow definition** (the graph of nodes and subscriptions)
- Each node shows its **current or most recent status** from all runs
- Multiple runs can be executing at the same time
- The canvas updates in real-time as runs execute

Click on any node to view its run history — all executions that have passed through that node. From
there, you can click any run item to see the full run chain, showing all nodes that executed as
part of that particular run.

### Console

The console tracks errors, warnings, and provides a log of all changes and events happening on the
canvas.

![Console showing logs and errors](../../../assets/canvas-overview-console.png)

The console displays:

- **Errors and warnings**: Count indicators show how many issues need attention
- **Canvas changes**: Logs when components or connections are added, updated, or removed
- **Run details**: Execution logs for each run that executes on the canvas
- **Search**: Filter through logs to find specific events or changes

Use the console to debug issues, track canvas modifications, and monitor workflow execution history.

## Best Practices

When working with canvases:

- **Organize logically**: Group related nodes together visually
- **Use clear node names**: Make it easy to understand what each node does
- **Document complex logic**: Use node descriptions or comments for non-obvious flows
- **Test incrementally**: Build and test workflows step by step
- **Monitor run history**: Regularly check execution history to understand behavior
- **Use the console**: Check for errors and warnings regularly

For more details on how data flows through your canvas, see [Data Flow](./data-flow). For
information about the components you can use as nodes, see [Component Nodes Overview](./component-nodes-overview).
