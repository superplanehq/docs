# SuperPlane Documentation

This repository contains the documentation for [SuperPlane](https://github.com/superplanehq/superplane), the open source DevOps control plane.

## About This Documentation Site

This documentation site is built with [Starlight](https://starlight.astro.build), a documentation framework built on [Astro](https://astro.build) and deployed to Cloudflare Pages.

### Project Structure

**Key Starlight concepts:**
- Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.
- Images can be added to `src/assets/` and embedded in Markdown with a relative link.
- Static assets, like favicons, can be placed in the `public/` directory.
- Configure your site's sidebar, title, and other settings in `astro.config.mjs`.

Check out [Starlight docs](https://starlight.astro.build/getting-started/) for more information about its features.

### Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
