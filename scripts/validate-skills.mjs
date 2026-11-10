import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] ? process.argv[2] : process.cwd();
const skillsDir = join(root, "skills");
const errors = [];

const skillIds = readdirSync(skillsDir).filter((entry) =>
  statSync(join(skillsDir, entry)).isDirectory(),
);
if (skillIds.length === 0) {
  errors.push("skills/: no skill directories found");
}

const readmes = [];
for (const name of ["README.md", "README.zh-CN.md"]) {
  const file = join(root, name);
  if (existsSync(file)) {
    readmes.push({ name, text: readFileSync(file, "utf8") });
  } else if (name === "README.md") {
    errors.push("README.md: file is missing");
  }
}

const forbidden = [
  [/\b[A-Za-z]:\\/, "absolute Windows path"],
  [/\/Users\/[^/\s]+/, "absolute macOS home path"],
  [/\/home\/[^/\s]+/, "absolute Linux home path"],
  [/\bsk-[A-Za-z0-9]{16,}/, "API key"],
  [/\bghp_[A-Za-z0-9]{20,}/, "GitHub token"],
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS key"],
];

for (const id of skillIds) {
  const file = join(skillsDir, id, "SKILL.md");
  let text;
  try {
    text = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  } catch {
    errors.push(`${id}: SKILL.md is missing`);
    continue;
  }

  if (!text.startsWith("---\n")) {
    errors.push(`${id}: frontmatter must start on line 1`);
    continue;
  }
  const end = text.indexOf("\n---", 4);
  if (end === -1) {
    errors.push(`${id}: frontmatter is not closed`);
    continue;
  }
  const frontmatter = text.slice(4, end);

  const allowedKeys = new Set([
    "name",
    "description",
    "enable",
    "allowed-tools",
  ]);
  const keys = frontmatter
    .split("\n")
    .filter((line) => /^[A-Za-z0-9_-]+:/.test(line))
    .map((line) => line.split(":")[0].trim());
  for (const key of keys) {
    if (!allowedKeys.has(key)) {
      errors.push(`${id}: unsupported frontmatter field "${key}"`);
    }
  }

  const name = /^name:\s*(.+)$/m
    .exec(frontmatter)?.[1]
    ?.trim()
    .replace(/^["']|["']$/g, "");
  const descriptionRaw = /^description:\s*(.*)$/m.exec(frontmatter)?.[1]?.trim() ?? "";
  const description = descriptionRaw.replace(/^["']|["']$/g, "");
  const enable = /^enable:\s*(.*)$/m.exec(frontmatter)?.[1]?.trim() ?? "";

  if (enable && !/^(true|false)$/i.test(enable)) {
    errors.push(`${id}: enable must be true or false`);
  }
  if (descriptionRaw.startsWith("|") || descriptionRaw.startsWith(">")) {
    errors.push(`${id}: description must be a single line`);
  }

  if (name !== id) {
    errors.push(`${id}: name "${name ?? ""}" does not match the folder name`);
  }
  if (!description) {
    errors.push(`${id}: description is missing`);
  } else if (description.length < 40) {
    errors.push(`${id}: description is too short to be a trigger`);
  } else if (description.length > 600) {
    errors.push(`${id}: description is longer than 600 characters`);
  }

  for (const { name: readmeName, text: readme } of readmes) {
    if (!readme.includes(`skills/${id}/SKILL.md`)) {
      errors.push(`${id}: ${readmeName} does not link skills/${id}/SKILL.md`);
    }
  }

  for (const [pattern, label] of forbidden) {
    if (pattern.test(text)) {
      errors.push(`${id}: contains a ${label}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`validate-skills: ${errors.length} issue(s)`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`validate-skills: ${skillIds.length} skill(s) OK`);
