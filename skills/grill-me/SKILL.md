---
name: grill-me
description: Alias entry for the grilling skill. Use only when the user explicitly says grill me or asks to pressure-test a plan. Loads grilling and follows it end to end.
---

After loading, immediately run `skills-skill-execute` with `grilling` and follow that skill end to end.

## When not to use

- The user did not explicitly ask to be grilled; do not trigger on a vague "help me think".
- You actually need the interview protocol: load `grilling` directly instead of adding a hop.

This file is an entry alias only: do not start interviewing from here, and do not copy the protocol into it.
