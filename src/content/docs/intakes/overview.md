---
title: Intakes overview
description: Choose where Factory tasks come from and decide which requests enter the backlog.
---

Use intakes to bring work from your existing tools into a Factory. Start with a connected repository or issue tracker, then define which requests belong in the backlog. This page helps you choose a source and plan the rules before configuring the workflow.

## Choose a source

For your first GitHub repository, follow the [Quickstart](/get-started/quickstart). For other sources, use the integration components in a custom automation.

| Source | Reference |
| --- | --- |
| GitHub | [Issues and repository events](/components/github) |
| Jira | [Jira issues](/components/jira) |
| Linear | [Linear issues and events](/components/linear) |
| Sentry | [Sentry events and actions](/components/sentry) |

Component references describe available events and actions. Connecting a source alone does not define how its events become Factory tasks; configure that behavior in your intake automation.

## Define what to import

Choose a repository or project and a narrow set of matching requests. Use filters such as labels or issue state where the source supports them.

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

When a custom automation creates a task through an agent's task creation tool, the task's **Intake** section identifies the automation. It shows the automation name and **Created by automated intake**. If the task also has an origin ticket, its link remains separate from the automation that created it. Older tasks without stored creator or source-run information cannot show this attribution.

If one intake run creates several tasks, each task retains the automation name, but the shared run does not appear in their run histories. Review the run from the automation instead. See [Factory costs](/fundamentals/performance-costs) for shared intake cost attribution.

Follow [Build your first Factory](/get-started/build-first-factory) to run tasks through implementation, verification and review.
