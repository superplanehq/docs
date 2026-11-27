---
title: Intakes overview
description: Choose where Factory tasks come from and decide which requests enter the backlog.
---

Use intakes to bring work from your existing tools into a Factory. Start with a connected repository or issue tracker, then define which requests belong in the backlog. This page helps you choose a source and plan the rules before configuring the workflow.

## Choose a source

For your first GitHub repository, follow the [Quickstart](/get-started/quickstart). To receive JSON requests from another tool, configure a [webhook intake](/intakes/overview#receive-tasks-from-a-webhook). For other workflows, use the integration components in a custom automation.

| Source | Reference |
| --- | --- |
| GitHub | [Issues and repository events](/components/github) |
| Jira | [Jira issues](/components/jira) |
| Linear | [Linear issues and events](/components/linear) |
| Sentry | [Sentry events and actions](/components/sentry) |
| Webhook | [Receive tasks from a webhook](/intakes/overview#receive-tasks-from-a-webhook) |

Component references describe available events and actions. Connecting a source alone does not define how its events become Factory tasks; configure that behavior in your intake automation.

## Receive tasks from a webhook

Use **Webhook** intake to turn authenticated JSON requests into tasks in **Backlog**. You don't need to enable an experimental feature. You need permission to update the workspace to add an intake or manage its webhooks.

1. Open the **Backlog** column menu, click **Add intake**, and select **Webhook**.
2. Choose **New webhook**, enter a **Name**, and select **Authentication**. The default is **Bearer token**; you can also choose **HMAC signature** or **Header token**. To reuse a webhook from the same workspace, choose **Existing webhook**.
3. Click **Continue** and map **Title**, **Description**, and **Link** to fields in the JSON body. The defaults are `title`, `description`, and `url`. Use dots for nested fields, such as `issue.title`.
4. If your workspace uses a [Codex subscription](/billing/bring-your-own-subscription), select a default task owner with Codex connected.
5. Click **Create intake**. For a new webhook, copy the URL, secret, and example request before clicking **Done**. SuperPlane shows the secret only once.
6. Configure the sender to use that URL and authentication method, then send a JSON request with the mapped fields. Confirm the task appears in **Backlog**.

The **Title** mapping is required, but a request missing that field gets the title `Webhook request`. Leave **Description** empty to create tasks without a description. A populated **Link** prevents another task with the same source link; leave the mapping empty to create a task for each request. Webhook intake receives new requests and does not import earlier ones.

Open **Settings** → **Workspace** → **Webhooks** to copy URLs, edit webhooks, regenerate secrets, or delete unused webhooks. You need workspace read permission to view this page and update permission to make changes; no experimental enablement is required. Regenerating a secret invalidates the previous secret immediately, so update the sender. Remove a webhook from its listening intakes and automations before deleting it.

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

Follow [Build your first Factory](/get-started/build-first-factory) to run tasks through implementation, verification and review.
