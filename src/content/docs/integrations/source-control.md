---
title: Source control and work intake
description: Connect repositories, issues, branches, pull requests and review events to SuperPlane.
---

Source-control integrations give a Factory access to backlog items and the reviewable outputs of agent work. Grant only the repositories and actions required by the workflow.

## Source control

- [GitHub](/components/github) manages issues, branches, pull requests, comments, checks and repository events.
- [GitHub Enterprise Cloud](#github-enterprise-cloud) connects organizations hosted on `ghe.com`. It requires the Enterprise plan.
- [GitLab](/components/gitlab) reacts to repository changes and manages GitLab resources.
- [Bitbucket](/components/bitbucket) reacts to events in Bitbucket repositories.

### GitHub Enterprise Cloud

Connect a GitHub Enterprise Cloud organization on your `ghe.com` subdomain, such as `acme.ghe.com`. During Factory setup, choose **GitHub Enterprise Cloud** as the source control host, enter your host and organization, and create a private GitHub App in that organization. The [GitHub](/components/github) components then work against your Enterprise Cloud repositories.

GitHub Enterprise Cloud is an Enterprise integration. Organizations without an Enterprise plan or license see the option marked **Enterprise** and can't select it. See [Compare plan features](/billing/overview#compare-plan-features).

**Note:** GitHub Enterprise Server (self-hosted GitHub) isn't supported yet.

## Work intake

- [GitHub](/components/github) provides issue intake during the guided Factory setup.
- [Jira](/components/jira) manages Jira issues in custom workflows.
- [Linear](/components/linear) manages and reacts to Linear issues.
- [ServiceNow](/components/servicenow) connects service-management records and events.

## Access guidance

Use a dedicated connection with the minimum repository scope. Confirm that it can read the backlog, create the required branch and pull request and receive the review events used by the line.
