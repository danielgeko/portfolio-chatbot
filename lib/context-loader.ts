import fs from "fs";
import path from "path";

const CONTENT_ENV_VAR = "PORTFOLIO_CONTENT_JSON";

function readContentFile(relPath: string): string {
  const bundled = process.env[CONTENT_ENV_VAR];
  if (bundled) {
    const parsed = JSON.parse(bundled) as Record<string, string>;
    const value = parsed[relPath];
    if (value === undefined) {
      throw new Error(`Missing "${relPath}" in ${CONTENT_ENV_VAR}`);
    }
    return value;
  }
  return fs.readFileSync(path.join(process.cwd(), "content", relPath), "utf-8");
}

export function getSystemBlocks() {
  const persona = readContentFile("system-prompt.md");
  const resume = readContentFile("resume.md");

  return [
    { type: "text" as const, text: persona },
    {
      type: "text" as const,
      text: resume,
      cache_control: { type: "ephemeral" as const, ttl: "1h" as const },
    },
  ];
}
