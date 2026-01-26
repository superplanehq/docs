---
title: Component Nodes
description: Learn about components and component nodes, and how to add, configure, and use them in your workflows.
---

**Components** are available building blocks that define capabilities in SuperPlane. A **component node**
is one instance of a component on the Canvas. When you add a component to your canvas, it becomes a
node that can receive events, perform work, and emit payloads.

## Components vs Component Nodes

- **Component**: The building block definition — what it does, what configuration it needs, what it
  emits
- **Component Node**: A single instance of a component placed on your canvas with specific
  configuration

Think of it like this: a component is like a blueprint, and a component node is the actual building
you construct from that blueprint.

## Component Types

There are two types of components:

### Trigger Components

**Trigger components** start workflow executions. They listen for external events or can be invoked
manually:

- **External events**: Webhooks, GitHub pushes, Slack mentions, scheduled times
- **Manual invocation**: Manual Run component lets you start workflows on demand
- **Event-driven**: They emit events when something happens externally

**Examples:** Webhook, Schedule, Manual Run, GitHub onPush, Slack onAppMention

### Action Components

**Action components** execute operations in response to upstream events:

- **Subscribe to events**: They receive events from trigger nodes or other action nodes
- **Perform operations**: Call external APIs, transform data, route events, wait for input
- **Emit results**: Produce payloads that downstream nodes can use

**Examples:** HTTP Request, Filter, Approval, GitHub runWorkflow, Slack sendMessage

## Adding Component Nodes to the Canvas

New component nodes can be added to the Canvas in two ways:

### From the Components Menu

1. Click the **"+ Components"** button in the top right of the canvas
2. Select a component from the list of available components
3. Drag it onto the canvas where you want it

The component is now a node on your canvas, ready to be configured and connected.

### From Output Channels

You can also drag an output channel from an existing node to an empty space on the canvas. This
creates a new component node and automatically subscribes it to that output channel, making it
faster to model workflows.

## Node Overview on Canvas

Each component node on the canvas displays key information and provides interactive elements:

![Component node on canvas](../../../assets/component-nodes-node.png)

1. **Input channel** — Available on Action nodes only. Drag from here to subscribe to output events
   from other nodes on the Canvas.

2. **Configuration overview** — A quick summary of key configurations and settings for this node,
   displayed directly on the node card.

3. **Latest Run Item** — Displays the last run this node executed or the last event emitted (in the
   case of trigger nodes). Shows status, timestamp, and run details.

4. **Action menu** — Appears on hover. You can manually emit an event from this node, copy the node,
   toggle between collapsed/detailed view, or delete the node.

5. **Output channels** — Lets other nodes subscribe to events from this node. Can also be used to
   drag and drop new components for faster modeling.

## Component Node Sidebar

Clicking on a component node selects it and opens a component node sidebar. The sidebar is resizable
and contains all the information about the node.

![Component node sidebar](../../../assets/component-nodes-sidebar.png)

### Runs Tab

The **Runs** tab displays run items — a list of runs this particular node executed:

1. **Latest runs** — Shows the most recent executions, including currently running items and
   finished runs. Each run item displays the event ID, timestamp, and status.

2. **Active run actions** — Active run items have an action menu with additional options like
   canceling them or pushing them through.

3. **Queued runs** — Components execute runs sequentially (FIFO). Items that are in queue for
   execution are listed here, showing which runs are waiting to be processed.

### Configuration Tab

The **Configuration** tab is for setting up and updating the node's configuration settings. Each
component has its own configuration requirements:

- **Required fields**: Settings that must be provided for the component to work
- **Optional fields**: Settings that customize behavior or provide additional context
- **Expression support**: Many fields support expressions using `{{ }}` syntax

See [Expressions](./expressions) for details on writing expressions.

## Single Run Chain

By selecting a single run from the list in the sidebar, you can see the whole chain of nodes that
run went through, with the current node preselected in the chain.

![Single run chain view](../../../assets/component-nodes-single-run.png)

1. **Run chain overview** — By selecting a single run from the list, you will see the whole chain
   of nodes this run went through, with the current node preselected in the chain. The sidebar shows
   the trigger that started the run, all steps that executed, and their outcomes.

2. **Dimmed nodes on canvas** — On the Canvas, nodes that were not included in the run (due to
   routing) will be dimmed down. This visual distinction helps you understand which path the run
   actually took through your workflow.

3. **Expandable run details** — You can expand run details of other nodes in the chain to easily
   access summary and payloads. Each step in the run chain can be expanded to view its execution
   details.

4. **Details tab** — The Details tab provides key information about the node's execution for that
   run, including start time, finish time, result, reason, actor (if applicable), and duration.

5. **Payload tab** — The Payload tab contains the payload that this node emitted at the end of its
   execution. This is the data that downstream nodes can access and use in their configurations.

## Component Availability

Components are provided by **integrations**. SuperPlane includes:

- **Core components**: Built-in components like Webhook, Filter, HTTP Request
- **Integration components**: Components from integrations like GitHub, Slack, PagerDuty

To use integration components, you may need to configure authentication or connection settings for
that integration first.

Browse the [Components](/components) section to see all available components and their
documentation.

## Best Practices

When working with component nodes:

- **Choose the right component**: Understand what each component does before using it
- **Configure thoughtfully**: Provide clear, meaningful configuration values
- **Use expressions**: Make configurations dynamic by referencing upstream data
- **Name nodes clearly**: Give nodes descriptive names that indicate their purpose
- **Document complex logic**: Use node descriptions for non-obvious configurations
- **Test configurations**: Verify component behavior with simple test cases first
- **Monitor run history**: Regularly check execution history to understand behavior

For more details on how component nodes connect and how data flows between them, see [Data
Flow](./data-flow). For information about the canvas where you work with component nodes, see
[Canvas](./canvas).
