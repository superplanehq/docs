# Agent Guidelines for SuperPlane Documentation

This document provides guidelines for AI agents working with the SuperPlane documentation repository.

## Repository Overview

This repository contains the documentation for
[SuperPlane Factory](https://github.com/superplanehq/superplane), an AI software
factory for tracked agent work. The documentation site is built with
[Starlight](https://starlight.astro.build), a documentation framework built on
[Astro](https://astro.build).

## Project Structure

### Key Directories

- `src/content/docs/` - All documentation content (`.md` and `.mdx` files)
  - Each file becomes a route based on its file name
  - Organized by topic (for example, `get-started/` and `reference/`)
- `src/assets/` - Text-based assets such as SVG logos
- `public/` - Text-based static assets
- `docs-assets` R2 bucket - Raster images, videos and other binary assets
- `astro.config.mjs` - Starlight configuration (sidebar, title, etc.)

### File Organization

Documentation files follow a hierarchical structure:

- `get-started/` - Factory onboarding and first-task guides
- `components/` - Core and integration component reference
- `expressions/` - Expression syntax and function reference
- `security/` - Authentication, secrets and access control
- `reference/` - API reference and glossary

## Content Guidelines

### Markdown Frontmatter

All documentation files should include frontmatter with:

- `title` - Page title
- `description` - Page description (optional but recommended)

Example:

```markdown
---
title: Page Title
description: Brief description of the page content
---
```

### Writing spec

Concise rules for developer-facing docs. Use MUST/SHOULD/NEVER. When in doubt, read an exemplar page first.

#### Before you write

- MUST: Pick one content type and stick to it: **Tutorial**, **How-to**, **Reference**, **Conceptual**, or
  **Troubleshooting**. One page, one job.
- MUST: Read a similar existing page before writing (see [Exemplar pages](#exemplar-pages)).
- SHOULD: State the page goal in one line (verb: configure, explain, debug).

#### Voice

Classic devtool docs: clear, direct, pragmatic. Minimal marketing; anchor value in what the reader can do.

- MUST: Active voice, direct `you`, present tense.
- MUST: Imperative for steps: "Click **Save**", not "You will need to click **Save**".
- SHOULD: Short sentences. Contractions are fine (`you'll`, `it's`).
- NEVER: `easy`, `simple`, `quick`, `just`, `simply`, `really`, `very`, `obviously`, `clearly`.
- NEVER: Rhetorical questions, filler (`typically`, `generally`, `often` without a number), or `we` as a stand-in
  for `you`.
- NEVER: Words like `utilize`, `facilitate`, `commence`. Use `use`, `help`, `start`.

#### Anti-slop (AI tells)

- NEVER: Recap transitions ("With this setup complete…", "Now that we've covered…").
- NEVER: Spec-sheet voice ("provides", "is configurable", "is designed to").
- NEVER: Choppy fragments that split one idea into three sentences.
- NEVER: Generic openers ("In today's world…", "The question teams face is whether…").
- NEVER: Personified systems ("hand the browser a URL" → "the browser fetches the URL").

#### Structure

- MUST: Open every page with a one-paragraph TL;DR (what this page is for, who it's for).
- MUST: Sentence case headings: `## Configure environment variables`, not title case.
- MUST: Descriptive section headings; the reader should guess the section from the title alone.
- SHOULD: Keep paragraphs to 2–4 sentences. Use lists when you have 3+ parallel items.
- SHOULD: Spell out acronyms on first use: `Content Security Policy (CSP)`.
- MUST: Link the first mention of a SuperPlane term to [glossary](/reference/glossary/) when a page exists.

#### Formatting

- MUST: **Bold** UI elements (buttons, tabs, menu items). Don't quote them.
- MUST: Inline code for paths, flags, identifiers: `canvas`, `/api/v1`, `.yaml`.
- MUST: Descriptive link text. Never "click here" or bare URLs in prose.
- MUST: Internal links use site-root paths (`/reference/glossary`, `/get-started/overview`).
- DON'T: Hard-wrap prose in source (one line per paragraph). Cap code at ~80 columns.
- DON'T: Bold for emphasis in prose. Use callouts (`**Note:**`, `**Warning:**`) when needed.

#### Code

- MUST: Language tag on every fenced block. Explain what each block does in prose before or after.
- MUST: Runnable, realistic examples. Placeholders in `snake_case` (`your_access_token_here`).
- SHOULD: Minimal comments in code; explain non-obvious steps in prose.
- SHOULD: Specify versions or image tags when relevant (e.g., `stable`, `v0.4`).

#### Terminology

Use consistently: **factory**, **workspace**, **task**, **work order**, **line**, **automation**, **canvas**,
**node**, **component**, **run**, **payload**, **channel**, **subscription**, **expression**. Link to the glossary on first use per page.

- MUST: Write **open source** without a hyphen when it is a noun or an adjective: "open source project" and "SuperPlane is open source." Keep literal paths, slugs and identifiers unchanged.

#### Examples

- Focus on outcomes and cross-tool workflows.
- Avoid fake demo numbers unless the page is a step-by-step tutorial.

### Images

- Upload raster images and videos to the `docs-assets` Cloudflare R2 bucket
- Use repository-style object keys such as `src/assets/image-name.png`
- Reference assets with absolute `https://docs-assets.superplane.com/` URLs
- Never commit binary assets to this repository
- Use descriptive filenames
- Include alt text for accessibility

### Diagrams

- Prefer Mermaid diagrams in the page source for workflows, state changes and architecture. A contributor should be able to update a diagram in the same pull request as its text.
- Use sentence case labels and describe observable system states or actions. Do not use slogans as node labels.
- Model the normal path first. Show retries as labeled loops and exceptional human decisions as branches. Do not add repeated human review nodes when the standard workflow has one final review.
- Add one sentence below every diagram that explains the path and any important exception. The prose must remain useful when the diagram is not rendered.
- Use a raster diagram only when the source cannot be represented clearly in Mermaid. Store the editable source beside the exported asset or document the source tool and export steps in the pull request.
- Run `npm run build` after editing a Mermaid diagram and inspect it in the dark theme at desktop and mobile widths.

### Navigation and information architecture

- Prefer Starlight **autogenerated sections** (`autogenerate`) for directories that will grow (e.g. `reference/`,
  `components/`).
- If you add a manual sidebar entry, ensure the **slug exists** and the site builds. A bad slug fails the build.
- Avoid leaving unused “template” pages around; they can create confusing routes or warnings.

## Common Tasks

### Adding New Documentation

1. Create a new `.md` or `.mdx` file in the appropriate directory under `src/content/docs/`
2. Add frontmatter with `title` and `description`
3. Write the content following existing patterns
4. Update `astro.config.mjs` if you need to modify the sidebar structure

### Editing Existing Documentation

1. Locate the file in `src/content/docs/`
2. Maintain the existing structure and style
3. Update frontmatter if the title or description changes
4. Ensure links remain valid

### Adding Images

1. Upload the image to the `docs-assets` R2 bucket with a key such as `src/assets/image-name.png`
2. Reference it in Markdown: `![Alt text](https://docs-assets.superplane.com/src/assets/image-name.png)`
3. Run `npm run check:text-only` before committing

## Technical Details

### Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start local dev server at `localhost:4321`
- `npm run generate:llms` - Generate `public/llms.txt` and `public/llms-full.txt`
- `npm run build` - Build production site
- `npm run preview` - Preview production build locally

When making content or navigation changes, run `npm run build` to catch:

- invalid slugs
- missing/invalid frontmatter
- broken asset paths

### Key Dependencies

- `@astrojs/starlight` - Starlight documentation framework
- `astro` - Astro framework
- `sharp` - Image processing

## Best Practices

1. **Consistency**: Follow existing documentation patterns and structure
2. **Clarity**: Write for users who may be new to SuperPlane
3. **Completeness**: Include all necessary steps and prerequisites
4. **Accuracy**: Ensure code examples and commands are correct and tested
5. **Organization**: Place content in the appropriate directory based on topic
6. **Links**: Use site-root paths for internal links (`/get-started/...`); relative paths for images
7. **Versioning**: When mentioning versions or tags, be specific (e.g., `v0.4`, `stable`, `beta`)

## Notes for AI Agents

- Follow the [Writing spec](#writing-spec) for all content changes
- Read an exemplar page in the same category before writing or editing
- Maintain the hierarchical organization of documentation
- Update the sidebar source in `src/config/sidebar.mjs` if adding new top-level sections
- Test that relative paths for images and links are correct based on file location
- Preserve frontmatter structure when editing files
- Run `npm run build` after content or navigation changes
- Treat `public/llms.txt` and `public/llms-full.txt` as generated artifacts (do not edit manually)
- Keep the Git repository text-only. Store raster images, videos and other binaries in the `docs-assets` R2 bucket.
- Keep `public/robots.txt` limited to crawler policy, sitemap discovery, and comments that point to agent-readable indexes. Do not use non-standard directives to advertise `llms.txt`.
- Keep the `<link rel="describedby" href="/llms.txt">` discovery hint in the shared document head when changing head metadata.

### Exemplar pages

| Type | Example |
| --- | --- |
| Tutorial | `src/content/docs/get-started/quickstart.mdx` |
| Conceptual | `src/content/docs/get-started/overview.mdx` |
| Reference | `src/content/docs/reference/api.md` |
| Landing | `src/content/docs/use-cases/overview.mdx` |
