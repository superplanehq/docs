---
title: Installation Overview
description: Choose the right installation path for local, single-host, or Kubernetes deployments.
---

SuperPlane can be installed in a few different ways depending on the
level of scale and operational control you need.

## Try it on your computer

Choose this if you want to quickly try SuperPlane on your local machine without
setting up cloud resources or Kubernetes.

- [Try it on your computer](/installation/local)

## Single-host installation

Choose this if you want a production-like setup without Kubernetes.
Single-host installs are simpler to operate and are ideal for smaller
teams or early deployments.

  - [EC2 on AWS](/installation/single-host/aws-ec2)
  - [Compute Engine on GCP](/installation/single-host/gcp-compute-engine)
  - [Hetzner](/installation/single-host/hetzner)
  - [DigitalOcean](/installation/single-host/digitalocean)
  - [Linode](/installation/single-host/linode)
  - [Generic server](/installation/single-host/generic-server)

## Kubernetes

Choose this if you want a scalable, production instance of SuperPlane.

- [Google Kubernetes Engine](/installation/kubernetes/gke)
- [Amazon Kubernetes (EKS)](/installation/kubernetes/amazon-eks)

## Updating SuperPlane

Each installation method has its own upgrade process. See the upgrade
section in your installation method's documentation:

- [Local installation](/installation/local#upgrading)
- Single-host installations:
  - [EC2 on AWS](/installation/single-host/aws-ec2#upgrading)
  - [Compute Engine on GCP](/installation/single-host/gcp-compute-engine#upgrading)
  - [Hetzner](/installation/single-host/hetzner#upgrading)
  - [DigitalOcean](/installation/single-host/digitalocean#upgrading)
  - [Linode](/installation/single-host/linode#upgrading)
  - [Generic server](/installation/single-host/generic-server#upgrading)
- Kubernetes installations:
  - [Google Kubernetes Engine](/installation/kubernetes/gke#upgrading)
  - [Amazon Kubernetes (EKS)](/installation/kubernetes/amazon-eks#upgrading)
