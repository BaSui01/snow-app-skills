---
name: decision-notes
description: Use when a non-trivial change must keep its why (behavior, architecture, cross-file contracts, process or tooling, testing strategy, on-disk/wire/config formats), when a design interview ends and the decisions must be written down, or when a decision is superseded or a defect leaves a lesson. Writes one note under .agents/notes/<lifecycle>/<class>/ with the strongest rejected alternatives and the verification, then runs the tree check. Not for formatting, renames, styling, CRUD, tagging or behavior-neutral dependency patches.
---

# Decision Notes

Goal: the next person recovers why the code is like this, what was rejected, and how the change was proven, without replaying the conversation. The folder path is the state; there is no index.

## When not to use

- The change is mechanical: formatting, typo, unambiguous rename, styling, version tag, behavior-neutral dependency patch, routine CRUD.
- The decision is already recorded and only paths, symbols or defaults changed: update that note in place instead of opening a new one.
- The question is a fact lookup or a code walkthrough: answer it, do not open a note.

## Non-trivial threshold

Write when any of these is true:

- behavior visible to a user or another service changed;
- module boundaries, package topology or runtime invariants changed;
- a contract between files, processes, storage or network formats changed;
- the process, tooling, CI or release flow changed;
- the testing strategy changed;
- a decision was superseded, or a defect exposed a rule worth keeping.

Unsure? Ask whether a later maintainer could derive the why from the code and tests alone. If yes, skip the note. If no, write it. Do not record to look diligent.

An `architecture` note also carries the ADR bar: offer it only when the decision is hard to reverse, surprising without context, and the result of a real trade-off. If any of the three is missing, record it as `process` or skip the note.

## Layout

`.agents/notes/<lifecycle>/<class>/YYYY-MM-DD-topic.md`

- Lifecycle: `proposed`, `implemented`, `rejected`, `archived`.
- Class: `feature`, `bug-fix`, `simplification`, `architecture`, `process`, `testing`. Do not invent classes; the check rejects them.
- The date is the day the decision was first proposed, and it does not change when the note moves.
- File name is ASCII kebab-case. The body uses the user's language.
- If the host repository already records decisions, map its states and classes onto this layout instead of creating a second system.
- If `.agents/notes` does not exist, create the four lifecycle folders; create a class folder on first use. Do not pre-create every class.

## Note shape

The first two lines are fixed:

```text
# Agent Note: <title>
Status: <status>
```

`Status` must match the lifecycle folder.

- `proposed`: `## Problem` -> `## Proposal` -> free sections -> `## Alternatives considered` -> `## Acceptance criteria` -> `## Risks`
- `implemented`: `## Problem` -> `## Decision` (present tense) -> free sections -> `## Alternatives considered` -> `## Consequences` (both costs and benefits)
- `rejected`: frozen proposal shape, with `Status: rejected — <reason>`
- `archived`: the implemented shape plus one `Archived: <date> <reason>` line, then frozen

An execution plan adds an `## Execution batches` table under the free sections: batch, goal, files, gate, depends on, status. The parent agent owns `status`; sub-agents never edit the note. When the work lands, compress that table into `## Consequences` (one line per batch: scope and gate result); do not keep the status table.

`## Alternatives considered` is always required. Write the strongest case for each real alternative before rejecting it; write `none` when there genuinely was no alternative. Never invent one.

`implemented` must not contain proposal headings: `## Proposal`, `## Plan`, `## Migration plan`, `## Acceptance criteria`, or their translations.

## Workflow

1. Before proposing or deciding, search existing notes: slice by class, then `rg --hidden --glob '!.agents/notes/archived/**' "<mechanism or keyword>" .agents/notes/`.
2. When a design interview (`grilling`) converges and the user wants the decisions kept, write one `proposed` note before implementation; do not open a note per question.
3. A new non-trivial proposal starts as `proposed`; copy `templates/proposed.md` from this skill.
4. When the change lands, move the file to `implemented/<same class>/` in the same commit or pull request: keep the date, change `Status`, rewrite `## Proposal` into present-tense `## Decision`, and fold acceptance and risks into `## Consequences`.
5. When a decision is superseded, keep both notes and link them both ways; update only the facts that still hold. Archive the old note only when it has no independent value, and record what replaced it in the new note.
6. After writing or moving any note, run the check from the host project root:

   ```sh
   node <skill-path>/scripts/verify-notes.mjs
   ```

   Use the actual loaded skill path. When the host has its own wrapper or npm script, run that instead; never skip the check because no wrapper exists.
6. Report the note path and the check result. Do not paste the whole note into the conversation.

## Boundary with memory

The note is the repository record: it ships with the code and survives sessions. `memory-manage` is a cross-session index: keep only a one-line pointer plus the note path. Do not maintain the full decision in both places.

## Stop conditions

- A non-trivial change cannot name a real rejected alternative: report the missing trade-off instead of writing a decorative note.
- The check fails on a rule the note cannot satisfy: report the exact rule; never delete the check or weaken the schema.
- The change is mechanical: do not write a note.
