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

## Step 3: Reserve Static IP Address and Configure DNS

Reserve a static IP address for your ingress:

```bash
gcloud compute addresses create superplane-ip \
  --global \
  --ip-version=IPV4
```

Get the reserved IP address:

```bash
export INGRESS_IP=$(gcloud compute addresses describe superplane-ip \
  --global \
  --format='get(address)')
echo $INGRESS_IP
```

Save this IP address. You'll use it to configure DNS and assign it to the
ingress.

Set your domain name as an environment variable:

```bash
export DOMAIN_NAME="superplane.example.com"
```

Replace `superplane.example.com` with your actual domain name.

Configure DNS to point to the static IP address. Create an A record in your DNS
provider:

- **Type:** A
- **Name:** `@` or your subdomain (e.g., `superplane`)
- **Value:** `$INGRESS_IP` (the IP address from above)
- **TTL:** 300 (or your preferred value)

Wait for DNS propagation (usually 5-30 minutes, but can take up to 48 hours).
Verify DNS resolution:

```bash
dig $DOMAIN_NAME +short
```

This should return the static IP address you reserved.

## Step 4: Create a GKE Cluster

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

## Step 5: Set Up PostgreSQL Database

Create a Cloud SQL PostgreSQL instance for SuperPlane:

```bash
export DB_PASSWORD="your-secure-password-here"
```

Replace `your-secure-password-here` with a strong password.

Enable networking service:

```
gcloud services enable servicenetworking.googleapis.com
```

Reserve an IP range for the database:

```
gcloud compute addresses create google-managed-services-default \
  --global --purpose=VPC_PEERING --prefix-length=16 --network=default
```

Create a VPC peering:

```
gcloud services vpc-peerings connect \
  --service=servicenetworking.googleapis.com \
  --ranges=google-managed-services-default --network=default
```

Create a database instance:

```
gcloud sql instances create superplane-db \
  --database-version=POSTGRES_17 \
  --cpu=2 \
  --memory=4GB \
  --region=us-central1 \
  --root-password=$DB_PASSWORD \
  --edition=enterprise \
  --network=default \
  --no-assign-ip
```

Create a database for SuperPlane:

```bash
gcloud sql databases create superplane --instance=superplane-db
```

## Step 6: Configure Database Connection

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
  --from-literal=POSTGRES_DB_SSL='false' \
  --from-literal=ENCRYPTION_KEY="$ENCRYPTION_KEY"
```

Create a Kubernetes secret for the session key:

```bash
kubectl create secret generic superplane-session -n superplane --from-literal=SESSION_SECRET="$(openssl rand -hex 32)"
```

Create a Kubernetes secret for the JWT secret:

```bash
kubectl create secret generic superplane-jwt -n superplane --from-literal=JWT_SECRET="$(openssl rand -hex 32)"
```

Create a Kubernetes secret for the encryption key:

```bash
kubectl create secret generic superplane-encryption -n superplane --from-literal=ENCRYPTION_KEY="$(openssl rand -hex 32)"
```

## Step 7: Install SuperPlane

Set your email address for Let's Encrypt certificate notifications:

```bash
export EMAIL="your-email@example.com"
```

Replace `your-email@example.com` with your actual email address.

Install the SuperPlane helm chart. cert-manager will be installed automatically
as a dependency when enabled:

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
  --set ingress.annotations."kubernetes\.io/ingress\.global-static-ip-name"="superplane-ip" \
  --set ingress.ssl.enabled=true \
  --set ingress.ssl.type="cert-manager" \
  --set ingress.ssl.certManager.issuerRef.name="letsencrypt-prod" \
  --set ingress.ssl.certManager.issuerRef.kind="ClusterIssuer" \
  --set cert-manager.enabled=true \
  --set cert-manager.installCRDs=true \
  --set certManager.issuerRef.name="letsencrypt-prod" \
  --set certManager.issuerRef.kind="ClusterIssuer" \
  --set certManager.secretName="superplane-tls-secret" \
  --set certManager.createClusterIssuer=true \
  --set certManager.acme.email="$EMAIL" \
  --set certManager.acme.server="https://acme-v02.api.letsencrypt.org/directory" \
  --set authentication.github.enabled=false \
  --set authentication.google.enabled=false \
  --set telemetry.opentelemetry.enabled=false \
  --set telemetry.opentelemetry.endpoint="" \
  --set session.secretName="superplane-session" \
  --set jwt.secretName="superplane-jwt" \
  --set encryption.secretName="superplane-encryption"
```

Wait for cert-manager to be ready:

```bash
kubectl wait --for=condition=ready pod \
  -l app.kubernetes.io/instance=cert-manager \
  -n cert-manager \
  --timeout=300s
```

The ClusterIssuer will be created automatically by the helm chart. Verify it was
created:

```bash
kubectl get clusterissuer letsencrypt-prod
```

## Step 8: Verify the Installation

Check that all pods are running:

```bash
kubectl get pods -n superplane
kubectl get pods -n cert-manager
```

Verify cert-manager is running:

```bash
kubectl get pods -A | grep cert-manager
```

Verify the ClusterIssuer was created:

```bash
kubectl get clusterissuer letsencrypt-prod
kubectl describe clusterissuer letsencrypt-prod
```

Wait until all pods show `Running` status. Check the logs if needed:

```bash
kubectl logs -n superplane -l app=superplane
```

Get the ingress endpoint:

```bash
kubectl get ingress -n superplane
```

Verify that the ingress is using the static IP address:

```bash
kubectl get ingress -n superplane -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}'
```

This should return the static IP address you reserved in Step 3.

### SSL Certificate

cert-manager will automatically request and provision an SSL certificate from
Let's Encrypt for your domain. The certificate provisioning may take a few
minutes. Check the certificate status:

```bash
kubectl get certificate -n superplane
kubectl describe certificate -n superplane
```

Check the certificate request status:

```bash
kubectl get certificaterequest -n superplane
kubectl describe certificaterequest -n superplane
```

You can also check the cert-manager logs:

```bash
kubectl logs -n cert-manager -l app=cert-manager
```

**Note:** If you don't see a Certificate resource, check the ingress
annotations to ensure cert-manager is configured correctly:

```bash
kubectl get ingress -n superplane -o yaml | grep -A 5 annotations
```

The ingress should have the annotation
`cert-manager.io/cluster-issuer: letsencrypt-prod`. If it's missing, the helm
chart may not be creating the Certificate resource automatically. Check the
ingress configuration in the helm chart values.

If the Certificate resource is not being created automatically, you may need to
create it manually or verify the helm chart's cert-manager integration.

Once the certificate is issued (status shows `Ready`) and DNS is configured,
your SuperPlane instance will be accessible at `https://$DOMAIN_NAME`.

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

If any are missing, recreate them using the commands from Step 6.

### Certificate Resource Not Found

If you don't see a Certificate resource in the superplane namespace, the helm
chart may not be creating it automatically. Check the ingress to see if it has
the cert-manager annotation:

```bash
kubectl get ingress -n superplane -o yaml | grep -A 10 annotations
```

The ingress should have `cert-manager.io/cluster-issuer: letsencrypt-prod` or
similar annotation. If it's missing, verify your helm values include the
cert-manager configuration.

Check if cert-manager is detecting ingress resources:

```bash
kubectl logs -n cert-manager -l app=cert-manager | grep -i ingress
```

### TLS Secret Not Found Error

If you see an error like `secrets "superplane-tls-secret" not found` in the
ingress controller logs, this means either:

1. The Certificate resource hasn't been created yet (see above)
2. cert-manager is still processing the certificate request

If the Certificate resource exists, check its status:

```bash
kubectl get certificate -n superplane
kubectl describe certificate -n superplane
```

If the certificate shows `Ready: False`, check the events and conditions:

```bash
kubectl describe certificate -n superplane | grep -A 10 "Conditions:"
```

Check certificate requests:

```bash
kubectl get certificaterequest -n superplane
kubectl describe certificaterequest -n superplane
```

Common issues:

- **DNS not propagated:** Ensure your DNS is correctly pointing to the static IP
  and has propagated. Verify with `dig $DOMAIN_NAME +short`.
- **Let's Encrypt rate limiting:** If you've made too many requests, wait a few
  hours before trying again.
- **HTTP-01 challenge failing:** Ensure your domain is publicly accessible and
  the ingress is working on HTTP (port 80).
- **ClusterIssuer not found:** Verify the ClusterIssuer exists:
  ```bash
  kubectl get clusterissuer letsencrypt-prod
  ```

Once the certificate is ready, the TLS secret will be created automatically and
the error will resolve.

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
  --set domain.name="$DOMAIN_NAME" \
  --set ingress.enabled=true \
  --set ingress.className="gce" \
  --set ingress.annotations."kubernetes\.io/ingress\.global-static-ip-name"="superplane-ip" \
  --set ingress.ssl.enabled=true \
  --set ingress.ssl.type="cert-manager" \
  --set ingress.ssl.certManager.issuerRef.name="letsencrypt-prod" \
  --set ingress.ssl.certManager.issuerRef.kind="ClusterIssuer" \
  --set cert-manager.enabled=true \
  --set cert-manager.installCRDs=true \
  --set certManager.issuerRef.name="letsencrypt-prod" \
  --set certManager.issuerRef.kind="ClusterIssuer" \
  --set certManager.secretName="superplane-tls-secret" \
  --set certManager.createClusterIssuer=true \
  --set certManager.acme.email="$EMAIL" \
  --set certManager.acme.server="https://acme-v02.api.letsencrypt.org/directory" \
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
