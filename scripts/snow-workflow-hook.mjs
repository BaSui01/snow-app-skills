#!/usr/bin/env node
// Snow App workflow hooks.
// Usage: node snow-workflow-hook.mjs <classify|guard|evidence|verify>
// The hook event JSON arrives on stdin; exit 0 passes (stdout becomes context),
// exit 2 aborts the guarded step and shows stderr.

import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const mode = process.argv[2] ?? "";
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const VERIFY_SCRIPT = join(SCRIPT_DIR, "verify-notes.mjs");

const readStdin = () => {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
};

const parseContext = () => {
  const raw = readStdin().trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const pass = (context = "") => {
  if (context) process.stdout.write(`${context}\n`);
  process.exit(0);
};

const abort = (message) => {
  process.stderr.write(`${message}\n`);
  process.exit(2);
};

const context = parseContext();
const cwd =
  typeof context.cwd === "string" && context.cwd ? context.cwd : process.cwd();

const WRITE_TOOLS = new Set([
  "filesystem-replace_edit",
  "filesystem-create",
  "filesystem-copy",
]);

const DESTRUCTIVE_GIT = [
  /\bgit\s+reset\s+--hard\b/i,
  /\bgit\s+checkout\s+--\b/i,
  /\bgit\s+clean\s+-[a-z]*f/i,
  /\bgit\s+push\b[^\n]*--force/i,
  /\bgit\s+restore\b[^\n]*(\s\.|\s--staged|\s--worktree)/i,
];

const guard = () => {
  const toolName = String(context.toolName ?? "");
  const argsText = JSON.stringify(context.args ?? {});

  if (DESTRUCTIVE_GIT.some((pattern) => pattern.test(argsText))) {
    abort(
      "Workflow guard: destructive git command blocked. Discard a failed batch through the session checkpoint or by fixing the failure; never reset, force-push or clean the worktree.",
    );
  }

  if (!WRITE_TOOLS.has(toolName)) pass();
  if (argsText.includes(".snow/") || argsText.includes(".snow\\\\")) pass();

  const statePath = join(cwd, ".snow", "workflow-state.json");
  if (!existsSync(statePath)) pass();

  let state;
  try {
    state = JSON.parse(readFileSync(statePath, "utf8"));
  } catch (error) {
    abort(`Workflow guard: cannot read ${statePath}: ${error.message}`);
  }

  if (
    state.recipe === "debug" &&
    state.phase === "diagnose" &&
    state.rootCause === "unconfirmed"
  ) {
    abort(
      `Workflow guard: source edits are blocked while the debug root cause is unconfirmed. Reproduce, record the evidence in ${state.bugNote ?? ".snow/bugs/"} and then set phase="fix" with the confirmed root cause in .snow/workflow-state.json. Do not delete the state to bypass this block.`,
    );
  }

  pass();
};

const evidence = () => {
  const agentId = String(context.agentId ?? "");
  const summary = String(context.summary ?? "");
  if (!summary.trim()) pass();

  const isImplementer = /implement/i.test(agentId);
  if (!isImplementer) pass();

  const hasPath =
    /\b[\w./-]+\.(?:ts|tsx|js|mjs|cjs|rs|py|go|java|kt|md|json|ya?ml|toml)\b/.test(
      summary,
    );
  const hasGate =
    /\b(gate|lint|typecheck|build|tests?|passed|failed|exit\s*code|verified|verification)\b|退出码|退出结果|构建|类型检查|测试|诊断/i.test(
      summary,
    );
  const hasAcceptance = /acceptance|evidence|证据/i.test(summary);

  if (!hasPath || !hasGate || !hasAcceptance) {
    abort(
      "Workflow acceptance: the implementation sub-agent returned without evidence. Report the changed file paths, the batch gate output and each acceptance item actually verified. Do not restate that the work is done.",
    );
  }

  pass();
};

const SYMPTOM_CONTEXT =
  "[Workflow] Failure-shaped request. Load diagnosing-bugs and follow it: reproduce first, confirm the root cause with evidence, then fix. Never edit source to see whether it helps. Write .snow/workflow-state.json and the bug note before changing code.";
const CHANGE_CONTEXT =
  "[Workflow] Change-shaped request. If any decision is still open, load grilling and stop at the answer; if the plan is converged, load plan-execute with a frozen batch table. Never interview and edit in the same turn.";
const SYMPTOM_PATTERN =
  /报错|异常|崩溃|闪退|白屏|黑屏|卡死|卡顿|很慢|变慢|失效|不生效|回归|堆栈|失败|打不开|没反应|卡住|转圈|超时|\b[45]\d\d\b|error|exception|crash|blank|white\s*screen|hang|slow|regression|flaky|stack\s*trace|timeout/i;
const CHANGE_PATTERN =
  /加一个|新增功能|实现一个|实现这个|开发一个|改造|重构|设计一下|要不要|implement|\badd\b|refactor|redesign/i;

const classify = () => {
  const message = String(context.message ?? "");
  if (!message.trim()) pass();
  if (SYMPTOM_PATTERN.test(message)) pass(SYMPTOM_CONTEXT);
  if (CHANGE_PATTERN.test(message)) pass(CHANGE_CONTEXT);
  pass();
};

const touchesNotes = (value) => {
  if (typeof value === "string") {
    return value.replace(/\\/g, "/").includes(".agents/notes/");
  }
  if (Array.isArray(value)) return value.some(touchesNotes);
  if (value && typeof value === "object") {
    return Object.values(value).some(touchesNotes);
  }
  return false;
};

const verify = () => {
  if (!touchesNotes(context.args)) pass();

  const result = spawnSync(process.execPath, [VERIFY_SCRIPT, cwd], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "").trim();
    abort(
      `Workflow notes: verify-notes failed.${detail ? `\n${detail}` : ""}`,
    );
  }

  pass();
};

if (mode === "guard") guard();
else if (mode === "evidence") evidence();
else if (mode === "classify") classify();
else if (mode === "verify") verify();
else abort(`Workflow hook: unknown mode "${mode}". Use classify, guard, evidence or verify.`);
