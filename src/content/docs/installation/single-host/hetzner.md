---
title: Single Host Installation on Hetzner
description: Install SuperPlane on a single Hetzner server.
---

This guide walks you through setting up a new Hetzner cloud server from
scratch and installing SuperPlane using the single‑host installer.

## 1. Create a Hetzner cloud server

1. Sign in to the [Hetzner Cloud Console](https://console.hetzner.cloud/).
2. Create a new project (or use an existing one).
3. Create a server:
   - Choose a location close to you.
   - Select an Ubuntu LTS image (for example Ubuntu 22.04).
   - Pick a shared CPU type with 2 CPU and 4 GB RAM.
   - Add SSH keys so you can log in securely.
4. Note the server’s public IPv4 address.

At this point you have a Linux server that is reachable from the internet.

## 2. Point your domain to the server

1. In your DNS provider, create an `A` record for your domain or subdomain
   (for example `superplane.example.com`).
2. Point the `A` record to the public IP of your Hetzner server.
3. Wait for DNS to propagate (usually a few minutes).

SuperPlane will use this domain to issue and maintain an SSL certificate.

## 3. Open required ports

In the Hetzner Cloud Console:

1. Open your project and go to the **Servers** view.
2. Click your SuperPlane server to open its details.
3. Go to the **Networking** tab.
4. Under **Firewalls**, either create a new firewall or edit the one attached
   to the server.
5. Add inbound rules that allow:
   - TCP port 22 (SSH)
   - TCP port 80 (HTTP, for certificate issuance)
   - TCP port 443 (HTTPS, for SuperPlane)
6. Apply the firewall to your server if it is not already attached.

## 4. Install Docker and Docker Compose

SSH into your Hetzner server using the IP or domain:

```bash
ssh root@your-server-ip-or-domain
```

On the server, install Docker and Docker Compose. For example, on
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

You now have a Hetzner Linux server with Docker and Docker Compose installed,
reachable from the internet at your chosen domain.

## 5. Install SuperPlane

With Docker set up, install SuperPlane using the single‑host installer.
First, download and unpack the installer:

```bash
wget -q https://install.superplane.com/superplane-single-host.tar.gz
tar -xf superplane-single-host.tar.gz
cd superplane
```

Then run the installer:

```bash
./install
```

This downloads the single‑host bundle, extracts it, and runs the installer.
The installer sets up the Docker Compose stack and starts SuperPlane on your
server.

## SSL certificates and public access

Because SuperPlane needs to connect to external integrations and receive
webhooks, your server must be reachable from the public internet.

During installation, SuperPlane automatically:

- Issues an SSL certificate for your configured domain.
- Renews the certificate so HTTPS continues to work over time.

Ensure your firewall allows inbound traffic on ports 80 and 443 so
certificate issuance and HTTPS access can succeed.

## 6. Set up full disk backups

To protect your SuperPlane instance, enable full disk backups for your
Hetzner server.

In the Hetzner Cloud Console:

1. Open your project and go to the **Servers** view.
2. Click your SuperPlane server to open its details.
3. Go to the **Backups** section.
4. Enable backups for the server.

Hetzner will now create regular full disk backups of your server’s root
volume. You can use these backups to restore the entire server to an earlier
state if something goes wrong.
