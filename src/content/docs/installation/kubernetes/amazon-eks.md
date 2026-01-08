---
title: Install on Amazon EKS
description: Run SuperPlane on an Amazon Elastic Kubernetes Service (EKS) cluster with RDS PostgreSQL.
---

This guide describes how to deploy SuperPlane to Amazon EKS using Terraform.

## Prerequisites

- An AWS account with permissions to create EKS, RDS, and VPC resources
- [Terraform][terraform-install] >= 1.5.0
- [AWS CLI][aws-cli-install] installed and configured
- [`kubectl`][kubectl-install] installed

## Step 1: Clone and Configure Terraform

```bash
git clone https://github.com/superplanehq/superplane-k8s-installation
cd superplane-k8s-installation/eks
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
domain_name       = "superplane.example.com"
letsencrypt_email = "admin@example.com"
```

### Configuration Options

| Variable               | Description                | Default        |
| ---------------------- | -------------------------- | -------------- |
| `domain_name`          | Domain name for SuperPlane | (required)     |
| `letsencrypt_email`    | Email for Let's Encrypt    | (required)     |
| `region`               | AWS region                 | `us-east-1`    |
| `cluster_name`         | EKS cluster name           | `superplane`   |
| `node_count`           | Number of EKS nodes        | `2`            |
| `instance_type`        | EKS node instance type     | `t3.medium`    |
| `db_instance_class`    | RDS instance class         | `db.t3.medium` |
| `superplane_image_tag` | SuperPlane image tag       | `stable`       |

## Step 2: Deploy

```bash
terraform init
terraform apply
```

The deployment takes 15-20 minutes and creates:

- VPC with public and private subnets
- EKS cluster with node group
- RDS PostgreSQL instance
- AWS Load Balancer Controller
- cert-manager with Let's Encrypt
- SuperPlane deployment

## Step 3: Configure kubectl

```bash
aws eks update-kubeconfig --region us-east-1 --name superplane
```

## Step 4: Configure DNS

Get the ALB DNS name:

```bash
kubectl get ingress -n superplane
```

Create a CNAME record in your DNS provider:

- **Type:** CNAME
- **Name:** Your subdomain (e.g., `superplane`)
- **Value:** The ALB DNS name from the command above

## Step 5: Verify

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
aws rds modify-db-instance \
  --db-instance-identifier superplane-db \
  --no-deletion-protection \
  --apply-immediately

# Wait for modification to complete
aws rds wait db-instance-available --db-instance-identifier superplane-db

# Destroy all resources
terraform destroy
```

[terraform-install]: https://www.terraform.io/downloads
[kubectl-install]: https://kubernetes.io/docs/tasks/tools/
[aws-cli-install]: https://aws.amazon.com/cli/
