---
title: Try SuperPlane on Your Computer
description: Run SuperPlane locally with Docker in less than a minute.
---

The fastest way to try SuperPlane is to run the latest version of the
SuperPlane Docker container on your own machine. You'll have a working
SuperPlane instance in less than a minute, without provisioning
any cloud infrastructure.

## Prerequisites

To run SuperPlane, you need:

- [Docker installed and running][docker-install] (for example Docker Desktop on
  macOS/Windows, or Docker Engine on Linux).
- A stable internet connection (SuperPlane opens a tunnel for incoming
  webhooks).

## Starting SuperPlane

Run the latest stable SuperPlane Docker container:

```bash
docker pull ghcr.io/superplanehq/superplane-demo:stable
docker run --rm -p 3000:3000 -v spdata:/app/data -ti ghcr.io/superplanehq/superplane-demo:stable
```

This pulls the stable image and starts SuperPlane in your terminal.

### Public access and localtunnel

SuperPlane needs to be reachable from the public internet to receive
incoming webhooks. When you run the container, it automatically starts
a [localtunnel][localtunnel] to expose your local instance through a
public URL for incoming webhooks.

This is convenient for quick trials, but it also means:

- Your local SuperPlane instance becomes accessible from the internet
  via the tunnel URL.
- You should **not** use this setup with sensitive data, secrets, or
  production systems.

Use this setup for exploration and evaluation only. For more
controlled, production-like deployments, use one of the single-host or
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

## Updating SuperPlane

To update to the latest version, run docker pull and restart the container:
```
docker pull ghcr.io/superplanehq/superplane-demo:stable
docker run --rm -p 3000:3000 -v spdata:/app/data -ti ghcr.io/superplanehq/superplane-demo:stable
```

Replace `stable` with the specific version tag if needed.

## Removing SuperPlane

To completely remove SuperPlane, remove the data volume and Docker
images:

```bash
docker volume rm spdata
docker rmi ghcr.io/superplanehq/superplane-demo:stable
```

If you've used other tags (like `beta` or specific versions), remove
those images as well:

```bash
docker rmi ghcr.io/superplanehq/superplane-demo:beta
docker rmi ghcr.io/superplanehq/superplane-demo:v0.4
```

[localtunnel]: https://github.com/localtunnel/localtunnel
[docker-install]: https://docs.docker.com/get-docker/
