---
title: Glossary
description: Definitions for key SuperPlane concepts and terms.
---

This page defines the core terms used throughout the SuperPlane documentation.

## Canvas

A **canvas** is the workspace where you design and run workflows. It is a graph of nodes connected by
subscriptions that define how events flow between nodes. A canvas usually represents multiple possible workflows.

## Workflow

A **workflow** is the behavior expressed by a canvas: what should happen when an event occurs, which steps run, and how data moves between steps.

## Node

A **node** is a single step on a canvas. Each node receives an event, performs some work, and emits an event to any downstream nodes that subscribe to it.

## Component

A **component** is the “type” of a node (for example, **Webhook**, **Manual Run**, **Filter**, or a GitHub action).
Components define what configuration a node needs and what it emits.

## Trigger

A **trigger** is a component that starts a workflow execution. Triggers typically receive external events (webhooks, schedules) or start runs manually.

## Action

An **action** is a component that runs in response to an upstream event. Actions can call external systems, transform data, route events, or wait for human input.

## Integration

An **integration** connects SuperPlane to an external system (for example GitHub, Slack, PagerDuty). Integrations
provide triggers and actions you can use as nodes on the canvas.

## Event

An **event** is the unit of work that flows between nodes. Events carry data (the payload) and are delivered to any
downstream nodes that subscribe to them.

## Payload

A **payload** is the JSON data associated with an event or a node execution. Payloads are what you inspect in run
history and what you reference in expressions.

## Output channel (channel)

A **channel** is a named output a node can emit on (for example `passed`/`failed`, `approved`/`rejected`). Channels let
you route events to different downstream paths based on outcomes.

## Subscription

A **subscription** is the connection from one node’s output (optionally a specific channel) to another node’s input. A
canvas is essentially a graph of subscriptions.

## Run

A **run** is a single end-to-end workflow execution, from the first triggering event through all downstream work it
causes. Runs are what you use to debug “what happened?” across many steps.

## Run item

A **run item** is the execution record for a single node within a run. A run is composed of many run items.

## Run history

**Run history** is the UI view that lists past executions for a node or a canvas. It’s where you inspect payloads,
timestamps, statuses, and errors.

## Message chain

The **message chain** is the accumulated outputs from upstream nodes within a run. It allows downstream nodes to access
and combine data from earlier steps.

## Expression

An **expression** is a small program used to read and transform payload data (for example to build a message, compute a
condition, or select an output path). See the [Expressions](./expressions) page for more details.
