---
title: CLI Reference
description: Install the SuperPlane CLI and manage canvases.
---

Use the SuperPlane CLI to configure access and manage canvases from your terminal.

## Installation

Install the CLI with Homebrew:

```sh
brew install superplanehq/tap/superplane
```

Or download a binary from the GitHub releases page:

- https://github.com/superplanehq/superplane/releases

## Prerequisites

- A SuperPlane API token

## Configure the CLI

Set the API URL and your API token before running any commands:

```sh
superplane config set api_url https://app.superplane.com
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
superplane apply -f my_canvas.yaml
```
