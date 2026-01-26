---
title: CLI Reference
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

## Create a canvas

```sh
superplane create canvas <canvas_name>
```

## Describe a canvas

```sh
superplane get canvas <canvas_name>
```

## Update a canvas

Export the existing canvas, edit it, then apply your changes:

```sh
superplane get canvas <canvas_name> > my_canvas.yaml
# update your YAML to reflect the changes you want to make
superplane update -f my_canvas.yaml
```
