---
title: Source control and work intake
description: Connect repositories, issues, branches, pull requests and review events to SuperPlane.
---

Source-control integrations give a Factory access to backlog items and the reviewable outputs of agent work. Grant only the repositories and actions required by the workflow.

## Source control

- [GitHub](/components/github) manages issues, branches, pull requests, comments, checks and repository events.
- [GitLab](/components/gitlab) reacts to repository changes and manages GitLab resources.
- [Bitbucket](/components/bitbucket) reacts to events in Bitbucket repositories.

## Work intake

- [GitHub](/components/github) provides issue intake during the guided Factory setup.
- [Jira](/components/jira) supports guided issue intake from a selected project and actions in custom workflows.
- [Linear](/components/linear) supports guided issue intake from a selected team, with optional project filters, and actions in custom workflows.
- [ServiceNow](/components/servicenow) connects service-management records and events.

## Access guidance

Authorize the GitHub App for the code and backlog repositories used by the tutorial. Confirm write access to the code repository, read access to its issues source, and the code repository's default branch. The two repositories can be the same. Review model prerequisites in the [Quickstart](/get-started/quickstart#prerequisites) before completing setup.

Initial issue import and ongoing **Automatic intake** are separate settings. Review filters and import results in [Intakes](/intakes/overview); connecting a repository does not guarantee that every issue enters Backlog.
