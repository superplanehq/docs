---
title: Beacon Telemetry
description: Understand what the SuperPlane beacon sends and how to disable it.
---

SuperPlane includes a lightweight beacon that sends a periodic ping to help the team understand
installation volume and deployment types.

## What the beacon sends

The beacon sends a JSON payload with:

- `installation_type`: The installation type (for example `demo`, `single-host`, or `kubernetes`).
- `installation_id`: A randomly generated UUID stored in the SuperPlane database

No user data, workflow payloads, or secrets are included. The data is anonymized.

## How to disable the beacon

You can disable the beacon by setting `SUPERPLANE_BEACON_ENABLED=no` and restarting SuperPlane.

### Local demo container

Set the environment variable when starting the container:

```bash
docker run --rm -p 3000:3000 -v spdata:/app/data \
  -e SUPERPLANE_BEACON_ENABLED=no \
  -ti ghcr.io/superplanehq/superplane-demo:stable
```

If you already have a data volume, you can also edit `/app/data/superplane.env` in that volume
and restart the container.

### Single-host installer

Edit `superplane.env` in the installation directory and set:

```bash
SUPERPLANE_BEACON_ENABLED=no
```

Then restart the stack:

```bash
docker compose up -d
```

### Kubernetes (Helm)

Set the Helm value and upgrade:

```yaml
installation:
  beaconEnabled: false
```

Or with `--set`:

```bash
helm upgrade superplane ./superplane-helm-chart \
  --set installation.beaconEnabled=false
```