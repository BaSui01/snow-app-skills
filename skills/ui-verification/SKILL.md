---
name: ui-verification
description: Use when a rendered interface looks wrong or must be proven correct: misalignment, overflow, spacing, color, typography, responsive breakpoints, z-index, flicker, layout shift, blank areas, or "it does not match the design". Captures a baseline, measures real geometry with getBoundingClientRect and getComputedStyle, checks console and network, applies the smallest CSS or component change, then re-measures and re-screenshots the same path. Not for backend logic or copy-only edits.
allowed-tools:
  - filesystem-read
  - filesystem-replace_edit
  - grep-search
  - grep-find
  - lsp-diagnostics
  - browser-create
  - browser-navigate
  - browser-click
  - browser-type
  - browser-evaluate
  - browser-screenshot
  - browser-wait
  - browser-devtools
  - todo-todo-manage
  - user-interaction-askUserQuestion
---

# UI Verification

Goal: turn "looks wrong" into a measured difference, fix the layer that causes it, and prove the fix on the same viewport and path. Numbers first, screenshots second, opinions never.

## When not to use

- The defect is backend, storage, IPC or network logic: use `diagnosing-bugs`.
- The change is copy-only or a pure asset swap: edit and verify normally.
- No browser, no running page and no design reference: say what is missing instead of guessing from a screenshot.

## 1. Baseline

- Record the URL, viewport size, device scale and the exact selector that shows the problem.
- Take a screenshot before touching anything; keep the path.
- Reproduce the state: the same interaction, scroll position and data that exposes the issue. A defect that only appears after an async load needs that load in the path.

## 2. Measure

Use `browser-evaluate` and return numbers, not adjectives:

```js
const el = document.querySelector("<selector>");
const r = el.getBoundingClientRect();
const s = getComputedStyle(el);
return {
  rect: { x: r.x, y: r.y, width: r.width, height: r.height },
  overflowX: el.scrollWidth > el.clientWidth,
  display: s.display,
  flex: s.flex,
  gap: s.gap,
  padding: s.padding,
  margin: s.margin,
  position: s.position,
  zIndex: s.zIndex,
  font: s.font,
  lineHeight: s.lineHeight,
};
```

Compare against the design token, the sibling element, or the stated requirement. State which number is wrong and by how much.

## 3. Runtime evidence

- `browser-devtools` `action=console`: new errors or warnings tied to the element.
- `browser-devtools` `action=network`: failed assets, fonts or late data that change layout.
- `browser-devtools` `action=trace`: only when the symptom is flicker, layout shift or a long task, not for static spacing.

## 4. Locate the layer

Pick the first layer that actually disagrees, not the last one you can edit:

- parent layout constraint (flex/grid, fixed height, missing min-width);
- the element's own box (padding, border, width, max-width, overflow);
- the cascade (specificity, order, inherited property, a global reset);
- content (font loading, line wrapping, localized text length, empty state);
- stacking (z-index, transform, portal, overlay).

Read the real stylesheet or component source before editing; do not add `!important` to mask an unknown cascade.

## 5. Fix

- Change the smallest thing that corrects the measured value, in the owning component or stylesheet.
- Do not restyle unrelated elements, reformat the file, or replace a shared component for one screen.
- If the correct fix crosses a shared contract, stop and report the boundary instead of patching locally.

## 6. Re-verify

- Re-measure the same selector with the same script and compare the numbers.
- Re-screenshot at the same viewport and path; keep both screenshots and name them before/after.
- Confirm console and network have no new error introduced by the change.
- Check one adjacent breakpoint when the fix touches layout, not every breakpoint.

## Stop conditions

- The defect cannot be reproduced: report the missing state or data, do not "fix" by eye.
- Browser tools are unavailable: report the limitation; do not claim visual verification.
- The design reference is absent and the expected value is a product decision: ask, do not invent spacing or color.

## Output

URL, viewport, selector, the wrong number and its expected value, the layer, the changed files, before/after screenshots, console and network result, and any breakpoint still unverified.
