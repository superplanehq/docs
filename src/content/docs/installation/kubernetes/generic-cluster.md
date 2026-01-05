---
title: Install on a Generic Kubernetes Cluster
description: Run SuperPlane on a generic Kubernetes cluster using Helm charts.
---

This guide describes how to deploy SuperPlane to any Kubernetes cluster using
Helm charts. This works with managed Kubernetes services (GKE, EKS, AKS) or
self-managed clusters.

## Prerequisites

Before you begin, ensure you have:

- A Kubernetes cluster running version 1.24 or later
- `kubectl` configured to connect to your cluster
- [Helm 3.x installed][helm-install]
- A PostgreSQL database (managed or self-hosted) accessible from your cluster
- Network connectivity between your cluster and the database

## Step 1: Set Up PostgreSQL

You need a PostgreSQL database for SuperPlane. You can use:

- A managed database service (Cloud SQL, RDS, Azure Database, etc.)
- A self-hosted PostgreSQL instance
- An in-cluster PostgreSQL (not recommended for production)

For production deployments, use a managed database service. Ensure the
database is accessible from your Kubernetes cluster and create:

1. A database named `superplane` (or your preferred name)
2. A database user with appropriate permissions
3. Network rules allowing connections from your cluster

## Step 2: Create Kubernetes Secrets

Create a Kubernetes secret for the database credentials:

```bash
kubectl create secret generic superplane-db-credentials \
  --from-literal=host='YOUR_DB_HOST' \
  --from-literal=port='5432' \
  --from-literal=database='superplane' \
  --from-literal=username='YOUR_DB_USER' \
  --from-literal=password='YOUR_DB_PASSWORD'
```

Replace:
- `YOUR_DB_HOST` with your database hostname or IP address
- `YOUR_DB_USER` with your database username
- `YOUR_DB_PASSWORD` with your database password

## Step 3: Add the Helm Repository

Add the SuperPlane Helm chart repository:

```bash
helm repo add superplane https://superplanehq.github.io/helm-chart
helm repo update
```

## Step 4: Create a Values File

Create a `values.yaml` file for your deployment:

```yaml
# Database configuration
database:
  host: "YOUR_DB_HOST"
  port: 5432
  name: "superplane"
  user: "YOUR_DB_USER"
  existingSecret: "superplane-db-credentials"
  existingSecretPasswordKey: "password"
  existingSecretUserKey: "username"
  existingSecretDatabaseKey: "database"
  existingSecretHostKey: "host"
  existingSecretPortKey: "port"

# Disable in-cluster PostgreSQL (use external database)
postgresql:
  enabled: false

# Application configuration
image:
  repository: ghcr.io/superplanehq/superplane
  tag: "stable"
  pullPolicy: IfNotPresent

# Service configuration
service:
  type: LoadBalancer  # or ClusterIP, NodePort, etc.
  port: 3000

# Ingress configuration (optional)
ingress:
  enabled: false
  className: "nginx"  # or your ingress controller
  annotations: {}
  hosts:
    - host: superplane.example.com
      paths:
        - path: /
          pathType: Prefix
  tls: []

# Resource limits (adjust as needed)
resources:
  requests:
    cpu: 100m
    memory: 256Mi
  limits:
    cpu: 500m
    memory: 512Mi

# Replica count
replicaCount: 1
```

Replace:
- `YOUR_DB_HOST` with your database hostname
- `YOUR_DB_USER` with your database username
- Adjust other settings based on your cluster configuration

## Step 5: Install SuperPlane

Install SuperPlane using Helm:

```bash
helm install superplane superplane/superplane \
  --namespace superplane \
  --create-namespace \
  -f values.yaml
```

## Step 6: Verify the Installation

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

## Step 7: Access SuperPlane

The access method depends on your service configuration:

### LoadBalancer Service

If using a LoadBalancer service, wait for the external IP to be assigned:

```bash
kubectl get svc -n superplane -w
```

Access SuperPlane at `http://EXTERNAL-IP:3000`.

### NodePort Service

If using a NodePort service, access SuperPlane at
`http://NODE-IP:NODE-PORT`. Get the node port:

```bash
kubectl get svc -n superplane
```

### Ingress

If using ingress, access SuperPlane at the configured hostname. Verify the
ingress:

```bash
kubectl get ingress -n superplane
```

### Port Forward (for testing)

For local testing, use port forwarding:

```bash
kubectl port-forward -n superplane svc/superplane 3000:3000
```

Then access SuperPlane at `http://localhost:3000`.

## Troubleshooting

### Pods not starting

Check pod status and events:

```bash
kubectl describe pod -n superplane -l app=superplane
kubectl logs -n superplane -l app=superplane
```

### Database connection issues

Verify network connectivity from a pod:

```bash
kubectl run -it --rm debug \
  --image=postgres:15 \
  --restart=Never \
  --namespace superplane \
  -- psql -h YOUR_DB_HOST -U YOUR_DB_USER -d superplane
```

### Service not accessible

Check service configuration:

```bash
kubectl describe svc -n superplane
```

Verify endpoints are created:

```bash
kubectl get endpoints -n superplane
```

### Ingress not working

Check ingress status:

```bash
kubectl describe ingress -n superplane
```

Verify your ingress controller is running:

```bash
kubectl get pods -n ingress-nginx  # or your ingress namespace
```

## Updating SuperPlane

To update to a newer version:

```bash
helm repo update
helm upgrade superplane superplane/superplane \
  --namespace superplane \
  -f values.yaml
```

## Configuration Options

The Helm chart supports various configuration options. View available options:

```bash
helm show values superplane/superplane
```

Common configurations include:

- **Image tags**: Use `stable`, `beta`, or specific version tags
- **Resource limits**: Adjust CPU and memory based on your workload
- **Replica count**: Scale horizontally for high availability
- **Service type**: Choose LoadBalancer, ClusterIP, or NodePort
- **Ingress**: Configure ingress for external access with TLS

## Uninstalling

To remove SuperPlane from your cluster:

```bash
helm uninstall superplane --namespace superplane
kubectl delete namespace superplane
```

This removes the SuperPlane deployment but does not delete your database.

[helm-install]: https://helm.sh/docs/intro/install/
