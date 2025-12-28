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

## Install Docker and Docker Compose

Install Docker using Docker's official repository. On Ubuntu, run:

```bash
apt update
apt install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) \
  signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker
```

## Installation steps

Run the following commands on your server to download and unpack the
installer:

```bash
wget -q https://install.superplane.com/stable/superplane-single-host.tar.gz
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
