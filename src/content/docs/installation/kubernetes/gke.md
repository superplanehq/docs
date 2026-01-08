---
title: Install on Google Kubernetes Engine
description: Run SuperPlane on a Google Kubernetes Engine (GKE) cluster with Cloud SQL PostgreSQL.
---

This guide describes how to deploy SuperPlane to Google Kubernetes Engine (GKE)
using Terraform.

## Prerequisites

- A GCP project with billing enabled
- [Terraform][terraform-install] >= 1.5.0
- [`gcloud` CLI][gcloud-install] installed and authenticated
- [`kubectl`][kubectl-install] installed

## Step 1: Authenticate with GCP

```bash
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

## Step 2: Create Static IP Address

Create a global static IP address for the ingress:

```bash
gcloud compute addresses create superplane-ip --global --ip-version=IPV4
```

Get the reserved IP address:

```bash
gcloud compute addresses describe superplane-ip --global --format='get(address)'
```

## Step 3: Configure DNS

Create an A record in your DNS provider pointing to the static IP:

- **Type:** A
- **Name:** Your subdomain (e.g., `superplane`)
- **Value:** The static IP address from Step 2

Wait for DNS propagation and verify:

```bash
dig superplane.example.com +short
```

## Step 4: Clone and Configure Terraform

```bash
git clone https://github.com/superplanehq/superplane-k8s-installation
cd superplane-k8s-installation/gke
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
project_id        = "my-gcp-project"
domain_name       = "superplane.example.com"
static_ip_name    = "superplane-ip"
letsencrypt_email = "admin@example.com"
```

### Configuration Options

| Variable               | Description                   | Default         |
| ---------------------- | ----------------------------- | --------------- |
| `project_id`           | GCP project ID                | (required)      |
| `domain_name`          | Domain name for SuperPlane    | (required)      |
| `static_ip_name`       | Name of pre-created static IP | (required)      |
| `letsencrypt_email`    | Email for Let's Encrypt       | (required)      |
| `region`               | GCP region                    | `us-central1`   |
| `zone`                 | GCP zone                      | `us-central1-a` |
| `cluster_name`         | GKE cluster name              | `superplane`    |
| `node_count`           | Number of GKE nodes           | `2`             |
| `machine_type`         | GKE node machine type         | `e2-medium`     |
| `superplane_image_tag` | SuperPlane image tag          | `stable`        |

## Step 5: Deploy

```bash
terraform init
terraform apply
```

The deployment takes 15-20 minutes and creates:

- GKE cluster
- Cloud SQL PostgreSQL instance with VPC peering
- Kubernetes secrets
- cert-manager with Let's Encrypt
- SuperPlane deployment

## Step 6: Verify

Configure kubectl:

```bash
gcloud container clusters get-credentials superplane --zone=us-central1-a \
  --project=YOUR_PROJECT_ID
```

Check pods and ingress:

```bash
kubectl get pods -n superplane
kubectl get ingress -n superplane
```

Check SSL certificate status:

```bash
kubectl get certificate -n superplane
```

Once the certificate shows `Ready`, access SuperPlane at `https://your-domain.com`.

## Updating

Modify `superplane_image_tag` in `terraform.tfvars` and apply:

```bash
terraform apply
```

## Uninstalling

```bash
# Disable deletion protection on the database
gcloud sql instances patch superplane-db --no-deletion-protection

# Destroy all resources
terraform destroy

# Delete the static IP
gcloud compute addresses delete superplane-ip --global
```

[terraform-install]: https://www.terraform.io/downloads
[kubectl-install]: https://kubernetes.io/docs/tasks/tools/
[gcloud-install]: https://cloud.google.com/sdk/docs/install
