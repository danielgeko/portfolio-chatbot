import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_ENV_VAR = "PORTFOLIO_CONTENT_JSON";

function getBundle(): Record<string, string> | null {
  const bundled = process.env[CONTENT_ENV_VAR];
  return bundled ? (JSON.parse(bundled) as Record<string, string>) : null;
}

function readContentFile(relPath: string): string {
  const bundle = getBundle();
  if (bundle) {
    const value = bundle[relPath];
    if (value === undefined) {
      throw new Error(`Missing "${relPath}" in ${CONTENT_ENV_VAR}`);
    }
    return value;
  }
  return fs.readFileSync(path.join(process.cwd(), "content", relPath), "utf-8");
}

// Returns the raw text of every entry file in content/<dir> (skipping
// _template.md), most-recent-first by filename.
function readEntryFiles(relDir: string): string[] {
  const bundle = getBundle();
  if (bundle) {
    return Object.keys(bundle)
      .filter((key) => key.startsWith(`${relDir}/`) && !key.endsWith("_template.md"))
      .sort()
      .reverse()
      .map((key) => bundle[key]);
  }

  const dirPath = path.join(process.cwd(), "content", relDir);
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".md") && f !== "_template.md")
    .sort()
    .reverse()
    .map((f) => fs.readFileSync(path.join(dirPath, f), "utf-8"));
}

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Turns "2026-05" into "May 2026"; passes anything else through unchanged.
function formatMonth(value: unknown): string {
  const s = String(value ?? "");
  const m = s.match(/^(\d{4})-(\d{2})$/);
  if (!m) return s;
  return `${MONTHS[Number(m[2])] ?? ""} ${m[1]}`.trim();
}

// Parses an entry's frontmatter into a "### Heading" + body block, dropping the
// raw YAML so it never renders as literal text.
function formatEntry(raw: string): string {
  const { data, content } = matter(raw);
  const title = data.title ?? "";
  const org = data.org ? ` — ${data.org}` : "";
  const dates =
    data.start || data.end
      ? ` (${formatMonth(data.start)}${data.end ? ` – ${formatMonth(data.end)}` : ""})`
      : "";
  const heading = `### ${title}${org}${dates}`;
  return `${heading}\n${content.trim()}`;
}

function readEntries(relDir: string): string {
  return readEntryFiles(relDir).map(formatEntry).join("\n\n");
}

// ---- Static page content (rendered as markdown) ----
// (The Resume page renders public/resume.pdf directly, so no resume loader here.)

export function getProjectsMarkdown(): string {
  return `# Projects\n\n${readEntries("projects")}`;
}

export function getContactMarkdown(): string {
  return readContentFile("contact.md");
}

// ---- Chatbot context ----

// The chatbot knows everything: persona + all content combined into one
// cached prefix. Only the trailing user messages vary per request.
export function getChatbotSystemBlocks() {
  const persona = readContentFile("system-prompt.md");
  const combined = [
    `# Resume\n\n${readContentFile("resume.md")}`,
    `# Experience\n\n${readEntries("experience")}`,
    `# Projects\n\n${readEntries("projects")}`,
    `# Personal\n\n${readContentFile("personal.md")}`,
  ].join("\n\n");

  return [
    { type: "text" as const, text: persona },
    {
      type: "text" as const,
      text: combined,
      cache_control: { type: "ephemeral" as const, ttl: "1h" as const },
    },
  ];
}
