# Changelog

All notable changes to this repository are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Chinese README (`README.zh-CN.md`) with a language switch and a shared SVG workflow diagram.
- Issue forms for bug reports and skill requests, plus a pull request template.

### Changed

- The README workflow is now a static SVG that renders everywhere instead of a Mermaid block.
- `scripts/validate-skills.mjs` also requires each skill to be linked from `README.zh-CN.md` when that file exists.

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
