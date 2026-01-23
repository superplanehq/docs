---
title: Installation Overview
description: Choose the right installation path for local, single-host, or Kubernetes deployments.
---

SuperPlane can be installed in a few different ways depending on the
level of scale and operational control you need.

### Try it your computer

Choose this if you want to quickly try SuperPlane on your local machine without 
setting up cloud resources or Kubernetes.

- [Try it on your computer](./local)

### Single-host installation

Choose this if you want a production-like setup without Kubernetes.
Single-host installs are simpler to operate and are ideal for smaller
teams or early deployments.

  - [EC2 on AWS](./single-host/aws-ec2)
  - [Compute Engine on GCP](./single-host/gcp-compute-engine)
  - [Hetzner](./single-host/hetzner)
  - [DigitalOcean](./single-host/digitalocean)
  - [Linode](./single-host/linode)
  - [Generic server](./single-host/generic-server)

### Kubernetes

Choose this if you want a scalable, production instance of SuperPlane.

- GKE: [Google Kubernetes Engine](./kubernetes/gke)
- EKS: [Amazon Kubernetes (EKS)](./kubernetes/amazon-eks)
