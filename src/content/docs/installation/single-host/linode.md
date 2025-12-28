---
title: Single Host Installation on Linode
description: Install SuperPlane on a single Linode instance.
---

This guide walks you through setting up a new Linode instance from scratch
and installing SuperPlane using the single-host installer.

## 1. Create a Linode

1. Sign in to the [Linode Cloud Manager](https://cloud.linode.com/).
2. Click **Create → Linode**.
3. Configure your Linode:
   - Choose a region close to you.
   - Select an Ubuntu LTS image (for example Ubuntu 22.04 LTS).
   - Pick a shared CPU plan with 2 vCPUs and 4 GB RAM (for example
     **Linode 4GB**).
   - Add SSH keys so you can log in securely.
4. Create the Linode and note its public IPv4 address.

At this point you have a Linux server that is reachable from the internet.

## 2. Point your domain to the Linode

1. In your DNS provider (Linode DNS or another provider), create an `A`
   record for your domain or subdomain (for example
   `superplane.example.com`).
2. Point the `A` record to the public IP of your Linode.
3. Wait for DNS to propagate (usually a few minutes).

SuperPlane will use this domain to issue and maintain an SSL certificate.

## 3. Open required ports with Cloud Firewall

In the Linode Cloud Manager:

1. Go to **Firewall**.
2. Create a new firewall (or edit an existing one).
3. Under **Inbound Rules**, allow:
   - TCP port 22 (SSH)
   - TCP port 80 (HTTP, for certificate issuance)
   - TCP port 443 (HTTPS, for SuperPlane)
4. Under **Linodes**, attach the firewall to your SuperPlane Linode.
5. Save the firewall.

## 4. Install Docker and Docker Compose

SSH into your Linode using the IP or domain:

```bash
ssh root@your-linode-ip-or-domain
```

On the Linode, install Docker and Docker Compose. For example, on
Ubuntu:

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

You now have a Linode with Docker and Docker Compose installed, reachable
from the internet at your chosen domain.

## 5. Install SuperPlane

With Docker set up, install SuperPlane using the single-host installer.
First, download and unpack the installer:

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
Linode.

## SSL certificates and public access

Because SuperPlane needs to connect to external integrations and receive
webhooks, your Linode must be reachable from the public internet.

During installation, SuperPlane automatically:

- Issues an SSL certificate for your configured domain.
- Renews the certificate so HTTPS continues to work over time.

Ensure your firewall allows inbound traffic on ports 80 and 443 so
certificate issuance and HTTPS access can succeed.

## 6. Enable backups

To protect your SuperPlane instance, enable backups for your Linode.

In the Linode Cloud Manager:

1. Go to **Linodes** and click your SuperPlane Linode.
2. Open the **Backups** tab.
3. Enable backups for the Linode.

Linode will now create regular backups of your instance. You can use these
backups to restore the Linode to an earlier state if something goes wrong.

