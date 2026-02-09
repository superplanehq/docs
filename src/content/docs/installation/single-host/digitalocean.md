---
title: Single Host Installation on DigitalOcean
description: Install SuperPlane on a single DigitalOcean Droplet.
---

This guide walks you through setting up a new DigitalOcean Droplet from
scratch and installing SuperPlane using the single-host installer.

## 1. Create a DigitalOcean Droplet

1. Sign in to the
   [DigitalOcean Control Panel](https://cloud.digitalocean.com/).
2. Click **Create → Droplets**.
3. Configure your Droplet:
   - Choose a region close to you.
   - Select an Ubuntu LTS image (for example Ubuntu 22.04).
   - Pick a Basic Droplet with 2 vCPUs and 4 GB RAM.
   - Add SSH keys so you can log in securely.
4. Create the Droplet and note its public IPv4 address.

At this point you have a Linux server that is reachable from the internet.

## 2. Point your domain to the Droplet

1. In your DNS provider (DigitalOcean DNS or another provider), create an
   `A` record for your domain or subdomain (for example
   `superplane.example.com`).
2. Point the `A` record to the public IP of your Droplet.
3. Wait for DNS to propagate (usually a few minutes).

SuperPlane will use this domain to issue and maintain an SSL certificate.

## 3. Open required ports with Cloud Firewalls

In the DigitalOcean Control Panel:

1. Go to **Networking → Firewalls**.
2. Create a new firewall (or edit an existing one).
3. Under **Inbound rules**, allow:
   - TCP port 22 (SSH)
   - TCP port 80 (HTTP, for certificate issuance)
   - TCP port 443 (HTTPS, for SuperPlane)
4. Under **Apply to Droplets**, select your SuperPlane Droplet.
5. Save the firewall.

## 4. Install Docker and Docker Compose

SSH into your Droplet using the IP or domain:

```bash
ssh root@your-droplet-ip-or-domain
```

On the Droplet, install Docker and Docker Compose. For example, on
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

You now have a DigitalOcean Droplet with Docker and Docker Compose installed,
reachable from the internet at your chosen domain.

## 5. Install SuperPlane

With Docker set up, install SuperPlane using the single-host installer.
First, download and unpack the installer:

```bash
wget -q https://install.superplane.com/superplane-single-host.tar.gz
tar -xf superplane-single-host.tar.gz
cd superplane
```

Then run the installer:

```bash
./install.sh
```

This downloads the single-host bundle, extracts it, and runs the installer.
The installer sets up the Docker Compose stack and starts SuperPlane on your
Droplet.

## SSL certificates and public access

Because SuperPlane needs to connect to external integrations and receive
webhooks, your Droplet must be reachable from the public internet.

During installation, SuperPlane automatically:

- Issues an SSL certificate for your configured domain.
- Renews the certificate so HTTPS continues to work over time.

Ensure your firewall allows inbound traffic on ports 80 and 443 so
certificate issuance and HTTPS access can succeed.

## 6. Enable automatic backups

To protect your SuperPlane instance, enable automatic backups for your
Droplet.

In the DigitalOcean Control Panel:

1. Go to **Droplets** and click your SuperPlane Droplet.
2. Open the **Backups** tab.
3. Enable backups for the Droplet.

DigitalOcean will now create regular full disk backups of your Droplet. You
can use these backups to restore the entire Droplet to an earlier state if
something goes wrong.

## Updating SuperPlane

1. Check the [GitHub releases][github-releases] for the latest version tag.
2. Edit `docker-compose.yml` and update the `image` field with the new tag.
3. Restart the stack:

```
docker compose pull
docker compose up -d
```

[github-releases]: https://github.com/superplanehq/superplane/releases

[github-releases]: https://github.com/superplanehq/superplane/releases
