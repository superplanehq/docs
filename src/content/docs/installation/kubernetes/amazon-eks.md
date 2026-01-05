---
title: Install on Amazon EKS
description: Run SuperPlane on an Amazon Elastic Kubernetes Service (EKS) cluster with RDS for PostgreSQL.
---

This guide describes how to deploy SuperPlane to an Amazon EKS cluster using
Helm charts, with a managed PostgreSQL database on Amazon RDS.

## Prerequisites

Before you begin, ensure you have:

- An EKS cluster running Kubernetes 1.31 or later
- [`kubectl` installed and configured][kubectl-install] to connect to your cluster
- [Helm 4.x installed][helm-install]
- [AWS CLI installed and configured][aws-cli-install] with appropriate credentials
- An RDS for PostgreSQL instance (or permission to create one)
- The EKS cluster and RDS instance in the same VPC or with proper network
  connectivity

## Step 1: Create an RDS PostgreSQL Instance

If you don't already have an RDS instance, create one using the AWS CLI:

```bash
aws rds create-db-instance \
  --db-instance-identifier superplane-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username postgres \
  --master-user-password YOUR_SECURE_PASSWORD \
  --allocated-storage 20 \
  --storage-type gp2 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name default \
  --backup-retention-period 7 \
  --publicly-accessible false
```

Replace:

- `YOUR_SECURE_PASSWORD` with a strong password
- `sg-xxxxxxxxx` with your security group ID
- Adjust other parameters as needed for your environment

Wait for the instance to become available:

```bash
aws rds wait db-instance-available --db-instance-identifier superplane-db
```

Get the endpoint address:

```bash
aws rds describe-db-instances \
  --db-instance-identifier superplane-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text
```

## Step 2: Create a Database and User

Connect to your RDS instance and create a database and user:

```bash
PGPASSWORD=YOUR_SECURE_PASSWORD psql \
  -h YOUR_RDS_ENDPOINT \
  -U postgres \
  -d postgres
```

Replace `YOUR_RDS_ENDPOINT` with the endpoint from the previous step.

Inside the PostgreSQL prompt, run:

```sql
CREATE DATABASE superplane;
CREATE USER superplane WITH PASSWORD 'YOUR_DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE superplane TO superplane;
\q
```

Replace `YOUR_DB_PASSWORD` with a secure password for the database user.

## Step 3: Configure Security Groups

Ensure your EKS cluster's security group allows outbound connections to RDS,
and your RDS security group allows inbound connections from the EKS cluster's
security group on port 5432.

Get your EKS cluster's security group:

```bash
aws eks describe-cluster --name CLUSTER_NAME \
  --query 'cluster.resourcesVpcConfig.clusterSecurityGroupId' \
  --output text
```

Add an inbound rule to your RDS security group:

```bash
aws ec2 authorize-security-group-ingress \
  --group-id sg-RDS_SECURITY_GROUP_ID \
  --protocol tcp \
  --port 5432 \
  --source-group sg-EKS_SECURITY_GROUP_ID
```

Replace:

- `sg-RDS_SECURITY_GROUP_ID` with your RDS security group ID
- `sg-EKS_SECURITY_GROUP_ID` with your EKS cluster security group ID

## Step 4: Create Kubernetes Secrets

Create a Kubernetes secret for the database credentials:

```bash
kubectl create secret generic superplane-db-credentials \
  --from-literal=host='YOUR_RDS_ENDPOINT' \
  --from-literal=port='5432' \
  --from-literal=database='superplane' \
  --from-literal=username='superplane' \
  --from-literal=password='YOUR_DB_PASSWORD'
```

Replace:

- `YOUR_RDS_ENDPOINT` with your RDS endpoint address
- `YOUR_DB_PASSWORD` with the password you set for the database user

## Step 5: Add the Helm Repository

Add the SuperPlane Helm chart repository:

```bash
helm repo add superplane https://superplanehq.github.io/helm-chart
helm repo update
```

## Step 6: Create a Values File

Create a `values.yaml` file for your deployment:

```yaml
# Database configuration
database:
  host: "YOUR_RDS_ENDPOINT"
  port: 5432
  name: "superplane"
  user: "superplane"
  existingSecret: "superplane-db-credentials"
  existingSecretPasswordKey: "password"
  existingSecretUserKey: "username"
  existingSecretDatabaseKey: "database"
  existingSecretHostKey: "host"
  existingSecretPortKey: "port"

# Disable in-cluster PostgreSQL
postgresql:
  enabled: false

# Application configuration
image:
  repository: ghcr.io/superplanehq/superplane
  tag: "stable"
  pullPolicy: IfNotPresent

# Service configuration
service:
  type: LoadBalancer
  port: 3000

# Ingress configuration (optional)
ingress:
  enabled: true
  className: "alb"
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
  hosts:
    - host: superplane.example.com
      paths:
        - path: /
          pathType: Prefix
```

Replace `YOUR_RDS_ENDPOINT` with your RDS endpoint address. Adjust the ingress
configuration based on your needs (ALB, NLB, or other ingress controller).

## Step 7: Install SuperPlane

Install SuperPlane using Helm:

```bash
helm install superplane superplane/superplane \
  --namespace superplane \
  --create-namespace \
  -f values.yaml
```

## Step 8: Verify the Installation

Check that all pods are running:

```bash
kubectl get pods -n superplane
```

Wait until all pods show `Running` status. Check the logs if needed:

```bash
kubectl logs -n superplane -l app=superplane
```

Get the service endpoint:

```bash
kubectl get svc -n superplane
```

If using a LoadBalancer service, wait for the `EXTERNAL-IP` to be assigned.
If using ingress, check the ingress resource:

```bash
kubectl get ingress -n superplane
```

## Step 9: Configure Network Policies (Optional)

If you're using Kubernetes network policies, ensure pods in the `superplane`
namespace can connect to RDS on port 5432. Create a network policy:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-rds
  namespace: superplane
spec:
  podSelector: {}
  policyTypes:
    - Egress
  egress:
    - to:
        - namespaceSelector: {}
      ports:
        - protocol: TCP
          port: 5432
```

Apply it:

```bash
kubectl apply -f network-policy.yaml
```

## Troubleshooting

### Pods not starting

Check pod logs for database connection errors:

```bash
kubectl logs -n superplane -l app=superplane
```

### Database connection issues

Verify network connectivity from a pod:

```bash
kubectl run -it --rm debug \
  --image=postgres:15 \
  --restart=Never \
  --namespace superplane \
  -- psql -h YOUR_RDS_ENDPOINT -U superplane -d superplane
```

### Security group issues

Verify security group rules allow traffic:

```bash
aws ec2 describe-security-groups \
  --group-ids sg-RDS_SECURITY_GROUP_ID \
  --query 'SecurityGroups[0].IpPermissions'
```

### RDS endpoint not resolving

Ensure your pods can resolve the RDS endpoint. If using a private endpoint,
verify DNS resolution:

```bash
kubectl run -it --rm debug \
  --image=busybox \
  --restart=Never \
  --namespace superplane \
  -- nslookup YOUR_RDS_ENDPOINT
```

## Updating SuperPlane

To update to a newer version:

```bash
helm repo update
helm upgrade superplane superplane/superplane \
  --namespace superplane \
  -f values.yaml
```

## Uninstalling

To remove SuperPlane from your cluster:

```bash
helm uninstall superplane --namespace superplane
kubectl delete namespace superplane
```

Note: This does not delete your RDS instance. To remove it:

```bash
aws rds delete-db-instance \
  --db-instance-identifier superplane-db \
  --skip-final-snapshot
```

[helm-install]: https://helm.sh/docs/intro/install/
[kubectl-install]: https://kubernetes.io/docs/tasks/tools/
[aws-cli-install]: https://aws.amazon.com/cli/
