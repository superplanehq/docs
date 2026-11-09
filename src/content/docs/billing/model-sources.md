---
title: Model sources
description: Compare model sources and plan availability, then choose how your workspace runs agents.
---

Choose one model source for each workspace: SuperPlane-provided models, your provider API key or members' ChatGPT subscriptions for Codex. The source applies to the workspace's agents. Open **Settings → Models** and click **Change model source** to view the sources your organization can use.

## Compare the sources

<div class="billing-comparison billing-details-table billing-sources" role="region" aria-label="Compare model sources and available plans" tabindex="0">

| Source | Available plans | How model use is paid for |
| --- | --- | --- |
| SuperPlane | All plans. | SuperPlane credits at provider API rates plus 10% on Pay-as-you-go, Starter and Team; custom rates on Enterprise. |
| Your API key | Team and Enterprise. | Your Anthropic, OpenAI or OpenRouter account pays for tokens. SuperPlane adds no token markup. |
| ChatGPT subscriptions | All plans. | Each task uses its owner's connected ChatGPT subscription for Codex. SuperPlane adds no token markup. |

</div>

Sandbox time uses SuperPlane credits with every source. A connected provider key or Codex subscription does not cover sandbox charges. Read [Costs and budgets](/billing/costs-budgets) to plan usage and [SuperPlane pricing](https://superplane.com/pricing/) for current plan terms.

Enterprise can also connect your organization's inference infrastructure, such as AWS Bedrock. [Contact the SuperPlane team](https://superplane.com/demo/) to discuss that setup.

## Set up a source

- [Bring your own key](/billing/bring-your-own-key) connects a Claude, OpenAI or OpenRouter API key on Team or Enterprise.
- [Bring your own subscription](/billing/bring-your-own-subscription) connects personal ChatGPT subscriptions for Codex on any plan.

After the source is active, choose models on the same page. Keep **Use all available models** selected, or clear it and select the models agents can use. Click **Save models**.

You can view **Models** when you can read the workspace. You can change the source and the model list when you can update the workspace.

## Related pages

- [Billing overview](/billing/overview)
- [Costs and budgets](/billing/costs-budgets)
