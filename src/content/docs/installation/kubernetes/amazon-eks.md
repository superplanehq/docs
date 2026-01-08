---
title: Install on Amazon EKS
description: Run SuperPlane on an Amazon Elastic Kubernetes Service (EKS) cluster with RDS PostgreSQL.
---

This guide describes how to deploy SuperPlane to Amazon EKS using Terraform.

## Prerequisites

- An AWS account with permissions to create EKS, RDS, and VPC resources
- [Terraform][terraform-install] >= 1.5.0
- [AWS CLI][aws-cli-install] installed
- [`kubectl`][kubectl-install] installed

## Step 1: Configure AWS CLI

Configure the AWS CLI with your credentials:

```bash
aws configure
```

You will be prompted to enter:

- **AWS Access Key ID:** Your access key
- **AWS Secret Access Key:** Your secret key
- **Default region name:** e.g., `us-east-1`
- **Default output format:** `json` (recommended)

Verify the configuration:

```bash
aws sts get-caller-identity
```

## Step 2: Create Static IP Address

Create an Elastic IP for the load balancer:

```bash
aws ec2 allocate-address --domain vpc --tag-specifications \
  'ResourceType=elastic-ip,Tags=[{Key=Name,Value=superplane-ip}]'
```

Get the allocation ID and static IP address:

```bash
aws ec2 describe-addresses --filters "Name=tag:Name,Values=superplane-ip" \
  --query 'Addresses[0].[AllocationId,PublicIp]' --output text
```

Save both values — you'll need the allocation ID for Terraform and the IP for DNS.

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
git clone https://github.com/superplanehq/superplane-terraform
cd superplane-terraform/eks
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
domain_name       = "superplane.example.com"
eip_allocation_id = "eipalloc-xxxxxxxxxxxxxxxxx"
```

### Configuration Options

| Variable               | Description                      | Default        |
| ---------------------- | -------------------------------- | -------------- |
| `domain_name`          | Domain name for SuperPlane       | (required)     |
| `eip_allocation_id`    | Elastic IP allocation ID         | (required)     |
| `region`               | AWS region                       | `us-east-1`    |
| `cluster_name`         | EKS cluster name                 | `superplane`   |
| `node_count`           | Number of EKS nodes              | `2`            |
| `instance_type`        | EKS node instance type           | `t3.medium`    |
| `db_instance_class`    | RDS instance class               | `db.t3.medium` |
| `superplane_image_tag` | SuperPlane image tag             | `stable`       |

## Step 5: Deploy

```bash
terraform init
terraform apply
```

The deployment takes 15-20 minutes and creates:

- VPC with public and private subnets
- EKS cluster with node group
- RDS PostgreSQL instance
- Network Load Balancer with Elastic IP
- ACM certificate for TLS
- SuperPlane deployment

## Step 6: Validate ACM Certificate

After the deployment, Terraform will output the DNS records needed to validate the ACM
certificate. Create a CNAME record in your DNS provider with the provided values.

Get the validation records:

```bash
terraform output acm_certificate_validation_records
```

Create the CNAME record in your DNS provider, then wait for validation to complete
(this typically takes a few minutes).

## Step 7: Configure kubectl

```bash
aws eks update-kubeconfig --region us-east-1 --name superplane
```

## Step 8: Verify

Check pods and load balancer:

```bash
kubectl get pods -n superplane
kubectl get svc -n superplane superplane-nlb
```

Once the load balancer is ready, access SuperPlane at `https://your-domain.com`.

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

# Release the Elastic IP
aws ec2 release-address --allocation-id eipalloc-xxxxxxxxxxxxxxxxx
```

[terraform-install]: https://www.terraform.io/downloads
[kubectl-install]: https://kubernetes.io/docs/tasks/tools/
[aws-cli-install]: https://aws.amazon.com/cli/
