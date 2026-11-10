---
name: diagnosing-bugs
description: Use when a bug or performance regression needs disciplined diagnosis. Reproduce, build a feedback loop, narrow the layer, instrument, test one hypothesis at a time, fix the root cause, and verify. Read-only until the cause is confirmed.
---

# Diagnosing Bugs

Goal: find the root cause before changing code. Guessing, retrying, swallowing errors and fake success are out of bounds.

## 1. Reproduce

- Capture the real entry point, exact steps, environment, and expected versus actual behavior.
- Read the actual error, stack and logs before theorising. Use the application's log surface and the current session's file-change view.
- If it cannot be reproduced, say so and ask for the missing reproduction; do not invent a cause.

## 2. Build a feedback loop

Use what already exists; do not add a test suite just to debug.

- Language-server diagnostics on the involved files.
- The repository's typecheck and build commands.
- Existing tests that cover the area, run narrowly.
- Settings inspection when behavior depends on configuration: confirm the real source and scope instead of assuming a file.

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

- Fix the root cause with the smallest change that preserves existing contracts.
- Verify with the same loop that reproduced the bug, plus diagnostics and the relevant build command. If native modules changed, rebuild them and restart the app before runtime verification.
- Remove temporary logs. Record the root cause and verification with `memory-save` (kind=pitfall) so it is not rediscovered later.

## Report

Root cause, evidence chain, fix, verification output, remaining risk. If the cause is still unconfirmed, report the current hypothesis and what is missing; never present a workaround as a fix.
