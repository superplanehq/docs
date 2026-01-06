---
title: Install on Google Kubernetes Engine
description: Run SuperPlane on a Google Kubernetes Engine (GKE) cluster with Cloud SQL for PostgreSQL.
---

This guide describes how to deploy SuperPlane to a Google Kubernetes Engine
(GKE) cluster using Helm charts, with a managed PostgreSQL database on Cloud
SQL.

## Prerequisites

Before you begin, ensure you have:

- [`kubectl` installed][kubectl-install]
- [Helm 4.x installed][helm-install]
- [`gcloud` CLI installed and authenticated][gcloud-install]
- Permission to create GKE clusters, Cloud SQL instances, and service accounts
- A GCP project with billing enabled

## Verify Required Permissions

Before proceeding, verify that you have the necessary permissions to create Cloud
SQL instances and service accounts. You'll need the following IAM roles:

- `roles/container.admin` - To create and manage GKE clusters
- `roles/cloudsql.admin` - To create and manage Cloud SQL instances
- `roles/iam.serviceAccountAdmin` - To create service accounts
- `roles/iam.serviceAccountUser` - To bind service accounts (if using Workload Identity)

### Check Your Current Permissions

Check which project you're using:

```bash
gcloud config get-value project
```

Verify your current IAM roles for the project:

```bash
gcloud projects get-iam-policy $(gcloud config get-value project) \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:$(gcloud config get-value account)" \
  --format="table(bindings.role)"
```

## Step 1: Set Project Variables

First, export your GCP project ID as a variable:

```bash
export PROJECT_ID=$(gcloud config get-value project)
```

Verify the project ID is set correctly:

```bash
echo $PROJECT_ID
```

If you need to use a different project, set it explicitly:

```bash
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID
```

Set variables for your cluster configuration:

```bash
export CLUSTER_NAME="superplane-cluster"
export REGION="us-central1"  # or your preferred region
export ZONE="us-central1-a"  # or your preferred zone
```

## Step 2: Enable Required APIs

Enable the required Google Cloud APIs:

```bash
gcloud services enable \
  container.googleapis.com \
  sqladmin.googleapis.com \
  iam.googleapis.com
```

This may take a few minutes. You'll see prompts asking for confirmation - type `y`
to proceed.

## Step 3: Create a GKE Cluster

Create a GKE cluster with Workload Identity enabled. This is the recommended
configuration for secure authentication:

```bash
gcloud container clusters create $CLUSTER_NAME \
  --region=$REGION \
  --num-nodes=2 \
  --machine-type=e2-medium \
  --enable-workload-identity \
  --workload-pool=$PROJECT_ID.svc.id.goog \
  --release-channel=regular \
  --cluster-version=1.31
```

This command creates a regional cluster with:

- 2 nodes per zone (for high availability)
- `e2-medium` machine type (adjust based on your needs)
- Workload Identity enabled (required for secure Cloud SQL access)
- Kubernetes version 1.31

The cluster creation may take 5-10 minutes. You can monitor progress in the
Google Cloud Console or wait for the command to complete.

### Alternative: Create a Zonal Cluster

If you prefer a zonal cluster (single zone, lower cost), use:

```bash
gcloud container clusters create $CLUSTER_NAME \
  --zone=$ZONE \
  --num-nodes=2 \
  --machine-type=e2-medium \
  --enable-workload-identity \
  --workload-pool=$PROJECT_ID.svc.id.goog \
  --release-channel=regular \
  --cluster-version=1.31
```

### Configure kubectl

After the cluster is created, configure `kubectl` to connect to it:

```bash
gcloud container clusters get-credentials $CLUSTER_NAME --region=$REGION
```

If you created a zonal cluster, use:

```bash
gcloud container clusters get-credentials $CLUSTER_NAME --zone=$ZONE
```

Verify the connection:

```bash
kubectl get nodes
```

You should see your cluster nodes listed.

## Step 4: Enable Cloud SQL Admin API

Enable the Cloud SQL Admin API. This is required before you can create Cloud
SQL instances:

```bash
gcloud services enable sqladmin.googleapis.com
```

This may take a few minutes to complete. You'll see a prompt asking for
confirmation - type `y` to proceed.

## Step 5: Set Database Password

Export a variable with a secure password for your database:

```bash
export DB_PASSWORD="your-secure-password-here"
```

Replace `your-secure-password-here` with a strong password. This password will
be used for both the Cloud SQL root user and the SuperPlane database user.

## Step 6: Create a Cloud SQL PostgreSQL Instance

If you don't already have a Cloud SQL instance, create one:

```bash
gcloud sql instances create superplane-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=$DB_PASSWORD
```

Note the instance
connection name, which you'll need later. It follows the format:
`PROJECT_ID:REGION:INSTANCE_NAME`.

Create a database for SuperPlane:

```bash
gcloud sql databases create superplane \
  --instance=superplane-db
```

## Step 7: Create a Database User

Create a dedicated database user:

```bash
gcloud sql users create superplane \
  --instance=superplane-db \
  --password=$DB_PASSWORD
```

## Step 8: Create a GCP Service Account

Create a Google Cloud service account for the Cloud SQL Proxy:

```bash
gcloud iam service-accounts create superplane-cloudsql \
  --display-name="SuperPlane Cloud SQL Proxy"
```

Grant the service account the Cloud SQL Client role:

```bash
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:superplane-cloudsql@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

## Step 9: Create Kubernetes Service Account and Bind to GCP Service Account

Create a Kubernetes service account in the namespace where SuperPlane will run:

```bash
kubectl create namespace superplane
kubectl create serviceaccount superplane-ksa \
  --namespace superplane
```

Bind the Kubernetes service account to the Google Cloud service account:

```bash
gcloud iam service-accounts add-iam-policy-binding \
  superplane-cloudsql@$PROJECT_ID.iam.gserviceaccount.com \
  --role roles/iam.workloadIdentityUser \
  --member "serviceAccount:$PROJECT_ID.svc.id.goog[superplane/superplane-ksa]"
```

Annotate the Kubernetes service account with the GCP service account email:

```bash
kubectl annotate serviceaccount superplane-ksa \
  --namespace superplane \
  iam.gke.io/gcp-service-account=superplane-cloudsql@$PROJECT_ID.iam.gserviceaccount.com
```

## Step 10: Create Kubernetes Secrets

Create a Kubernetes secret for the database credentials:

```bash
kubectl create secret generic superplane-db-credentials \
  --namespace superplane \
  --from-literal=host='127.0.0.1' \
  --from-literal=port='5432' \
  --from-literal=database='superplane' \
  --from-literal=username='superplane' \
  --from-literal=password="$DB_PASSWORD"
```

## Step 11: Add the Helm Repository

Add the SuperPlane Helm chart repository:

```bash
helm repo add superplane https://superplanehq.github.io/helm-chart
helm repo update
```

## Step 12: Create a Values File

First, get your Cloud SQL instance connection name:

```bash
export INSTANCE_CONNECTION_NAME=$(gcloud sql instances describe superplane-db \
  --format="value(connectionName)")
echo $INSTANCE_CONNECTION_NAME
```

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
  instanceConnectionName: "INSTANCE_CONNECTION_NAME"
  # Use Workload Identity (no service account key needed)
  useWorkloadIdentity: true
  serviceAccountName: "superplane-ksa"

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

Replace `INSTANCE_CONNECTION_NAME` with the connection name from the command
above (it will be in the format `PROJECT_ID:REGION:superplane-db`). You can
also use a command to create the file directly:

```bash
cat > values.yaml <<EOF
# Database configuration
database:
  host: "127.0.0.1"
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
  instanceConnectionName: "$INSTANCE_CONNECTION_NAME"
  # Use Workload Identity (no service account key needed)
  useWorkloadIdentity: true
  serviceAccountName: "superplane-ksa"

# Application configuration
image:
  repository: ghcr.io/superplanehq/superplane
  tag: "stable"
  pullPolicy: IfNotPresent

# Service configuration
service:
  type: LoadBalancer
  port: 3000
EOF
```

## Step 13: Install SuperPlane

Install SuperPlane using Helm:

```bash
helm install superplane superplane/superplane \
  --namespace superplane \
  --create-namespace \
  -f values.yaml
```

## Step 14: Verify the Installation

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
gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:superplane-cloudsql@$PROJECT_ID.iam.gserviceaccount.com"
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

### Remove Cloud SQL Instance

To remove the Cloud SQL instance:

```bash
gcloud sql instances delete superplane-db
```

### Remove GKE Cluster (Optional)

If you want to remove the entire GKE cluster:

```bash
gcloud container clusters delete $CLUSTER_NAME --region=$REGION
```

If you created a zonal cluster:

```bash
gcloud container clusters delete $CLUSTER_NAME --zone=$ZONE
```

This will permanently delete the cluster and all its resources. Make sure you
have backups of any important data before proceeding.

[helm-install]: https://helm.sh/docs/intro/install/
[kubectl-install]: https://kubernetes.io/docs/tasks/tools/
[gcloud-install]: https://cloud.google.com/sdk/docs/install
[workload-identity]: https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity
