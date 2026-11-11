---
name: handoff
description: Use when the session ends with work still open or another agent or later session must continue: "handoff", "write it down for the next session", context running out, switching machines. Compacts state, decisions, open questions, changed files, todo status and the next first step into a project memo. Redacts secrets. Not a substitute for finishing work that can be finished now.
---

# Handoff

Write a handoff document that lets a fresh session continue without replaying this conversation.

## When not to use

- The task can be finished now: finish it instead of handing it off.
- You would be copying a diff, spec or issue: reference it by path or URL instead.
- Secrets or personal data are involved and cannot be redacted: do not write the handoff.

## Where to save

- Preferred: a project memo, so the next session can find it without filesystem access.
- Otherwise: a file outside the workspace, in the application's data directory. Do not drop handoff files into the repository unless the user asks.

## What to include

1. **Goal**: what the work is meant to achieve, in one paragraph.
2. **Current state**: what is done, what is verified, and what is still unverified.
3. **Decisions**: settled decisions with their rationale and the alternatives that were dropped.
4. **Open questions**: anything still waiting on the user, and what it blocks.
5. **Todo status**: the todo list as it stands, with completed and pending items.
6. **Changed files**: the files touched in this session and why; reference the diff or file-change view instead of duplicating it.
7. **Workspace context**: branch, worktree, or environment the work is bound to.
8. **Memory entries and notes**: ids or titles worth recalling, plus the `.agents/notes/` paths that shaped the work.
9. **Suggested skills**: which skills the next agent should load, by name.
10. **Next first step**: the single action to take first, not a vague "continue".

## Rules

- Reference existing artifacts (specs, plans, ADRs, issues, commits, diffs) by path or URL; do not duplicate them.
- If `.snow/workflow-state.json` exists, record its recipe, phase and root cause in the handoff, then delete it: a leftover `diagnose` state blocks the next session's source edits.
- Redact API keys, tokens, passwords and personal data.
- If the user described what the next session will focus on, tailor the document to that focus and mark everything else as background.
- Report the saved location and a one-line summary. Do not claim the work is complete when it is only handed off.
