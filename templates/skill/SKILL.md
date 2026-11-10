---
name: skill-name
description: Use when <situation>. It produces <artifact>. Hard boundary: <what it must never do>.
---

# Skill Name

One sentence: the goal, and what "done" looks like.

## When not to use

- <The adjacent situation that should use another skill instead.>
- <The case where the task is too small to need this skill.>
- <The case where the required facts or decisions are missing.>

## Steps

1. <First concrete action, including which tool or file to read.>
2. <Next action, with the decision or verification it depends on.>
3. <Stop point when the work is settled; state what must be true before moving on.>

## Stop conditions

- <What makes the skill stop and report instead of retrying.>
- <What needs an explicit user decision.>

## Output

- <The artifact the caller should receive, e.g. decisions, batches, root cause, handoff path.>

## Notes for Snow App

- Frontmatter supports `name`, `description`, `enable`, `allowed-tools`; other fields are ignored.
- Use Snow App tool names (`skills-skill-execute`, `todo-todo-manage`, `memory-save`, `user-interaction-askUserQuestion`, `config-get`).
- Keep the body English and free of machine-specific paths, credentials, and private project names.
