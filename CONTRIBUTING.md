# Contributing to SuperPlane Documentation

Thank you for contributing to the SuperPlane documentation. This guide will help you get set up for local development.

## Development Setup

### Prerequisites

- Node.js (version specified in `.nvmrc` if present, or latest LTS)
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/superplanehq/docs.git
cd docs
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`.

## Project Structure

This documentation site is built with [Starlight](https://starlight.astro.build), a documentation framework built on [Astro](https://astro.build).

**Key concepts:**

- Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.
- Text-based assets such as SVG files can be added to `src/assets/`.
- Raster images, videos and other binaries must be uploaded to the `docs-assets` Cloudflare R2 bucket and referenced through `https://docs-assets.superplane.com/`.
- Configure your site's sidebar, title and other settings in `astro.config.mjs`.

## Available Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Making Changes

### Content Guidelines

- Follow the writing style guidelines in [AGENTS.md](./AGENTS.md)
- Use clear, concise language
- Include code examples where helpful
- Upload binary assets to the `docs-assets` R2 bucket and reference their absolute `https://docs-assets.superplane.com/` URLs
- Keep markdown files to 120 characters width

### File Organization

- Documentation files go in `src/content/docs/`
- Text-based assets go in `src/assets/` or `public/`
- Binary assets go in the `docs-assets` R2 bucket

### Testing Your Changes

Before submitting a pull request:

1. Run the build to check for errors:

```bash
npm run build
```

2. Preview the production build:

```bash
npm run preview
```

This helps catch:
- Invalid slugs in `astro.config.mjs`
- Missing or invalid frontmatter
- Broken asset paths

## Submitting Changes

1. Create a branch for your changes
2. Make your edits
3. Test locally with `npm run build`
4. Commit your changes
5. Open a pull request

For more details on our writing style and conventions, see [AGENTS.md](./AGENTS.md).
