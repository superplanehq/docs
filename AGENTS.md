# Agent Guidelines for SuperPlane Documentation

This document provides guidelines for AI agents working with the SuperPlane documentation repository.

## Repository Overview

This repository contains the documentation for
[SuperPlane](https://github.com/superplanehq/superplane), an open source DevOps
control plane. The documentation site is built with
[Starlight](https://starlight.astro.build), a documentation framework built on
[Astro](https://astro.build).

## Project Structure

### Key Directories

- `src/content/docs/` - All documentation content (`.md` and `.mdx` files)
  - Each file becomes a route based on its file name
  - Organized by topic (e.g., `installation/`, `reference/`)
- `src/assets/` - Images and other assets referenced in documentation
- `public/` - Static assets like favicons
- `astro.config.mjs` - Starlight configuration (sidebar, title, etc.)

### File Organization

Documentation files follow a hierarchical structure:

- `get-started/` - Getting started guides
- `installation/` - Installation instructions
  - `local.md` - Local installation
  - `single-host/` - Single host deployments
  - `kubernetes/` - Kubernetes deployments
- `reference/` - Reference documentation

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
- MUST: Link the first mention of a SuperPlane term to [glossary](/concepts/glossary/) when a page exists.

#### Formatting

- MUST: **Bold** UI elements (buttons, tabs, menu items). Don't quote them.
- MUST: Inline code for paths, flags, identifiers: `canvas`, `/api/v1`, `.yaml`.
- MUST: Descriptive link text. Never "click here" or bare URLs in prose.
- MUST: Internal links use site-root paths (`/concepts/glossary`, `/installation/local`).
- DON'T: Hard-wrap prose in source (one line per paragraph). Cap code at ~80 columns.
- DON'T: Bold for emphasis in prose. Use callouts (`**Note:**`, `**Warning:**`) when needed.

#### Code

- MUST: Language tag on every fenced block. Explain what each block does in prose before or after.
- MUST: Runnable, realistic examples. Placeholders in `snake_case` (`your_access_token_here`).
- SHOULD: Minimal comments in code; explain non-obvious steps in prose.
- SHOULD: Specify versions or image tags when relevant (e.g., `stable`, `v0.4`).

#### Terminology

Use consistently: **canvas**, **node**, **component**, **run**, **run item**, **payload**, **channel**,
**subscription**, **expression**. Link to the glossary on first use per page.

#### Examples

- Focus on outcomes and cross-tool workflows.
- Avoid fake demo numbers unless the page is a step-by-step tutorial.

### Images

- Place images in `src/assets/`
- Reference them with relative paths in Markdown
- Use descriptive filenames
- Include alt text for accessibility

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

1. Save the image to `src/assets/`
2. Reference it in Markdown: `![Alt text](../assets/image-name.png)`
3. Adjust the relative path based on the documentation file's location

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
6. **Links**: Use site-root paths for internal links (`/concepts/...`); relative paths for images
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

### Exemplar pages

| Type | Example |
| --- | --- |
| Tutorial | `src/content/docs/get-started/quickstart.md` |
| Conceptual | `src/content/docs/concepts/data-flow.md` |
| Installation | `src/content/docs/installation/local.md` |
| Landing | `src/content/docs/index.md` |
