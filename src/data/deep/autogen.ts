import type { ToolDeepDive } from '../deepDive'

/**
 * Microsoft AutoGen 深度解析
 * 数据来源：
 * - starHistory：OSS Insight API（microsoft/autogen），2023-08 至 2026-07 共 36 点
 * - stats：GitHub REST API /repos/microsoft/autogen（2026-07-18 采集）
 * - versions：github.com/microsoft/autogen/releases（Python 包 tag：python-vX.Y.Z；
 *   README 声明显示文档 CC-BY-4.0、代码 MIT）
 * - 架构：README 与 microsoft.github.io/autogen 官方文档（Core/AgentChat/Extensions 三层、
 *   Topic/Subscription、GroupChat、Magentic-One、分布式 Runtime）；项目 2025-09 起进入维护模式
 */
export const autogenDeep: ToolDeepDive = {
  toolId: 'autogen',
  stats: {
    stars: 59804,
    forks: 8999,
    license: 'MIT / CC-BY-4.0',
    checkedAt: '2026-07-18',
  },
  starHistory: [
    { date: '2023-08', stars: 2 },
    { date: '2023-09', stars: 2327 },
    { date: '2023-10', stars: 13821 },
    { date: '2023-11', stars: 16356 },
    { date: '2023-12', stars: 17882 },
    { date: '2024-01', stars: 19931 },
    { date: '2024-02', stars: 20962 },
    { date: '2024-03', stars: 22387 },
    { date: '2024-04', stars: 23794 },
    { date: '2024-05', stars: 25109 },
    { date: '2024-06', stars: 26346 },
    { date: '2024-07', stars: 27455 },
    { date: '2024-08', stars: 28536 },
    { date: '2024-09', stars: 29720 },
    { date: '2024-10', stars: 30795 },
    { date: '2024-11', stars: 33186 },
    { date: '2024-12', stars: 34625 },
    { date: '2025-01', stars: 36579 },
    { date: '2025-02', stars: 38321 },
    { date: '2025-03', stars: 40205 },
    { date: '2025-04', stars: 41567 },
    { date: '2025-05', stars: 42780 },
    { date: '2025-06', stars: 43578 },
    { date: '2025-07', stars: 44469 },
    { date: '2025-08', stars: 45124 },
    { date: '2025-09', stars: 45723 },
    { date: '2025-10', stars: 46082 },
    { date: '2025-11', stars: 46448 },
    { date: '2025-12', stars: 46876 },
    { date: '2026-01', stars: 47267 },
    { date: '2026-02', stars: 47567 },
    { date: '2026-03', stars: 47904 },
    { date: '2026-04', stars: 48129 },
    { date: '2026-05', stars: 48223 },
    { date: '2026-06', stars: 48256 },
    { date: '2026-07', stars: 59804 },
  ],
  versions: [
    { version: 'v0.7.5', date: '2025-09-30', highlight: 'GPT-5 推理参数与 Anthropic 思考模式支持' },
    { version: 'v0.7.4', date: '2025-08-19', highlight: '修复 Redis 缓存反序列化与流式问题' },
    { version: 'v0.7.3', date: '2025-08-19', highlight: '新增 GPT-5 模型信息与 anyOf 类型支持' },
    { version: 'v0.7.2', date: '2025-08-07', highlight: 'MagenticOne 默认改用 Docker 代码执行器' },
    { version: 'v0.7.1', date: '2025-07-28', highlight: '新增 RedisMemory，Team 可嵌套协作' },
  ],
  architecture: {
    intro:
      '架构分四层：Core 按 Topic 订阅路由消息，AgentChat 封装 Agent 与 Team，Extensions 提供模型与工具，顶层含 Magentic-One。依赖严格向下。',
    diagram: {
      cols: 3,
      rows: 4,
      nodes: [
        { id: 'app', label: '用户应用', sub: '自定义 Agent 系统', kind: 'external', col: 1, row: 1, group: '应用层' },
        { id: 'studio', label: 'Studio', sub: 'autogen-studio', kind: 'external', col: 2, row: 1, group: '应用层' },
        { id: 'm1', label: 'M-One', sub: 'magentic-one', kind: 'core', col: 3, row: 1, group: '应用层' },
        { id: 'assistant', label: '助手 Agent', sub: 'AssistantAgent', kind: 'core', col: 1, row: 2, group: 'AgentChat' },
        { id: 'team', label: '群聊团队', sub: 'BaseGroupChat', kind: 'core', col: 2, row: 2, group: 'AgentChat' },
        { id: 'term', label: '终止条件', sub: 'Termination', kind: 'control', col: 3, row: 2, group: 'AgentChat' },
        { id: 'actor', label: 'Actor 引擎', sub: 'AgentRuntime', kind: 'core', col: 1, row: 3, group: 'Core 层' },
        { id: 'topic', label: 'Topic 订阅', sub: 'Subscription', kind: 'core', col: 2, row: 3, group: 'Core 层' },
        { id: 'dist', label: 'gRPC 运行时', sub: 'GrpcWorker', kind: 'core', col: 3, row: 3, group: 'Core 层' },
        { id: 'model', label: '模型客户端', sub: 'ChatCompletion', kind: 'data', col: 1, row: 4, group: '扩展层' },
        { id: 'tools', label: '工具工作台', sub: 'McpWorkbench', kind: 'data', col: 2, row: 4, group: '扩展层' },
        { id: 'memory', label: '记忆与执行', sub: 'RedisMemory', kind: 'data', col: 3, row: 4, group: '扩展层' },
      ],
      edges: [
        { from: 'app', to: 'team', label: 'run(task)' },
        { from: 'studio', to: 'team', label: '可视化编排' },
        { from: 'm1', to: 'team', label: '构建于 Team' },
        { from: 'assistant', to: 'team', label: '加入团队' },
        { from: 'team', to: 'term', label: '终止判定' },
        { from: 'team', to: 'actor', label: '运行于' },
        { from: 'actor', to: 'topic', label: '发布订阅' },
        { from: 'actor', to: 'dist', label: '跨进程注册' },
        { from: 'assistant', to: 'model', label: 'create()' },
        { from: 'assistant', to: 'tools', label: 'call_tool' },
        { from: 'assistant', to: 'memory', label: '记忆读写' },
      ],
      note: '四层依赖严格向下：Extensions 可插拔替换，Core 不依赖任何上层抽象，可独立嵌入。',
    },
  },
  dataFlow: {
    intro:
      '群聊任务全生命周期：任务经 run() 进入共享线程，Manager 挑选发言人，Agent 调用模型与工具并写回线程，每轮按增量消息判定终止，命中后输出 TaskResult。线程是唯一事实来源。',
    diagram: {
      direction: 'LR',
      cols: 5,
      rows: 2,
      nodes: [
        { id: 'task', label: '用户任务', sub: '文本/多模态', kind: 'external', col: 1, row: 1 },
        { id: 'mgr', label: '群聊管理', sub: 'GroupChat', kind: 'core', col: 2, row: 1 },
        { id: 'agent', label: '发言人', sub: 'AssistantAgent', kind: 'core', col: 3, row: 1 },
        { id: 'client', label: '模型客户端', sub: 'ChatCompletion', kind: 'data', col: 4, row: 1 },
        { id: 'llm', label: 'LLM', sub: '云端推理', kind: 'external', col: 5, row: 1 },
        { id: 'thread', label: '消息线程', sub: 'AgentMessage', kind: 'data', col: 2, row: 2 },
        { id: 'wb', label: '工具工作台', sub: 'McpWorkbench', kind: 'data', col: 3, row: 2 },
        { id: 'term', label: '终止判定', sub: 'Termination', kind: 'control', col: 4, row: 2 },
        { id: 'result', label: '任务结果', sub: 'TaskResult', kind: 'external', col: 5, row: 2 },
      ],
      edges: [
        { from: 'task', to: 'mgr', label: 'run(task)' },
        { from: 'mgr', to: 'agent', label: '挑选发言人' },
        { from: 'agent', to: 'client', label: 'create()' },
        { from: 'client', to: 'llm', label: 'API 请求' },
        { from: 'llm', to: 'client', label: '流式响应', dashed: true },
        { from: 'agent', to: 'wb', label: 'call_tool' },
        { from: 'wb', to: 'thread', label: '执行结果' },
        { from: 'agent', to: 'thread', label: '消息写入' },
        { from: 'thread', to: 'mgr', label: '读上下文', dashed: true },
        { from: 'mgr', to: 'term', label: '增量消息' },
        { from: 'term', to: 'result', label: '终止命中' },
      ],
      note: '消息线程是唯一事实来源：Agent 无私有状态也能从上下文恢复与接力。',
    },
  },
  sequence: {
    intro:
      'SelectorGroupChat 典型流程：run() 启动群聊，Manager 选出发言人，发言人调用模型返回消息，Manager 广播并增量判定终止，最终输出 TaskResult。',
    diagram: {
      actors: [
        { id: 'user', label: '用户', kind: 'user' },
        { id: 'team', label: 'Team', kind: 'system' },
        { id: 'mgr', label: 'Manager', kind: 'system' },
        { id: 'agent', label: '发言人', kind: 'agent' },
        { id: 'llm', label: 'LLM', kind: 'external' },
      ],
      messages: [
        { from: 'user', to: 'team', label: 'team.run(task)' },
        { from: 'team', to: 'mgr', label: '启动消息线程' },
        { from: 'mgr', to: 'mgr', label: 'select_speaker' },
        { from: 'mgr', to: 'agent', label: 'on_messages()' },
        { from: 'agent', to: 'llm', label: 'create() 请求' },
        { from: 'llm', to: 'agent', label: 'CreateResult', dashed: true },
        { from: 'agent', to: 'mgr', label: '返回 Response', dashed: true },
        { from: 'mgr', to: 'team', label: 'publish_message' },
        { from: 'team', to: 'user', label: 'TaskResult 返回', dashed: true },
      ],
      note: 'Selector 每次由模型选发言人；RoundRobin 跳过第 3 步轮换；广播后按增量消息判终止。',
    },
  },
  extension: [
    {
      title: '自定义 Agent',
      desc: '继承 BaseChatAgent 即可加入任意 Team；也可实现 Core 的 Agent 协议注册进运行时，或用 AgentTool 把 Agent 包装成工具供上级调用。',
    },
    {
      title: '模型客户端',
      desc: '实现 ChatCompletionClient 接口即可接入任意模型：扩展包内置 OpenAI、Anthropic、Ollama 等，统一支持流式与结构化输出，换模型只换实例。',
    },
    {
      title: '工具与 Workbench',
      desc: '函数签名自动生成工具 schema，无需手写描述；Workbench 聚合多个 MCP Server 的工具集，支持覆盖工具名与描述，让 Agent 直连 MCP 服务。',
    },
    {
      title: 'Memory 扩展',
      desc: '实现 Memory 接口可在发言前注入上下文；核心包内置 ListMemory，扩展包提供 RedisMemory、mem0 与 ChromaDB，覆盖缓存、向量召回与长期记忆。',
    },
  ],
  challenges: [
    {
      title: '对话失控风险',
      desc: '多 Agent 自由对话容易陷入重复客套或话题漂移，必须组合发言选择策略、TextMention/MaxMessage 等终止条件与 Token 用量上限，把对话约束在任务轨道上。',
    },
    {
      title: '版本迁移断层',
      desc: '0.2 到 0.4 是完全重写，API 全面异步化且互不兼容，社区因此分叉出 AG2；存量系统需按官方迁移指南改造对话与工具代码，成本不可忽视。',
    },
    {
      title: '分布式调试复杂',
      desc: '跨进程、跨语言的分布式运行时依赖消息序列化与订阅路由，乱序与故障恢复难以复现；虽内置 OpenTelemetry 追踪，定位问题仍需专业 Trace 分析。',
    },
    {
      title: '上下文膨胀',
      desc: '群聊中每条消息都进入共享线程并广播给后续发言人，长任务下上下文迅速膨胀；需用可裁剪的上下文对象压缩历史，否则 token 成本线性失控。',
    },
  ],
  positioning:
    'AutoGen 由微软研究院 2023 年开源，以「对话驱动协作」开创多 Agent 框架：角色各异的 Agent 经结构化消息协作。0.4 重构为事件驱动 Actor 架构，分 Core、AgentChat、Extensions 三层，Magentic-One 展示通用团队潜力。2025 年 9 月进入维护模式，继任者为 Microsoft Agent Framework，社区分叉出 AG2 演进，仍是多 Agent 编排经典蓝本。',
  landscape: {
    intro:
      '上游对接 LLM 厂商、MCP 工具与记忆存储，中游是 Core/AgentChat 框架本体，下游长出 Magentic-One 与 Studio，并演进为 MAF 与 AG2 后继路线。',
    diagram: {
      direction: 'LR',
      cols: 3,
      rows: 4,
      nodes: [
        { id: 'llm', label: 'LLM 厂商', sub: 'OpenAI/Azure', kind: 'external', col: 1, row: 1, group: '上游依赖' },
        { id: 'mcp', label: 'MCP 工具', sub: 'MCP Servers', kind: 'external', col: 1, row: 2, group: '上游依赖' },
        { id: 'mem', label: '记忆存储', sub: 'Redis/mem0', kind: 'external', col: 1, row: 3, group: '上游依赖' },
        { id: 'docker', label: '代码执行', sub: 'Docker', kind: 'external', col: 1, row: 4, group: '上游依赖' },
        { id: 'core', label: 'AutoGen', sub: 'Core+AgentChat', kind: 'core', col: 2, row: 2, group: '本项目' },
        { id: 'ext', label: '扩展生态', sub: 'autogen-ext', kind: 'core', col: 2, row: 3, group: '本项目' },
        { id: 'm1', label: 'M-One', sub: 'magentic-one', kind: 'core', col: 3, row: 1, group: '下游应用' },
        { id: 'studio', label: 'Studio', sub: 'autogen-studio', kind: 'core', col: 3, row: 2, group: '下游应用' },
        { id: 'maf', label: 'MAF', sub: 'AgentFramework', kind: 'external', col: 3, row: 3, group: '下游应用' },
        { id: 'ag2', label: 'AG2', sub: 'ag2ai/ag2', kind: 'external', col: 3, row: 4, group: '下游应用' },
      ],
      edges: [
        { from: 'llm', to: 'core', label: 'create()' },
        { from: 'mcp', to: 'core', label: 'MCP/stdio' },
        { from: 'mem', to: 'ext', label: 'Memory 接口' },
        { from: 'docker', to: 'ext', label: '容器执行' },
        { from: 'ext', to: 'core', label: '注入能力' },
        { from: 'core', to: 'm1', label: '构建团队' },
        { from: 'core', to: 'studio', label: '驱动 GUI' },
        { from: 'core', to: 'maf', label: '演进继任', dashed: true },
        { from: 'core', to: 'ag2', label: '0.2 分叉', dashed: true },
      ],
      note: 'AutoGen 已进入维护模式：新能力流向 Microsoft Agent Framework，存量由社区维护。',
    },
  },
  competitors: [
    {
      name: 'LangGraph',
      relation: '直接竞品',
      diff: '以图状态机显式编排状态流转，确定性与持久化更强；AutoGen 以对话驱动协作，角色交互灵活但行为更难预测。',
    },
    {
      name: 'CrewAI',
      relation: '直接竞品',
      diff: '以角色三要素定义 Agent，心智直观上手快；AutoGen 分层 API 与事件驱动运行时更深，学习曲线更陡。',
    },
    {
      name: 'OpenAI Agents SDK',
      relation: '相邻替代',
      diff: '轻量原语绑定 OpenAI 生态，集成顺滑；AutoGen 模型无关、协作拓扑更丰富，复杂度也更高。',
    },
    {
      name: 'MetaGPT',
      relation: '相邻替代',
      diff: '用 SOP 流水线模拟软件公司角色分工，面向代码生成场景收敛；AutoGen 是通用对话式协作框架，适用面更广。',
    },
  ],
  mechanism: [
    {
      title: 'Topic 消息路由',
      desc: '广播时发布方只给出 TopicId＝（Topic Type, Topic Source），运行时的订阅表把 Topic 映射到 AgentId：TypeSubscription 按 Topic Type 匹配订阅的 Agent Type，并以 Topic Source 的值充当 Agent Key 拼出目标 AgentId；实例不存在时由运行时惰性创建，无订阅的 Topic 消息直接丢弃，同一 Agent 命中多条订阅也只投递一次。',
    },
    {
      title: '模型选择发言人',
      desc: 'SelectorGroupChat 每轮把候选 Agent 的名字与 description 填入 {roles}、对话历史填入 {history} 组成选择提示词，调用模型从 {participants} 名单中指名下一位发言人；默认禁止同一 Agent 连续发言，可设 allow_repeated_speaker 放开；还可用 selector_func 完全接管选择逻辑，或先用 candidate_func 收窄候选范围，函数返回 None 时回落到模型选择。',
    },
    {
      title: '终止条件组合判定',
      desc: 'TerminationCondition 是有状态的可调用对象：群聊中每个 Agent 响应完成后，团队把自上次判定以来的增量消息序列交给它，返回 StopMessage 即终止并把原因写入 TaskResult，返回 None 则继续下一轮；多个条件可用 & 与 | 组合成与/或逻辑，且每次 run 结束后自动 reset，团队得以带着既有上下文继续后续任务。',
    },
    {
      title: '跨进程 Agent 寻址',
      desc: 'AgentId 由（Type, Key）二元组构成，消息始终按 AgentId 寻址而不关心物理位置；分布式模式下 GrpcWorkerAgentRuntimeHost 维护全部 worker 连接并保存直发消息会话，每个 worker 启动时向 host 登记自己支持的 Agent Type，host 据此把消息转发到正确的 worker 进程；跨语言通信要求所有消息类型共享 protobuf schema。',
    },
  ],
  sourceLayout: [
    { path: 'python/packages/autogen-core', role: '事件驱动 Actor 运行时：Agent、消息传递与订阅路由' },
    { path: 'python/packages/autogen-agentchat', role: '高层 API：预置 Agent、Team 编排与终止条件' },
    { path: 'python/packages/autogen-ext', role: '扩展包：模型客户端、工具、记忆与 gRPC 分布式运行时' },
    { path: 'python/packages/autogen-magentic-one', role: 'Magentic-One 通用多智能体团队的实现' },
    { path: 'python/packages/autogen-studio', role: '低代码原型工具 AutoGen Studio 的前后端' },
    { path: 'python/packages/agbench', role: 'Agent 性能基准评测套件 AutoGen Bench' },
    { path: 'protos', role: '跨语言分布式运行时共享的 protobuf 消息契约' },
    { path: 'dotnet/src', role: '.NET 实现：AutoGen.Core 与分布式运行时' },
  ],
  tradeoffs: [
    {
      title: '0.4 全面重写',
      choice: '放弃兼容，改为事件驱动 Actor 模型',
      reason: 'v0.2 在快速扩张中积累架构约束：观测与干预能力弱、协作模式不灵活、组件难复用；团队按社区反馈以异步消息与事件驱动重建，换取可扩展性、健壮性与分布式能力。',
    },
    {
      title: 'Core/AgentChat 分层',
      choice: '高低两层 API 并存，依赖严格向下',
      reason: 'AgentChat 维持与 v0.2 相近的抽象层级以降低迁移成本，Core 只暴露事件驱动原语供深度定制；代价是同类协作能力存在两套接口，学习路径与官方维护面都随之加大。',
    },
    {
      title: '全面异步化',
      choice: 'API 全面 async/await 化',
      reason: '消息驱动与并发处理天然契合异步：Agent 可同时响应事件与请求-响应；但同步时代的 0.2 代码无法直接迁移，存量项目须按官方迁移指南改写为异步调用。',
    },
  ],
  production: [
    {
      title: '维护模式下的选型',
      desc: '项目自 2025 年 9 月进入维护模式：仅接受 bug 修复、安全补丁与文档改进；新项目官方建议直接用 Microsoft Agent Framework，存量项目按迁移指南过渡或评估分叉 AG2。',
    },
    {
      title: '分布式部署',
      desc: 'host 用 GrpcWorkerAgentRuntimeHost 启动，worker 用 GrpcWorkerAgentRuntime 注册 Agent，host 统一投递消息；仍属实验性 API。',
    },
    {
      title: 'OTel 追踪接入',
      desc: '内置 OpenTelemetry 埋点遵循 GenAI 语义约定，配 OTLP Exporter 接入 Jaeger 等后端；AUTOGEN_DISABLE_RUNTIME_TRACING 可关闭。',
    },
    {
      title: '成本与失控防护',
      desc: 'Selector 每轮选发言人本身消耗一次模型调用，可用 candidate_func 收窄候选；并以 MaxMessage/TokenUsage 等终止条件兜底，防止循环失控。',
    },
  ],
  en: {
    tagline:
      "Microsoft Research's pioneering framework where specialized agents collaborate through structured conversations — the classic blueprint for multi-agent orchestration, now in maintenance mode.",
    summary:
      'AutoGen, open-sourced by Microsoft Research in 2023, popularized conversation-driven multi-agent collaboration. Its 0.4 rewrite introduced a layered, event-driven actor architecture: autogen-core provides message passing with topic/subscription routing plus local and distributed runtimes; AgentChat adds high-level agents, teams, and composable termination conditions; Extensions supply model clients, MCP tools, and memory. Magentic-One demonstrates a generalist agent team built on these APIs. The project entered maintenance mode in 2025, succeeded by Microsoft Agent Framework, yet it remains the classic reference for studying group-chat orchestration, speaker selection, and human-in-the-loop agent design.',
  },
}
