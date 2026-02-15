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

The SuperPlane CLI uses API tokens for authentication. To generate a new one:

- Go to **Profile > API token** in the SuperPlane UI
- Click the **Regenerate Token** button

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
