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

## Step 2: Clone and Configure Terraform

If you already have the SuperPlane repo checked out, the Terraform configuration lives in `superplane-terraform/eks`. Otherwise, clone it:

```bash
git clone https://github.com/superplanehq/superplane-terraform
```

Then:

```bash
cd superplane-terraform/eks
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

## Step 3: Deploy

```bash
terraform init
terraform apply
```

The deployment takes 15-20 minutes and creates:

- VPC with public and private subnets
- EKS cluster with node group
- RDS PostgreSQL instance
- Network Load Balancer
- NGINX Ingress Controller
- cert-manager with Let's Encrypt
- SuperPlane deployment

### Troubleshooting deploy

#### Helm release failed or timed out

If Terraform reports a failed Helm release or `context deadline exceeded`, inspect the release and pods:

```bash
helm -n superplane status superplane
kubectl get pods -n superplane
kubectl describe pod -n superplane
kubectl logs -n superplane --all-containers --tail=200
```

Fix the underlying error (for example, image pull failures or database connectivity) and rerun:

```bash
terraform apply
```

## Step 4: Configure kubectl

```bash
aws eks update-kubeconfig --region us-east-1 --name superplane
```

## Step 5: Configure DNS

Get the Load Balancer hostname:

```bash
kubectl get svc -n ingress-nginx ingress-nginx-controller \
  -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

Create a CNAME record in your DNS provider:

- **Type:** CNAME
- **Name:** Your subdomain (e.g., `superplane`)
- **Value:** The hostname from the command above

Wait for DNS propagation:

```bash
dig superplane.example.com +short
```

## Step 6: Verify

Check pods and certificate status:

```bash
kubectl get pods -n superplane
kubectl get certificate -n superplane
```

Once the certificate shows `Ready`, access SuperPlane at `https://your-domain.com`.

:::note
Certificate issuance may take 5-10 minutes after DNS propagation completes.
:::

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

### Troubleshooting destroy

If `terraform destroy` fails, resolve the issue and rerun `terraform destroy`.

#### Helm uninstall kept cert-manager CRDs

Helm keeps cert-manager CRDs due to a resource policy. If the destroy is blocked or times out, remove them manually:

```bash
kubectl delete crd \
  challenges.acme.cert-manager.io \
  orders.acme.cert-manager.io \
  certificaterequests.cert-manager.io \
  certificates.cert-manager.io \
  clusterissuers.cert-manager.io \
  issuers.cert-manager.io
```

#### RDS final snapshot already exists

RDS will fail to delete the DB if a snapshot with the final snapshot identifier already exists. Delete the snapshot, then rerun destroy:

```bash
aws rds delete-db-snapshot \
  --db-snapshot-identifier superplane-db-final-snapshot
```

#### Internet gateway detach dependency violation

If the internet gateway cannot detach because the VPC still has mapped public addresses, release the remaining elastic IPs (or delete dependent resources such as NAT gateways or load balancers), then rerun destroy:

```bash
aws ec2 describe-addresses --filters Name=domain,Values=vpc

aws ec2 disassociate-address --association-id eipassoc-xxxxxxxx
aws ec2 release-address --allocation-id eipalloc-xxxxxxxx
```

[terraform-install]: https://www.terraform.io/downloads
[kubectl-install]: https://kubernetes.io/docs/tasks/tools/
[aws-cli-install]: https://aws.amazon.com/cli/
