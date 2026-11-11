---
name: diagnosing-bugs
description: Use when something is broken or slower than before: error, exception, stack trace, HTTP 4xx/5xx, blank page or white screen, crash, hang, timeout, flaky test, regression, "it worked yesterday", "so slow". Reproduce first, build a feedback loop, narrow the layer, confirm the root cause with evidence, then apply the smallest fix and re-verify. Not for new features or refactors.
---

# Diagnosing Bugs

Goal: find the root cause before changing code. Guessing, retrying, swallowing errors and fake success are out of bounds.

## When not to use

- The work is a feature or a refactor, not a failure: use `plan-execute`.
- There is no reproducible symptom and the user cannot provide one: ask for a repro instead of guessing.
- The root cause is already confirmed and the fix is trivial: fix it and verify.

## 1. Reproduce

- Capture the real entry point, exact steps, environment, and expected versus actual behavior.
- Write the reproduction into `.snow/bugs/<date>-<slug>.md` (entry point, steps, environment, expected versus actual, reproduction command). Keep it out of product docs.
- Write `.snow/workflow-state.json` as `{"recipe":"debug","phase":"diagnose","rootCause":"unconfirmed","bugNote":"<path>"}`. The project write guard blocks source edits while `phase` is `diagnose` and `rootCause` is `unconfirmed`. Do not delete or rewrite the state to bypass the block; confirm the root cause instead.
- Read the actual error, stack and logs before theorising. Use the application's log surface and the current session's file-change view.
- If it cannot be reproduced, say so and ask for the missing reproduction; do not invent a cause.

## 2. Build a feedback loop

Use what already exists; do not add a test suite just to debug.

- Language-server diagnostics on the involved files.
- The repository's typecheck and build commands.
- Existing tests that cover the area, run narrowly.
- Settings inspection when behavior depends on configuration: confirm the real source and scope instead of assuming a file.
- Runtime evidence, each with the narrowest filter: `config-manage action=logs` (level, module, time window), a short-lived `requestLogging` session for API failures, `browser-devtools` console and network for the renderer, `terminal-read` for a live process, `filesystem-read` for a detached log path.

## 3. Narrow the layer

Trace the real chain and find the first layer that disagrees:

```text
UI -> bridge/preload API -> IPC handler -> native binding -> storage or provider
```

Check the contract at each hop with semantic tools and source reads. A UI bug and a storage bug look alike until the contract is verified. For paths, terminals or packaging, check every supported platform branch instead of extrapolating from the current machine.

## 4. Instrument

- Prefer existing logs and error contexts. Add temporary logs only when needed; redact secrets and keep the original error text.
- Never add fallbacks, defaults, retries or catch-all blocks that convert a failure into silence just to make the symptom disappear.

## 5. Hypothesise one at a time

- State one falsifiable hypothesis and the evidence that would confirm or reject it.
- Verify against code before editing; if the evidence rejects it, discard it explicitly and move on.

## 6. Fix and verify

- Before editing source, set `phase` to `fix` in `.snow/workflow-state.json` and record the confirmed root cause and its evidence paths in the bug note.
- Fix the root cause with the smallest change that preserves existing contracts.
- Verify with the same loop that reproduced the bug, plus diagnostics and the relevant build command. If native modules changed, rebuild them and restart the app before runtime verification.
- Remove temporary logs. Write the root cause and its verification into `implemented/bug-fix/<YYYY-MM-DD>-<slug>.md` through `decision-notes`, then keep only a one-line pointer in memory (kind=pitfall) so it is not rediscovered later.
- Mark the state `phase: done`, then delete `.snow/workflow-state.json`. A leftover diagnose state blocks the next session's edits.

## Report

Root cause, evidence chain, fix, verification output, remaining risk. If the cause is still unconfirmed, report the current hypothesis and what is missing; never present a workaround as a fix.
