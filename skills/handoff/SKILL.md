---
name: handoff
description: Use when another agent or a later session must continue the work. Compacts the current conversation into a handoff document with state, decisions, open questions, changed files, and the next first step. Redacts secrets.
---

# Handoff

Write a handoff document that lets a fresh session continue without replaying this conversation.

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
8. **Memory entries**: ids or titles worth recalling, so the next session can `memory-search` them.
9. **Suggested skills**: which skills the next agent should load, by name.
10. **Next first step**: the single action to take first, not a vague "continue".

## Rules

- Reference existing artifacts (specs, plans, ADRs, issues, commits, diffs) by path or URL; do not duplicate them.
- Redact API keys, tokens, passwords and personal data.
- If the user described what the next session will focus on, tailor the document to that focus and mark everything else as background.
- Report the saved location and a one-line summary. Do not claim the work is complete when it is only handed off.
