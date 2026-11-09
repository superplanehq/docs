---
title: Bring your own subscription
description: Run Codex in a workspace on each task owner's ChatGPT subscription.
---

Bring your own subscription (BYOS) runs Codex on a personal ChatGPT subscription on any SuperPlane plan. Each member connects their own ChatGPT account. A task uses that task owner's subscription and the models the workspace allows.

SuperPlane adds no token markup to model use through your connected ChatGPT account. Sandbox time still uses SuperPlane credits. See [SuperPlane pricing](https://superplane.com/pricing/) for current plan terms.

## Connect your ChatGPT account

You can connect your ChatGPT account once per organization and use it in every workspace in that organization.

1. Open **Settings → Account → Codex**.
2. In ChatGPT, allow device sign-in in Security settings. See [device code authentication](https://learn.chatgpt.com/docs/auth#preferred-device-code-authentication-beta).
3. Click **Connect ChatGPT**.
4. Copy the sign-in code.
5. Click **Open ChatGPT** and enter the code.
6. Wait until ChatGPT is connected.

The usage card shows the last snapshot SuperPlane saved at sign-in or during a Codex run.

## Select ChatGPT for the workspace

1. Open **Settings → Models**.
2. Click **Change model source**.
3. Click **Select ChatGPT subscriptions**.
4. Choose a **Default task owner** who has ChatGPT connected.
5. Click **Switch to Codex**.

The default task owner is the person SuperPlane assigns when an intake creates a task. Codex runs that task on the owner's ChatGPT subscription. A new intake task has no owner yet, so SuperPlane needs a connected member before it can create the task.

**Note:** This replaces the default owner on every intake, including scheduled intakes and intakes that already name another owner.

If no member is connected, click **Connect Codex** in the dialog and finish sign-in. Then choose the default owner.

You need the **Maintainer** or **Admin** role to switch the source.

## Choose models

The model list combines catalogs from members who have ChatGPT connected. A task uses models that its owner's subscription includes and that the workspace allows.

1. Keep **Use all available models** selected, or clear it and select models.
2. Click **Save models**.

Models marked **Unavailable from connected members** are saved on the workspace and missing from the connected members' catalogs. Select an available model, or ask a connected member to click **Refresh usage and models**.

In the **Models** page, the member table lists who has ChatGPT connected and the last saved usage snapshot. Open the row menu and click **Set as default task owner**. Confirm **Save default owner**. That confirmation replaces the default owner on every intake.

## Assign work

Set the task owner to a member who has ChatGPT connected in this organization. That owner's subscription runs the task. Each member's connection stays on that member's account.

When the owner has no ChatGPT connection, choose another owner or ask that person to connect under **Account → Codex**.

## What you pay

The task owner's ChatGPT subscription covers Codex model use, subject to that account's limits. SuperPlane records the run and charges sandbox time separately through your organization's credits. See [Costs and budgets](/billing/costs-budgets).

## Related pages

- [Model sources](/billing/model-sources)
- [Bring your own key](/billing/bring-your-own-key)
