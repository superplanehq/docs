---
title: Install on Google Kubernetes Engine
description: Run SuperPlane on a Google Kubernetes Engine (GKE) cluster with an external PostgreSQL database.
---

This guide describes how to deploy SuperPlane to a Google Kubernetes Engine
(GKE) cluster using Helm charts, connecting to an external PostgreSQL database
using an IP address and password.

## Prerequisites

Before you begin, ensure you have:

- A GCP project with billing enabled
- Permission to create GKE clusters
- [`kubectl` installed][kubectl-install]
- [`gcloud` CLI installed and authenticated][gcloud-install]
- [Helm 4.x installed][helm-install]

## Step 1: Set Project Variables

First, export your GCP project ID as a variable:

```bash
export PROJECT_ID=$(gcloud config get-value project)
```

Verify the project ID is set correctly:

```bash
echo $PROJECT_ID
```

Set variables for your cluster configuration:

```bash
export CLUSTER_NAME="superplane"
export ZONE="us-central1-a"  # or your preferred zone
```

## Step 2: Enable Required APIs

Enable the required Google Cloud APIs:

```bash
gcloud services enable container.googleapis.com
```

This may take a few minutes.

## Step 3: Create a GKE Cluster

Create a GKE cluster:

```bash
gcloud container clusters create $CLUSTER_NAME \
  --zone=$ZONE \
  --num-nodes=2 \
  --machine-type=e2-medium \
  --release-channel=regular \
  --cluster-version=1.31
```

The cluster creation may take 5-10 minutes.

### Configure kubectl

After the cluster is created, configure `kubectl` to connect to it:

```bash
gcloud container clusters get-credentials $CLUSTER_NAME --zone=$ZONE
```

Verify the connection:

```bash
kubectl get nodes
```

You should see your cluster nodes listed.

## Step 4: Set Up a PostgreSQL Database

Create a Cloud SQL PostgreSQL instance for SuperPlane:

```bash
export DB_PASSWORD="your-secure-password-here"
```

Replace `your-secure-password-here` with a strong password.

```
gcloud sql instances create superplane-db \
  --database-version=POSTGRES_17 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=$DB_PASSWORD \
  --no-assign-ip
```

Create a database for SuperPlane:

```bash
gcloud sql databases create superplane --instance=superplane-db
```

## Step 5: Configure SuperPlane Secrets

Create the namespace for SuperPlane:

```bash
kubectl create namespace superplane
```

Create a Kubernetes secret for the database credentials:

```bash
export DB_HOST=$(gcloud sql instances describe superplane-db --format=json | jq -r '.ipAddresses[] | select(.type == "PRIVATE") | .ipAddress')

kubectl create secret generic superplane-db-credentials \
  --namespace superplane \
  --from-literal=DB_HOST="$DB_HOST" \
  --from-literal=DB_PORT='5432' \
  --from-literal=DB_NAME='superplane' \
  --from-literal=DB_USERNAME='postgres' \
  --from-literal=DB_PASSWORD="$DB_PASSWORD" \
  --from-literal=POSTGRES_DB_SSL='false'
```

Create a Kubernetes secret for the session key:

```bash
kubectl create secret generic superplane-session -n superplane --from-literal=key="$(openssl rand -hex 32)"
```

Create a Kubernetes secret for the JWT secret:

```bash
kubectl create secret generic superplane-jwt -n superplane --from-literal=secret="$(openssl rand -hex 32)"
```

Create a Kubernetes secret for the encryption key:

```bash
kubectl create secret generic superplane-encryption -n superplane --from-literal=key="$(openssl rand -hex 32)"
```

## Step 6: Install SuperPlane

Set your domain name as an environment variable:

```bash
export DOMAIN_NAME="superplane.example.com"
```

Install the SuperPlane helm chart:

```bash
helm install superplane oci://ghcr.io/superplanehq/superplane-chart \
  --namespace superplane \
  --create-namespace \
  --set database.secretName="superplane-db-credentials" \
  --set database.host="$DB_HOST" \
  --set database.port=5432 \
  --set database.username="postgres" \
  --set database.password="$DB_PASSWORD" \
  --set database.ssl=false \
  --set database.local.enabled=false \
  --set image.registry="ghcr.io/superplanehq" \
  --set image.name="superplane" \
  --set image.tag="stable" \
  --set image.pullPolicy="IfNotPresent" \
  --set domain.name="$DOMAIN_NAME" \
  --set ingress.enabled=true \
  --set ingress.className="gce" \
  --set ingress.ssl.enabled=true \
  --set ingress.ssl.type="google" \
  --set ingress.ssl.google.certName="superplane-ssl-cert" \
  --set authentication.github.enabled=false \
  --set authentication.google.enabled=false \
  --set telemetry.opentelemetry.enabled=false \
  --set telemetry.opentelemetry.endpoint="" \
  --set session.secretName="superplane-session" \
  --set jwt.secretName="superplane-jwt" \
  --set encryption.secretName="superplane-encryption"
```

## Step 7: Verify the Installation

Check that all pods are running:

```bash
kubectl get pods -n superplane
```

Wait until all pods show `Running` status. Check the logs if needed:

```bash
kubectl logs -n superplane -l app=superplane
```

Get the ingress endpoint:

```bash
kubectl get ingress -n superplane
```

Wait for the ingress to be assigned an IP address. This may take a few minutes.
Once the `ADDRESS` column shows an IP address, note it down.

### Configure DNS

Point your domain to the ingress IP address by creating an A record in your DNS
provider:

1. **Get the ingress IP address:**

   ```bash
   kubectl get ingress -n superplane -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}'
   ```

2. **Create an A record** in your DNS provider:

   - **Type:** A
   - **Name:** `@` or your subdomain (e.g., `superplane`)
   - **Value:** The IP address from step 1
   - **TTL:** 300 (or your preferred value)

3. **Wait for DNS propagation** (usually 5-30 minutes, but can take up to 48
   hours)

4. **Verify DNS resolution:**
   ```bash
   dig $DOMAIN_NAME +short
   ```
   This should return the ingress IP address.

### SSL Certificate

If you configured `ingress.ssl.type="google"`, Google Cloud will automatically
provision an SSL certificate for your domain. The certificate provisioning may
take 10-60 minutes. You can check the certificate status:

```bash
kubectl describe ingress -n superplane
```

Once the certificate is provisioned and DNS is configured, your SuperPlane
instance will be accessible at `https://$DOMAIN_NAME`.

## Troubleshooting

### Pods not starting

Check pod status:

```bash
kubectl get pods -n superplane
```

If pods show `CreateContainerConfigError`, check the pod description for missing
secrets or configuration issues:

```bash
kubectl describe pod -n superplane <pod-name>
```

Check pod logs for database connection errors:

```bash
kubectl logs -n superplane -l app=superplane
```

### CreateContainerConfigError

This error typically indicates a missing secret or misconfigured environment
variable. Verify all required secrets exist:

```bash
kubectl get secrets -n superplane
```

Ensure the following secrets are present:

- `superplane-db-credentials`
- `superplane-session`
- `superplane-jwt`
- `superplane-encryption`

If any are missing, recreate them using the commands from Step 5.

### Pods stuck in Pending status

Pods in `Pending` status cannot be scheduled to a node. Common causes include
insufficient resources or node constraints. Check why a pod is pending:

```bash
kubectl describe pod -n superplane <pod-name>
```

Look for events or conditions that indicate why the pod can't be scheduled.

**Check node resources:**

```bash
kubectl top nodes
kubectl describe node
```

**Check resource requests and limits:**

```bash
kubectl describe pod -n superplane <pod-name> | grep -A 5 "Limits\|Requests"
```

If your cluster has limited resources (e.g., a single-node cluster with small
machine type), you may need to:

- Scale up your cluster (add more nodes or use a larger machine type)
- Reduce resource requests/limits in the Helm values
- Scale down other workloads

**Check for resource quotas:**

```bash
kubectl get resourcequota -n superplane
```

If quotas exist and are exhausted, you may need to increase them or remove
unnecessary quotas.

### Database connection issues

Verify network connectivity from a pod:

```bash
kubectl run -it --rm debug \
  --image=postgres:17 \
  --restart=Never \
  --namespace superplane \
  -- psql -h $DB_HOST -U postgres -d superplane
```

Ensure your GKE cluster has network access to your database server. Check that:

- Firewall rules allow connections from your cluster to the database IP on port
  5432
- The database is listening on the correct IP address and port
- The database credentials in the secret are correct

## Updating SuperPlane

To update to a newer version:

```bash
helm upgrade superplane oci://ghcr.io/superplanehq/superplane-chart \
  --namespace superplane \
  --set database.secretName="superplane-db-credentials" \
  --set database.host="$DB_HOST" \
  --set database.port=5432 \
  --set database.username="postgres" \
  --set database.password="$DB_PASSWORD" \
  --set database.ssl=false \
  --set database.local.enabled=false \
  --set image.registry="ghcr.io/superplanehq" \
  --set image.name="superplane" \
  --set image.tag="stable" \
  --set image.pullPolicy="IfNotPresent" \
  --set domain.name="superplane.example.com" \
  --set ingress.enabled=true \
  --set ingress.className="gce" \
  --set ingress.ssl.enabled=true \
  --set ingress.ssl.type="google" \
  --set telemetry.opentelemetry.enabled=false \
  --set telemetry.opentelemetry.endpoint="" \
  --set session.secretName="superplane-session" \
  --set jwt.secretName="superplane-jwt" \
  --set encryption.secretName="superplane-encryption"
```

The image tag `stable` uses the latest stable release. To use a specific version,
replace `--set image.tag="stable"` with `--set image.tag="VERSION"` (e.g.,
`--set image.tag="v0.4"`). To use the beta channel, use `--set image.tag="beta"`.

## Uninstalling

To remove SuperPlane from your cluster:

```bash
helm uninstall superplane --namespace superplane
kubectl delete namespace superplane
```

### Remove GKE Cluster

If you want to remove the entire GKE cluster:

```bash
gcloud container clusters delete $CLUSTER_NAME --zone=$ZONE
```

This will permanently delete the cluster and all its resources. Make sure you
have backups of any important data before proceeding.

[helm-install]: https://helm.sh/docs/intro/install/
[kubectl-install]: https://kubernetes.io/docs/tasks/tools/
[gcloud-install]: https://cloud.google.com/sdk/docs/install
[helm-chart]: https://github.com/superplanehq/helm-chart
