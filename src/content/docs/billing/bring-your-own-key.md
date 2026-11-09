---
title: Bring your own key
description: Run workspace agents with your Claude, OpenAI, or OpenRouter API key.
---

Bring your own key (BYOK) runs workspace agents with an API key from Claude, OpenAI or OpenRouter on Team and Enterprise. Your provider bills model tokens, and SuperPlane adds no token markup. Sandbox time still uses SuperPlane credits.

## Before you start

You need a Team or Enterprise plan and the **Maintainer** or **Admin** role. See [SuperPlane pricing](https://superplane.com/pricing/) for plan availability.

## Connect the key

1. Open **Settings → Models**.
2. Click **Change model source**.
3. Click **Select Your API key**.
4. In **New API key provider**, choose **Claude**, **OpenAI**, or **OpenRouter**.
5. Click **Switch to Claude**, **Switch to OpenAI**, or **Switch to OpenRouter**.
6. When the provider is not connected yet, enter the API key and click **Save and switch**.

When the provider is already connected, **Switch to** that provider keeps the existing key. If **Your API key** is already the source, click **Change model source**, then **Change provider**, to move to another provider.

Open **Settings → Integrations** and look for **Claude**, **OpenAI**, or **OpenRouter** to see your existing API keys and manage them. On **Models**, click **Open integration** to review or replace the key this workspace uses.

## Choose models

The page lists models available from the connected key.

1. Keep **Use all available models** selected, or clear it and select models.
2. Click **Save models**.

## What changes for runs and billing

Agents in this workspace run with the connected key. Your provider bills those model tokens. SuperPlane records the token use.

Sandbox time stays on your SuperPlane usage and draws from your organization's credits. See [Costs and budgets](/billing/costs-budgets).

An OpenAI API key is separate from a ChatGPT subscription. To run Codex on a ChatGPT plan, use [Bring your own subscription](/billing/bring-your-own-subscription).

## Related pages

- [Model sources](/billing/model-sources)
