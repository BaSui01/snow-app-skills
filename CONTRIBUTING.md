# Contributing

Thanks for improving these skills. Keep the bar high: a skill is a procedure, not an essay. See [WORKFLOW.md](WORKFLOW.md) for how the skills compose.

## Add or change a skill

1. Start from `templates/skill/SKILL.md`, then create `skills/<skill-name>/SKILL.md`. The folder name is the skill id.
2. Use this frontmatter:

   ```yaml
   ---
   name: skill-name
   description: When to use it, what it produces, and any hard boundary.
   ---
   ```

3. Write the body in English, in the imperative, with concrete steps and stop conditions.
4. Keep one skill to one job. If it needs another skill, load it by name instead of copying its text.
5. Do not encode machine-specific paths, credentials, tokens, or private project names.
6. Add the skill to the table in `README.md`.

## Record a decision

A non-trivial change needs a note under `.agents/notes/`: behavior, architecture, cross-file contracts, process or tooling, testing strategy, or on-disk/wire/config formats. Start from `skills/decision-notes/templates/proposed.md`, keep the path `.agents/notes/proposed/<class>/YYYY-MM-DD-topic.md`, and move it to `implemented/<class>/` in the same pull request. Mechanical edits (formatting, rename, styling, tag, CRUD, behavior-neutral dependency patch) get no note. Run `node scripts/verify-notes.mjs` before opening the pull request; never keep a second decision system next to it.

## Quality bar

- **Trigger**: the description makes the right situation obvious and excludes unrelated ones.
- **Boundary**: read-only versus write, confirmation points, and forbidden actions are explicit.
- **Failure**: the skill says where to stop and what to report, instead of retrying or hiding errors.
- **Portability**: tool names are Snow App's; the rules stay meaningful on other agents.
- **Record**: a non-trivial change leaves a decision note that passes `verify-notes`.

Before opening a pull request, test three cases:

1. **Positive**: a matching request selects the skill and it completes.
2. **Negative**: an unrelated request does not select it.
3. **Permission boundary**: when a required tool is unavailable, the skill stops and reports the gap instead of working around it.

## Release

1. Move the `Unreleased` items in `CHANGELOG.md` under the new version.
2. Commit and push to `main`; the `validate` workflow must pass.
3. Tag and push: `git tag vX.Y.Z && git push origin vX.Y.Z`.
4. The `release` workflow creates the GitHub Release with generated notes.
5. Verify the release, then install one skill from the tag to prove it works.

## Pull requests

- One skill per pull request when possible.
- Describe the failure mode the change fixes, not just the wording change.
- Do not reformat unrelated skills.

## License

By contributing, you agree that your contribution is licensed under the [MIT License](LICENSE).
