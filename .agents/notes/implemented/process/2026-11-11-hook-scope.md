# Agent Note: Hook 作用域按依赖分层
Status: implemented

## Problem

工作流 hook 最初全部配置为全局：消息分流（`onUserMessage`）、诊断写保护与危险 git 阻断（`beforeToolCall`）、子代理证据门禁（`onSubAgentComplete`）、笔记写入校验（`afterToolCall`）。其中笔记校验依赖目标项目的 `.agents/notes/` 与本机 `snow-workflow-hook.mjs` 的绝对路径；全局配置让所有项目在每次写文件时都启动一次 node，即使该项目根本没有使用决策笔记。

## Decision

按“是否依赖项目结构”分层，而不是一律全局：

- `onUserMessage` classify：保持全局。症状/需求分流与项目无关。
- `beforeToolCall` guard：保持全局。危险 git 阻断通用；诊断写保护在 `.snow/workflow-state.json` 不存在时直接放行，不会误伤。
- `onSubAgentComplete` evidence：保持全局。针对全局 `dev-implement`，只在派发子代理时触发。
- `afterToolCall` verify：改为项目级，仅在采用 `.agents/notes/` 的项目配置。当前配置于 `local:E:\code\snow-app-skills`，全局记录已删除。

规则与脚本见 [WORKFLOW.md](../../../../WORKFLOW.md) 和 [snow-workflow-hook.mjs](../../../../scripts/snow-workflow-hook.mjs)。

## Alternatives considered

- **全部保持全局** — 最强理由：一处配置，所有项目行为一致，运维最省事。否决因为无关项目要承担 node 启动开销和本机脚本路径依赖，且笔记校验对没有 `.agents/notes` 的项目没有意义。
- **全部改为项目级** — 最强理由：隔离最彻底，单项目可独立启停。否决因为消息分流、危险 git 阻断和子代理证据门禁是跨项目通用的，逐项目复制会产生规则漂移；通用规则应只有一份来源。
- **不配 `afterToolCall`，只靠 CI** — 最强理由：零运行时开销，CI 已经是硬门禁。否决因为笔记写坏后要等到推送才发现，反馈太晚；按路径触发只在写笔记时付出约 150ms，值得。

## Consequences

- Benefit: 其他项目写文件不再触发笔记校验；笔记校验只在实际使用决策笔记的项目运行。
- Cost: 每个采用笔记系统的项目要单独配一次 `afterToolCall`；项目级同类规则会完全取代全局同类规则，未来若给某项目加项目级 `beforeToolCall`，必须把全局的危险 git 阻断完整复制过去。
- Boundary: `afterToolCall` 是事后钩子，校验失败只记录软警告，不回滚已完成的写入；它负责“立刻发现”，不负责“阻止写坏”。
- Verification: 写坏笔记后应用日志出现 `afterToolCall` 执行记录与 4 条 `verify-notes` 错误；全局 `action=list scope=hooks` 为 3 条，项目级 `action=get` 返回 `scope=project`；`node scripts/verify-notes.mjs` 输出 `1 note(s) OK`。
