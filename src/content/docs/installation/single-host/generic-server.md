---
title: Single Host Installation on a Generic Server
description: Install SuperPlane on a generic Linux server.
---

This guide describes how to install and run SuperPlane on a generic Linux
server, such as a bare-metal host or virtual machine from any provider.

## Prerequisites

Before you start, make sure you have:

- A Linux server that is exposed to the internet (public IP or behind a
  public load balancer).
- Docker and Docker Compose installed on the server.
- A domain name that points to this server’s public IP.

The single-host installation uses Docker Compose to run SuperPlane and its
dependencies. It will also issue and maintain an SSL certificate for the
domain you configure.

## Installation steps

Run the following commands on your server to download and unpack the
installer:

```bash
wget -q https://github.com/superplanehq/superplane/releases/download/v0.0.11/superplane-single-host.tar.gz
tar -xf superplane-single-host.tar.gz
cd superplane
```

Then run the installer:

```bash
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
