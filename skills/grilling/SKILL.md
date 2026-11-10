---
name: grilling
description: Use when a plan, decision, or idea needs stress-testing. Runs a design-tree interview in rounds, asking only unblocked questions with a recommended answer, until the frontier is empty and the user confirms shared understanding. Research and ask only; never change code.
---

# Grilling

Goal: grind the plan until nothing is silently assumed. Done means every branch of the design tree has been visited, the user has decided each open point, and they explicitly confirm the shared understanding.

## Hard boundaries

- Interview and research only. No code, config, database or Git changes, no side-effecting commands. Implementation starts only after the user confirms.
- Facts are yours to find; decisions belong to the user. Never ask for anything you can look up.
- Reply in the user's language. No decorative headings, no recap of the process.

## 1. Build the tree

- Restate the target and known constraints in one sentence; if the target is vague, ask one scoping question.
- Design tree: each decision is a node; its children are the decisions it unlocks.
- Run `memory-search` first for earlier decisions and pitfalls; do not re-ask settled points.

## 2. Find facts (never ask the user)

Pick the narrowest tool per gap and parallelize when possible:

- Project code, symbols, call chains, contracts: `lsp-*`, `filesystem-read`; use `grep-search` only for literal text such as logs, config and comments.
- Application settings truth: `config-get` / `config-list` (identify the right scope; do not guess files).
- Plugin or MCP tool names and parameters: `toolSearch-discover`.
- In-repo data flow, table structure, existing implementations: sub-agent `dev-research`.
- External facts, version differences, official docs: sub-agent `agent_search`; require inline citations.
- Genuinely complex trade-offs with multiple viable options: sub-agent `dev-plan`.

Research is an unsettled prerequisite: only questions downstream of it wait. Ask the rest of the frontier now; do not stall.

## 3. Ask the whole frontier each round

Frontier = decisions whose prerequisites are settled and that you can ask now without guessing.

- Ask with `user-interaction-askUserQuestion`, one call per question, all questions of the round in one batch, and that batch contains nothing but the questions (never mix in research or file reads).
- Give at least two options per question; the first is "Recommended: <full recommended answer>", the rest are concrete alternatives. The user can still add free text.
- Never substitute a Q1/Q2 text list in the message for the interactive tool.
- Wait for every answer before computing the next frontier; questions that depend on an open item belong to the next round.
- If the user selects mutually exclusive options, ask exactly one follow-up on that point; do not pick for them.

## 4. Record

- After each settled batch, update `todo-todo-manage` in the same batch as real work: decided items, open questions, questions blocked on research. This survives context compaction.
- Report only deltas each round: newly settled decisions, assumptions that were overturned, the next frontier.
- When the user makes a call that will affect later work, save it with `memory-save` (kind=decision): conclusion, rationale, alternatives dropped.

## 5. Converge

The frontier is empty when every branch has been visited and nothing is silently assumed.

Close with four items only: settled decisions, remaining risks and costs, dropped alternatives and why, suggested next verification.
Then ask "Shared understanding reached - start implementing?" Do not act before an explicit yes.
