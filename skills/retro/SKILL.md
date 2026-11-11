---
name: retro
description: Use when the user asks for a retrospective or "what should we improve" after a difficult session, or when repeated mistakes suggest the environment is at fault. Reviews the session against logs, usage, hooks and check results, then proposes prioritized fixes to rules, checks, skills and tooling. Proposes only; applies after confirmation. Not a code review.
---

# Retro

Improve the agent's environment so the next session goes better. Do not re-litigate the product code; look at how the work was done.

## When not to use

- The user wants a code review: use a review skill or a review sub-agent.
- There is no session evidence or log to inspect: ask for the session first.
- You intend to apply changes immediately: propose them and wait for confirmation.

## 1. Read the primary sources

- The session transcript and its tool results.
- `config-manage action=logs` filtered by level, module and time window; a temporary `requestLogging` session for API errors, retries and wasted calls.
- `usage` totals and per-model rows, to see where tokens were actually spent.
- Hook execution records and the effective hook, sub-agent, skill and permission configuration.
- `.agents/notes/rejected/` for rejected paths that were proposed again, and `archived/` for notes that no longer match the code. Run `verify-notes` to see structural drift.
- The repository's own check commands, CI workflow and contributor docs.

## 2. Look for candidates

- **Navigation**: did finding the right file take too long? Add a pointer file, a map, or a better symbol name.
- **Automated checks**: did the agent make a mistake a typecheck, lint, test or docs check could catch? Is an existing check unwired or silently broken? Prefer fixing the check over writing a rule.
- **Coding standards**: was a rule missing, ambiguous, or unenforced? Mechanical violations belong in a check; keep judgment calls in the standards file.
- **Steering files**: are rules bloated, duplicated, or no-ops? Move navigation pointers out, delete rules that do not change behavior.
- **Tool economy**: expensive or repeated calls, oversized outputs, token-inefficient custom tooling.
- **Information access**: was a crucial piece of information unavailable? Logs, read-only service access, a diagnostic command.
- **Skills**: did a skill trigger at the wrong time, miss a step, or carry stale paths? Propose a concrete edit.
- **Decision notes**: did a non-trivial change ship without a note, did a note contradict the code, or did a check fail while nobody looked? Prefer wiring a check over writing a reminder.

## 3. Report

Present candidates ordered by severity. For each: the symptom observed in this session, the proposed change, where it lives, and how to verify it helps.

Do not apply changes without confirmation. When the user approves, update the rule, skill, hook or check, then verify the change with the same workflow that exposed the problem.
