---
name: grill-with-docs
description: Use when a plan must be stress-tested and the outcome should be written down. Runs the grilling interview, sharpens domain terminology, and records decisions in the repository glossary and ADRs. Read-only until the user confirms.
---

# Grill With Docs

First run `skills-skill-execute` with `grilling` and follow it end to end. This skill only adds the documentation discipline below; it never relaxes the interview rules, the tool bans, or the "wait for answers" rule.

## When not to use

- No durable decision is expected (throwaway spike): use `grilling` alone.
- The repository has no documentation convention and the user does not want one created: skip the docs half.
- The work is pure fact-finding with no decision to record: just answer it.

## Rules to respect

- Verify facts against code, not against docs. Evidence order: reachable entry point, then cross-process contract, then implementation and storage. Settings truth comes from the configuration source, never from a guessed file.
- Record nothing mid-question. Decisions are written only after the user settles them.
- Follow the repository's own documentation conventions: language, directory layout, index files and lint or link checks. If the repository is bilingual, every new document needs its counterpart.

## While grilling

- Challenge terms against the code: session versus conversation, worktree versus branch, mode versus run, project versus workspace. If a term is overloaded, force one canonical meaning before moving on.
- When the user states how something works, check the real call chain and report contradictions instead of accepting them.

## Where decisions go

- **Glossary (lazy)**: create `GLOSSARY.md` the first time a cross-cutting term is settled. One entry per term: canonical term, definition, what it is not, code anchor. A glossary only, never specs or implementation notes. If the repository keeps terminology elsewhere, use that location.
- **ADR**: create `docs/adr/NNNN-short-title.md` only when the decision meets the threshold below. Context, options considered, decision, consequences, code anchors.
- **Non-architectural decisions** (tooling, process, scope): `memory-save` with kind=decision.
- **Every new or edited document**: register it in the repository index if one exists, then run the repository's documentation check and report the actual result.

## ADR threshold

Offer an ADR only when all three hold: hard to reverse, surprising without context, and the result of a real trade-off. If any is missing, keep it in memory or skip it.

## Close

When the frontier is empty, report: settled decisions, documents written or changed (paths), memory entries saved, and remaining risks. Then ask for explicit confirmation before implementation.
