---
name: plan-execute
description: Use when a plan is converged and implementation should start, or when the user says "build it", "implement this", "start executing", "refactor this module". Freezes a batch table with file ownership and gates, tracks todos, implements and verifies batch by batch, records results. Not while decisions are still open (use grilling); not for a one-line fix.
---

# Plan Execution

Precondition: the plan is converged (grilling produced agreement, or the user gave an explicit scope and acceptance criteria). If not, go back and ask; never interview and edit at the same time.

## When not to use

- The plan is still being debated: go back to `grilling` first.
- The change is a single file or a one-line fix: do it directly.
- You only need the cause of a failure: use `diagnosing-bugs`.

## 1. Freeze the batches

Write the batch table into the `proposed` note from `grilling`, under `## Execution batches`, before touching code. If no note exists, load `decision-notes`, create one from the template, and record the settled decisions first. The note is the plan of record; the conversation only carries a short summary.

| Batch | Goal | Files | Gate | Depends on | Status |
| --- | --- | --- | --- | --- | --- |

Each batch states:

- goal in one sentence that can be compiled and verified independently;
- file ownership: files or directories this batch may modify;
- gate commands that must pass at the end of the batch;
- stop-on-failure point: where to stop instead of carrying unverified changes forward;
- dependencies: which batch's output this batch needs.

The parent agent owns the `Status` column: `pending`, `in-progress`, `done`, `failed`. Sub-agents never edit the note.

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

- Clear file ownership and large implementation: `dev-implement`; the prompt must carry the note path, the batch row verbatim, the completed batches, the file list, gate commands and finishing requirements (the sub-agent cannot see this conversation). The sub-agent must not edit the note.
- Need to verify call chains, schema or existing behavior: `dev-research` (read-only).
- Next step depends on the result: `executionMode: sync`; long independent work: `async`, keep working on other batches and review the result when it lands.
- On an async result: read the summary and acceptance receipt, spot-check key files, confirm every todo item; never accept "done" without evidence.
- Every delegated batch carries an `acceptance` list naming what must actually be true (batch gate output, file paths, verification command). Treat `satisfied: false` or an unverified item as unfinished: continue the same sub-agent for the missing items only.
- Use `dev-review` only for high-risk batches (permissions, contracts, concurrency, migrations), not for every batch.

Dispatch template - copy it into the prompt, fill every field, and do not send a sub-agent to read this conversation:

```text
Batch: <B2>
Plan: <note path> (## Execution batches)
Goal: <one sentence that compiles and verifies independently>
File ownership: <files or directories; touch nothing else>
Gate: <commands that must pass before the batch ends>
Depends on: <completed batches and the contracts they established>
Acceptance: [{id, description}, ...]
Constraints: do not edit the note, do not run Git, do not touch another batch's files.
Report: six sections, with real file paths, gate output and acceptance evidence.
```

## 4. Gates per batch

Run the repository's own commands. Read its package scripts, Makefile, task runner or contributor docs first; never invent a command.

Typical gates, in order:

1. language-server diagnostics over the files this batch changed;
2. typecheck, lint and build commands the repository defines;
3. existing tests that cover the area, run narrowly;
4. renderer changes: load the page, reproduce the interaction, confirm `browser-devtools` console and network show no new error; for layout or spacing claims read `getBoundingClientRect` and `getComputedStyle`, never judge by eye;
5. if native modules change, rebuild them before runtime verification and restart the app;
6. after all batches: the full build, plus the docs check when documentation changed; when `.agents/notes` exists, `verify-notes` must pass.

Gate failure: stop at the current batch, fix the real error, rerun. Never treat a failure as a warning, never cross into the next batch.

The note is the shared state: the parent agent writes it, sub-agents receive only their batch row and return evidence. After a batch passes, set its `Status` to `done` and mark the todo item completed in the same turn. On failure, set `failed`, stop at that batch, and leave the remaining rows `pending`.

## 5. Record what each batch did

At the end of a batch, in order:

1. Todo list: mark this batch completed and the next in progress (same batch as real work).
2. Decision note: set the batch row to `done`. When every batch is done, move the note to `implemented/<same class>/` in the same change, keep the date, rewrite `## Proposal` as `## Decision`, and compress `## Execution batches` into `## Consequences` - one line per batch with its scope and gate result. Do not keep the status table.
3. Run `node <skill-path>/scripts/verify-notes.mjs` when `.agents/notes` exists.
4. `memory-save`: kind=task_state, importance 1-2; note what changed, gate results and leftovers, plus the note path. Cross-session searchable.
5. Git: prompt the user to commit; run Git only after they confirm. Never auto commit or push.

For "what changed just now", use the application's file-change view or diff; across sessions use `memory-search` or the conversation history. Do not write process logs into project docs; only update docs that the change actually affects.

### Note state

The note is authoritative; the todo list is the per-turn view. Only the parent agent changes either.

| Event | Note row | Note lifecycle | Other |
| --- | --- | --- | --- |
| Batch starts | `in-progress` | `proposed` | todo item in progress |
| Batch gate passes | `done` | `proposed` | todo completed, `memory-save` task_state with the note path |
| Batch fails | `failed` | `proposed` | stop; remaining rows stay `pending` |
| All batches pass | - | `implemented/<class>/` | compress the table into `## Consequences`, run `verify-notes` |
| Session ends early | current value | `proposed` | `handoff` references the path and the next batch |
| Decision superseded | - | new note, cross-linked | old note archived or deleted, reasons carried over |

## 6. Finish

- Report: completed batches, gate result per batch, unfinished items with reasons, actual risks.
- Do not declare the task complete before the user confirms.
- Enable Goal Mode (`app-control-setMode`, `mode: "goal"`) only when the remaining work is mechanical and the plan and acceptance are frozen. Set a finite token budget in the plus menu; the AI cannot set the budget itself. Never enable it while decisions are open, while a gate is failing, or with an unlimited budget.

## Forbidden

- Running all batches in one shot; using a parallel workflow mode for a sequential refactor; enabling an autonomous loop without a budget.
- Two sub-agents editing the same file or a shared contract; deciding product questions for the user.
- Hiding failures behind `git reset` or `git checkout --`.
