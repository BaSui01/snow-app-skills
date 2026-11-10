# Workflow

The skills do not orchestrate themselves. You drive the chain, one stage at a time. Each recipe below names the skill, the prompt to use, and the artifact you should get before moving on.

## Recipe 1: Build a feature

| Step | Skill | Prompt | Artifact |
| --- | --- | --- | --- |
| 1. Align | `grilling` | "Grill me on <feature>. Ask the whole frontier, one round at a time, and recommend an answer for each question." | Settled decisions, remaining risks, dropped alternatives |
| 2. Write it down | `grill-with-docs` | "Grill me on this design and record the durable decisions in the repository docs." | `GLOSSARY.md`, ADRs, updated docs |
| 3. Freeze | `plan-execute` | "Freeze the batch plan and start executing. Stop at the first gate failure." | Batch table, todo list, gate output per batch |
| 4. Hand off | `handoff` | "Write a handoff for the next session." | State, open questions, next first step |

Stop if step 1 ends with unresolved decisions: do not start step 3.

## Recipe 2: Fix a bug

| Step | Skill | Prompt | Artifact |
| --- | --- | --- | --- |
| 1. Diagnose | `diagnosing-bugs` | "Diagnose <symptom>. Reproduce, narrow the layer, and do not change code until the root cause is confirmed." | Reproduction, evidence chain, root cause, verification loop |
| 2. Fix | `plan-execute` | "Execute the fix in gated batches. The root cause is confirmed." | Minimal fix, gate output, regression evidence |
| 3. Record | `memory-save` / `handoff` | "Record the root cause and hand off." | Pitfall entry, handoff document |

Stop if the root cause is still a hypothesis: do not apply a fix to see whether it helps.

## Recipe 3: Refactor with decisions

| Step | Skill | Prompt | Artifact |
| --- | --- | --- | --- |
| 1. Align and document | `grill-with-docs` | "Grill me on this refactor and write the decisions into `docs/adr` and `GLOSSARY.md`." | ADR, glossary entries, migration boundaries |
| 2. Execute | `plan-execute` | "Freeze the refactor into batches and execute them in order. Never start two batches that touch the same file." | Batch table, gates, recorded results |
| 3. Review | `retro` | "Run a retro on this session and propose the smallest environment improvements." | Prioritized improvements, applied only after confirmation |

Stop if a batch cannot be verified independently: split it before starting.

## Session boundary

Run `handoff` when the session ends with work still open. The document must name the branch or worktree, the todo state, the decisions already made, the memory entries worth recalling, and the first action of the next session. Do not duplicate diffs or specs; reference them by path.

## Periodic improvement

Run `retro` after a difficult session, or once a week. It reviews the environment rather than the product: navigation, automated checks, standards, steering files, tool economy, and skills that misfired. Apply changes only after the user confirms.

## Anti-patterns

- Interviewing and editing at the same time.
- Running `plan-execute` on a plan that is still being debated.
- Diagnosing by trying fixes instead of reproducing the bug.
- Two agents or two batches editing the same file or contract.
- Using `handoff` as a substitute for finishing work that could be finished now.
- Writing process logs into project docs; docs describe the product, not the session.
