---
title: Single Host Installation on AWS EC2
description: Install SuperPlane on a single Amazon EC2 instance.
---

This guide walks you through setting up a new Amazon EC2 instance from
scratch and installing SuperPlane using the single-host installer.

## 1. Create an EC2 instance

1. Sign in to the [AWS Management Console](https://console.aws.amazon.com/).
2. Open the **EC2** service.
3. Click **Launch instance**.
4. Configure your instance:
   - Give it a name (for example `superplane-single-host`).
   - Under **Application and OS Images**, choose an Ubuntu LTS image (for
     example Ubuntu Server 22.04 LTS).
   - Choose an instance type such as `t3.medium` (2 vCPUs, 4 GiB memory).
   - Select or create an SSH key pair so you can log in securely.
5. Under **Network settings**, either create a new security group or use an
   existing one with inbound rules that allow:
   - TCP port 22 (SSH) from your IP.
   - TCP port 80 (HTTP) from the internet.
   - TCP port 443 (HTTPS) from the internet.
6. Launch the instance and note its public IPv4 address or DNS name.

At this point you have a Linux server that is reachable from the internet.

## 2. Point your domain to the instance

1. In your DNS provider (Route 53 or another provider), create an `A` record
   for your domain or subdomain (for example `superplane.example.com`).
2. Point the `A` record to the public IP address of your EC2 instance.
3. Wait for DNS to propagate (usually a few minutes).

SuperPlane will use this domain to issue and maintain an SSL certificate.

Optionally, you can allocate an Elastic IP and associate it with your
instance so its public IP does not change.

## 3. Verify security group rules

In the EC2 console:

1. Go to **Instances** and select your SuperPlane instance.
2. In the **Security** tab, click the attached security group.
3. Under **Inbound rules**, ensure the following rules exist:
   - SSH (TCP 22) from your IP.
   - HTTP (TCP 80) from `0.0.0.0/0`.
   - HTTPS (TCP 443) from `0.0.0.0/0`.

Save any changes you make to the security group.

## 4. Install Docker and Docker Compose

SSH into your EC2 instance using the public DNS name or IP. For Ubuntu
images, the default user is usually `ubuntu`:

```bash
ssh -i /path/to/your-key.pem ubuntu@your-ec2-public-dns
```

On the instance, install Docker and Docker Compose. For example, on
Ubuntu:

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

You now have an EC2 instance with Docker and Docker Compose installed,
reachable from the internet at your chosen domain.

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
instance.

## SSL certificates and public access

Because SuperPlane needs to connect to external integrations and receive
webhooks, your instance must be reachable from the public internet.

During installation, SuperPlane automatically:

- Issues an SSL certificate for your configured domain.
- Renews the certificate so HTTPS continues to work over time.

Ensure your security group allows inbound traffic on ports 80 and 443 so
certificate issuance and HTTPS access can succeed.

## 6. Enable EBS snapshots

To protect your SuperPlane instance, create regular snapshots of the root EBS
volume.

In the EC2 console:

1. Go to **Instances** and select your SuperPlane instance.
2. Open the **Storage** tab and note the root volume ID.
3. Click the volume ID to open it in the **Volumes** view.
4. Click **Actions → Create snapshot** to create a snapshot of the volume.

You can use these snapshots to restore the volume, or create a new instance
with the same data if something goes wrong.
