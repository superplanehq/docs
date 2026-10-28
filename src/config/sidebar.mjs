// Shared source of truth for Astro navigation and llms.txt generation.
export const sidebar = [
  {
    label: "1. Get Started",
    collapsed: true,
    items: [
      { label: "Introduction", slug: "get-started/overview" },
      { label: "Learn how Superplane works", slug: "get-started/how-superplane-works" },
      { label: "Quickstart", slug: "get-started/quickstart" },
      { label: "Video Walkthrough", slug: "get-started/video-walkthrough" },
      { label: "Build your first Factory", slug: "get-started/build-first-factory" },
    ],
  },
  {
    label: "2. Software Factory Fundamentals",
    collapsed: true,
    items: [
      { label: "How one-shot engineering works", slug: "fundamentals/one-shot-engineering" },
      {
        label: "The Factory pipeline",
        collapsed: true,
        items: [
          { label: "Pipeline overview", slug: "fundamentals/factory-pipeline" },
          { label: "Work intake and backlog", slug: "fundamentals/work-intake" },
          { label: "Intelligent task assignment", slug: "fundamentals/intelligent-task-assignment" },
          { label: "Implement", slug: "fundamentals/implement" },
          { label: "Verify", slug: "fundamentals/verify" },
          { label: "Done", slug: "fundamentals/done" },
        ],
      },
      {
        label: "Automations",
        collapsed: true,
        items: [
          { label: "Automation overview", slug: "fundamentals/automations" },
          { label: "Backlog automation", slug: "fundamentals/automation-backlog" },
          { label: "Implement automation", slug: "fundamentals/automation-implement" },
          { label: "Verify automation", slug: "fundamentals/automation-verify" },
          { label: "Done automation", slug: "fundamentals/automation-done" },
        ],
      },
      {
        label: "Factory performance",
        collapsed: true,
        items: [
          { label: "Performance overview", slug: "fundamentals/factory-performance" },
          { label: "Task time", slug: "fundamentals/performance-task-time" },
          { label: "Costs", slug: "fundamentals/performance-costs" },
          { label: "People and automations", slug: "fundamentals/performance-people-automations" },
        ],
      },
    ],
  },
  {
    label: "3. Use Cases",
    collapsed: true,
    items: [
      { label: "Use cases overview", slug: "use-cases/overview" },
      { label: "Fix a GitHub issue", slug: "use-cases/fix-github-issue" },
      { label: "Make small code improvements", slug: "use-cases/small-code-improvements" },
    ],
  },
  {
    label: "4. Integrations and Components",
    collapsed: true,
    items: [
      { label: "Source control and work intake", slug: "integrations/source-control" },
      { label: "Coding agents and AI", slug: "integrations/coding-agents-ai" },
      { label: "CI/CD", slug: "integrations/ci-cd" },
      { label: "Observability", slug: "integrations/observability" },
      { label: "Cloud and infrastructure", slug: "integrations/cloud-infrastructure" },
      { label: "Custom integrations", slug: "integrations/custom-integrations" },
      { label: "All components", slug: "components" },
    ],
  },
  {
    label: "5. Billing",
    collapsed: true,
    items: [
      { label: "Overview", slug: "billing/overview" },
      { label: "Costs and budgets", slug: "billing/costs-budgets" },
    ],
  },
  {
    label: "6. Self-hosting",
    collapsed: true,
    items: [
      { label: "Overview", slug: "self-hosting/overview" },
      { label: "Install on a single VM", slug: "self-hosting/single-vm" },
      { label: "Install on your cloud", slug: "self-hosting/install" },
      { label: "Troubleshooting", slug: "self-hosting/troubleshooting" },
      { label: "Upgrade and uninstall", slug: "self-hosting/upgrade-and-uninstall" },
    ],
  },
  {
    label: "7. Open Source",
    collapsed: true,
    items: [
      { label: "Why SuperPlane is open source", slug: "open-source/why-open-source" },
      {
        label: "GitHub repository",
        link: "https://github.com/superplanehq/superplane",
        attrs: { target: "_blank", rel: "noopener noreferrer" },
      },
      { label: "Contributing", slug: "open-source/contributing" },
      { label: "Community", slug: "open-source/community" },
    ],
  },
  {
    label: "8. Support and Help",
    collapsed: true,
    items: [
      {
        label: "Discord Community",
        link: "https://discord.superplane.com/",
        attrs: { target: "_blank", rel: "noopener noreferrer" },
      },
      { label: "Report a bug", slug: "troubleshooting/report-bug" },
    ],
  },
  {
    label: "9. Release Notes",
    collapsed: true,
    items: [
      { label: "Latest release", slug: "release-notes/latest" },
      { label: "Product & Integration updates", slug: "release-notes/product-updates" },
    ],
  },
];
