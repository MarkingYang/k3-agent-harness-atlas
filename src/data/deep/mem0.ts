import type { ToolDeepDive } from '../deepDive'

/**
 * Mem0 深度解析数据
 * 真实数据来源：
 * - Star 历史：OSS Insight API（api.ossinsight.io/v1/repos/mem0ai/mem0/stargazers/history）
 * - 仓库统计：GitHub API（api.github.com/repos/mem0ai/mem0）
 * - 版本信息：GitHub Releases（github.com/mem0ai/mem0/releases）
 * - 架构理解：mem0ai/mem0 官方 README（含 2026-04 新记忆算法说明）与 docs.mem0.ai
 * - 机制深潜：mem0.ai 官方博客《The Token-Efficient Memory Algorithm》（2026-04）
 * - 源码结构：GitHub API 逐层核实 mem0ai/mem0 仓库目录（main 分支）
 */
export const mem0Deep: ToolDeepDive = {
  toolId: 'mem0',

  stats: {
    stars: 61096,
    forks: 7110,
    license: 'Apache-2.0',
    checkedAt: '2026-07-18',
  },

  // OSS Insight 共 38 个采样点，按规则保留首点（2023-06）+ 最近 35 点
  starHistory: [
    { date: '2023-06', stars: 2648 },
    { date: '2023-09', stars: 4998 },
    { date: '2023-10', stars: 5504 },
    { date: '2023-11', stars: 5671 },
    { date: '2023-12', stars: 5944 },
    { date: '2024-01', stars: 7042 },
    { date: '2024-02', stars: 7457 },
    { date: '2024-03', stars: 7930 },
    { date: '2024-04', stars: 8103 },
    { date: '2024-05', stars: 8320 },
    { date: '2024-06', stars: 8491 },
    { date: '2024-07', stars: 17672 },
    { date: '2024-08', stars: 19688 },
    { date: '2024-09', stars: 21163 },
    { date: '2024-10', stars: 21709 },
    { date: '2024-11', stars: 22200 },
    { date: '2024-12', stars: 22775 },
    { date: '2025-01', stars: 23419 },
    { date: '2025-02', stars: 24057 },
    { date: '2025-03', stars: 25945 },
    { date: '2025-04', stars: 27120 },
    { date: '2025-05', stars: 31357 },
    { date: '2025-06', stars: 32868 },
    { date: '2025-07', stars: 34037 },
    { date: '2025-08', stars: 34927 },
    { date: '2025-09', stars: 35810 },
    { date: '2025-10', stars: 36364 },
    { date: '2025-11', stars: 36920 },
    { date: '2025-12', stars: 37422 },
    { date: '2026-01', stars: 38002 },
    { date: '2026-02', stars: 38578 },
    { date: '2026-03', stars: 39225 },
    { date: '2026-04', stars: 39724 },
    { date: '2026-05', stars: 39944 },
    { date: '2026-06', stars: 40032 },
    { date: '2026-07', stars: 61096 },
  ],

  versions: [
    { version: 'v2.0.12', date: '2026-07-13', highlight: 'update() 接受 text 参数，修复 ID 编码问题' },
    { version: 'ts-v3.1.0', date: '2026-07-13', highlight: 'TS SDK 新增 17 家向量库与 rerank 支持' },
    { version: 'cli-v0.2.10', date: '2026-07-13', highlight: '修复特殊字符 ID 导致的请求格式错误' },
    { version: 'cli-node-v0.2.11', date: '2026-07-13', highlight: 'Node CLI 同步修复 URL 路径编码问题' },
    { version: 'v2.0.11', date: '2026-07-01', highlight: '抽取失败改为显式报错，修复多个向量库注入风险' },
  ],

  architecture: {
    intro:
      'Mem0 开源版以 Memory 类为唯一入口，写入侧单遍完成事实抽取与实体链接，读取侧多信号融合召回；配置工厂让 LLM、Embedder 与三类存储全部可插拔替换。',
    diagram: {
      cols: 4,
      rows: 4,
      nodes: [
        { id: 'app', label: 'Agent 应用', sub: 'SDK/Server/MCP', kind: 'external', col: 1, row: 1 },
        { id: 'cloud', label: '托管云', sub: 'app.mem0.ai', kind: 'external', col: 4, row: 1 },
        { id: 'memory', label: 'Memory 类', sub: 'add / search', kind: 'core', col: 1, row: 2, group: '接入层' },
        { id: 'asyncmem', label: '异步接口', sub: 'AsyncMemory', kind: 'core', col: 2, row: 2, group: '接入层' },
        { id: 'cfg', label: '配置工厂', sub: 'MemoryConfig', kind: 'control', col: 3, row: 2, group: '接入层' },
        { id: 'extract', label: '事实抽取', sub: 'LLM 单遍调用', kind: 'core', col: 1, row: 3, group: '记忆引擎' },
        { id: 'entity', label: '实体链接', sub: 'Entity Linking', kind: 'core', col: 2, row: 3, group: '记忆引擎' },
        { id: 'embed', label: '向量化', sub: 'Embedder', kind: 'core', col: 3, row: 3, group: '记忆引擎' },
        { id: 'recall', label: '融合召回', sub: '语义+BM25+实体', kind: 'core', col: 4, row: 3, group: '记忆引擎' },
        { id: 'vec', label: '向量库', sub: 'Qdrant', kind: 'data', col: 1, row: 4, group: '存储层' },
        { id: 'graph', label: '图存储', sub: 'Neo4j', kind: 'data', col: 2, row: 4, group: '存储层' },
        { id: 'hist', label: '历史库', sub: 'SQLite', kind: 'data', col: 3, row: 4, group: '存储层' },
      ],
      edges: [
        { from: 'app', to: 'memory', label: 'add/search' },
        { from: 'app', to: 'asyncmem', label: '异步调用', dashed: true },
        { from: 'app', to: 'cloud', label: '托管 API', dashed: true },
        { from: 'cfg', to: 'memory', label: '工厂装配', dashed: true },
        { from: 'memory', to: 'extract', label: '写入路径' },
        { from: 'extract', to: 'entity', label: '实体候选' },
        { from: 'entity', to: 'embed', label: '事实文本' },
        { from: 'embed', to: 'vec', label: '向量写入' },
        { from: 'entity', to: 'graph', label: '关系三元组' },
        { from: 'memory', to: 'recall', label: 'search' },
        { from: 'vec', to: 'recall', label: '候选召回' },
        { from: 'graph', to: 'recall', label: '关系候选' },
        { from: 'extract', to: 'hist', label: '变更日志' },
      ],
      note: '组件名均对应官方实现：Memory/AsyncMemory、MemoryConfig 工厂、实体链接层与 Qdrant/Neo4j/SQLite 三存储。',
    },
  },

  dataFlow: {
    intro:
      '写入路径把对话单遍蒸馏为结构化事实，与历史版本并存落库；读取路径带作用域过滤做三路信号召回，经秩融合与时态排序后仅 top_k 条注入 prompt，token 成本可控。',
    diagram: {
      cols: 5,
      rows: 2,
      direction: 'LR',
      nodes: [
        { id: 'msg', label: '对话消息', sub: 'user/assistant', kind: 'data', col: 1, row: 1 },
        { id: 'add', label: 'add 写入', sub: 'Memory.add', kind: 'core', col: 2, row: 1 },
        { id: 'extract', label: '事实抽取', sub: 'LLM 单遍调用', kind: 'core', col: 3, row: 1 },
        { id: 'fact', label: '结构化事实', sub: '文本+实体', kind: 'data', col: 4, row: 1 },
        { id: 'store', label: '记忆存储', sub: 'Qdrant+Neo4j', kind: 'data', col: 5, row: 1 },
        { id: 'query', label: '用户提问', sub: 'query', kind: 'data', col: 1, row: 2 },
        { id: 'recall', label: '混合召回', sub: 'Memory.search', kind: 'core', col: 2, row: 2 },
        { id: 'fuse', label: '信号融合', sub: '按秩融合', kind: 'core', col: 3, row: 2 },
        { id: 'rank', label: '时态排序', sub: '时间感知', kind: 'core', col: 4, row: 2 },
        { id: 'inject', label: '记忆注入', sub: 'system prompt', kind: 'core', col: 5, row: 2 },
      ],
      edges: [
        { from: 'msg', to: 'add', label: 'messages' },
        { from: 'add', to: 'extract', label: '抽取 prompt' },
        { from: 'extract', to: 'fact', label: '事实 JSON' },
        { from: 'fact', to: 'store', label: '向量+三元组' },
        { from: 'query', to: 'recall', label: 'query' },
        { from: 'recall', to: 'store', label: '过滤检索' },
        { from: 'store', to: 'recall', label: '候选记忆', dashed: true },
        { from: 'recall', to: 'fuse', label: '三路打分' },
        { from: 'fuse', to: 'rank', label: '融合候选' },
        { from: 'rank', to: 'inject', label: 'top_k 条' },
      ],
      note: '写入侧 ADD-only 只增不改，新旧事实全部保留；矛盾由读取侧的时态排序按查询意图消解。',
    },
  },

  sequence: {
    intro:
      '以一轮问答为例：Agent 先用 search 召回记忆注入 prompt，生成回复后再以 add 异步写回对话；Mem0 内部完成单遍事实抽取与持久化，写入不阻塞用户延迟。',
    diagram: {
      actors: [
        { id: 'user', label: '用户', kind: 'user' },
        { id: 'agent', label: 'Agent 应用', kind: 'agent' },
        { id: 'mem0', label: 'Mem0', kind: 'system' },
        { id: 'llm', label: 'LLM', kind: 'external' },
        { id: 'store', label: '向量库', kind: 'external' },
      ],
      messages: [
        { from: 'user', to: 'agent', label: '发送消息' },
        { from: 'agent', to: 'mem0', label: 'search(query)' },
        { from: 'mem0', to: 'store', label: '过滤+混合检索' },
        { from: 'store', to: 'mem0', label: '候选记忆', dashed: true },
        { from: 'mem0', to: 'agent', label: 'top_k 记忆注入', dashed: true },
        { from: 'agent', to: 'llm', label: 'prompt+记忆' },
        { from: 'llm', to: 'agent', label: '生成回复', dashed: true },
        { from: 'agent', to: 'mem0', label: 'add(messages)' },
        { from: 'mem0', to: 'llm', label: '单遍事实抽取' },
      ],
      note: '第 8-9 步可在回复返回后异步执行，不阻塞用户延迟。',
    },
  },

  extension: [
    {
      title: '自定义 LLM',
      desc: '通过 Configuration 指定 provider 与模型即可替换抽取 LLM：OpenAI、Anthropic、Ollama、xAI 等 20 余家，工厂模式懒加载接入。',
    },
    {
      title: '可插拔向量库与 Embedder',
      desc: '向量库支持 Qdrant、PGVector、Milvus 等 20 余种，接口统一可互换；Embedder 可换 HuggingFace 等，维度需在 config 对齐。',
    },
    {
      title: 'Graph Memory 图记忆',
      desc: '启用 graph_store 配置后，实体与关系以图结构写入 Neo4j、Memgraph 或 Neptune，检索时可沿关系多跳召回；图存储独立于向量库，可单独开关与替换。',
    },
    {
      title: '自定义提示词与 Reranker',
      desc: '可覆写事实抽取 prompt 与记忆更新策略，定制写入行为；检索侧支持挂接 Cohere、cross-encoder、LLM 等重排器，并可在单次 search 调用上按需启用。',
    },
  ],

  challenges: [
    {
      title: '记忆一致性与遗忘',
      desc: '用户事实会变（如「喜欢咖啡」变「已戒掉」），旧管线靠 LLM 判 ADD/UPDATE/DELETE 易误合并；新算法改为 ADD-only 累积，矛盾交给检索侧时态排序。',
    },
    {
      title: '召回精度与 token 成本',
      desc: '召回过多会挤占上下文窗口、推高推理成本，召回过少又等于遗忘；需要融合语义、BM25、实体三路信号并控制 top_k，在精度与预算之间取得平衡。',
    },
    {
      title: '时态推理',
      desc: '同一事实的现状、过往与计划版本必须按时间正确排序，依赖 created_at 等时间元数据与时间感知排序策略，否则会把过期记忆当作现状回答。',
    },
    {
      title: '多租户作用域隔离',
      desc: 'user_id、agent_id、run_id 三级作用域过滤要在每种向量库与图库后端上正确实现；release 中多次修复过滤器注入漏洞，隔离正确性直接关系数据安全。',
    },
  ],

  positioning:
    'Mem0 卡在 Agent 技术栈的「记忆层」这一格：上承任意 LLM 与 Agent 框架，下接向量库与图数据库，把无状态的模型调用变成可积累的用户认知。与框架内生的短期状态不同，它解决跨会话、跨 Agent 的长期语义记忆；与传统 RAG 不同，它存的不是文档而是会持续增改的事实。以开源 SDK、自托管 Server、托管云三档形态与 20 多个框架集成，Mem0 已成独立记忆层的头部选项，并以论文与公开评测让记忆质量可量化比较。',

  landscape: {
    intro:
      'Mem0 把记忆层做成独立中间件：上游对接可替换的 LLM、嵌入模型与向量/图存储，自身以 SDK、自托管 Server 与托管云三档交付，下游经官方集成进入各 Agent 框架。',
    diagram: {
      cols: 3,
      rows: 4,
      direction: 'LR',
      nodes: [
        { id: 'openai', label: 'OpenAI', sub: 'gpt-5-mini', kind: 'external', col: 1, row: 1, group: '上游依赖' },
        { id: 'embed', label: '嵌入模型', sub: 'HuggingFace', kind: 'external', col: 1, row: 2, group: '上游依赖' },
        { id: 'qdrant', label: 'Qdrant', sub: '默认向量库', kind: 'external', col: 1, row: 3, group: '上游依赖' },
        { id: 'neo4j', label: 'Neo4j', sub: '图存储后端', kind: 'external', col: 1, row: 4, group: '上游依赖' },
        { id: 'sdk', label: 'Mem0 SDK', sub: 'Python / TS', kind: 'core', col: 2, row: 1, group: '本项目' },
        { id: 'server', label: 'REST 服务', sub: 'FastAPI Server', kind: 'external', col: 2, row: 2, group: '本项目' },
        { id: 'cloud', label: '托管云', sub: 'app.mem0.ai', kind: 'external', col: 2, row: 3, group: '本项目' },
        { id: 'langgraph', label: 'Agent 框架', sub: 'LangGraph', kind: 'external', col: 3, row: 1, group: '下游应用' },
        { id: 'crewai', label: 'CrewAI', sub: '多智能体框架', kind: 'external', col: 3, row: 2, group: '下游应用' },
        { id: 'mcp', label: 'MCP 生态', sub: 'MCP 工具接入', kind: 'external', col: 3, row: 3, group: '下游应用' },
        { id: 'app', label: 'AI 应用', sub: '助手/客服/医疗', kind: 'external', col: 3, row: 4, group: '下游应用' },
      ],
      edges: [
        { from: 'openai', to: 'sdk', label: '事实抽取' },
        { from: 'embed', to: 'sdk', label: '向量化' },
        { from: 'qdrant', to: 'sdk', label: '向量持久化' },
        { from: 'neo4j', to: 'sdk', label: '关系存储' },
        { from: 'server', to: 'sdk', label: '同一引擎', dashed: true },
        { from: 'cloud', to: 'sdk', label: '同源内核', dashed: true },
        { from: 'sdk', to: 'langgraph', label: '官方集成' },
        { from: 'sdk', to: 'crewai', label: '官方集成' },
        { from: 'sdk', to: 'mcp', label: '工具暴露' },
        { from: 'sdk', to: 'app', label: '记忆能力' },
      ],
      note: '上游全部可替换、下游框架中立，这是 Mem0 区别于框架内生记忆方案的根本定位。',
    },
  },

  competitors: [
    {
      name: 'Zep',
      relation: '直接竞品',
      diff: '同样提供托管记忆层，核心是基于 Graphiti 的时序知识图谱检索；Mem0 接入更轻量，开源版默认本地存储零运维。',
    },
    {
      name: 'Letta（MemGPT）',
      relation: '相邻替代',
      diff: '把记忆做进 Agent 运行时本身，采用自编辑记忆与虚拟上下文分页；是「带记忆的 Agent 框架」而非独立记忆层。',
    },
    {
      name: 'LangMem',
      relation: '相邻替代',
      diff: 'LangChain 官方记忆库，与 LangGraph 深度绑定；Mem0 框架中立、跨栈可用。',
    },
    {
      name: 'OpenViking',
      relation: '互补共存',
      diff: '面向 Agent 的数据与上下文管理层，侧重文档与知识组织；Mem0 专注对话事实型记忆，两者可分层共用。',
    },
  ],

  mechanism: [
    {
      title: '单遍写入管线',
      desc: '输入先做上下文查找，随后一次 LLM 调用完成候选事实抽取——用户陈述与 Agent 确认的动作、建议同等入档，再经去重与实体链接后向量化写入持久存储。相比旧版「先抽事实、再对照存量记忆判决」的两段式，单遍形态把模型算力全部用于理解输入，整条写入路径压缩为一次调用。',
    },
    {
      title: 'ADD-only 累积写入',
      desc: '旧算法的第二次 LLM 调用负责将候选事实对照存量记忆判决 ADD/UPDATE/DELETE，既慢又会摧毁上下文：覆盖抹掉原始事实细节，误删则丢失日后有用的信息。新算法彻底取消判决环节，每条事实独立追加、新旧并存，抽取延迟约减半，矛盾消解移交读取侧的时态排序完成。',
    },
    {
      title: '三信号并行融合',
      desc: '查询经预处理后，语义相似度、BM25 关键词、实体匹配三路并行打分再按秩融合，合成单一得分优于任一单路信号。实体层把事实中的实体抽取并嵌入到与记忆平行的实体集合，跨记忆建立链接，查询命中实体时为相关记忆加权召回。',
    },
    {
      title: '时态感知排序',
      desc: 'ADD-only 让同一事实的现状、过往与计划版本全部保留，检索侧以时间感知策略为「当前状态」「过去事件」「未来计划」类查询选出日期正确的实例，而非简单返回最新一条。官方评测显示新算法在 LoCoMo 时态类查询提升 29.6 分、多跳推理提升 23.1 分，为涨幅最大的两类。',
    },
  ],

  sourceLayout: [
    { path: 'mem0/memory', role: '记忆管线核心：Memory 类 add/search 实现与 SQLite 变更历史' },
    { path: 'mem0/vector_stores', role: 'Qdrant、PGVector 等 20 余种向量库统一适配层' },
    { path: 'mem0/llms', role: 'OpenAI、Anthropic 等 LLM 提供商抽象，工厂懒加载' },
    { path: 'mem0/embeddings', role: 'Embedding 模型接入层，维度需与配置对齐' },
    { path: 'mem0/configs', role: 'Pydantic 配置模型与组件装配工厂' },
    { path: 'mem0/client', role: '托管云平台 API 客户端（MemoryClient）' },
    { path: 'mem0-ts', role: 'TypeScript SDK，含 17 家向量库与 rerank 支持' },
    { path: 'server', role: '自托管 REST 服务：FastAPI、鉴权限流、Dashboard、Compose' },
    { path: 'evaluation', role: 'LoCoMo 等基准的开源评测框架，可复现官方数据' },
  ],

  tradeoffs: [
    {
      title: '写入判决简化',
      choice: 'ADD-only 替代 UPDATE/DELETE 判决',
      reason: '官方博客指出两段式对齐既慢又丢上下文：覆盖抹掉原始细节、误删丢失后验信息；只增不删保留完整状态史，抽取延迟约减半，矛盾交给检索侧时态排序消解。',
    },
    {
      title: '开源托管分层',
      choice: '核心算法开源，高级优化留云平台',
      reason: '官方明确基准分数含托管平台专有优化，开源 SDK 只能获得方向性一致的收益；鉴权、Dashboard 与高级特性按 Library/Self-hosted/Cloud 三档分层，以托管收入反哺开源迭代。',
    },
    {
      title: 'token 预算优先',
      choice: '单次检索控制在 7K token 内',
      reason: '生产环境每个 token 都是成本，全上下文方案单次查询常耗 25K+ token；Mem0 以单遍检索加多信号融合在精度、成本、延迟三角中取平衡，而非一味扩大上下文窗口。',
    },
  ],

  production: [
    {
      title: '向量库选型',
      desc: '开源版默认本地 Qdrant，零运维适合原型；已有 Postgres 的团队可切 PGVector 减少组件；需关系多跳召回时再开图存储（Neo4j/Memgraph/Neptune），图与向量库独立开关，嵌入维度须与 config 对齐。',
    },
    {
      title: '异步写入',
      desc: '抽取与索引可放在回复返回后执行，不阻塞用户延迟；官方提供 AsyncMemory 非阻塞接口，抽取与检索均异步运行。高并发场景应配任务队列削峰，并对 LLM 抽取失败显式报错与重试。',
    },
    {
      title: '多租户过滤',
      desc: '所有读写必须携带 user_id/agent_id/run_id 作用域过滤器，平台 v2 API 强制至少提供一个；自托管 Server 默认开启鉴权，需设 ADMIN_API_KEY 注册管理员，AUTH_DISABLED=true 仅限本地开发。',
    },
    {
      title: '成本控制',
      desc: '默认 gpt-5-mini 抽取加 text-embedding-3-small 嵌入，单次检索平均约 7K token；top_k 直接决定注入 prompt 的长度，是成本主旋钮；嵌入模型质量直接影响混合检索效果，生产环境不宜选用过小模型。',
    },
  ],

  en: {
    tagline:
      'The universal memory layer for AI agents — extract, store, and recall what matters across every conversation.',
    summary:
      'Mem0 is an open-source memory layer that gives LLM applications persistent, personalized long-term memory. It automatically extracts salient facts from conversations, embeds them, and stores them in pluggable vector and graph stores, then recalls the right memories at inference time through multi-signal hybrid search with temporal reasoning. Memories are scoped by user, agent, and run, so assistants remember preferences and history across sessions without stuffing full transcripts into the prompt. It ships as Python and TypeScript SDKs, a self-hosted server, and a managed cloud platform, integrating with LangGraph, CrewAI, MCP, and more than twenty frameworks.',
  },
}
