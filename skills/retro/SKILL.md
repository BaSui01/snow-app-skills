---
name: retro
description: Use when the user asks for a retrospective on a session. Reviews how the agent worked, then proposes prioritized improvements to the environment: navigation, automated checks, standards, steering files, and tool economy.
---

# Retro

Improve the agent's environment so the next session goes better. Do not re-litigate the product code; look at how the work was done.

## 1. Read the primary sources

- The session transcript and its tool results.
- The application log surface for errors, retries and wasted calls.
- The project rules, skills, hooks, sub-agent configs and permission list that were in force.
- The repository's own check commands, CI workflow and contributor docs.

## 2. Look for candidates

- **Navigation**: did finding the right file take too long? Add a pointer file, a map, or a better symbol name.
- **Automated checks**: did the agent make a mistake a typecheck, lint, test or docs check could catch? Is an existing check unwired or silently broken? Prefer fixing the check over writing a rule.
- **Coding standards**: was a rule missing, ambiguous, or unenforced? Mechanical violations belong in a check; keep judgment calls in the standards file.
- **Steering files**: are rules bloated, duplicated, or no-ops? Move navigation pointers out, delete rules that do not change behavior.
- **Tool economy**: expensive or repeated calls, oversized outputs, token-inefficient custom tooling.
- **Information access**: was a crucial piece of information unavailable? Logs, read-only service access, a diagnostic command.
- **Skills**: did a skill trigger at the wrong time, miss a step, or carry stale paths? Propose a concrete edit.

## 3. Report

Present candidates ordered by severity. For each: the symptom observed in this session, the proposed change, where it lives, and how to verify it helps.

Do not apply changes without confirmation. When the user approves, update the rule, skill, hook or check, then verify the change with the same workflow that exposed the problem.
