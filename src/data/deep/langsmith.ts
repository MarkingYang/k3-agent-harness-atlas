import type { ToolDeepDive } from '../deepDive'

/**
 * LangSmith 深度解析
 * 数据来源：
 * - Star 历史：OSS Insight API https://api.ossinsight.io/v1/repos/langchain-ai/langsmith-sdk/stargazers/history
 * - 仓库统计：GitHub API https://api.github.com/repos/langchain-ai/langsmith-sdk（2026-07-18，stars 972 / forks 261 / MIT）
 * - 版本：https://github.com/langchain-ai/langsmith-sdk/releases（v0.10.6-v0.10.2，2026-07-18 核对）
 * - 架构：官方自托管文档 https://docs.langchain.com/langsmith/self-hosted
 *   （Frontend/Backend/Queue/Platform backend/Playground/ACE + ClickHouse/PostgreSQL/Redis/Blob）
 * - 机制/源码：langsmith-sdk 仓库实际路径（jsDelivr 文件清单 + PyPI 0.10.5 sdist 核对）；
 *   扩容文档 https://docs.langchain.com/langsmith/self-host-scale（platform backend→Redis→queue→ClickHouse）；
 *   压缩缓冲 issue https://github.com/langchain-ai/langsmith-sdk/issues/1962（_background_thread/_compressed_traces）
 * - 取舍/生产：评估文档（采样率控成本）、托管 ClickHouse 文档（输入输出存客户 S3/GCS）、
 *   Terraform 参考架构（AWS/GCP/Azure，KEDA 弹性扩容）、changelog（项目级月度 Trace 限额）
 */
export const langsmithDeep: ToolDeepDive = {
  toolId: 'langsmith',

  stats: {
    stars: 972,
    forks: 261,
    license: 'MIT',
    checkedAt: '2026-07-18',
  },

  // OSS Insight 共 37 个采样点，按规则保留首点 + 最近 35 点
  starHistory: [
    { date: '2023-06', stars: 10 },
    { date: '2023-08', stars: 94 },
    { date: '2023-09', stars: 118 },
    { date: '2023-10', stars: 151 },
    { date: '2023-11', stars: 174 },
    { date: '2023-12', stars: 197 },
    { date: '2024-01', stars: 216 },
    { date: '2024-02', stars: 232 },
    { date: '2024-03', stars: 258 },
    { date: '2024-04', stars: 279 },
    { date: '2024-05', stars: 302 },
    { date: '2024-06', stars: 322 },
    { date: '2024-07', stars: 338 },
    { date: '2024-08', stars: 350 },
    { date: '2024-09', stars: 365 },
    { date: '2024-10', stars: 387 },
    { date: '2024-11', stars: 402 },
    { date: '2024-12', stars: 422 },
    { date: '2025-01', stars: 454 },
    { date: '2025-02', stars: 469 },
    { date: '2025-03', stars: 492 },
    { date: '2025-04', stars: 509 },
    { date: '2025-05', stars: 527 },
    { date: '2025-06', stars: 545 },
    { date: '2025-07', stars: 560 },
    { date: '2025-08', stars: 575 },
    { date: '2025-09', stars: 585 },
    { date: '2025-10', stars: 592 },
    { date: '2025-11', stars: 604 },
    { date: '2025-12', stars: 617 },
    { date: '2026-01', stars: 638 },
    { date: '2026-02', stars: 648 },
    { date: '2026-03', stars: 656 },
    { date: '2026-04', stars: 661 },
    { date: '2026-05', stars: 666 },
    { date: '2026-07', stars: 972 },
  ],

  versions: [
    { version: 'v0.10.6', date: '2026-07-17', highlight: '捕获 Pipecat 实时转写与工具调用' },
    { version: 'v0.10.5', date: '2026-07-15', highlight: '同步 API 定义并修补 JS 高危依赖' },
    { version: 'v0.10.4', date: '2026-07-14', highlight: 'LiveKit 实时转写与语音成本捕获' },
    { version: 'v0.10.3', date: '2026-07-14', highlight: '修复批量摄取丢失工作区覆盖问题' },
    { version: 'v0.10.2', date: '2026-07-10', highlight: '标注队列支持按键添加 Run' },
  ],

  architecture: {
    intro:
      '读写路径彻底分离：平台后端专职鉴权与高并发摄取，Trace 经 Redis 削峰由队列批量落盘 ClickHouse；后端 API 承接前端与 Playground 查询，自定义代码交 ACE 沙箱执行，SDK 异步上报零阻塞。',
    diagram: {
      cols: 4,
      rows: 4,
      nodes: [
        { id: 'ingest', label: 'SDK 埋点', sub: 'traceable·wrap', kind: 'core', col: 1, row: 1, group: '接入层' },
        { id: 'otel', label: 'OTLP 接入', sub: 'OpenTelemetry', kind: 'external', col: 3, row: 1, group: '接入层' },
        { id: 'ui', label: '前端门户', sub: 'Nginx', kind: 'core', col: 1, row: 2, group: '平台服务' },
        { id: 'api', label: '后端 API', sub: 'Backend', kind: 'core', col: 2, row: 2, group: '平台服务' },
        { id: 'platform', label: '平台后端', sub: 'Auth/Ingest', kind: 'core', col: 3, row: 2, group: '平台服务' },
        { id: 'queue', label: '摄取队列', sub: 'Queue', kind: 'core', col: 4, row: 2, group: '平台服务' },
        { id: 'playground', label: '提示演练', sub: 'Playground', kind: 'core', col: 1, row: 3, group: '平台服务' },
        { id: 'ace', label: 'ACE 执行', sub: '自定义代码沙箱', kind: 'core', col: 2, row: 3, group: '平台服务' },
        { id: 'ch', label: 'Trace 列存', sub: 'ClickHouse', kind: 'data', col: 1, row: 4, group: '存储层' },
        { id: 'pg', label: '元数据库', sub: 'PostgreSQL', kind: 'data', col: 2, row: 4, group: '存储层' },
        { id: 'redis', label: 'Redis', sub: 'Cache/Queue', kind: 'data', col: 3, row: 4, group: '存储层' },
        { id: 'blob', label: '对象存储', sub: 'S3/GCS', kind: 'data', col: 4, row: 4, group: '存储层' },
      ],
      edges: [
        { from: 'ingest', to: 'platform', label: '批量上报' },
        { from: 'otel', to: 'platform', label: 'OTLP' },
        { from: 'ui', to: 'api', label: 'REST 请求' },
        { from: 'ui', to: 'playground', label: '演练请求' },
        { from: 'playground', to: 'api', label: 'Prompt 拉取' },
        { from: 'api', to: 'ace', label: '代码执行' },
        { from: 'platform', to: 'api', label: '认证校验' },
        { from: 'platform', to: 'redis', label: 'Trace 入队' },
        { from: 'redis', to: 'queue', label: 'BLPOP 拉取' },
        { from: 'queue', to: 'ch', label: '批量写入' },
        { from: 'queue', to: 'blob', label: '附件写入' },
        { from: 'api', to: 'pg', label: '元数据读写' },
        { from: 'api', to: 'ch', label: 'Trace 查询', dashed: true },
      ],
      note: '六类平台服务与四类存储取自官方自托管文档，ACE 独立承担自定义代码的安全执行；SaaS 与自托管共享同一套组件拓扑。',
    },
  },

  dataFlow: {
    intro:
      '一次 Agent 调用的数据旅程：traceable 把嵌套调用组装成 RunTree，后台线程 zstd 压缩后 multipart 批量上报；platform backend 鉴权入队 Redis，queue 消费后批量 INSERT 进 ClickHouse，在线评估器再按采样率打分回写。全链路异步，与业务线程解耦。',
    diagram: {
      cols: 5,
      rows: 2,
      direction: 'LR',
      nodes: [
        { id: 'app', label: '业务应用', sub: 'Agent 调用', kind: 'core', col: 1, row: 1 },
        { id: 'runtree', label: '调用树', sub: 'RunTree', kind: 'data', col: 2, row: 1 },
        { id: 'batcher', label: '批量线程', sub: 'zstd 压缩', kind: 'core', col: 3, row: 1 },
        { id: 'platform', label: '摄取入口', sub: 'Auth/Ingest', kind: 'core', col: 4, row: 1 },
        { id: 'redis', label: 'Redis', sub: '削峰队列', kind: 'data', col: 5, row: 1 },
        { id: 'queue', label: 'Queue 服务', sub: 'KEDA 扩容', kind: 'core', col: 5, row: 2 },
        { id: 'ch', label: 'Trace 列存', sub: 'ClickHouse', kind: 'data', col: 4, row: 2 },
        { id: 'eval', label: '在线评估', sub: 'LLM-as-judge', kind: 'control', col: 3, row: 2 },
        { id: 'dash', label: '仪表板告警', sub: 'Webhook', kind: 'external', col: 2, row: 2 },
      ],
      edges: [
        { from: 'app', to: 'runtree', label: 'traceable' },
        { from: 'runtree', to: 'batcher', label: 'Run JSON' },
        { from: 'batcher', to: 'platform', label: 'zstd 上报' },
        { from: 'platform', to: 'redis', label: 'Trace 入队' },
        { from: 'redis', to: 'queue', label: 'BLPOP' },
        { from: 'queue', to: 'ch', label: '批量 INSERT' },
        { from: 'ch', to: 'eval', label: '采样拉取' },
        { from: 'eval', to: 'ch', label: '分数回写' },
        { from: 'ch', to: 'dash', label: 'SQL 查询' },
      ],
      note: '压缩批量以轻微可见延迟换取高吞吐，进程退出由 atexit 冲刷兜底。',
    },
  },

  sequence: {
    intro:
      '以一次带在线评估的生产请求为例：traceable 同步记录嵌套调用并组装 RunTree，批量上报交给后台线程经 multipart 端点异步完成；平台落盘后评估器按采样率拉取打分并回写 feedback，异常经 Webhook 通知，主请求全程零阻塞。',
    diagram: {
      actors: [
        { id: 'dev', label: '开发者', kind: 'user' },
        { id: 'app', label: '业务应用', kind: 'agent' },
        { id: 'sdk', label: 'SDK 客户端', kind: 'system' },
        { id: 'ls', label: 'LangSmith', kind: 'system' },
        { id: 'eval', label: '在线评估器', kind: 'external' },
      ],
      messages: [
        { from: 'dev', to: 'app', label: '发起 Agent 请求' },
        { from: 'app', to: 'sdk', label: 'traceable 记录调用' },
        { from: 'sdk', to: 'sdk', label: '组装 RunTree' },
        { from: 'sdk', to: 'ls', label: 'multipart 批量上报', dashed: true },
        { from: 'ls', to: 'ls', label: '写入 ClickHouse' },
        { from: 'eval', to: 'ls', label: '采样拉取 Run' },
        { from: 'eval', to: 'eval', label: 'LLM-as-judge 打分' },
        { from: 'eval', to: 'ls', label: '回写 feedback' },
        { from: 'ls', to: 'dev', label: 'Webhook 告警通知', dashed: true },
      ],
      note: '第 4 步在后台线程执行，主请求路径零阻塞。',
    },
  },

  extension: [
    {
      title: '自定义评估器',
      desc: '用 Python/JS 函数或 LLM-as-judge 提示词定义评估逻辑，对 Run 的输入输出打分；同一套评估器既可跑离线数据集实验，也可按采样率用于线上流量。',
    },
    {
      title: 'Annotation Queue 人工标注',
      desc: '把可疑或抽样的 Trace 送入标注队列，由人工审查打分并回写为反馈数据，与自动评估互补，持续校准 LLM 评委与人类偏好的一致性。',
    },
    {
      title: 'Webhook 告警与自动化',
      desc: '当在线评估分数跌破阈值或错误率飙升时触发 Webhook，推送到 Slack、PagerDuty 等外部系统，把质量事件接入既有值班与响应流程。',
    },
    {
      title: 'OpenTelemetry 与开放 API',
      desc: '提供 OTLP 端点，任意框架的 Trace 可按 OpenTelemetry 规范接入；完整 REST API 支持把数据集、实验与反馈嵌入自有研发流水线。',
    },
  ],

  challenges: [
    {
      title: '高吞吐异步摄取',
      desc: '生产环境每秒产生海量 Run，SDK 需本地缓冲、压缩与批量发送，平台侧用队列削峰、失败重试，同时保证业务主路径不被观测流量拖慢。',
    },
    {
      title: '嵌套调用树建模',
      desc: 'Run Tree 需准确编码父子层级与执行顺序，在并发、流式与跨进程调用下保持树结构完整，否则 Trace 视图会错位、难以还原真实执行路径。',
    },
    {
      title: '数据脱敏与驻留',
      desc: 'Trace 天然包含用户输入与 Prompt，SDK 提供 anonymizer 脱敏与采样控制，企业版再以自托管与 BYOC 让敏感数据留在客户自己的云环境中。',
    },
    {
      title: '评估打分一致性',
      desc: 'LLM-as-judge 存在噪声与立场漂移，需要版本化评估定义、与人类标注对齐校准，并在模型升级后复测，否则分数趋势会失去可比性。',
    },
  ],

  positioning:
    'LangSmith 位于 Agent Harness 的可观测与评估层，是 LangChain 生态的商业化运维中枢：向上承接各类框架的 Trace，向下沉淀为数据集、评估实验与线上监控，覆盖“调试—评估—监控”全生命周期。与开源的 Phoenix、Langfuse 相比，它以托管体验、原生集成和企业级自托管/BYOC 取胜；与通用 APM 相比，它面向 LLM 语义建模，把 Agent 行为变成可检索、可评估、可告警的工程对象。',

  landscape: {
    intro:
      '上游多源开放接入：LangChain 系框架经环境变量自动埋点，任意框架亦可走 OTLP 端点；Trace 在平台内沉淀为数据集与评估资产，下游联动 LangGraph 部署观测、GitHub Actions 回归门禁与 Slack、PagerDuty 告警，形成质量闭环。',
    diagram: {
      cols: 3,
      rows: 4,
      direction: 'LR',
      nodes: [
        { id: 'openai', label: 'OpenAI', sub: 'GPT 系列', kind: 'external', col: 1, row: 1, group: '上游依赖' },
        { id: 'claude', label: 'Claude', sub: 'Anthropic', kind: 'external', col: 1, row: 2, group: '上游依赖' },
        { id: 'fw', label: 'Agent 框架', sub: 'LangChain', kind: 'external', col: 1, row: 3, group: '上游依赖' },
        { id: 'otel', label: 'OTLP 来源', sub: 'OpenTelemetry', kind: 'external', col: 1, row: 4, group: '上游依赖' },
        { id: 'sdk', label: '采集 SDK', sub: 'langsmith-sdk', kind: 'core', col: 2, row: 2, group: '本项目' },
        { id: 'ls', label: '观测评估中枢', sub: 'LangSmith', kind: 'core', col: 2, row: 3, group: '本项目' },
        { id: 'langgraph', label: 'Agent 部署', sub: 'LangGraph', kind: 'external', col: 3, row: 1, group: '下游应用' },
        { id: 'ci', label: 'CI 回归', sub: 'GitHub Actions', kind: 'external', col: 3, row: 2, group: '下游应用' },
        { id: 'slack', label: 'Slack', sub: 'Webhook 告警', kind: 'external', col: 3, row: 3, group: '下游应用' },
        { id: 'pd', label: '值班告警', sub: 'PagerDuty', kind: 'external', col: 3, row: 4, group: '下游应用' },
      ],
      edges: [
        { from: 'openai', to: 'fw', label: 'API 调用' },
        { from: 'claude', to: 'fw', label: 'API 调用' },
        { from: 'fw', to: 'sdk', label: '自动埋点' },
        { from: 'otel', to: 'ls', label: 'OTLP' },
        { from: 'sdk', to: 'ls', label: 'POST /runs' },
        { from: 'ls', to: 'langgraph', label: '部署观测' },
        { from: 'ls', to: 'ci', label: '评估门禁' },
        { from: 'ls', to: 'slack', label: 'Webhook' },
        { from: 'ls', to: 'pd', label: '告警触发' },
      ],
      note: '上游多源接入，下游形成调试—评估—监控的质量闭环。',
    },
  },

  competitors: [
    {
      name: 'Langfuse',
      relation: '直接竞品',
      diff: '开源自托管的 LLM 观测平台，数据自主、社区版免费；LangSmith 的 LangChain 集成与托管体验更深。',
    },
    {
      name: 'Arize Phoenix',
      relation: '直接竞品',
      diff: 'OTel 原生、可本地运行的开源观测评估工具；LangSmith 的协作、Prompt Hub 与企业功能更完整。',
    },
    {
      name: 'Braintrust',
      relation: '直接竞品',
      diff: '以评估实验与数据集工作流为核心的商业平台；LangSmith 的 Trace 调试与 LangChain 生态联动更强。',
    },
    {
      name: 'W&B Weave',
      relation: '相邻替代',
      diff: 'W&B 实验追踪生态下的 LLM 观测模块，适合已用 W&B 的团队；LangSmith 更聚焦 Agent 生命周期。',
    },
  ],

  mechanism: [
    {
      title: 'Run Tree 组装与批量上报',
      desc: 'traceable 装饰器借助上下文变量把嵌套调用挂成父子 Run Tree，Run 结束时写入内存优先级队列；独立后台线程批量取出后先落入 zstd 压缩缓冲区，聚合后经 /runs/multipart 一次上报，进程退出时由 atexit 冲刷，全程与业务线程解耦。',
    },
    {
      title: '队列削峰与列式落盘',
      desc: 'platform backend 收到摄取请求后把 Trace 放入 Redis 队列，queue 与 ingest-queue 消费队列、异步持久化到 ClickHouse 与对象存储；Redis 削峰缓冲，ingest-queue 用 KEDA 按队列深度弹性扩容，ClickHouse 支撑高并发写入与聚合查询。',
    },
    {
      title: '在线评估采样回流',
      desc: '在线评估器按项目配置过滤器与采样率，对新落盘的 Run 自动触发 LLM-as-judge 或自定义代码评估器打分；分数作为反馈写回 ClickHouse 的反馈存储并与原始 Trace 关联，既可实时监控质量趋势与告警，又用采样率把评估推理成本压在预算内。',
    },
    {
      title: '人审标注队列闭环',
      desc: 'Annotation queue 把可疑或抽样的 Run 分配给领域专家，在统一界面中审查输入输出、按评分标准打分并留批注；人工反馈写回后与自动评估分数并列，还能一键转入数据集作为回归测试样例，用于持续校准 LLM 评委与人类判断的一致性。',
    },
  ],

  sourceLayout: [
    { path: 'python/langsmith/client.py', role: 'REST 客户端：Run/数据集/反馈 CRUD 与批量摄取入口' },
    { path: 'python/langsmith/run_trees.py', role: 'RunTree 模型：嵌套调用树的数据结构与序列化' },
    { path: 'python/langsmith/_internal/', role: '摄取管线内部：后台批量线程、压缩缓冲与 multipart 组装' },
    { path: 'python/langsmith/evaluation/', role: '离线评估运行器与 LLM/字符串评估器协议' },
    { path: 'python/langsmith/wrappers/', role: 'OpenAI 等三方 SDK 的无侵入包装器' },
    { path: 'js/src/', role: 'TS SDK：client、run_trees 与 traceable 实现' },
    { path: 'python/langsmith/integrations/', role: 'Claude Agent SDK、Google ADK 等三方框架集成' },
    { path: 'openapi/openapi.yaml', role: '平台 REST API 的 OpenAPI 契约，驱动客户端生成' },
  ],

  tradeoffs: [
    {
      title: '异步上报 vs 同步强一致',
      choice: '后台线程批量异步上报',
      reason: '官方设计上 Trace 由后台线程压缩批量发送，业务主路径零阻塞；代价是进程崩溃可能丢失未冲刷缓冲，故提供 atexit 冲刷与手动 flush 兜底。',
    },
    {
      title: '压缩缓冲 vs 实时可见',
      choice: '默认 zstd 压缩批量发送',
      reason: '压缩缓冲显著减少请求数与带宽，是高吞吐摄取的关键；代价是额外内存占用与轻微可见延迟，可用 DISABLE_RUN_COMPRESSION 关闭换回实时性。',
    },
    {
      title: '托管优先 vs 自托管',
      choice: 'SaaS 优先，自托管为增值项',
      reason: '默认走 LangChain 托管多租户，开箱即用；自托管作为 Enterprise 附加许可，面向有数据驻留与安全合规要求的大客户，需自行运维 ClickHouse 等组件。',
    },
  ],

  production: [
    {
      title: '自托管组件拓扑',
      desc: '组件拓扑：frontend、backend、platform backend、queue、playground、ACE 六服务，配 ClickHouse、PostgreSQL、Redis（可换 Valkey）与对象存储。',
    },
    {
      title: '数据驻留与合规',
      desc: '企业可选自托管或 BYOC；采用 LangSmith 托管 ClickHouse 时，Trace 输入输出保存在客户自己的 S3/GCS 桶中，敏感数据不出客户云账户，满足数据驻留合规要求。',
    },
    {
      title: '采样率与成本控制',
      desc: '在线评估器务必配置过滤器与采样率，只对代表性流量打分以控制 LLM 评委推理开销；平台还支持按项目/用户设月度 Trace 限额，超限拒绝新 Trace 但保留已有数据的补丁与反馈。',
    },
    {
      title: '写路径扩容要点',
      desc: '写路径瓶颈：platform backend→Redis→ingest-queue→ClickHouse；queue 与 ingest-queue 用 KEDA 按队列积压自动扩容，高读场景建议 ClickHouse 三副本集群。',
    },
  ],

  en: {
    tagline:
      'LangChain’s commercial platform for debugging, evaluating, and monitoring LLM agents across their entire lifecycle, from local development to production traffic.',
    summary:
      'LangSmith is a hosted observability and evaluation platform paired with open-source Python/JS SDKs. The traceable decorator and wrap_openai helpers capture every LLM call, retrieval, and tool execution as a nested Run Tree, batched asynchronously so the main request path is never blocked. Traces are ingested through a queue into ClickHouse, with PostgreSQL, Redis, and blob storage alongside. Teams turn failing traces into datasets, run experiments with custom or LLM-as-judge evaluators, manage prompts in Prompt Hub, and apply online evaluators with webhook alerts to production traffic. Enterprise plans add self-hosted and BYOC deployment.',
  },
}
