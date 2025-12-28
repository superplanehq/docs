---
title: Try SuperPlane on Your Computer
description: Run SuperPlane locally for evaluation and development.
---

The fastest way to try SuperPlane is to run the latest version of the
SuperPlane Docker container on your own machine. You'll have a working
SuperPlane instance in less than a minute, without provisioning
any cloud infrastructure.

## Prerequisites

To run SuperPlane you need:

- Docker installed and running (for example Docker Desktop on
  macOS/Windows, or Docker Engine on Linux).
- A stable internet connection (SuperPlane connects to external
  integrations and opens a tunnel).

## Starting SuperPlane

Run the latest stable SuperPlane Docker container:

```bash
docker run -ti --rm ghcr.io/superplanehq/superplane-demo:stable
```

This pulls the stable image (if needed) and starts SuperPlane in your
terminal.

### Public access and Cloudflare tunnel

SuperPlane needs to be reachable from the public internet so it can
connect to external integrations and webhooks. When you run the
container, it automatically starts a Cloudflare Tunnel to expose your
local instance through a public URL.

This is convenient for quick trials, but it also means:

- Your local SuperPlane instance becomes accessible from the internet
  via the tunnel URL.
- You should **not** use this setup with sensitive data, secrets, or
  production systems.

Use this setup for exploration and evaluation only. For more
controlled, production‑like deployments, use one of the single‑host or
Kubernetes installation options instead.

## Try the beta channel

To try the latest features before they land in stable, use the beta
tag:

```bash
docker run -ti --rm ghcr.io/superplanehq/superplane-demo:beta
```

Beta images may change more frequently and can be less stable than the
`stable` channel.

## Pin a specific version

If you want to run a particular version, you can pin it explicitly:

```bash
docker run -ti --rm ghcr.io/superplanehq/superplane-demo:v0.4
```

Replace `v0.4` with the version you want to run.
