---
title: SuperPlane CLI
description: Install the SuperPlane CLI and manage canvases.
---

Use the SuperPlane CLI to configure access and manage canvases from your terminal.

## Installation

Download the latest binary for your operating system and architecture:

```
curl -L https://install.superplane.com/superplane-cli-darwin-arm64 -o superplane
chmod +x superplane
sudo mv superplane /usr/local/bin/superplane
```

Or download a specific version:

```
curl -L https://install.superplane.com/v0.1.6/superplane-cli-darwin-arm64 -o superplane
chmod +x superplane
sudo mv superplane /usr/local/bin/superplane
```

## Authentication

The SuperPlane CLI uses API tokens for authentication. You can use:

- **Service account token** (recommended for scripts and integrations): see [Service Accounts](/concepts/service-accounts).
- **Personal token** (tied to your user): go to **Profile > API token** in the SuperPlane UI.

## Configure the CLI

Set the API URL and your API token before running any commands:

```sh
superplane config set api_url <SUPERPLANE_URL>
superplane config set api_token <API_TOKEN>
```

## Managing canvases

### Create a canvas

```sh
superplane canvases create <canvas_name>
```

### Describe a canvas

```sh
superplane canvases get <canvas_name>
```

### Update a canvas

Export the existing canvas, edit it, then apply your changes:

```sh
superplane canvases get <canvas_name> > my_canvas.yaml
# update your YAML to reflect the changes you want to make
superplane canvases update -f my_canvas.yaml
```

### Canvas YAML shape (minimal working example)

When updating canvases via YAML, component nodes and edges must use the API field names.

This example connects a `schedule` trigger to an `http` component that sends a keepalive
request every minute:

```yaml
apiVersion: v1
kind: Canvas
metadata:
  id: <canvas_id>
  name: Store app
spec:
  edges:
    - sourceId: schedule-schedule-w3mak1
      targetId: http-keepalive-ping
      channel: default
  nodes:
    - id: schedule-schedule-w3mak1
      name: schedule
      type: TYPE_TRIGGER
      trigger:
        name: schedule
      paused: false
      position:
        x: 144
        y: 0
      configuration:
        type: minutes
        minutesInterval: 1
        customName: Keepalive {{ now() }}
    - id: http-keepalive-ping
      name: http
      type: TYPE_COMPONENT
      component:
        name: http
      paused: false
      position:
        x: 456
        y: 0
      configuration:
        method: GET
        url: https://store-app-c6nr.examplepaas.com/
        customName: PaaS keepalive
```

Notes:

- For component nodes, `type` must be `TYPE_COMPONENT` and `component.name` is required.
- For trigger nodes, use `type: TYPE_TRIGGER` and `trigger.name`.
- Edge fields are `sourceId`, `targetId`, and optional `channel`.
- Use `superplane components list` to find component keys (for example, `http`, `if`, `noop`).
- Positioning guideline for agents:
  - Keep downstream nodes on the same row by default (`y` unchanged).
  - Use `x = upstream.x + 480` as the default spacing for new connected nodes.
  - Avoid changing positions of existing nodes unless explicitly requested.
  - If overlap still appears in UI, apply a small horizontal nudge (`x +/- 80..120`) before changing `y`.

## Discovering components

### List integrations

```sh
superplane integrations list
```

Get details for one integration:

```sh
superplane integrations get <integration_name>
```

### List components

List all available components:

```sh
superplane components list
```

List components from a specific integration:

```sh
superplane components list --from <integration_name>
```

Get details for one component:

```sh
superplane components get <component_name>
```

### List triggers

List all available triggers:

```sh
superplane triggers list
```

List triggers from a specific integration:

```sh
superplane triggers list --from <integration_name>
```

Get details for one trigger:

```sh
superplane triggers get <trigger_name>
```

## Managing integrations

List only integrations connected to your authenticated organization:

```sh
superplane integrations list --connected
```

List resources available from a connected integration:

```sh
superplane integrations list-resources --id <connected_integration_id> --type <resource_type>
```

You can pass additional query parameters when needed:

```sh
superplane integrations list-resources \
  --id <connected_integration_id> \
  --type <resource_type> \
  --parameters key=value,key2=value2
```

## Updating SuperPlane

To upgrade to the latest version, download the latest binary and replace
the existing one:

```bash
curl -L https://install.superplane.com/superplane-cli-darwin-arm64 -o superplane
chmod +x superplane
sudo mv superplane /usr/local/bin/superplane
```

Replace `darwin-arm64` with your operating system and architecture
(e.g., `linux-amd64`, `darwin-amd64`).
