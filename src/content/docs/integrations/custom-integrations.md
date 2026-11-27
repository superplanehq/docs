---
title: Custom integrations
description: Connect services that do not have a dedicated SuperPlane component.
---

Use core components to connect an HTTP API, GraphQL endpoint, webhook, or SSH host when no dedicated integration exists.

## HTTP and GraphQL

The [HTTP Request](/components/core#http-request) component calls REST-style endpoints. The [GraphQL Request](/components/core#graph-ql-request) component sends a GraphQL document over HTTP and returns the response data.

## Webhooks

The [Webhook](/components/core#webhook) trigger gives an external system a URL that can start an automation. Configure authentication and validate every incoming payload before it controls a sensitive action.

To turn incoming JSON requests into **Backlog** tasks, configure a [webhook intake](/intakes/overview#receive-tasks-from-a-webhook) from **Add intake** on the board.

## SSH

The [SSH Command](/components/core#ssh-command) component runs commands on a remote host. Store keys or passwords in an organization secret and select the secret from the component configuration.

## Safe integration design

Use the smallest required permission set, add timeouts and failure paths and remove credentials from logs and outputs. Put a human approval before high-impact changes.
