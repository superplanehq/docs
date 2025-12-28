---
title: Single Host Installation on GCP Compute Engine
description: Install SuperPlane on a single Google Compute Engine VM.
---

This guide walks you through setting up a new Google Compute Engine virtual
machine from scratch and installing SuperPlane using the single-host
installer.

## 1. Create a Compute Engine VM

1. Sign in to the
   [Google Cloud Console](https://console.cloud.google.com/).
2. Select or create a project.
3. Go to **Compute Engine → VM instances** and click **Create instance**.
4. Configure your VM:
   - Choose a region and zone close to you.
   - Under **Machine configuration**, pick a machine type such as
     `e2-medium` (2 vCPUs, 4 GB memory).
   - Under **Boot disk**, select an Ubuntu LTS image (for example Ubuntu
     22.04 LTS).
   - Under **Firewall**, check **Allow HTTP traffic** and
     **Allow HTTPS traffic**.
5. Click **Create** and note the external IP address of the VM.

At this point you have a Linux server that is reachable from the internet.

## 2. Point your domain to the VM

1. In your DNS provider (Cloud DNS or another provider), create an `A`
   record for your domain or subdomain (for example
   `superplane.example.com`).
2. Point the `A` record to the external IP of your VM.
3. Wait for DNS to propagate (usually a few minutes).

SuperPlane will use this domain to issue and maintain an SSL certificate.

## 3. Verify firewall rules

In the Google Cloud Console:

1. Go to **VPC network → Firewall**.
2. Ensure there are rules that allow:
   - TCP port 22 (SSH) to your VM.
   - TCP port 80 (HTTP) to your VM.
   - TCP port 443 (HTTPS) to your VM.

The **Allow HTTP traffic** and **Allow HTTPS traffic** options you selected
when creating the VM typically create these rules automatically.

## 4. Install Docker and Docker Compose

SSH into your VM using the external IP or domain. For Ubuntu images, the
default user is usually `ubuntu`:

```bash
gcloud compute ssh your-instance-name --zone your-zone
```

or using plain SSH:

```bash
ssh ubuntu@your-vm-external-ip-or-domain
```

On the VM, install Docker and Docker Compose. For example, on Ubuntu:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) \
  signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
```

You now have a Compute Engine VM with Docker and Docker Compose installed,
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
./install
```

This downloads the single-host bundle, extracts it, and runs the installer.
The installer sets up the Docker Compose stack and starts SuperPlane on your
VM.

## SSL certificates and public access

Because SuperPlane needs to connect to external integrations and receive
webhooks, your VM must be reachable from the public internet.

During installation, SuperPlane automatically:

- Issues an SSL certificate for your configured domain.
- Renews the certificate so HTTPS continues to work over time.

Ensure your firewall allows inbound traffic on ports 80 and 443 so
certificate issuance and HTTPS access can succeed.

## 6. Enable disk snapshots

To protect your SuperPlane instance, create regular snapshots of the boot
disk.

In the Google Cloud Console:

1. Go to **Compute Engine → Disks**.
2. Find the boot disk attached to your SuperPlane VM.
3. Click the disk name to open its details.
4. Click **Create snapshot** to create a snapshot of the disk.

You can use these snapshots to restore the disk, or create a new VM with the
same data if something goes wrong.
