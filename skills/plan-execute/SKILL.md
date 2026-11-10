---
name: plan-execute
description: Use when a converged plan must be executed. Freeze batch boundaries and gates, create the todo list, implement and verify batch by batch, and record results. Default path for multi-file refactors; never do everything in one shot.
---

# Plan Execution

Precondition: the plan is converged (grilling produced agreement, or the user gave an explicit scope and acceptance criteria). If not, go back and ask; never interview and edit at the same time.

## 1. Freeze the batches

Write a batch table in the conversation before touching code. Each batch states:

- goal in one sentence that can be compiled and verified independently;
- file ownership: files or directories this batch may modify;
- gate commands that must pass at the end of the batch;
- stop-on-failure point: where to stop instead of carrying unverified changes forward;
- dependencies: which batch's output this batch needs.

Size: 3-6 files or one vertical slice (for example storage -> bridge -> IPC -> UI counts as one batch). Split longer chains.

## 2. Create the todo list

- `todo-todo-manage`, one item per batch, created in the same batch as real work on batch 1.
- Mark a batch in progress when it starts; completed only after its gates pass.
- Reword items when the plan changes; leave no stale items.

## 3. Execute

Default to the main agent, serially. Delegate to sub-agents only when all of these hold:

- modified files do not overlap and share no contract;
- each batch has independently verifiable acceptance;
- there is a real parallel win (many isomorphic edits, unrelated modules).

Assignment:

- Clear file ownership and large implementation: `dev-implement`; the prompt must carry the batch table, file list, gate commands and finishing requirements (the sub-agent cannot see this conversation).
- Need to verify call chains, schema or existing behavior: `dev-research` (read-only).
- Next step depends on the result: `executionMode: sync`; long independent work: `async`, keep working on other batches and review the result when it lands.
- On an async result: read the summary and acceptance receipt, spot-check key files, confirm every todo item; never accept "done" without evidence.
- Use `dev-review` only for high-risk batches (permissions, contracts, concurrency, migrations), not for every batch.

## 4. Gates per batch

Run the repository's own commands. Read its package scripts, Makefile, task runner or contributor docs first; never invent a command.

Typical gates, in order:

1. language-server diagnostics over the files this batch changed;
2. typecheck, lint and build commands the repository defines;
3. existing tests that cover the area, run narrowly;
4. if native modules change, rebuild them before runtime verification and restart the app;
5. after all batches: the full build, plus the docs check when documentation changed.

Gate failure: stop at the current batch, fix the real error, rerun. Never treat a failure as a warning, never cross into the next batch.

## 5. Record what each batch did

At the end of a batch, in order:

1. Todo list: mark this batch completed and the next in progress (same batch as real work).
2. `memory-save`: kind=task_state, importance 1-2; note what changed, gate results and leftovers. Cross-session searchable.
3. Git: prompt the user to commit; run Git only after they confirm. Never auto commit or push.

For "what changed just now", use the application's file-change view or diff; across sessions use `memory-search` or the conversation history. Do not write process logs into project docs; only update docs that the change actually affects.

## 6. Finish

- Report: completed batches, gate result per batch, unfinished items with reasons, actual risks.
- Do not declare the task complete before the user confirms.
- Enable any autonomous loop mode only when the remaining work is mechanical and the plan and acceptance are frozen; always set a budget.

## Forbidden

- Running all batches in one shot; using a parallel workflow mode for a sequential refactor; enabling an autonomous loop without a budget.
- Two sub-agents editing the same file or a shared contract; deciding product questions for the user.
- Hiding failures behind `git reset` or `git checkout --`.
