---
title: CLI Reference
description: Install the SuperPlane CLI and manage canvases.
---

Use the SuperPlane CLI to configure access and manage canvases from your terminal.

## Installation

Download a binary from the GitHub releases page:

```
curl -L https://github.com/superplanehq/superplane/releases/download/v0.1.3/superplane-cli-v0.1.3-darwin-arm64 -o superplane
chmod +x superplane
sudo mv superplane /usr/local/bin/superplane
```

## Prerequisites

- A SuperPlane API token

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
