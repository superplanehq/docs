// shared source of truth for both astro.config.mjs and generating llms.txt
export const sidebar = [
  {
    label: "Get Started",
    items: [
      { label: "Welcome", slug: "" },
      { label: "Quickstart", slug: "get-started/quickstart" },
      { label: "Example use cases", slug: "get-started/example-use-cases" },
    ],
  },
  {
    label: "SuperPlane Apps",
    items: [
      { label: "Overview", slug: "concepts/superplane-apps" },
      { label: "Canvas", slug: "concepts/canvas" },
      {
        label: "Console",
        items: [
          { label: "Overview", slug: "concepts/console" },
          { label: "Widgets", slug: "concepts/console/widgets" },
          { label: "Data sources", slug: "concepts/console/data-sources" },
          { label: "Expressions & CEL", slug: "concepts/console/expressions" },
        ],
      },
      { label: "Memory", slug: "concepts/canvas-memory" },
      { label: "Files", slug: "concepts/files" },
      { label: "Agent", slug: "concepts/agent" },
      { label: "Sharing apps", slug: "concepts/sharing-apps" },
    ],
  },
  {
    label: "Workflow Orchestration",
    items: [
      { label: "Overview", slug: "concepts/data-flow" },
      { label: "Runs", slug: "concepts/runs" },
      { label: "Component Nodes", slug: "concepts/component-nodes" },
      { label: "Expressions", slug: "concepts/expressions" },
      { label: "Expression Functions", slug: "concepts/expression-functions" },
      { label: "Runners", slug: "concepts/runners" },
    ],
  },
  {
    label: "Security",
    items: [
      { label: "Authentication & Accounts", slug: "security/authentication" },
      { label: "Secrets", slug: "security/secrets" },
      { label: "RBAC", slug: "security/access-control" },
      { label: "Service accounts", slug: "security/service-accounts" },
    ],
  },
  {
    label: "Installation",
    items: [
      { label: "Overview", slug: "installation/overview" },
      { label: "Try it on your computer", slug: "installation/local" },
      { label: "EC2 on AWS", slug: "installation/single-host/aws-ec2" },
      {
        label: "Compute Engine on GCP",
        slug: "installation/single-host/gcp-compute-engine",
      },
      { label: "Hetzner", slug: "installation/single-host/hetzner" },
      { label: "DigitalOcean", slug: "installation/single-host/digitalocean" },
      { label: "Linode", slug: "installation/single-host/linode" },
      {
        label: "Generic server",
        slug: "installation/single-host/generic-server",
      },
      {
        label: "Google Kubernetes Engine",
        slug: "installation/kubernetes/gke",
      },
      {
        label: "Amazon Kubernetes (EKS)",
        slug: "installation/kubernetes/amazon-eks",
      },
      { label: "Beacon", slug: "installation/beacon" },
    ],
  },
  {
    label: "Command Line Interface (CLI)",
    items: [
      { label: "Overview & Installation", slug: "cli/overview" },
      { label: "Managing Apps", slug: "cli/apps" },
      { label: "Runs & Executions", slug: "cli/runs" },
      { label: "Integrations & Secrets", slug: "cli/resources" },
      { label: "Discovery Index", slug: "cli/discovery" },
    ],
  },
  {
    label: "Components",
    autogenerate: { directory: "components" },
  },
  {
    label: "Reference",
    items: [
      { label: "Public API Reference", slug: "concepts/api-reference" },
      { label: "Glossary", slug: "concepts/glossary" },
    ],
  },
];
