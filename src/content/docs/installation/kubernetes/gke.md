---
title: Install on Google Kubernetes Engine
description: Run SuperPlane on a Google Kubernetes Engine (GKE) cluster with Cloud SQL for PostgreSQL.
---

This guide describes how to deploy SuperPlane to a Google Kubernetes Engine
(GKE) cluster using Helm charts, with a managed PostgreSQL database on Cloud
SQL.

## Prerequisites

Before you begin, ensure you have:

- A GKE cluster running Kubernetes 1.24 or later
- `kubectl` configured to connect to your cluster
- [Helm 3.x installed][helm-install]
- `gcloud` CLI installed and authenticated
- A Cloud SQL for PostgreSQL instance (or permission to create one)
- The Cloud SQL Proxy sidecar image available in your cluster

## Step 1: Create a Cloud SQL PostgreSQL Instance

If you don't already have a Cloud SQL instance, create one:

```bash
gcloud sql instances create superplane-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=YOUR_SECURE_PASSWORD
```

Replace `YOUR_SECURE_PASSWORD` with a strong password. Note the instance
connection name, which you'll need later. It follows the format:
`PROJECT_ID:REGION:INSTANCE_NAME`.

Create a database for SuperPlane:

```bash
gcloud sql databases create superplane \
  --instance=superplane-db
```

## Step 2: Create a Database User

Create a dedicated database user:

```bash
gcloud sql users create superplane \
  --instance=superplane-db \
  --password=YOUR_DB_PASSWORD
```

Replace `YOUR_DB_PASSWORD` with a secure password for the database user.

## Step 3: Enable Cloud SQL Admin API

Enable the Cloud SQL Admin API if it's not already enabled:

```bash
gcloud services enable sqladmin.googleapis.com
```

## Step 4: Create a Service Account

Create a service account for the Cloud SQL Proxy:

```bash
gcloud iam service-accounts create superplane-cloudsql \
  --display-name="SuperPlane Cloud SQL Proxy"
```

Grant the service account the Cloud SQL Client role:

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:superplane-cloudsql@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

Replace `PROJECT_ID` with your GCP project ID.

## Step 5: Create Kubernetes Secrets

Create a Kubernetes secret for the database credentials:

```bash
kubectl create secret generic superplane-db-credentials \
  --from-literal=host='127.0.0.1' \
  --from-literal=port='5432' \
  --from-literal=database='superplane' \
  --from-literal=username='superplane' \
  --from-literal=password='YOUR_DB_PASSWORD'
```

Replace `YOUR_DB_PASSWORD` with the password you set for the database user.

Create a secret for the Cloud SQL service account key:

```bash
gcloud iam service-accounts keys create key.json \
  --iam-account=superplane-cloudsql@PROJECT_ID.iam.gserviceaccount.com

kubectl create secret generic superplane-cloudsql-key \
  --from-file=service-account.json=key.json

rm key.json
```

Replace `PROJECT_ID` with your GCP project ID.

## Step 6: Add the Helm Repository

Add the SuperPlane Helm chart repository:

```bash
helm repo add superplane https://superplanehq.github.io/helm-chart
helm repo update
```

## Step 7: Create a Values File

Create a `values.yaml` file for your deployment:

```yaml
# Database configuration
database:
  host: "127.0.0.1" # Cloud SQL Proxy connects via localhost
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

# Cloud SQL Proxy configuration
cloudSqlProxy:
  enabled: true
  instanceConnectionName: "PROJECT_ID:REGION:superplane-db"
  serviceAccountSecret: "superplane-cloudsql-key"
  serviceAccountKey: "service-account.json"

# Application configuration
image:
  repository: ghcr.io/superplanehq/superplane
  tag: "stable"
  pullPolicy: IfNotPresent

# Service configuration
service:
  type: LoadBalancer
  port: 3000
```

Replace:

- `PROJECT_ID` with your GCP project ID
- `REGION` with the region where your Cloud SQL instance is located

## Step 8: Install SuperPlane

Install SuperPlane using Helm:

```bash
helm install superplane superplane/superplane \
  --namespace superplane \
  --create-namespace \
  -f values.yaml
```

## Step 9: Verify the Installation

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

The `EXTERNAL-IP` of the LoadBalancer service is your SuperPlane URL.

## Step 10: Configure Cloud SQL Proxy (if not using sidecar)

If your Helm chart doesn't include Cloud SQL Proxy as a sidecar, you can
deploy it separately. First, get your instance connection name:

```bash
gcloud sql instances describe superplane-db \
  --format="value(connectionName)"
```

Then deploy the Cloud SQL Proxy as a sidecar or separate deployment using
the connection name and service account credentials.

## Troubleshooting

### Pods not starting

Check pod logs for database connection errors:

```bash
kubectl logs -n superplane -l app=superplane
```

### Database connection issues

Verify the Cloud SQL Proxy is running and can connect:

```bash
kubectl logs -n superplane -l app=cloudsql-proxy
```

Ensure your GKE cluster has the necessary permissions and network access
to Cloud SQL.

### Service account permissions

Verify the service account has the correct IAM role:

```bash
gcloud projects get-iam-policy PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:superplane-cloudsql@PROJECT_ID.iam.gserviceaccount.com"
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

Note: This does not delete your Cloud SQL instance. To remove it:

```bash
gcloud sql instances delete superplane-db
```

[helm-install]: https://helm.sh/docs/intro/install/
