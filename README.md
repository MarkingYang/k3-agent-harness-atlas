[English](README_EN.md) · 中文

# Agent Harness 全景指南

交互式学习站点：用分层地图与 16 个开源项目，讲清现代 Agent 系统里 **Harness** 这一层在做什么。

**在线访问：** https://www.ainoteatlas.com/

---

## 什么是 Agent Harness

模型是大脑；**Agent Harness** 是把 LLM 变成可靠 Agent 所需的骨架与神经系统。

单靠一个框架通常不够。生产里还要同时处理：任务编排与状态、多 Agent 协作、Trace / 评估 / 监控、记忆与知识、模型网关、工具协议、沙箱执行，以及可上线的应用平台。Harness 指的就是这套**分层协作的基础设施**，而不是某一个产品名。

本站把这套能力拆成九层，并对每层代表性开源项目做图解与对照，方便建立选型与学习顺序。

---

## 怎么用这个站

1. 打开 [在线站点](https://www.ainoteatlas.com/)，从首页 **架构地图**（`#map`）看九层全貌。  
2. 按分区浏览：运行时 → 可观测 → 记忆与评估 → 基础设施 → 平台。  
3. 打开 **学习路径**（`#path`），按 ★ 优先级选项目，再点进详情页。  
4. 详情页（`/tool/:id`）可看 Star 趋势、版本史、架构 / 数据流 / 技术版图 / 时序四类图，以及机制与取舍说明。  
5. 顶栏可切换中英文。

| 路径 | 内容 |
| --- | --- |
| `/` | 地图、能力层、学习路径、对照表 |
| `/tool/:id` | 单项目深度页，例如 `/tool/langgraph` |

首页锚点：`#map` · `#runtime` · `#observability` · `#memory` · `#infra` · `#platform` · `#path` · `#table`

---

## 学习路径

不要从「随便挑一个框架」开始。建议按优先级读：

| 优先级 | 含义 | 先看这些 |
| --- | --- | --- |
| ★★★★★ 核心必读 | Harness 骨架 | LangGraph、OpenAI Agents、AutoGen、Phoenix、LangSmith、OpenTelemetry |
| ★★★★☆ 重点掌握 | 生产里常配齐 | OpenViking、Mem0、DeepEval、Ragas、LiteLLM、MCP、Daytona、E2B |
| ★★★☆☆ 了解参考 | 产品形态参考 | Dify、CrewAI |

九层能力：

1. **智能体运行时** — 编排、状态、中断恢复  
2. **多智能体协作** — 角色、对话、终止条件  
3. **可观测性** — Trace、评估、线上监控  
4. **记忆与知识** — 跨会话沉淀与召回  
5. **评估与测试** — 回归与质量门禁  
6. **模型网关** — 多厂商统一调用与成本  
7. **工具协议** — 工具发现与权限边界（MCP）  
8. **沙箱执行** — 安全跑模型生成的代码  
9. **应用平台** — 可上线的工作流与运营壳  

---

## 效果截图

![首页](docs/images/01-home-hero.png)

![架构地图](docs/images/02-stack-map.png)

![能力层](docs/images/03-layer-section.png)

![项目详情](docs/images/04-tool-detail.png)

![架构图](docs/images/05-diagram-architecture.png)

![时序图](docs/images/06-diagram-sequence.png)

---

## 16 个项目一览

| 项目 | id | 层 | 优先级 | 一句话 | GitHub |
| --- | --- | --- | --- | --- | --- |
| LangGraph | `langgraph` | 运行时 | ★★★★★ | 工作流编排与持久化执行 | [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) |
| OpenAI Agents SDK | `openai-agents` | 运行时 | ★★★★★ | OpenAI 轻量 Agent 抽象 | [openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| AutoGen | `autogen` | 多智能体 | ★★★★★ | 对话驱动的多 Agent 协作 | [microsoft/autogen](https://github.com/microsoft/autogen) |
| Phoenix | `phoenix` | 可观测 | ★★★★★ | OTel 原生 Trace / 评估 | [Arize-ai/phoenix](https://github.com/Arize-ai/phoenix) |
| LangSmith | `langsmith` | 可观测 | ★★★★★ | LangChain 团队运维监控 | [langchain-ai/langsmith-sdk](https://github.com/langchain-ai/langsmith-sdk) |
| OpenTelemetry | `opentelemetry` | 可观测 | ★★★★★ | 厂商中立可观测标准 | [open-telemetry/opentelemetry-specification](https://github.com/open-telemetry/opentelemetry-specification) |
| OpenViking | `openviking` | 记忆 | ★★★★☆ | Agent 上下文与知识管理 | [volcengine/OpenViking](https://github.com/volcengine/OpenViking) |
| Mem0 | `mem0` | 记忆 | ★★★★☆ | 长期记忆层 | [mem0ai/mem0](https://github.com/mem0ai/mem0) |
| DeepEval | `deepeval` | 评估 | ★★★★☆ | pytest 风格 LLM 评估 | [confident-ai/deepeval](https://github.com/confident-ai/deepeval) |
| Ragas | `ragas` | 评估 | ★★★★☆ | RAG 管线评估 | [explodinggradients/ragas](https://github.com/explodinggradients/ragas) |
| LiteLLM | `litellm` | 网关 | ★★★★☆ | 统一调用多厂商模型 | [BerriAI/litellm](https://github.com/BerriAI/litellm) |
| MCP | `mcp` | 工具协议 | ★★★★☆ | 工具与数据接入协议 | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |
| Daytona | `daytona` | 沙箱 | ★★★★☆ | Agent 安全执行环境 | [daytonaio/daytona](https://github.com/daytonaio/daytona) |
| E2B | `e2b` | 沙箱 | ★★★★☆ | Firecracker 云沙箱 | [e2b-dev/E2B](https://github.com/e2b-dev/E2B) |
| Dify | `dify` | 平台 | ★★★☆☆ | 开源 LLM 应用平台 | [langgenius/dify](https://github.com/langgenius/dify) |
| CrewAI | `crewai` | 平台 | ★★★☆☆ | 角色式多 Agent 协作 | [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) |

---

## 本地运行

Node.js ≥ 20。

```bash
git clone https://github.com/MarkingYang/k3-agent-harness-atlas.git
cd k3-agent-harness-atlas
npm install
npm run dev
```

打开 http://localhost:7200

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 开发（默认端口 7200） |
| `npm run restart` | 端口占用时清理后重启 |
| `npm run build` / `npm run preview` | 构建与预览 |
| `npm run lint` | ESLint |

---

## 数据说明

- Star / 版本等统计于 **2026-07-18** 经 GitHub API 核对；文案依据各项目官方文档。  
- Star 曲线来自 OSS Insight 采样，可能有偏差。  
- 仅供学习参考，选型以官方仓库为准。

贡献见 [CONTRIBUTING.md](CONTRIBUTING.md)。License：[MIT](LICENSE)。

感谢上述开源项目及其社区。
