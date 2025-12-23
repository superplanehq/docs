---
title: Single Host Installation on Hetzner
description: Install SuperPlane on a single Hetzner server.
---

This guide describes how to install and run SuperPlane on a single Hetzner
server using the SuperPlane single-host installer.

## Prerequisites

Before you start, make sure you have:

- A Hetzner Linux server that is exposed to the internet (public IP or behind
  a public load balancer).
- Docker and Docker Compose installed on the server.
- A domain name that points to this server’s public IP.

The single-host installation uses Docker Compose to run SuperPlane and its
dependencies. It will also issue and maintain an SSL certificate for the
domain you configure.

## Installation steps

SSH into your Hetzner server and run:

```bash
wget -q \
  https://github.com/superplanehq/superplane/releases/download/v0.0.11/superplane-single-host.tar.gz
tar -xf superplane-single-host.tar.gz
cd superplane
./install
```

This downloads the single-host bundle, extracts it, and runs the installer.
The installer sets up the Docker Compose stack and starts SuperPlane on your
server.

## SSL certificates and public access

Because SuperPlane needs to connect to external integrations and receive
webhooks, your server must be reachable from the public internet.

During installation, SuperPlane automatically:

- Issues an SSL certificate for your configured domain.
- Renews the certificate so HTTPS continues to work over time.

Ensure your firewall or security group allows inbound traffic on ports 80 and
443 so certificate issuance and HTTPS access can succeed.
