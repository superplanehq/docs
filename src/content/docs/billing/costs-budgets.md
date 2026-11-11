---
title: Costs and budgets
description: Estimate plan and usage charges, fund credits and control software factory spending.
---

Plan for the monthly subscription, sandbox time and model use separately. Fund your organization's usage with credits, then review spending as you run tasks. Team and Enterprise include budget limits for groups, users, workspaces and individual tasks.

<figure class="sp-media-figure sp-media-figure--flush not-content">
  <img
    src="https://docs-assets.superplane.com/videos/superplane_billing_1280.gif"
    alt="Managing billing in SuperPlane"
    loading="lazy"
    decoding="async"
  />
</figure>

Use [Billing overview](/billing/overview) to compare plans, and check [SuperPlane pricing](https://superplane.com/pricing/) for current rates and commercial terms.

## Know what contributes to cost

<div class="billing-comparison billing-details-table billing-costs" role="region" aria-label="Understand subscription and usage costs" tabindex="0">

| Cost | How it is charged | Where you pay |
| --- | --- | --- |
| Monthly plan | No monthly fee on Pay-as-you-go; per organization on Starter; per user on Team; custom on Enterprise. | SuperPlane subscription. |
| Sandbox time | Compute used by task runs, including runs on your own model account. | SuperPlane credits. |
| SuperPlane-provided tokens | Provider API rate plus 10% on Pay-as-you-go, Starter and Team; custom rates on Enterprise. | SuperPlane credits. |
| Your provider API key | Your provider's token charges, with no SuperPlane token markup. Available on Team and Enterprise. | Your provider account. |
| Your Codex subscription | Model use through the task owner's connected ChatGPT subscription. Available on all plans. | Your ChatGPT account. |

</div>

External services you connect can bill you separately. A retry can consume more sandbox time and model usage, so include repeated attempts when you estimate the cost of completing a task.

## Estimate monthly spending

Start with the subscription for your plan, then add expected sandbox charges and SuperPlane-provided model usage. Track charges to external model accounts separately so you can see the full cost of your workflow.

Run a small set of similar tasks before increasing volume. Record sandbox time, model usage, retry count and cost for each completed result. Use that baseline to estimate the credits you need for your expected task volume.

## Keep credits available

Buy credits for sandbox time and SuperPlane-provided model tokens. Top up when needed or schedule automatic purchases through your organization's billing settings. Review the credit balance alongside recent consumption before starting more work.

Connecting your own provider key or ChatGPT subscription changes how model use is paid for. Sandbox time still draws from SuperPlane credits.

## Set budget limits

Team and Enterprise include spending limits per group, user or workspace, plus a maximum spend per task. Use these controls to define how much work a team or workspace can consume and to bound the cost of an individual task.

Choose limits based on your observed task costs and expected volume. Review them when you change models, expand repository coverage or increase parallel work. See [SuperPlane pricing](https://superplane.com/pricing/) for budget feature availability.

Use provider budgets and alerts for charges billed to your own API keys. Keep the connected account's subscription limits in mind when running Codex through ChatGPT.

## Reduce avoidable usage

- Keep tasks focused and define acceptance criteria before starting them.
- Choose a model that matches the work each stage needs to do.
- Check failed runs before retrying to avoid repeating the same setup or credential error.
- Increase parallel work after you understand its effect on cost and throughput.
- Review spend on unsuccessful attempts alongside cost per completed task.

## Related pages

- [Billing overview](/billing/overview)
- [Model sources](/billing/model-sources)
- [Bring your own subscription](/billing/bring-your-own-subscription)
