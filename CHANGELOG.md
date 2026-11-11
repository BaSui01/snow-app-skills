# Changelog

All notable changes to this repository are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- `decision-notes`: folder-as-state decision notes under `.agents/notes/<lifecycle>/<class>/`, with templates, rejected-alternative rules and a zero-dependency `verify-notes` check.
- Repository-wide `.agents/notes/` tree, one bootstrap note, and a `scripts/verify-notes.mjs` wrapper wired into the `validate` workflow.
- `ui-verification`: measured layout verification with browser geometry, console/network evidence and before/after re-checks.
- `skill-install`: source verification, scope choice, install and read-back for Skills (not packages).
- Trigger-word descriptions for every skill, matched against the words users actually type.
- Global workflow hooks: symptom/change context injection, a diagnosis write guard and a sub-agent evidence gate.

### Changed

- `decision-notes` records decisions instead of `docs/adr`; `plan-execute`, `diagnosing-bugs`, `retro` and `handoff` now reference notes and run the note check.
- `grilling` writes the proposed note by default; `plan-execute` records `## Execution batches` in that note, owns the status column and compresses it into `## Consequences` on landing.
- `WORKFLOW.md` documents the automation layers, the debug state machine, the decision-note gate and the hook setup.
- Installing subdirectory `skills` now discovers every skill at once; the READMEs and PR template mention the note check.

### Removed

- `grill-with-docs`: the interview is `grilling` and the note rules are `decision-notes`; the wrapper only duplicated the trigger.
- `grill-me`: `grilling` already matches "grill me" in its description; the alias added a second trigger without adding a rule.

## [0.1.1] - 2026-11-10

### Added

- `WORKFLOW.md` with three end-to-end recipes: feature, bug fix, refactor.
- `templates/skill/SKILL.md` as the starting point for new skills.
- Every skill now documents a `When not to use` section.
- Chinese README (`README.zh-CN.md`) with a language switch and a shared SVG workflow diagram.
- Issue forms for bug reports and skill requests, plus a pull request template.
- Recommended installation sets in both READMEs.
- Tag-triggered release workflow (`.github/workflows/release.yml`).

### Changed

- README (both languages) and CONTRIBUTING link the workflow guide and template.
- The README workflow is now a static SVG that renders everywhere instead of a Mermaid block.
- `scripts/validate-skills.mjs` normalizes CRLF so validation passes on Windows checkouts.
- `scripts/validate-skills.mjs` also requires each skill to be linked from `README.zh-CN.md` when that file exists.
- `scripts/validate-skills.mjs` rejects unsupported frontmatter fields, non-boolean `enable`, and multi-line descriptions.
- CONTRIBUTING documents the release flow.

## [0.1.0] - 2026-11-10

### Added

- `grilling`: design-tree interview that settles decisions before code exists.
- `grill-me`: explicit alias entry for `grilling`.
- `grill-with-docs`: grilling plus `GLOSSARY.md` and ADR upkeep.
- `plan-execute`: frozen batches, todo tracking and per-batch gates.
- `diagnosing-bugs`: reproduce, narrow the layer, instrument, fix the root cause.
- `handoff`: compact state, decisions and next step for the next session.
- `retro`: prioritized environment improvements after a session.
- README with a banner, flow diagram, install instructions and compatibility notes.
- `CONTRIBUTING.md`, MIT `LICENSE`, and `scripts/validate-skills.mjs` with a CI workflow.
