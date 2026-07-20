import type { ToolDeepDive } from '../deepDive'

/**
 * LangGraph 深度解析
 * 数据来源：
 * - Star 历史：OSS Insight API https://api.ossinsight.io/v1/repos/langchain-ai/langgraph/stargazers/history
 * - 仓库统计：GitHub API https://api.github.com/repos/langchain-ai/langgraph（2026-07-18）
 * - 版本：https://github.com/langchain-ai/langgraph/releases（亮点取自 release notes 首行）
 *   版本日期以 PyPI 上传时间为准：https://pypi.org/pypi/langgraph/json
 * - 架构：官方 README 与文档（Graph API / Persistence / Pregel / Subgraph / Command / Send）
 * - 机制/取舍/生产：docs.langchain.com Graph API 与 Interrupts 指南、PostgresSaver 参考文档与 GitHub issue
 * - 源码结构：GitHub API 核实 langchain-ai/langgraph 仓库 libs/ 目录（2026-07）
 */
export const langgraphDeep: ToolDeepDive = {
  toolId: 'langgraph',

  stats: {
    stars: 37541,
    forks: 6290,
    license: 'MIT',
    checkedAt: '2026-07-18',
  },

  // OSS Insight 共 36 个采样点，未超上限，全量保留
  starHistory: [
    { date: '2023-08', stars: 5 },
    { date: '2023-09', stars: 8 },
    { date: '2023-10', stars: 25 },
    { date: '2023-11', stars: 58 },
    { date: '2023-12', stars: 73 },
    { date: '2024-01', stars: 843 },
    { date: '2024-02', stars: 1464 },
    { date: '2024-03', stars: 1933 },
    { date: '2024-04', stars: 2604 },
    { date: '2024-05', stars: 3204 },
    { date: '2024-06', stars: 3827 },
    { date: '2024-07', stars: 4484 },
    { date: '2024-08', stars: 5061 },
    { date: '2024-09', stars: 5550 },
    { date: '2024-10', stars: 6045 },
    { date: '2024-11', stars: 6515 },
    { date: '2024-12', stars: 7183 },
    { date: '2025-01', stars: 8021 },
    { date: '2025-02', stars: 8935 },
    { date: '2025-03', stars: 10189 },
    { date: '2025-04', stars: 11325 },
    { date: '2025-05', stars: 12311 },
    { date: '2025-06', stars: 13311 },
    { date: '2025-07', stars: 14272 },
    { date: '2025-08', stars: 15112 },
    { date: '2025-09', stars: 15853 },
    { date: '2025-10', stars: 16239 },
    { date: '2025-11', stars: 16684 },
    { date: '2025-12', stars: 17169 },
    { date: '2026-01', stars: 17639 },
    { date: '2026-02', stars: 18013 },
    { date: '2026-03', stars: 18534 },
    { date: '2026-04', stars: 19021 },
    { date: '2026-05', stars: 19220 },
    { date: '2026-06', stars: 19315 },
    { date: '2026-07', stars: 37541 },
  ],

  versions: [
    { version: '1.2.9', date: '2026-07-10', highlight: '修复 delta channel 元数据与计数' },
    { version: '1.2.8', date: '2026-07-06', highlight: '新线程 updateState 强制写完整快照' },
    { version: '1.2.7', date: '2026-06-30', highlight: '修复 DeltaChannel 覆盖快照与序列化' },
    { version: '1.2.6', date: '2026-06-18', highlight: '修复嵌套子图继承父 checkpoint_ns' },
    { version: '1.2.5', date: '2026-06-12', highlight: '合并 lc_versions 配置元数据' },
  ],

  architecture: {
    intro:
      '架构分四层：StateGraph 声明状态与边，编译后由 Pregel 并行调度；Checkpointer 落步边界快照，Platform 托管运行。取舍是只做低层原语，以显式图换确定性与可恢复。',
    diagram: {
      cols: 4,
      rows: 3,
      nodes: [
        { id: 'graph', label: '图构建器', sub: 'StateGraph', kind: 'core', col: 1, row: 1, group: '图定义层' },
        { id: 'schema', label: '状态通道', sub: 'State/reducer', kind: 'data', col: 2, row: 1, group: '图定义层' },
        { id: 'edges', label: '节点与边', sub: 'add_node/edge', kind: 'core', col: 3, row: 1, group: '图定义层' },
        { id: 'subg', label: '子图', sub: 'Subgraph', kind: 'core', col: 4, row: 1, group: '图定义层' },
        { id: 'pregel', label: 'Pregel引擎', sub: 'super-step 调度', kind: 'core', col: 1, row: 2, group: '运行时引擎' },
        { id: 'send', label: '动态分发', sub: 'Send API', kind: 'core', col: 2, row: 2, group: '运行时引擎' },
        { id: 'hitl', label: '中断恢复', sub: 'interrupt', kind: 'control', col: 3, row: 2, group: '运行时引擎' },
        { id: 'ckpt', label: '检查点', sub: 'Checkpointer', kind: 'data', col: 1, row: 3, group: '持久化层' },
        { id: 'store', label: '记忆存储', sub: 'BaseStore', kind: 'data', col: 2, row: 3, group: '持久化层' },
        { id: 'server', label: '托管服务', sub: 'Agent Server', kind: 'external', col: 3, row: 3, group: '平台接入' },
        { id: 'studio', label: 'Studio', sub: '可视化调试', kind: 'external', col: 4, row: 3, group: '平台接入' },
      ],
      edges: [
        { from: 'graph', to: 'schema', label: '定义schema' },
        { from: 'graph', to: 'edges', label: 'add_node' },
        { from: 'subg', to: 'edges', label: '作为节点嵌入' },
        { from: 'edges', to: 'pregel', label: 'compile()' },
        { from: 'schema', to: 'pregel', label: '读写合并' },
        { from: 'pregel', to: 'ckpt', label: '每步快照' },
        { from: 'hitl', to: 'pregel', label: '暂停恢复', bidirectional: true },
        { from: 'send', to: 'pregel', label: '动态分发' },
        { from: 'pregel', to: 'store', label: '长期记忆' },
        { from: 'server', to: 'pregel', label: '驱动执行', dashed: true },
        { from: 'studio', to: 'server', label: '调试回放', dashed: true },
        { from: 'graph', to: 'server', label: '部署发布', dashed: true },
      ],
      note: '执行模型灵感来自 Google Pregel：同一 super-step 内节点并行，全部静默即终止。',
    },
  },

  dataFlow: {
    intro:
      '一次调用即状态的单向演进：输入写入 State 后，Pregel 并行激活节点，节点只返回部分更新由 reducer 合并；条件边决定下一批节点或 END。快照只落在步边界，保证状态一致、可断点续跑。',
    diagram: {
      direction: 'LR',
      cols: 5,
      rows: 2,
      nodes: [
        { id: 'input', label: '用户输入', sub: 'invoke/stream', kind: 'external', col: 1, row: 1 },
        { id: 'state', label: '全局状态', sub: 'State 通道', kind: 'data', col: 2, row: 1 },
        { id: 'pregel', label: 'Pregel循环', sub: 'super-step', kind: 'core', col: 3, row: 1 },
        { id: 'exec', label: '节点执行', sub: '读状态返更新', kind: 'core', col: 4, row: 1 },
        { id: 'merge', label: '更新合并', sub: 'reducer', kind: 'data', col: 5, row: 1 },
        { id: 'human', label: '人工审批', sub: 'interrupt', kind: 'control', col: 1, row: 2 },
        { id: 'snap', label: '检查点', sub: 'thread_id 留档', kind: 'data', col: 2, row: 2 },
        { id: 'route', label: '条件路由', sub: '条件边/Command', kind: 'control', col: 4, row: 2 },
        { id: 'output', label: '流式输出', sub: 'stream 事件', kind: 'external', col: 5, row: 2 },
      ],
      edges: [
        { from: 'input', to: 'state', label: 'invoke 输入' },
        { from: 'state', to: 'pregel', label: '读取 State' },
        { from: 'pregel', to: 'exec', label: '并行激活' },
        { from: 'exec', to: 'merge', label: '部分更新 dict' },
        { from: 'merge', to: 'state', label: 'reducer 写回' },
        { from: 'merge', to: 'route', label: '最新 State' },
        { from: 'route', to: 'pregel', label: '循环激活', dashed: true },
        { from: 'route', to: 'output', label: 'stream 事件' },
        { from: 'merge', to: 'snap', label: '步末快照 put' },
        { from: 'snap', to: 'human', label: '断点待审', dashed: true },
        { from: 'human', to: 'pregel', label: 'Command 恢复', dashed: true },
      ],
      note: '状态只沿 reducer 通道单向演进，快照落在 super-step 边界，中断后可从最近检查点无损续跑。',
    },
  },

  sequence: {
    intro:
      '带审批的调用：按 thread_id 提交输入，引擎 get_tuple 读快照后驱动 LLM 推理，每步 put 落盘；interrupt 挂起待批，Command 断点续跑，流式返回。',
    diagram: {
      actors: [
        { id: 'client', label: '调用方', kind: 'user' },
        { id: 'engine', label: 'Pregel 引擎', kind: 'agent' },
        { id: 'llm', label: 'LLM', kind: 'external' },
        { id: 'ckpt', label: '检查点', kind: 'system' },
        { id: 'human', label: '审批人', kind: 'user' },
      ],
      messages: [
        { from: 'client', to: 'engine', label: 'invoke 提交输入' },
        { from: 'engine', to: 'ckpt', label: 'get_tuple 读快照' },
        { from: 'ckpt', to: 'engine', label: '恢复历史 State', dashed: true },
        { from: 'engine', to: 'llm', label: 'model.invoke 推理' },
        { from: 'llm', to: 'engine', label: '返回 AIMessage', dashed: true },
        { from: 'engine', to: 'ckpt', label: 'put 写步末快照' },
        { from: 'engine', to: 'human', label: 'interrupt 挂起待审' },
        { from: 'human', to: 'engine', label: 'Command 批准恢复' },
        { from: 'engine', to: 'client', label: 'stream 流式返回', dashed: true },
      ],
      note: '中断前后共享同一 thread 的检查点链，恢复无需重跑已完成节点。',
    },
  },

  extension: [
    {
      title: '自定义节点与 reducer',
      desc: '节点即普通函数：接收 State、返回部分更新即可入图；为 key 自定义 reducer，可精确控制并发写的合并语义，累加、覆盖、计数各有通道。',
    },
    {
      title: 'Subgraph 子图复用',
      desc: '编译后的图可作为节点嵌入父图，父子图共享或独立 schema；supervisor 等多 Agent 模式因此能封装为可复用组件，层层嵌套。',
    },
    {
      title: 'Checkpointer/Store 插件',
      desc: '持久化是接口而非实现：官方提供 SQLite、Postgres、Redis 等实现，也可继承 BaseCheckpointSaver 自研后端，按 thread 隔离。',
    },
    {
      title: 'LangGraph Platform',
      desc: '图代码经 langgraph-cli 起本地 Server 或部署 Platform，获得流式 API、定时任务与 Studio 调试；RemoteGraph 让远端图如本地调用。',
    },
  ],

  challenges: [
    {
      title: '并发写的状态一致性',
      desc: '同一 super-step 内多节点并行更新同一 key 时，合并结果取决于 reducer 设计；delta channel 的元数据漂移会让下游读到不一致快照。',
    },
    {
      title: '断点恢复的命名空间',
      desc: '子图嵌套时 checkpoint_ns 须正确继承父级，否则恢复错位；跨版本升级时旧快照与新 schema 的兼容迁移也需仔细设计。',
    },
    {
      title: '循环图的可观测性',
      desc: '图允许任意回边，执行路径运行时才确定，难预判步数；需借助流式事件、LangSmith trace 与 Studio 逐步回放每个 super-step。',
    },
    {
      title: '长任务工程化',
      desc: '跨天运行要处理节点幂等、部分失败重跑与流式背压；快照体积随状态增长，后端的写入开销与清理策略是隐性成本。',
    },
  ],

  positioning:
    'LangGraph 占据 Agent 栈编排运行时层：上承 LangChain 的模型工具集成，下接 Postgres 等持久化设施，向外经 Platform 部署、LangSmith 观测。它不做高层角色抽象，而是把 Agent 拆成状态、节点、边与检查点四个原语，用 super-step 模型换取确定性与可恢复性，成为长任务 Agent 的生产底座。对 Harness 而言即执行引擎：把模型计划变成可中断、可恢复、可审计的真实执行。',

  landscape: {
    intro:
      '向上承接模型推理、LangChain 与 Postgres 后端；向下支撑 DeepAgents、LangSmith 与 Platform。可脱离 LangChain 独立运行，各层可替换。',
    diagram: {
      direction: 'LR',
      cols: 3,
      rows: 3,
      nodes: [
        { id: 'llm', label: '模型厂商', sub: 'OpenAI 等', kind: 'external', col: 1, row: 1, group: '上游依赖' },
        { id: 'langchain', label: 'LangChain', sub: '模型/工具集成', kind: 'external', col: 2, row: 1, group: '上游依赖' },
        { id: 'db', label: '数据库后端', sub: 'Postgres/Redis', kind: 'external', col: 3, row: 1, group: '上游依赖' },
        { id: 'lg', label: 'LangGraph', sub: '编排运行时', kind: 'core', col: 1, row: 2, group: '本项目' },
        { id: 'prebuilt', label: '预置组件', sub: 'prebuilt', kind: 'core', col: 2, row: 2, group: '本项目' },
        { id: 'deep', label: 'DeepAgents', sub: '高层 Agent 框架', kind: 'external', col: 1, row: 3, group: '下游应用' },
        { id: 'smith', label: 'LangSmith', sub: '观测/评估', kind: 'external', col: 2, row: 3, group: '下游应用' },
        { id: 'plat', label: 'Platform', sub: '部署托管', kind: 'external', col: 3, row: 3, group: '下游应用' },
      ],
      edges: [
        { from: 'llm', to: 'lg', label: '模型推理' },
        { from: 'langchain', to: 'lg', label: '集成组件' },
        { from: 'db', to: 'lg', label: '快照持久化' },
        { from: 'lg', to: 'prebuilt', label: '提供原语' },
        { from: 'lg', to: 'deep', label: '底层编排' },
        { from: 'lg', to: 'smith', label: 'trace 上报' },
        { from: 'lg', to: 'plat', label: '部署运行' },
      ],
      note: 'LangGraph 可脱离 LangChain 独立使用，但生态组合时能力最完整。',
    },
  },

  competitors: [
    {
      name: 'CrewAI',
      relation: '直接竞品',
      diff: '角色扮演式高层抽象、上手快；但状态控制与持久化颗粒度远不如 LangGraph 的图模型。',
    },
    {
      name: 'AutoGen',
      relation: '直接竞品',
      diff: '对话驱动多 Agent 协作，模式丰富；LangGraph 更偏低层确定性编排与可恢复执行。',
    },
    {
      name: 'LlamaIndex Workflows',
      relation: '相邻替代',
      diff: '事件驱动 workflow，与 RAG 生态结合紧密；检查点与长任务恢复能力相对薄弱。',
    },
    {
      name: 'Dify 工作流',
      relation: '互补共存',
      diff: '低代码画布面向非工程团队；复杂逻辑常下沉到代码层，两者常前后端搭配使用。',
    },
  ],

  mechanism: [
    {
      title: 'Super-step 执行循环',
      desc: '执行开始时全部节点处于 inactive；节点在任一入边 channel 收到新状态消息即被激活，同一 super-step 内被激活的节点并行执行并各自返回部分更新；更新经 reducer 写入 channel 后作为消息激活下一批节点；步末无新消息的节点投票挂起，全部节点静默且无在途消息时图终止。',
    },
    {
      title: 'reducer 通道合并',
      desc: '状态的每个 key 是独立 channel，节点只返回部分更新而非全量状态；引擎对每个被更新的 key 调用二元 reducer——左参为当前累积值、右参为节点新值，未指定时默认覆盖；同一步内并行节点写同一 key 时合并语义完全由 reducer 决定，add_messages 等内置 reducer 还会按消息 ID 去重覆盖。',
    },
    {
      title: 'interrupt 断点回放',
      desc: 'interrupt 通过抛出特殊异常暂停执行，运行时捕获后把当前状态写入检查点并无限期挂起；以 Command(resume=值) 恢复时节点从函数开头整体重跑而非从中断行继续，引擎按序号把 resume 值逐一喂回各 interrupt 调用，已完成 task 的结果则直接从检查点还原、不再重算。',
    },
    {
      title: 'Send 动态分发',
      desc: '条件边可返回 Send(节点名, 状态) 列表：每个 Send 携带一份独立状态构成一条动态边，在下一 super-step 触发目标节点的一个并行实例，实例数运行时才确定；各实例产出写回共享 channel 经 reducer 聚合，由此实现 map-reduce——上游生成 N 个对象、下游逐对象映射再归约。',
    },
  ],

  sourceLayout: [
    { path: 'libs/langgraph', role: '核心包：StateGraph、Pregel 引擎与 Send/Command 原语' },
    { path: 'libs/langgraph/langgraph/pregel', role: 'Pregel 执行引擎：super-step 调度与消息传递' },
    { path: 'libs/langgraph/langgraph/graph', role: '图构建 API：StateGraph、消息状态与条件边' },
    { path: 'libs/langgraph/langgraph/channels', role: '状态通道实现：reducer 合并与并发写语义' },
    { path: 'libs/langgraph/langgraph/func', role: 'Functional API：entrypoint/task 装饰器' },
    { path: 'libs/checkpoint', role: '持久化基础：BaseCheckpointSaver、Store 与内存实现' },
    { path: 'libs/checkpoint-postgres', role: 'Postgres 检查点与 Store：连接池与迁移' },
    { path: 'libs/prebuilt', role: '预置组件：create_react_agent、ToolNode 等' },
  ],

  tradeoffs: [
    {
      title: '图状态机 vs 自由循环',
      choice: '显式状态图声明式编排',
      reason: '自由 while 循环的控制流隐于代码、难以快照与审计；显式图把执行拆成状态、节点、边，配合 super-step 模型天然可并行、可中断恢复、可逐步回放，这是官方 durable execution 定位的根基。',
    },
    {
      title: '检查点粒度',
      choice: '按 super-step 边界快照',
      reason: '官方明确快照落在 super-step 边界而非函数中途：边界处全部并行更新已被 reducer 合并、状态一致；代价是恢复时节点从头重跑，故官方要求节点幂等、副作用放 interrupt 之后。',
    },
    {
      title: '抽象层级',
      choice: '低层原语不做角色封装',
      reason: 'README 明确定位 low-level orchestration：只提供状态、节点、检查点等原语换取可控性，快速搭 Agent 则用其上的 Deep Agents；灵活但样板代码多于 CrewAI 类高层框架。',
    },
  ],

  production: [
    {
      title: 'Postgres 检查点配置',
      desc: '生产用 PostgresSaver 配合 psycopg 连接池；首次使用必须调用 setup() 建表并执行迁移（含 CREATE INDEX CONCURRENTLY，需在 autocommit 连接上运行），可用 schema 参数隔离到非 public 模式。',
    },
    {
      title: 'Platform 托管部署',
      desc: '图经 langgraph-cli 起本地 Server 或部署 LangGraph Platform；Agent Server 自动托管持久化与任务执行，无需自管 checkpointer，并附带 Studio 可视化调试、流式 API 与定时任务。',
    },
    {
      title: '长任务容错与幂等',
      desc: '崩溃后以同一 thread_id 重调即可从最近检查点续跑；节点须从源头设计为幂等——用 upsert/幂等键避免重复写，副作用置于 interrupt 之后；recursion_limit（默认 25 步）配合 RemainingSteps 优雅降级。',
    },
    {
      title: '常见坑：恢复语义',
      desc: '线程已结束再传 Command(update=…) 会从最近检查点恢复而看似卡死，多轮对话应传普通 dict 从头开始；节点内多个 interrupt 按序号严格匹配 resume 值，条件性跳过会错位。',
    },
  ],

  en: {
    tagline:
      'A low-level orchestration framework that models agents as persistent, resumable state graphs with human-in-the-loop control.',
    summary:
      'LangGraph models an agent as an explicit state graph: nodes are computation steps, edges are transition conditions, and a shared state flows between them through reducer channels. Its Pregel-inspired engine executes nodes in parallel super-steps, persisting a checkpoint after each step so long-running agents can crash and resume exactly where they left off. Built-in primitives such as interrupt/Command, subgraphs, the Send API, and pluggable checkpointers (Postgres, Redis) make durable execution and human-in-the-loop approval first-class. Together with LangSmith and LangGraph Platform, it forms the de facto runtime foundation for production-grade, stateful agents.',
  },
}
