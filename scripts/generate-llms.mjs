import fs from "node:fs";
import path from "node:path";
import { sidebar } from "../src/config/sidebar.mjs";

const BASE_URL = "https://docs.superplane.com";
const DOCS_ROOT = "src/content/docs";
const PUBLIC_DIR = "public";

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function trimQuotes(value) {
  return value.replace(/^['"]|['"]$/g, "");
}

function parseDocFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const frontmatter = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  let title = "";
  let description = "";
  let body = raw.trim();

  if (frontmatter) {
    body = raw.slice(frontmatter[0].length).trim();
    for (const line of frontmatter[1].split("\n")) {
      const titleMatch = line.match(/^title:\s*(.*)$/);
      if (titleMatch) title = trimQuotes(titleMatch[1].trim());

      const descriptionMatch = line.match(/^description:\s*(.*)$/);
      if (descriptionMatch) description = trimQuotes(descriptionMatch[1].trim());
    }
  }

  if (!description) {
    description = firstMeaningfulLine(body) || `${title || "Documentation"} page.`;
  }

  return { title, description, body };
}

function firstMeaningfulLine(body) {
  const lines = body.split("\n");
  let inFence = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (trimmed.startsWith("import ")) continue;
    if (trimmed.startsWith("<")) continue;
    if (trimmed.startsWith("#")) continue;
    return trimmed;
  }
  return "";
}

function slugToUrl(slug) {
  return slug === "" ? `${BASE_URL}/` : `${BASE_URL}/${slug}/`;
}

// Starlight uses lowercase slugs even when source filenames contain capitals.
// Resolve against actual filenames so Linux and macOS produce the same index.
const docFilesByPath = new Map();
for (const entry of fs.readdirSync(DOCS_ROOT, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || !/\.mdx?$/.test(entry.name)) continue;
  const filePath = path.join(entry.parentPath, entry.name);
  const key = filePath.toLowerCase();
  if (docFilesByPath.has(key)) {
    throw new Error(`Docs paths differ only by case: "${docFilesByPath.get(key)}" and "${filePath}"`);
  }
  docFilesByPath.set(key, filePath);
}

function slugToFilePath(slug) {
  const base = slug === "" ? "index" : slug;
  const candidates = [
    path.join(DOCS_ROOT, `${base}.md`),
    path.join(DOCS_ROOT, `${base}.mdx`),
    path.join(DOCS_ROOT, base, "index.md"),
    path.join(DOCS_ROOT, base, "index.mdx"),
  ];
  const filePath = candidates.map((candidate) => docFilesByPath.get(candidate.toLowerCase())).find(Boolean);
  if (filePath) return filePath;
  throw new Error(`Could not find docs file for slug: "${slug}"`);
}

function resolveItems(items) {
  return items.flatMap((item) => {
    if (Array.isArray(item.items)) return resolveItems(item.items);
    if (typeof item.slug !== "string") return [];

    const filePath = slugToFilePath(item.slug);
    const parsed = parseDocFile(filePath);
    return [
      {
        label: item.label,
        slug: item.slug,
        url: slugToUrl(item.slug),
        filePath,
        description: parsed.description,
        body: parsed.body,
      },
    ];
  });
}

function resolveManualSections(sidebarConfig) {
  return sidebarConfig
    .filter((section) => Array.isArray(section.items))
    .map((section) => ({ label: section.label, entries: resolveItems(section.items) }));
}

function resolveDirectory(dir, label) {
  const absolute = path.join(DOCS_ROOT, dir);
  const files = fs
    .readdirSync(absolute)
    .filter((name) => (name.endsWith(".md") || name.endsWith(".mdx")) && !name.startsWith("index."))
    .sort((a, b) => a.localeCompare(b));

  const entries = files.map((name) => {
    const filePath = path.join(absolute, name);
    const parsed = parseDocFile(filePath);
    const basename = name.replace(/\.(md|mdx)$/, "");
    const slug = `${dir}/${basename.toLowerCase()}`;

    return {
      label: parsed.title || basename,
      slug,
      url: slugToUrl(slug),
      filePath,
      description: parsed.description,
      body: parsed.body,
    };
  });

  return { label, entries };
}

function sectionListLines(section) {
  const lines = [`## ${section.label}`, ""];
  for (const entry of section.entries) {
    lines.push(`- [${entry.label}](${entry.url}): ${entry.description}`);
  }
  lines.push("");
  return lines;
}

function fullSectionLines(section) {
  const lines = [`### ${section.label}`, ""];
  for (const entry of section.entries) {
    lines.push(`#### ${entry.label}`);
    lines.push("");
    lines.push(`Source URL: ${entry.url}`);
    lines.push("");
    lines.push(entry.body);
    lines.push("");
  }
  return lines;
}

function buildLlmsTxt(sections) {
  const lines = [
    "# SuperPlane Docs",
    "",
    "> SuperPlane documentation for building and operating an AI software factory.",
    "",
    "This file provides a structured index of documentation pages for LLM-based tools.",
    "",
  ];

  for (const section of sections) {
    lines.push(...sectionListLines(section));
  }

  return `${lines.join("\n").trim()}\n`;
}

function buildLlmsFullTxt(sections) {
  const lines = [
    "# SuperPlane Docs (Full)",
    "",
    "> Comprehensive companion to `/llms.txt` with full page content for the current docs table of contents.",
    "",
    "SuperPlane Factory turns approved software tasks into tracked agent work.",
    "",
  ];

  for (const section of sections) {
    lines.push(...sectionListLines(section));
  }

  lines.push("## Full Content");
  lines.push("");

  for (const section of sections) {
    lines.push(...fullSectionLines(section));
  }

  return `${lines.join("\n").trim()}\n`;
}

function writeOutput(name, content) {
  const outputPath = path.join(PUBLIC_DIR, name);
  fs.writeFileSync(outputPath, content);
  return outputPath;
}

function main() {
  ensureDir(PUBLIC_DIR);

  const sections = resolveManualSections(sidebar);
  sections.push(resolveDirectory("components", "Component details"));

  const llms = buildLlmsTxt(sections);
  const llmsFull = buildLlmsFullTxt(sections);

  const llmsPath = writeOutput("llms.txt", llms);
  const llmsFullPath = writeOutput("llms-full.txt", llmsFull);

  console.log(`Generated ${llmsPath}`);
  console.log(`Generated ${llmsFullPath}`);
}

main();
