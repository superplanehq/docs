---
title: Intakes overview
description: Choose where Factory tasks come from and decide which requests enter the backlog.
---

Use intakes to bring work from your existing tools into a Factory. Start with a connected repository or issue tracker, then define which requests belong in the backlog. This page helps you choose a source and plan the rules before configuring the workflow.

## Choose a source

For the GitHub tutorial path, follow the [Quickstart](/get-started/quickstart). Onboarding also supports Jira and Linear work intake. Connect Jira and choose a project, or connect Linear and choose a team and any project filters. Other supported intakes can be added to the workspace; use integration components when you need a custom source workflow.

| Source | Reference |
| --- | --- |
| GitHub | [Issues and repository events](/components/github) |
| Jira | [Jira issues](/components/jira) |
| Linear | [Linear issues and events](/components/linear) |
| Sentry | [Sentry events and actions](/components/sentry) |

Component references describe available events and actions. Connecting a service alone does not create tasks. The guided setup provisions the selected intake; review its source and filters before relying on it.

The first workspace runs an initial import. Later workspace setup can skip it. **Automatic intake** controls ongoing events separately: turning it off leaves the initial import enabled. Check the import result and use manual intake import for a missing or one-off issue.

## Define what to import

Choose a repository or project and a narrow set of matching requests. Use filters such as labels, assignment or issue state where supported. New GitHub intakes listen for new and reopened issues and require authors to have repository access by default. An include-label filter also lets adding that label to an open issue trigger intake. With no labels selected, adding a label alone does not trigger intake.

Each task needs enough context to act on:

- The requested change and expected result.
- The repository and area in scope.
- A link to the original request.
- A test or check that can confirm completion.

Read [work intake and backlog](/fundamentals/work-intake) for task readiness criteria.

## Assess work before starting it

The Backlog automation can inspect a task and record a confidence score with a reason. Use that result to route work, rather than treating it as a guarantee of success.

Keep requests with missing context in the backlog until someone clarifies them. Define separately when implementation may start. See [Backlog automation](/fundamentals/automation-backlog) for filtering, assessment and routing rules.

## Try one task first

Import one bounded request and confirm its source and context are attached. Check the assessment result before starting implementation. Once the task follows the expected path, expand the intake rules to more work.

Follow [Build your first Factory](/get-started/build-first-factory) to run tasks through implementation, verification and review.
