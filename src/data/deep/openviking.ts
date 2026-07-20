import type { ToolDeepDive } from '../deepDive'

/**
 * OpenViking 深度解析数据
 * 数据来源（2026-07-18 复核）：
 * - stats：GitHub API repos/volcengine/OpenViking（2026-07-18）= stars 26900 / forks 2110 / AGPL-3.0，pushed_at 2026-07-17 活跃
 * - starHistory：OSS Insight API（月度点 2026-01…2026-07-01 全量保留）；末点按 GitHub API 当前值修正为 26900（date '2026-07'）
 *   注：OSS Insight 2026-07-01 为 5044，与 GitHub 当前值差异为 7 月上半月高增长所致，历史点不动
 * - license：主项目 AGPL-3.0（GitHub license 字段 + README License 段双重确认；ov_cli/examples 为 Apache-2.0）
 * - versions：取自 GitHub Releases API（v0.4.8-v0.4.10 已补齐官方 release notes，故列表刷新为 v0.4.7-v0.4.10）
 * - 架构理解：GitHub README Core Concepts + v0.4.x release notes（VikingFS/RAGFS/ParserRouter/TreeBuilder/SemanticQueue/User-Peer 模型）
 * - mechanism/tradeoffs/production：官方文档站 volcengine-openviking.mintlify.app（Storage / Retrieval /
 *   Context Layers / Session 四篇）+ README License/Commercial Access/Evaluation Highlights + v0.4.1/v0.4.7-v0.4.10 release notes
 * - sourceLayout（2026-07-18 复核）：经 jsDelivr CDN 逐路径探测 main 分支确认 8 条路径全部真实存在
 *   （含 crates/ragfs、web-studio；ParserRouter 见 openviking/parse/parser_router.py，SemanticQueue 见 storage/queuefs/semantic_queue.py）
 */
export const openvikingDeep: ToolDeepDive = {
  toolId: 'openviking',

  stats: {
    stars: 26900,
    forks: 2110,
    license: 'AGPL-3.0（主项目）',
    checkedAt: '2026-07-18',
  },

  starHistory: [
    { date: '2026-01', stars: 70 },
    { date: '2026-02', stars: 1290 },
    { date: '2026-03', stars: 4338 },
    { date: '2026-04', stars: 4839 },
    { date: '2026-05', stars: 4983 },
    { date: '2026-06', stars: 5035 },
    { date: '2026-07', stars: 26900 },
  ],

  versions: [
    {
      version: 'v0.4.10',
      date: '2026-07-16',
      highlight: 'reindex 清理孤儿向量，会话提交改持久队列',
    },
    {
      version: 'v0.4.9',
      date: '2026-07-13',
      highlight: '新增 Cursor/TRAE 记忆集成与图片检索',
    },
    {
      version: 'v0.4.8',
      date: '2026-07-08',
      highlight: '新增 cuVS GPU 向量检索与递归网页导入',
    },
    {
      version: 'v0.4.7',
      date: '2026-07-02',
      highlight: 'MCP 紧凑描述降 token 开销，本地文件签名上传自动入库',
    },
  ],

  architecture: {
    intro:
      'Server 是架构中心：SDK、CLI、MCP 三类接入统一走 HTTP 收口；上下文引擎把写入的语义加工与读取的递归检索解耦为异步双路；存储层以 viking:// 抽象屏蔽向量索引与 RAGFS 后端差异。',
    diagram: {
      cols: 4,
      rows: 4,
      nodes: [
        { id: 'sdk', label: 'SDK', sub: 'Python / Go', kind: 'external', col: 1, row: 1, group: '接入层' },
        { id: 'cli', label: 'ov CLI', sub: 'crates/ov_cli', kind: 'external', col: 2, row: 1, group: '接入层' },
        { id: 'mcp', label: 'MCP 插件', sub: 'Codex·OpenClaw', kind: 'external', col: 3, row: 1, group: '接入层' },
        { id: 'model', label: '模型层', sub: 'Embedding·VLM', kind: 'external', col: 4, row: 1 },
        { id: 'server', label: '服务核心', sub: 'HTTP API·1933', kind: 'core', col: 1, row: 2, group: '服务核心' },
        { id: 'parse', label: '解析路由', sub: 'ParserRouter', kind: 'core', col: 2, row: 2, group: '上下文引擎' },
        { id: 'semantic', label: '语义队列', sub: 'SemanticQueue', kind: 'core', col: 3, row: 2, group: '上下文引擎' },
        { id: 'retrieve', label: '递归检索', sub: 'retrieve 引擎', kind: 'core', col: 4, row: 2, group: '上下文引擎' },
        { id: 'memory', label: '记忆迭代', sub: 'session.commit', kind: 'core', col: 1, row: 3, group: '服务核心' },
        { id: 'vfs', label: 'VikingFS', sub: 'viking:// URI', kind: 'core', col: 2, row: 3, group: '存储层' },
        { id: 'vec', label: '向量索引', sub: 'local·VikingDB', kind: 'data', col: 3, row: 3, group: '存储层' },
        { id: 'ragfs', label: 'RAGFS', sub: 'crates/ragfs', kind: 'data', col: 4, row: 3, group: '存储层' },
      ],
      edges: [
        { from: 'sdk', to: 'server', label: 'HTTP' },
        { from: 'cli', to: 'server', label: 'HTTP' },
        { from: 'mcp', to: 'server', label: 'MCP 工具' },
        { from: 'server', to: 'parse', label: '资源入库' },
        { from: 'server', to: 'retrieve', label: 'find·grep' },
        { from: 'server', to: 'memory', label: '会话提交' },
        { from: 'parse', to: 'semantic', label: '排队加工' },
        { from: 'semantic', to: 'vfs', label: 'L0/L1 写回' },
        { from: 'semantic', to: 'vec', label: '向量化' },
        { from: 'retrieve', to: 'vec', label: '向量召回' },
        { from: 'retrieve', to: 'vfs', label: '目录下探' },
        { from: 'memory', to: 'vfs', label: '记忆入库' },
        { from: 'vfs', to: 'ragfs', label: '持久化' },
        { from: 'semantic', to: 'model', label: 'VLM 摘要', dashed: true },
      ],
      note: '读写解耦：语义加工异步分层写回，检索沿目录树下探，存储层对上层只暴露 viking://。',
    },
  },

  dataFlow: {
    intro:
      '入库与检索共用一棵目录树：写入经解析、建目录后由语义队列逐目录物化 L0/L1；查询沿树递归下探、汇聚候选，按 L0→L2 按需装载。取舍是成本前置：写入期算摘要，换查询期省 token。',
    diagram: {
      direction: 'LR',
      cols: 4,
      rows: 2,
      nodes: [
        { id: 'source', label: '原始资源', sub: '文档·URL·会话', kind: 'external', col: 1, row: 1 },
        { id: 'parse', label: '解析路由', sub: 'ParserRouter', kind: 'core', col: 2, row: 1 },
        { id: 'tree', label: '目录构建', sub: 'TreeBuilder', kind: 'core', col: 3, row: 1 },
        { id: 'semq', label: '语义队列', sub: 'L0/L1 生成', kind: 'core', col: 4, row: 1 },
        { id: 'query', label: 'Agent 查询', sub: 'find·grep·ls', kind: 'external', col: 1, row: 2 },
        { id: 'engine', label: '递归检索', sub: '意图·下探·聚合', kind: 'core', col: 2, row: 2 },
        { id: 'vfs', label: 'VikingFS', sub: 'viking:// 目录树', kind: 'core', col: 3, row: 2 },
        { id: 'result', label: '分层上下文', sub: '按 L0→L2 装载', kind: 'data', col: 4, row: 2 },
      ],
      edges: [
        { from: 'source', to: 'parse', label: '资源入库' },
        { from: 'parse', to: 'tree', label: '文本与图片' },
        { from: 'tree', to: 'semq', label: '排队加工' },
        { from: 'semq', to: 'vfs', label: '分层写回' },
        { from: 'query', to: 'engine', label: 'find' },
        { from: 'engine', to: 'vfs', label: '目录下探' },
        { from: 'vfs', to: 'engine', label: '候选片段', dashed: true },
        { from: 'engine', to: 'result', label: '聚合返回' },
      ],
      note: '写入侧逐目录物化 .abstract/.overview，读取侧先锁高分目录再目录内二次检索。',
    },
  },

  sequence: {
    intro:
      '一次 search() 的真实链路：先做意图分析生成 TypedQuery，向量定位高分起始目录后逐层递归下探，收敛后交 rerank 精排并返回 L0/L1，确认需要再 read() 拉取 L2 全文。',
    diagram: {
      actors: [
        { id: 'agent', label: 'Agent', kind: 'agent' },
        { id: 'server', label: 'OV Server', kind: 'system' },
        { id: 'ret', label: '检索引擎', kind: 'system' },
        { id: 'store', label: 'VikingFS', kind: 'system' },
      ],
      messages: [
        { from: 'agent', to: 'server', label: 'search() 检索请求' },
        { from: 'server', to: 'ret', label: '意图分析 TypedQuery' },
        { from: 'ret', to: 'store', label: '向量定位高分目录' },
        { from: 'store', to: 'ret', label: '候选目录与 L0 摘要', dashed: true },
        { from: 'ret', to: 'ret', label: '递归下探二次检索' },
        { from: 'ret', to: 'server', label: 'rerank 精排聚合' },
        { from: 'server', to: 'agent', label: '返回 L0/L1 上下文', dashed: true },
        { from: 'agent', to: 'server', label: 'read() 拉取 L2 全文' },
        { from: 'server', to: 'agent', label: 'L2 全文内容', dashed: true },
      ],
      note: '对应官方目录递归检索五步：意图分析→初始定位→精细探索→递归下探→结果聚合。',
    },
  },

  extension: [
    {
      title: '自定义存储后端',
      desc: 'RAGFS 抽象层适配本地磁盘与 S3/TOS 对象存储，支持 primary+多 backup 的 multi-write 高可用；QueueFS 缓存层可插拔。',
    },
    {
      title: '自定义解析器',
      desc: 'ParserRouter 按扩展名在内置解析器与第三方 Understanding API 间路由，配置 parser_api 即可把 PDF、视频等交给外部解析服务。',
    },
    {
      title: '自定义嵌入与 VLM',
      desc: 'Embedding 与 VLM 均为 provider 制：内置豆包、OpenAI、Ollama、LiteLLM 等十余家，可用多凭证按优先级故障转移。',
    },
    {
      title: 'Skills 与插件生态',
      desc: 'Skills 可从 Git 源安装到用户或共享目录；MCP 暴露检索工具，OpenClaw/Codex 等有官方插件，记忆结构可用 schema YAML 自定义。',
    },
  ],

  challenges: [
    {
      title: '分层摘要的一致性',
      desc: 'L0/L1 摘要由 VLM 生成，内容变更后需锚点定位并递归刷新祖先目录；既要防止索引与文件漂移，又要控制逐目录生成摘要的 token 成本与排队延迟。',
    },
    {
      title: '检索质量与延迟平衡',
      desc: '意图分析会展开多路检索条件，目录逐层下探放大向量调用次数；需约束递归深度与候选集规模，才能把 HotpotQA top-20 检索延迟压到约 0.23 秒。',
    },
    {
      title: '海量小文件并发写',
      desc: '上下文库由大量小文件构成，加密写入用 temp-file publish 加双路径锁保证原子性；QueueFS 需处理 sidecar 等路径的锁复用，主备多写还要最终一致。',
    },
    {
      title: '数据模型平滑演进',
      desc: '0.3 的 agent_id 到 0.4 的 User/Peer 切换中，迁移复用旧向量 payload 重写 URI 免重新 embedding，并提供备份-迁移-cleanup 两阶段路径。',
    },
  ],

  positioning:
    'OpenViking 位于 Agent 栈的记忆与上下文层，定位 Context Database：向下抽象模型与存储，向上为各类 Agent 统一管理记忆、资源与技能。相比传统 RAG 平铺向量存储，它以文件系统范式补齐分层加载与可观测检索；相比 Mem0、Zep 等记忆框架，它是带存储引擎、身份模型与会话自迭代的完整数据库。开源版可自托管，托管版由 VikingDB 支撑，有 VikingMem（VLDB 2026）学术背书。',

  landscape: {
    intro:
      'OpenViking 位于模型与 Agent 之间：上游依赖可插拔的模型服务与 S3/VikingDB 存储，下游经 MCP/SDK 支撑编程 Agent、VikingBot 与 Studio 可视化端，托管版承接商用。',
    diagram: {
      direction: 'LR',
      cols: 3,
      rows: 3,
      nodes: [
        { id: 'models', label: '模型服务', sub: '豆包·OpenAI', kind: 'external', col: 1, row: 1, group: '上游依赖' },
        { id: 'storage', label: '存储设施', sub: 'S3·VikingDB', kind: 'external', col: 1, row: 2, group: '上游依赖' },
        { id: 'content', label: '内容源', sub: '文档·网页·飞书', kind: 'external', col: 1, row: 3, group: '上游依赖' },
        { id: 'cli', label: 'ov CLI', sub: 'crates/ov_cli', kind: 'external', col: 2, row: 1, group: '本项目' },
        { id: 'ov', label: '上下文数据库', sub: 'OpenViking', kind: 'core', col: 2, row: 2, group: '本项目' },
        { id: 'coding', label: '编程 Agent', sub: 'Claude Code', kind: 'external', col: 3, row: 1, group: '下游应用' },
        { id: 'bot', label: '机器人框架', sub: 'VikingBot', kind: 'external', col: 3, row: 2, group: '下游应用' },
        { id: 'studio', label: '可视化端', sub: 'Studio·Helper', kind: 'external', col: 3, row: 3, group: '下游应用' },
      ],
      edges: [
        { from: 'models', to: 'ov', label: '模型调用', dashed: true },
        { from: 'storage', to: 'ov', label: 'RAGFS 适配' },
        { from: 'content', to: 'ov', label: '资源入库' },
        { from: 'cli', to: 'ov', label: 'HTTP' },
        { from: 'ov', to: 'coding', label: 'MCP·SDK' },
        { from: 'ov', to: 'bot', label: '上下文底座' },
        { from: 'ov', to: 'studio', label: '管理界面' },
      ],
      note: '上承模型与存储基础设施，下接 Agent 应用与官方周边（VikingBot / Studio / Helper）。',
    },
  },

  competitors: [
    {
      name: 'Mem0',
      relation: '直接竞品',
      diff: '轻量嵌入式记忆 SDK，抽取管线成熟；OpenViking 是带存储引擎与身份模型的上下文数据库，还管理资源与技能。',
    },
    {
      name: 'Zep',
      relation: '直接竞品',
      diff: '以时序知识图谱组织记忆，强于实体关系；OpenViking 以目录树组织上下文，强调分层装载、检索可观测与本地自托管。',
    },
    {
      name: 'Letta（MemGPT）',
      relation: '相邻替代',
      diff: 'Agent 内生记忆系统，记忆与运行时耦合；OpenViking 是独立上下文数据库，可跨 Agent 框架复用。',
    },
    {
      name: '传统 RAG 栈',
      relation: '相邻替代',
      diff: '向量库+LangChain 平铺切片、检索黑箱；OpenViking 以目录递归与分层装载兼顾准确率与可观测性。',
    },
  ],

  mechanism: [
    {
      title: 'viking:// 路径解析',
      desc: 'VikingFS 是统一 URI 抽象层，把 viking:// 虚拟路径映射为 AGFS 物理路径；读 L0 即取同目录 .abstract.md。向量索引只存 URI、向量与元数据、不存正文，内容始终从 AGFS 按需读取，保证单一数据源；写入、删除、移动目录时自动同步索引中的 uri 与 parent_uri，无需手工对账。',
    },
    {
      title: '分层装载触发时机',
      desc: '写入即分层：资源入库后语义队列自底向上逐目录生成 L0 摘要（约 100 token）与 L1 概览（约 2k token），子目录摘要聚合为父目录概览。检索结果只回传 L0 供快速筛选；L1 在 rerank 与规划决策时加载；确认必要后才 read() 拉取 L2 全文，token 消耗随层递进、按需加载。',
    },
    {
      title: '锁目录递归下探',
      desc: 'search() 先由 LLM 做意图分析，生成 0-5 条带类型的 TypedQuery；再全局向量检索取 top-3 定位高分起始目录，装入优先队列逐层下探：子节点得分=0.5×自身向量分+0.5×父目录分，使高分目录内的低分项也能上浮；连续 3 轮 topK 不变即收敛停止，THINKING 模式最后交 rerank 模型精排。',
    },
    {
      title: '会话提交记忆迭代',
      desc: 'session.commit() 触发两段流水线：先压缩归档——旧消息复制到 history/archive_NNN 并由 VLM 生成该段 L0/L1，活跃会话只保留最近 N 轮；再记忆提取——LLM 抽取 profile/preferences/entities/events/cases/patterns 六类候选，向量预筛相似旧记忆后由 LLM 判定 skip/create/merge，落盘对应记忆目录并向量化。',
    },
  ],

  sourceLayout: [
    { path: 'openviking', role: 'Python 核心包：SDK 客户端、服务端与全部业务逻辑' },
    { path: 'openviking/server', role: 'HTTP 服务层：API 路由、会话与权限控制' },
    { path: 'openviking/retrieve', role: '意图分析、分层递归检索与 rerank 实现' },
    { path: 'openviking/storage', role: 'VikingFS URI 抽象、AGFS 后端与向量索引适配' },
    { path: 'openviking/session', role: '会话压缩归档与六类记忆提取流水线' },
    { path: 'crates/ragfs', role: 'Rust 存储引擎：本地/S3 后端、多写与缓存层' },
    { path: 'crates/ov_cli', role: 'Rust 版 ov 命令行（Apache-2.0 许可）' },
    { path: 'web-studio', role: 'Studio 可视化管理端前端' },
  ],

  tradeoffs: [
    {
      title: '上下文组织范式',
      choice: '目录树范式替代扁平向量库',
      reason: '官方认为扁平切片缺乏全局视角、检索链路黑箱难调试；目录范式让 Agent 用 ls/find 确定性定位上下文，检索轨迹全程可观测，代价是写入侧需维护目录结构与逐目录分层摘要。',
    },
    {
      title: '开源许可证',
      choice: '主项目 AGPLv3',
      reason: 'README 明确主项目 AGPLv3、CLI 与 examples 为 Apache-2.0：以网络提供服务也须开源衍生作品，保障回馈社区；闭源商用需求由官方托管版 OpenViking Personal 承接。',
    },
    {
      title: '摘要成本前置',
      choice: '写入期预处理换查询期省 token',
      reason: 'L0/L1 由 VLM 逐目录生成，建库产生额外 token 与排队延迟；换来检索只回传约 100 token 摘要。官方评测建索引 token 仅为 LightRAG 的 13.8%，查询期 token 大幅下降。',
    },
  ],

  production: [
    {
      title: '独立 HTTP 服务部署',
      desc: '生产环境推荐 openviking-server 独立 HTTP 服务（默认端口 1933），官方建议火山引擎 ECS+veLinux 并附部署指南；仓库提供 Dockerfile 与 docker-compose.yml，官方镜像内置 Server、Console UI 与 VikingBot。',
    },
    {
      title: '存储与索引后端选型',
      desc: 'AGFS 内容存储可选 localfs（单机开发）或 s3fs（S3/MinIO/OSS，支撑多节点），RAGFS 层支持 primary+多 backup 多写高可用；向量索引可选 local/cuVS 嵌入式、HTTP 远程服务或 VikingDB 托管，按规模独立扩缩。',
    },
    {
      title: 'token 节省实测口径',
      desc: '官方 0.3.22 评测：LoCoMo 上 OpenClaw 接入后总输入 token 降 91.0%、延迟降 59.2%；HotpotQA top-20 准确率 91%、单次检索约 0.23 秒；五个数据集平均建索引 token 仅为 LightRAG 的 13.8%。',
    },
    {
      title: '异步加工与索引重建',
      desc: '语义加工异步执行：add_resource 后需 --wait 或 wait_processed 再检索，否则查不到新内容；embedding/VLM 以 max_concurrent 控并发；reindex 支持 vectors_only、semantic_and_vectors 与 prune_orphans 三种模式。',
    },
  ],

  en: {
    tagline:
      'An open-source context database for AI agents — unifying memories, resources, and skills under a viking:// filesystem paradigm, with tiered loading, recursive retrieval, and self-evolving memory.',
    summary:
      'OpenViking is an open-source context database for AI agents, created by Volcengine. Instead of the flat vector storage of traditional RAG, it organizes memories, resources, and skills as a virtual filesystem under the viking:// protocol, where every entry has a unique URI. Written content is automatically processed into three tiers — L0 abstract, L1 overview, and L2 full content — loaded on demand to save tokens. Directory recursive retrieval combines intent analysis with vector search and layered drill-down, while retrieval trajectories stay fully observable. A session-end loop extracts long-term user and agent memories, so agents grow smarter with use.',
  },
}
