# Changelog

All notable changes to this repository are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

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
