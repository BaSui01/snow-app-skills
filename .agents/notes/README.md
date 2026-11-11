# 决策笔记

这里记录"为什么这样定、放弃了什么、怎么证明改对了"，给下一个改这段代码的人看。目录位置本身就是状态，不建总索引。

## 结构

```text
.agents/notes/
├── proposed/      想法阶段，方案稿
├── implemented/   已落地，随代码同步
├── rejected/      审慎否掉，防止重犯
└── archived/      已封存，只读
```

每个 lifecycle 下按分类建子目录，分类固定六种，不允许自造：

| 分类 | 收什么 |
| --- | --- |
| `feature` | 新能力，用户或模型看得见的行为变化 |
| `bug-fix` | 修缺陷，或复盘暴露的缺口 |
| `simplification` | 只删不增，行为不变的结构收缩 |
| `architecture` | 模块边界、包拓扑、运行时不变量、跨文件契约 |
| `process` | 流程与工具链：检查、发布、协作方式 |
| `testing` | 测试策略与测试基建 |

`refactor` 不单列：行为变了归到对应类，行为没变就是 `simplification`。

## 命名

```text
<lifecycle>/<class>/YYYY-MM-DD-topic.md
```

日期是首次提出日，移动目录时不变。文件名用 ASCII kebab-case，正文用中文。首两行固定：

```text
# Agent Note: <标题>
Status: <与所在目录一致>
```

三种形态与必备节见 `skills/decision-notes/SKILL.md`；模板在同目录 `templates/`。

## 什么时候写

非平凡改动必须写：行为、架构、跨文件契约、流程与工具链、测试策略、落盘/网络/配置格式发生变化，或被否方案、缺陷复盘值得留痕。

纯排版、错别字、无歧义重命名、样式调整、版本打标、不改行为的依赖补丁、常规 CRUD 不写。判不准时问一句：后来的人只看代码和测试，能不能推出为什么？能推出就不写。

## 检索

不扫全库，按意图直切目录；关键词检索必须排除归档：

```sh
rg --hidden --glob '!.agents/notes/archived/**' "<机制名或关键词>" .agents/notes/
```

## 校验

仓库根执行：

```sh
node scripts/verify-notes.mjs
```

检查目录与分类合法性、文件名、首两行、Status 与目录一致、必备节、implemented 不允许提案标题、相对链接是否存在、是否出现总索引。CI 的 `validate` 工作流会跑同一条命令。

## 与 memory 的分工

笔记是仓库记录，随代码走；`memory-manage` 只存一行指针和笔记路径，不重复存完整决策。
