# Agent Note: 引入决策笔记系统
Status: implemented

## Problem

这套技能能约束"怎么做"，却留不下"为什么这样定"。技能正文、`WORKFLOW.md` 和 `memory` 都只能记录结论片段：被否掉的方案会随会话消失，改动与决策不在同一处，`retro` 也无法判断这轮有没有重提已经否掉的老路。第三方项目 `write-notes-like-deepseek` 证明了另一条路径——把决策写成仓库里的结构化笔记，并用脚本机械校验。

## Decision

仓库采用 `.agents/notes/{proposed,implemented,rejected,archived}/{feature,bug-fix,simplification,architecture,process,testing}/YYYY-MM-DD-topic.md` 的固定结构，不建总索引，路径即状态。首两行固定标题与 `Status`，`Status` 必须与所在目录一致。

新增 `decision-notes` 技能承载完整契约：非平凡判定、三种笔记形态、必备节、`proposed -> implemented` 流转、被取代时的互链与归档、检索命令和校验命令。笔记模板与零依赖校验脚本随技能目录分发，安装后即可在宿主项目使用；仓库根通过 `scripts/verify-notes.mjs` 薄包装复用同一份规则，CI 的 `validate` 工作流串跑 `validate-skills` 与 `verify-notes`。

`grilling` 收敛后默认写 `proposed` 笔记；`plan-execute` 把批次表写入同一篇笔记的 `## Execution batches`，主代理独占状态列，子代理只接收本批次行并返回证据，落地后压缩为 `## Consequences`；`diagnosing-bugs` 把根因与验证写入 `implemented/bug-fix/`；`retro` 读取 `rejected/` 检查重复提案；`handoff` 引用笔记路径而不是复制内容。`memory` 只保留一行指针。

规则细节见 [decision-notes SKILL.md](../../../../skills/decision-notes/SKILL.md)。

## Alternatives considered

- **只安装第三方 `write-notes-like-deepseek`** — 最强理由：结构、脚本、看板都现成，零维护。否决因为它要求 `npx tsx` 与外部模板，且与本技能库的触发面重叠；直接引入会出现两套描述竞争和两套规则来源，而这里需要的核心只是结构与校验。
- **把笔记规则塞进 `grill-with-docs`** — 最强理由：不新增技能，减少安装项。否决因为 `plan-execute`、`diagnosing-bugs`、`retro`、`handoff` 各自安装时拿不到规则与脚本，笔记格式会分叉；一个技能一个职责更稳。（该技能后来已并入 `grilling` 与 `decision-notes`。）
- **继续用 memory 加 ADR** — 最强理由：已有实践，零新增结构。否决因为 memory 跨会话但不是仓库资产，ADR 只覆盖结构决策，两者都没有生命周期、被否方案和机械校验。

## Consequences

- Benefit: 决策与代码同仓库、同一次改动；被否方案可检索；格式由非零退出码兜底，而不是靠自觉。
- Cost: 非平凡改动多一个文件；归档与被取代需要人工判断是否有独立价值；脚本只校验结构，语义仍要靠评审。
- Verification: `node scripts/verify-notes.mjs` 输出 `verify-notes: 1 note(s) OK`；`node scripts/validate-skills.mjs` 通过。
