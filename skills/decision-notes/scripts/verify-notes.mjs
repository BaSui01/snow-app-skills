import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = process.argv[2] ? resolve(process.argv[2]) : process.cwd();
const notesRoot = join(root, ".agents", "notes");
const LIFECYCLES = ["proposed", "implemented", "rejected", "archived"];
const CLASSES = new Set([
  "feature",
  "bug-fix",
  "simplification",
  "architecture",
  "process",
  "testing",
]);
const REQUIRED = {
  proposed: [
    "## Problem",
    "## Proposal",
    "## Alternatives considered",
    "## Acceptance criteria",
    "## Risks",
  ],
  implemented: [
    "## Problem",
    "## Decision",
    "## Alternatives considered",
    "## Consequences",
  ],
  rejected: ["## Problem", "## Proposal", "## Alternatives considered"],
  archived: [
    "## Problem",
    "## Decision",
    "## Alternatives considered",
    "## Consequences",
  ],
};
const FORBIDDEN_IMPLEMENTED = [
  "## Proposal",
  "## Plan",
  "## Migration plan",
  "## Acceptance criteria",
  "## 方案",
  "## 计划",
  "## 迁移计划",
  "## 验收标准",
];
const FILE_NAME = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

const errors = [];
let count = 0;

if (!existsSync(notesRoot)) {
  console.error("verify-notes: .agents/notes is missing");
  process.exit(1);
}

if (existsSync(join(notesRoot, "INDEX.md"))) {
  errors.push(
    ".agents/notes/INDEX.md: remove the global index; the folder path is the state",
  );
}

for (const lifecycle of LIFECYCLES) {
  const lifecycleDir = join(notesRoot, lifecycle);
  if (!existsSync(lifecycleDir)) {
    errors.push(`.agents/notes/${lifecycle}: lifecycle folder is missing`);
    continue;
  }

  for (const entry of readdirSync(lifecycleDir)) {
    if (entry.startsWith(".") || entry === "README.md") continue;
    const classDir = join(lifecycleDir, entry);
    const rel = `.agents/notes/${lifecycle}/${entry}`;

    if (!statSync(classDir).isDirectory()) {
      errors.push(`${rel}: only class folders are allowed at this level`);
      continue;
    }
    if (!CLASSES.has(entry)) {
      errors.push(`${rel}: unknown class "${entry}"`);
      continue;
    }

    for (const file of readdirSync(classDir)) {
      if (!file.endsWith(".md") || file === "README.md") continue;
      const relFile = `${rel}/${file}`;

      if (!FILE_NAME.test(file)) {
        errors.push(
          `${relFile}: file name must be YYYY-MM-DD-topic.md in ASCII kebab-case`,
        );
        continue;
      }

      count += 1;
      const text = readFileSync(join(classDir, file), "utf8").replace(
        /\r\n/g,
        "\n",
      );
      const lines = text.split("\n");

      if (!/^# Agent Note: \S/.test(lines[0] ?? "")) {
        errors.push(`${relFile}: first line must be "# Agent Note: <title>"`);
      }

      const statusLine = (lines[1] ?? "").trim();
      if (!statusLine.startsWith("Status: ")) {
        errors.push(`${relFile}: second line must be "Status: <status>"`);
      } else {
        const status = statusLine.slice("Status: ".length).trim();
        if (lifecycle === "rejected") {
          if (!/^rejected\s*[-—]\s*\S/.test(status)) {
            errors.push(
              `${relFile}: rejected status needs a reason, "Status: rejected — <reason>"`,
            );
          }
        } else if (status !== lifecycle) {
          errors.push(
            `${relFile}: status "${status}" must match the ${lifecycle} folder`,
          );
        }
      }

      for (const heading of REQUIRED[lifecycle]) {
        if (!lines.some((line) => line.trim() === heading)) {
          errors.push(`${relFile}: missing section "${heading}"`);
        }
      }

      if (lifecycle === "implemented") {
        for (const heading of FORBIDDEN_IMPLEMENTED) {
          if (lines.some((line) => line.trim() === heading)) {
            errors.push(
              `${relFile}: implemented notes must not contain "${heading}"`,
            );
          }
        }
      }

      if (
        lifecycle === "archived" &&
        !lines.some((line) => line.trim().startsWith("Archived:"))
      ) {
        errors.push(
          `${relFile}: archived notes need an "Archived:" line`,
        );
      }

      const noteDir = dirname(join(classDir, file));
      for (const match of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
        const target = match[1];
        if (/^(https?:|mailto:|#)/.test(target)) continue;
        const clean = target.split("#")[0];
        if (!clean) continue;
        if (!existsSync(resolve(noteDir, clean))) {
          errors.push(`${relFile}: broken relative link "${target}"`);
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`verify-notes: ${errors.length} issue(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`verify-notes: ${count} note(s) OK`);
