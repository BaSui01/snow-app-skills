---
name: skill-install
description: Use only when a Skill is the target: the user gives a Skill repository link or asks to install, update, inspect or uninstall a Skill. Verifies the source and its scripts, shows the install scope and impact, installs with config-manage, then reads the result back. Never installs silently and never installs unreviewed scripts. Not for npm or system packages, and not for business code.
---

# Skill Install

Goal: install exactly the Skill the user asked for, into the scope they chose, after showing what it will run. This is environment maintenance, not development.

## When not to use

- The target is an npm package, a system package or a project dependency: use the project's package manager.
- The user only shared a link without asking to install: read it, summarize it, and ask before writing anything.
- The repository is private and the user did not provide access: report it instead of guessing contents.

## 1. Verify the source

Fetch the repository page and its `SKILL.md` before any write:

- repository owner, license and last activity;
- the real `SKILL.md` frontmatter: `name`, `description`, `allowed-tools`;
- every referenced script, template and dependency, and whether it runs `npx`, network calls or installers;
- whether it depends on another Skill.

If the contents cannot be read, stop. Do not install from a name alone.

## 2. Decide the scope

| Scope | Where it lands | Use when |
| --- | --- | --- |
| global | `~/.snow/skills/<id>/` | the Skill is useful across projects |
| project | `<project>/.snow/skills/<id>/` | one project only; usually gitignored |
| versioned | `<project>/.agents/skills/<id>/` committed | the team must get it with the repository |

State which one you will use and why. A multi-Skill repository can be installed with a subdirectory pointing at its `skills` folder; a single Skill uses its own directory.

## 3. Show the impact

Before the write, report in one short block:

- source URL and the Skill id that will be created;
- scope and target path;
- scripts that will exist on disk and whether they execute anything;
- whether an existing Skill with the same id will be replaced.

Wait for confirmation. Never install silently, even when the user pasted the link.

## 4. Install and read back

```text
config-manage action=set scope=skills key=<skill-id> projectId=<projectId-or-empty>
  value={"url":"<owner>/<repo>@<branch>:<subdir>","location":"global|project"}
```

Then `config-manage action=list scope=skills` and check the id, `path`, `location`, `source` and enabled state. Report the actual values; do not claim success from the write result alone.

## 5. Update and uninstall

- Update: rerun the same `set` with the same URL; the install is pinned to a commit, so a plain "check for updates" has no meaning.
- Uninstall: only for Skills with a GitHub install record. Show scope, id, projectId and the directory that will be deleted, get explicit confirmation, then `config-manage action=delete scope=skills key=<id> confirmed=true`.
- A manually placed Skill has no install record: delete its directory only after confirming the exact path.

## Stop conditions

- The repository has no `SKILL.md` at the target level: report where it actually is instead of installing the wrong directory.
- The Skill runs an installer, requests credentials, or writes outside its own directory: stop and report; this needs a separate decision.
- The same id exists in another scope: report the collision and ask which one wins.

## Output

Source, verified facts, chosen scope and path, confirmation, read-back values, and any script or dependency the user should know about.
