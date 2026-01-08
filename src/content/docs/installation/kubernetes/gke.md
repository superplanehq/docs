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
gcloud compute addresses create superplane-ip --global --ip-version=IPV4
```

Get the reserved IP address:

```bash
export INGRESS_IP=$(gcloud compute addresses describe superplane-ip --global --format='get(address)')
echo $INGRESS_IP
```

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
  --from-literal=POSTGRES_DB_SSL='false'
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

## Step 7: Install cert-manager

Install cert-manager, which is required for SSL certificate management:

```bash
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true
```

Wait for cert-manager to be ready:

```bash
kubectl wait --for=condition=ready pod \
  -l app.kubernetes.io/instance=cert-manager \
  -n cert-manager \
  --timeout=300s
```

Verify cert-manager is running:

```bash
kubectl get pods -n cert-manager
```

## Step 8: Install SuperPlane

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
  --set ingress.staticIpName="superplane-ip" \
  --set ingress.ssl.enabled=true \
  --set ingress.ssl.type="cert-manager" \
  --set ingress.ssl.certManager.issuerRef.name="letsencrypt-prod" \
  --set ingress.ssl.certManager.issuerRef.kind="ClusterIssuer" \
  --set ingress.ssl.certManager.secretName="superplane-tls-secret" \
  --set authentication.github.enabled=false \
  --set authentication.google.enabled=false \
  --set telemetry.opentelemetry.enabled=false \
  --set telemetry.opentelemetry.endpoint="" \
  --set session.secretName="superplane-session" \
  --set jwt.secretName="superplane-jwt" \
  --set encryption.secretName="superplane-encryption"
```

Wait for the SuperPlane pods to start:

```bash
kubectl get pods -n superplane -w
```

Once the pods are running, verify the ingress was created with the static IP
annotation:

```bash
kubectl get ingress superplane -n superplane
```

The ingress may take a few minutes to get an IP address assigned.

## Step 9: Create ClusterIssuer

Set your email address for Let's Encrypt certificate notifications:

```bash
export EMAIL="your-email@example.com"
```

Replace `your-email@example.com` with your actual email address.

Create a ClusterIssuer for Let's Encrypt. This configuration tells cert-manager
to use the existing SuperPlane ingress for HTTP-01 challenges instead of
creating a separate solver ingress:

```bash
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: $EMAIL
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          name: superplane
          serviceType: ClusterIP
EOF
```

This approach reuses the SuperPlane ingress (which has the static IP) for
certificate validation, avoiding the issue where a separate solver ingress
would get a different IP address.

Verify the ClusterIssuer was created:

```bash
kubectl get clusterissuer letsencrypt-prod
```

## Step 10: Verify the Installation

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

Verify that the ingress is using the static IP address:

```bash
kubectl get ingress -n superplane -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}'
```

This should return the static IP address you reserved in Step 3.

**If the ingress shows no IP address**, verify the static IP annotation is set:

```bash
kubectl get ingress superplane -n superplane -o yaml | grep -A 5 annotations
```

You should see `kubernetes.io/ingress.global-static-ip-name: superplane-ip` in the
annotations. If it's missing, add it manually:

```bash
kubectl annotate ingress superplane -n superplane \
  kubernetes.io/ingress.global-static-ip-name=superplane-ip \
  --overwrite
```

Wait 2-3 minutes after adding the annotation for the GCE ingress controller to
assign the static IP.

### Verify Firewall Rules for Port 80

The GCE ingress controller automatically creates firewall rules to allow traffic
on ports 80 (HTTP) and 443 (HTTPS) when the ingress is created. Port 80 is
required for Let's Encrypt HTTP-01 challenges used by cert-manager.

Verify that firewall rules allow HTTP traffic:

```bash
gcloud compute firewall-rules list --filter="name~gke-$CLUSTER_NAME"
```

You should see firewall rules that allow traffic from `0.0.0.0/0` (or specific
source ranges) to ports 80 and 443. The GCE ingress controller typically
creates rules with names like `k8s-fw-*` or `gce-*`.

If you need to manually verify port 80 accessibility, test from an external
machine:

```bash
curl -I http://$DOMAIN_NAME
```

This should return an HTTP response (even if it's a redirect to HTTPS or a
certificate challenge page).

**Note:** If you're using a custom VPC or have strict firewall policies, ensure
that the default firewall rules allow HTTP traffic. The GCE ingress controller
requires these rules to function properly.

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
`cert-manager.io/cluster-issuer: letsencrypt-prod`. If it's missing, verify your
helm values include the cert-manager configuration and that the ClusterIssuer
exists.

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
- **ClusterIssuer not found:** Verify the ClusterIssuer exists (created in Step
  9):
  ```bash
  kubectl get clusterissuer letsencrypt-prod
  ```

### Empty Reply from Server (Port 80 Not Responding)

If you get `curl: (52) Empty reply from server` when testing port 80, this
usually means the GCE load balancer is still provisioning or the ingress
backend isn't configured correctly.

**Check if the ingress has an IP address:**

```bash
kubectl get ingress -n superplane
```

The ingress should show an IP address in the `ADDRESS` column. If it's empty or
shows `<pending>`, the load balancer is still being created. This can take 5-10
minutes.

**Check ingress events and status:**

```bash
kubectl describe ingress -n superplane
```

Look for:

- Events indicating the load balancer is being created
- Backend service configuration
- Any error messages

**Verify the ingress backend service exists:**

```bash
kubectl get svc -n superplane
```

Ensure there's a service for SuperPlane. Check if it has endpoints:

```bash
kubectl get endpoints -n superplane
```

If there are no endpoints, the pods may not be ready. Check pod status:

```bash
kubectl get pods -n superplane
```

**Check if pods are ready and healthy:**

```bash
kubectl get pods -n superplane -o wide
kubectl describe pod -n superplane <pod-name>
```

Pods should be in `Running` state with `1/1` ready. If pods aren't ready, check
their logs:

```bash
kubectl logs -n superplane -l app=superplane
```

**Verify the load balancer in GCP:**

```bash
gcloud compute forwarding-rules list --filter="name~k8s"
```

You should see forwarding rules created by the GCE ingress controller. Check
their status:

```bash
gcloud compute forwarding-rules describe <rule-name> --global
```

**Verify the static IP annotation is correct:**

If the ingress shows no IP address but cert-manager solver ingresses have IPs,
check that the static IP annotation is properly set:

```bash
kubectl get ingress superplane -n superplane -o yaml | grep -A 5 annotations
```

You should see:

```yaml
annotations:
  kubernetes.io/ingress.global-static-ip-name: superplane-ip
```

**If the annotation is missing**, the helm chart may not have applied it correctly.
You can add it manually by patching the ingress:

```bash
kubectl annotate ingress superplane -n superplane \
  kubernetes.io/ingress.global-static-ip-name=superplane-ip \
  --overwrite
```

After adding the annotation, wait 2-3 minutes for the GCE ingress controller to
reconcile and assign the static IP. Check the ingress again:

```bash
kubectl get ingress superplane -n superplane
```

If the annotation is still missing after patching, verify the static IP exists:

```bash
gcloud compute addresses describe superplane-ip --global
```

**Check ingress controller logs for errors:**

The GCE ingress controller may have errors assigning the static IP. Check the
ingress controller logs:

```bash
kubectl logs -n kube-system -l app=gce-ingress --tail=50
```

Look for errors related to the static IP assignment.

**Verify the static IP is available:**

Ensure the static IP isn't already in use by another resource:

```bash
gcloud compute addresses list --filter="name=superplane-ip"
gcloud compute forwarding-rules list --filter="IPAddress:34.117.156.142"
```

Replace `34.117.156.142` with your actual static IP address.

**Check ingress events for specific errors:**

```bash
kubectl describe ingress superplane -n superplane
```

Look for events that indicate why the IP isn't being assigned. Common issues:

- Static IP name doesn't match the annotation
- Static IP is already in use
- Insufficient permissions for the ingress controller
- GCE ingress controller is still processing the annotation

**Wait for load balancer provisioning:**

GCE load balancers can take 5-10 minutes to fully provision, especially when
using a static IP. If the ingress IP is still pending, wait a few more minutes
and check again:

```bash
watch -n 10 'kubectl get ingress -n superplane'
```

Once the IP is assigned, wait an additional 2-3 minutes for the load balancer
to be fully configured before testing again.

**Note:** If cert-manager solver ingresses have IPs but the main ingress
doesn't, this usually means the GCE ingress controller is still processing the
static IP annotation. This can take longer than a regular dynamic IP
assignment.

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
  --set ingress.staticIpName="superplane-ip" \
  --set ingress.ssl.enabled=true \
  --set ingress.ssl.type="cert-manager" \
  --set ingress.ssl.certManager.issuerRef.name="letsencrypt-prod" \
  --set ingress.ssl.certManager.issuerRef.kind="ClusterIssuer" \
  --set ingress.ssl.certManager.secretName="superplane-tls-secret" \
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
