# SuperPlane Documentation

This repository contains the documentation for [SuperPlane](https://github.com/superplanehq/superplane), an open source AI software factory for engineering teams. SuperPlane coordinates AI agents, source control, continuous integration (CI), review, approvals, and feedback to move high-confidence routine work from the backlog to verified, review-ready pull requests.

Agents perform the work. Workflows define the allowed scope, required checks, review policies, approval points, and escalation paths. This keeps control and verification in the workflow instead of depending on a specific model or agent.

## About

This documentation site is built with [Starlight](https://starlight.astro.build), a documentation framework built on [Astro](https://astro.build) and deployed to [docs.superplane.com](https://docs.superplane.com) via Cloudflare Pages.

## LLM Context Files

This repo publishes two LLM-oriented files at:

- `/llms.txt`
- `/llms-full.txt`

These files are generated automatically during `npm run build` (via `prebuild`) and should not be edited manually.

## Contributing

We welcome your contributions to improve the documentation. See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and contribution guidelines.

If you have any questions, please reach out to us on [Discord](https://discord.superplane.com).

If you find something missing, confusing, or wrong, please [open an issue](https://github.com/superplanehq/docs/issues) to put it on our radar.
