import type { ToolDeepDive } from '../deepDive'

/**
 * Arize Phoenix 深度解析
 * 数据来源：
 * - Star 历史：OSS Insight API https://api.ossinsight.io/v1/repos/Arize-ai/phoenix/stargazers/history
 * - 仓库统计：GitHub API https://api.github.com/repos/Arize-ai/phoenix（2026-07-18）
 * - 版本：https://github.com/Arize-ai/phoenix/releases
 * - 架构：官方 README 与文档（OTel 原生、OpenInference、phoenix-otel/-client/-evals 子包）
 */
export const phoenixDeep: ToolDeepDive = {
  toolId: 'phoenix',

  stats: {
    stars: 10611,
    forks: 993,
    license: 'Elastic-2.0',
    checkedAt: '2026-07-18',
  },

  // OSS Insight 共 40 个采样点，按规则保留首点 + 最近 35 点
  starHistory: [
    { date: '2023-04', stars: 135 },
    { date: '2023-09', stars: 1306 },
    { date: '2023-10', stars: 1481 },
    { date: '2023-11', stars: 1567 },
    { date: '2023-12', stars: 1693 },
    { date: '2024-01', stars: 1864 },
    { date: '2024-02', stars: 2043 },
    { date: '2024-03', stars: 2293 },
    { date: '2024-04', stars: 2467 },
    { date: '2024-05', stars: 2642 },
    { date: '2024-06', stars: 2795 },
    { date: '2024-07', stars: 2996 },
    { date: '2024-08', stars: 3177 },
    { date: '2024-09', stars: 3333 },
    { date: '2024-10', stars: 3601 },
    { date: '2024-11', stars: 3819 },
    { date: '2024-12', stars: 4119 },
    { date: '2025-01', stars: 4345 },
    { date: '2025-02', stars: 4603 },
    { date: '2025-03', stars: 4931 },
    { date: '2025-04', stars: 5205 },
    { date: '2025-05', stars: 5472 },
    { date: '2025-06', stars: 5691 },
    { date: '2025-07', stars: 5867 },
    { date: '2025-08', stars: 6063 },
    { date: '2025-09', stars: 6221 },
    { date: '2025-10', stars: 6414 },
    { date: '2025-11', stars: 6502 },
    { date: '2025-12', stars: 6620 },
    { date: '2026-01', stars: 6738 },
    { date: '2026-02', stars: 6832 },
    { date: '2026-03', stars: 6901 },
    { date: '2026-04', stars: 6966 },
    { date: '2026-05', stars: 7002 },
    { date: '2026-06', stars: 7016 },
    { date: '2026-07', stars: 10611 },
  ],

  versions: [
    { version: 'v19.0.0', date: '2026-07-17', highlight: '新增 OAuth2 授权与 CLI 登录' },
    { version: 'v18.1.0', date: '2026-07-17', highlight: 'REST 支持 API 密钥管理' },
    { version: 'v18.0.0', date: '2026-07-14', highlight: '会话筛选改用区间重叠语义' },
    { version: 'v17.30.0', date: '2026-07-14', highlight: '支持批量标注配置管理' },
    { version: 'v17.29.0', date: '2026-07-13', highlight: 'PXI 追踪移至服务端' },
  ],

  architecture: {
    intro:
      'Phoenix 最关键的设计决策是把埋点与平台彻底解耦：应用侧只依赖 OpenInference 埋点与 phoenix-otel 轻封装，按 OTLP 标准上报；服务端统一接收、批量落 SQL，再由 GraphQL 与 REST 支撑 UI、评估、实验与 Playground 四类消费。',
    diagram: {
      cols: 4,
      rows: 3,
      nodes: [
        { id: 'llm_app', label: 'LLM 应用', sub: 'Agent 或 RAG', kind: 'external', col: 1, row: 1, group: '接入层' },
        { id: 'oi_instr', label: 'OI 埋点', sub: 'openinference', kind: 'external', col: 2, row: 1, group: '接入层' },
        { id: 'px_otel', label: 'OTel 封装', sub: 'phoenix-otel', kind: 'external', col: 3, row: 1, group: '接入层' },
        { id: 'otlp_recv', label: 'OTLP 接收', sub: 'HTTP 6006', kind: 'core', col: 1, row: 2, group: '服务端' },
        { id: 'gql_api', label: 'API 层', sub: 'GraphQL 与 REST', kind: 'core', col: 2, row: 2, group: '服务端' },
        { id: 'bulk', label: '批量写入', sub: 'bulk_inserter', kind: 'core', col: 3, row: 2, group: '数据面' },
        { id: 'sql', label: 'SQL 存储', sub: 'SQLAlchemy', kind: 'data', col: 4, row: 2, group: '数据面' },
        { id: 'ui', label: 'Web UI', sub: 'React 前端', kind: 'core', col: 1, row: 3, group: '应用层' },
        { id: 'evals', label: 'Evals 引擎', sub: 'phoenix-evals', kind: 'core', col: 2, row: 3, group: '应用层' },
        { id: 'exp', label: '实验数据集', sub: 'Experiments', kind: 'core', col: 3, row: 3, group: '应用层' },
        { id: 'pg', label: '演练场', sub: 'Playground', kind: 'core', col: 4, row: 3, group: '应用层' },
      ],
      edges: [
        { from: 'llm_app', to: 'oi_instr', label: '一行埋点' },
        { from: 'oi_instr', to: 'px_otel', label: '生成 Span' },
        { from: 'px_otel', to: 'otlp_recv', label: 'OTLP 上报' },
        { from: 'otlp_recv', to: 'bulk', label: 'proto 解码' },
        { from: 'bulk', to: 'sql', label: '批量事务写' },
        { from: 'gql_api', to: 'sql', label: '读写', bidirectional: true },
        { from: 'ui', to: 'gql_api', label: 'GraphQL 查询' },
        { from: 'evals', to: 'gql_api', label: '拉取 Span' },
        { from: 'evals', to: 'sql', label: '标注回写', dashed: true },
        { from: 'exp', to: 'gql_api', label: 'REST 提交' },
        { from: 'pg', to: 'gql_api', label: '重放调用' },
      ],
      note: '埋点侧只依赖 OTel 与 OpenInference，平台可整体替换，这正是厂商中立的地基',
    },
  },

  dataFlow: {
    intro:
      '一条 Span 的完整生命周期：应用内拦截 LLM 调用并组装 OpenInference 语义，Exporter 缓冲后经 OTLP 推送，服务端解码、bulk_inserter 批量入库，再兵分两路供 UI 交互查询与 llm_classify 批量打分，评估标注回写同一存储形成闭环。',
    diagram: {
      cols: 4,
      rows: 2,
      direction: 'LR',
      nodes: [
        { id: 'agent', label: 'Agent 进程', sub: '被埋点应用', kind: 'external', col: 1, row: 1 },
        { id: 'exporter', label: 'Exporter', sub: 'OTLP Exporter', kind: 'external', col: 2, row: 1 },
        { id: 'ingest', label: '接收解析', sub: 'OTLP Receiver', kind: 'core', col: 3, row: 1 },
        { id: 'bulk', label: '批量写入', sub: 'bulk_inserter', kind: 'core', col: 4, row: 1 },
        { id: 'store', label: 'Trace 存储', sub: 'Span 与标注', kind: 'data', col: 1, row: 2 },
        { id: 'eval', label: '评估引擎', sub: 'llm_classify', kind: 'core', col: 2, row: 2 },
        { id: 'ui2', label: 'UI 呈现', sub: 'GraphQL 驱动', kind: 'core', col: 4, row: 2 },
      ],
      edges: [
        { from: 'agent', to: 'exporter', label: '批量缓冲' },
        { from: 'exporter', to: 'ingest', label: 'OTLP 推送' },
        { from: 'ingest', to: 'bulk', label: 'OI 语义解码' },
        { from: 'bulk', to: 'store', label: '事务落盘' },
        { from: 'store', to: 'eval', label: '批量拉取' },
        { from: 'eval', to: 'store', label: '标注回写', dashed: true },
        { from: 'store', to: 'ui2', label: '查询渲染' },
      ],
      note: '评估标注与原始 Span 同库存储，观测与评估共用一份事实，UI 可按评分直接过滤',
    },
  },

  sequence: {
    intro:
      '以本地调试闭环为例：开发者 launch_app 启动服务并给应用装上一行埋点，此后每次 LLM 调用自动生成 Span，经 OTLP 的 traces 端点上报并批量入库，开发者随即在 GraphQL 驱动的 UI 中下钻完整调用链。',
    diagram: {
      actors: [
        { id: 'dev', label: '开发者', kind: 'user' },
        { id: 'app', label: 'Agent 应用', kind: 'agent' },
        { id: 'px', label: 'Phoenix', kind: 'system' },
        { id: 'db', label: 'SQL 存储', kind: 'system' },
        { id: 'llm', label: 'LLM API', kind: 'external' },
      ],
      messages: [
        { from: 'dev', to: 'px', label: 'px.launch_app()' },
        { from: 'dev', to: 'app', label: 'instrument() 埋点' },
        { from: 'app', to: 'llm', label: 'chat.completions' },
        { from: 'llm', to: 'app', label: '返回响应', dashed: true },
        { from: 'app', to: 'px', label: 'POST /v1/traces' },
        { from: 'px', to: 'db', label: 'bulk_inserter 写入' },
        { from: 'dev', to: 'px', label: 'GraphQL 查询 Trace' },
        { from: 'px', to: 'dev', label: '渲染 Span 树', dashed: true },
      ],
      note: '装埋点后业务代码零改动，Span 上报异步批量进行，不阻塞应用主链路',
    },
  },

  extension: [
    {
      title: 'OpenInference 埋点插件',
      desc: 'openinference-instrumentation-* 系列覆盖 OpenAI、LangChain、LlamaIndex 等 25+ 框架，一行 instrument() 调用即可完成自动追踪；私有框架也可自行实现 Instrumentor，按同一语义输出 OTLP Span 即可被 Phoenix 完整解析。',
    },
    {
      title: '自定义评估器',
      desc: 'arize-phoenix-evals 提供模板化评估器基类：自定义 judge prompt、评分标尺与所用模型即可构建新评估器，也可编写确定性代码评估器，打分统一回写为 Span 或 Trace 标注。',
    },
    {
      title: '开放 API 与 MCP',
      desc: 'arize-phoenix-client 基于 OpenAPI 暴露 REST 接口，配合 phoenix-mcp 与 CLI 把 Trace、数据集与实验开放给程序调用，可接入 CI 评估门禁，或供 Claude Code 等编码 Agent 直接查询调试上下文。',
    },
    {
      title: 'Span Processor 转换',
      desc: 'openinference-instrumentation-openlit 与 openllmetry 等 Span Processor 可把其他埋点体系的 Trace 归一化为 OpenInference 语义，让存量 OpenLIT、Traceloop 观测数据无缝迁入 Phoenix 进行统一的展示与评估分析。',
    },
  ],

  challenges: [
    {
      title: '高基数 Trace 的存算性能',
      desc: '生产流量下 Span 体量大、属性高基数，Phoenix 需在通用 SQL 存储上设计批量写入与复合索引，才能让 UI 的聚合统计与过滤查询保持秒级响应。',
    },
    {
      title: '语义规范的持续演进',
      desc: 'OpenInference 要跟随各框架 SDK 的频繁变更更新属性约定，同时保证旧版本上报的数据仍可解析渲染，跨版本兼容与迁移成本很高。',
    },
    {
      title: 'LLM-as-Judge 的可信度',
      desc: '评估器自身会受模型偏差与幻觉影响，打分漂移可能误导迭代决策，需要模板校准、人工抽检与多模型交叉验证来维持评估结果可信。',
    },
    {
      title: '一套代码多端运行',
      desc: '同一发行版要覆盖 notebook 内嵌、本地 Docker、Kubernetes 与多租户云服务，鉴权、存储后端与资源隔离差异大，工程复杂度集中在此。',
    },
  ],

  positioning:
    'Phoenix 在 AI 可观测赛道中占据「开源 + 标准原生」的独特位置：它不发明私有协议，而是把 OpenTelemetry 与自家推动的 OpenInference 语义规范作为地基，因此天然厂商中立——任何能发 OTLP 的应用都能接入，Trace 数据也不被锁定在单一平台。与 LangSmith 等商业托管方案相比，Phoenix 可完全离线自托管，数据不出内网，契合合规敏感团队；与同样开源的 Langfuse 相比，它的差异化在于评估与实验闭环更深：版本化数据集、Experiments、LLM-as-Judge 与 Playground 围绕同一份 Trace 数据构建，覆盖从调试、评估到 prompt 迭代的完整工作流。加上 MCP/CLI 接口向编码 Agent 开放，Phoenix 正从「观测工具」演进为 Agent 工程的基础设施层。',

  landscape: {
    intro:
      'Phoenix 上游立于 OpenTelemetry 协议与 OpenInference 语义两大开放标准，向下游延伸出官方托管 Phoenix Cloud、企业版 Arize AX 与面向编码 Agent 的 phoenix-mcp 接口，构成「标准协议进、多元消费出」的完整版图。',
    diagram: {
      cols: 3,
      rows: 3,
      direction: 'LR',
      nodes: [
        { id: 'otel', label: 'OTel', sub: 'OpenTelemetry', kind: 'external', col: 1, row: 1, group: '上游依赖' },
        { id: 'oi', label: 'OI 规范', sub: 'OpenInference', kind: 'external', col: 1, row: 2, group: '上游依赖' },
        { id: 'instr2', label: '埋点插件', sub: '25+ 框架集成', kind: 'external', col: 1, row: 3, group: '上游依赖' },
        { id: 'core', label: 'Phoenix', sub: '开源可观测平台', kind: 'core', col: 2, row: 2, group: '本项目' },
        { id: 'client', label: 'Client', sub: 'phoenix-client', kind: 'core', col: 2, row: 3, group: '本项目' },
        { id: 'cloud', label: 'Cloud', sub: 'Phoenix Cloud', kind: 'control', col: 3, row: 1, group: '下游应用' },
        { id: 'arize', label: 'Arize AX', sub: '企业商业平台', kind: 'control', col: 3, row: 2, group: '下游应用' },
        { id: 'mcp', label: 'MCP 接口', sub: 'phoenix-mcp', kind: 'data', col: 3, row: 3, group: '下游应用' },
      ],
      edges: [
        { from: 'otel', to: 'core', label: 'OTLP 协议' },
        { from: 'oi', to: 'core', label: '语义约定' },
        { from: 'instr2', to: 'core', label: '自动埋点' },
        { from: 'core', to: 'client', label: 'REST 封装' },
        { from: 'client', to: 'mcp', label: '开放给 Agent' },
        { from: 'core', to: 'cloud', label: '托管发行' },
        { from: 'core', to: 'arize', label: '同源商业化', dashed: true },
      ],
      note: '上游绑定开放标准而非单一厂商，下游从自托管覆盖到企业级，商业闭环清晰',
    },
  },

  competitors: [
    {
      name: 'LangSmith',
      relation: '直接竞品',
      diff: 'LangChain 团队的商业托管平台，与自家生态整合最深；Phoenix 开源可自托管且厂商中立，但闭源托管协作功能更弱。',
    },
    {
      name: 'Langfuse',
      relation: '直接竞品',
      diff: '同样开源可自托管的 LLM 观测平台；Phoenix 以 OTel/OpenInference 标准与评估实验闭环见长，Langfuse 的产品化与协作体验更成熟。',
    },
    {
      name: 'Braintrust',
      relation: '相邻替代',
      diff: '闭源托管的评估驱动平台，实验与评测工作流极强；Phoenix 更偏 Trace 调试与开源可控，两者在评估场景有重叠。',
    },
    {
      name: 'Helicone',
      relation: '相邻替代',
      diff: '代理网关式接入，一行改 baseURL 即记录请求，上手极轻；但多步 Agent 深度 Trace 与评估能力不及 Phoenix。',
    },
  ],

  mechanism: [
    {
      title: 'Span 语义映射入库',
      desc: 'OpenInference 语义约定把 LLM 调用编码为带 openinference.span.kind（LLM/CHAIN/TOOL/RETRIEVER 等）与 llm.token_count、input.value 等命名空间属性的标准 OTel Span；Phoenix 服务端解码 OTLP 消息后，将 kind、模型名、token 用量等高频字段抽取为索引列，其余属性整体以 JSON 落库，再按 trace_id 与 parent_id 还原完整调用树供 UI 下钻。',
    },
    {
      title: '批量 Span 摄取管线',
      desc: '应用侧 BatchSpanProcessor 缓冲 Span 后经 OTLP（HTTP 6006 或 gRPC）推送；服务端接收层解码 protobuf 后交给 db 模块下的 bulk_inserter 模块与 insertion 包，把 Span、标注、评估结果合并为批量事务写入 SQLite/PostgreSQL，避免逐条提交，同时滚动维护 token 累计与项目级统计，保证高吞吐下聚合查询依然秒级响应。',
    },
    {
      title: 'LLM 评估执行与回写',
      desc: 'phoenix-evals 以 llm_classify 为原语：把 Span 的输入输出填入提示词模板占位符，用 rails 限定输出标签集合，经模型封装层并发调用并自动重试限流；产出的标签、分数与解释作为 annotator_kind 为 LLM 的标注经 REST API 回写到原 Trace 上，与人工反馈同构存储，UI 中可直接按评分过滤与聚合 Trace。',
    },
    {
      title: 'Experiments 数据集重放',
      desc: '实验以版本化数据集为输入：run_experiment 对每个 example 并发执行 task 函数重放应用逻辑，全程自动追踪调用链；任务完成后绑定的评估器自动对输出打分（对照 reference 或用 LLM 评审），结果存为实验运行记录；支持 repetitions 重复执行平滑模型随机性、dry-run 试跑不落库，多个实验可在 UI 中并排对比定位回归。',
    },
  ],

  sourceLayout: [
    { path: 'src/phoenix/server', role: 'FastAPI 服务端：OTLP 接收、REST/GraphQL、鉴权与保留策略' },
    { path: 'src/phoenix/db', role: 'SQLAlchemy 模型、Alembic 迁移与 Span 批量写入' },
    { path: 'src/phoenix/trace', role: 'Span 编解码、TraceDataset 与 Trace 过滤 DSL' },
    { path: 'src/phoenix/server/api', role: 'GraphQL schema 与 REST 路由定义' },
    { path: 'packages/phoenix-otel', role: '轻量 OTel 封装，内置 Phoenix 默认上报配置' },
    { path: 'packages/phoenix-client', role: '基于 OpenAPI 生成的 Phoenix REST 客户端' },
    { path: 'packages/phoenix-evals', role: 'LLM 评估器库与 llm_classify 原语' },
    { path: 'app', role: 'React/TypeScript Web 前端：Trace 下钻与实验对比' },
  ],

  tradeoffs: [
    {
      title: 'OTel 原生路线',
      choice: '基于 OTel + OpenInference，不造私有 SDK',
      reason: '埋点产物可移植到任何 OTel 兼容后端，用户不被单一平台锁定；官方把厂商与框架中立作为核心定位，并借 CNCF 标准生态直接获得多语言、多框架的接入能力。',
    },
    {
      title: '许可证选型',
      choice: '选 Elastic License 2.0 源码可用',
      reason: '允许任意内部自托管、修改且无用量上限，但禁止将其作为托管服务转售，以此保护 Phoenix Cloud 与 Arize AX 的商业化空间；代价是未获 OSI 认证，少数企业采购流程会受阻。',
    },
    {
      title: '默认存储选型',
      choice: 'SQLite 默认，PostgreSQL 可切换',
      reason: '默认零外部依赖，单容器或 notebook 内一条命令即可运行，最大限度降低上手门槛；生产环境再切换 PostgreSQL 并横向扩容多副本，不强迫所有用户运维重型存储集群。',
    },
  ],

  production: [
    {
      title: 'Docker 与 K8s 自托管',
      desc: '官方镜像 arizephoenix/phoenix 发布于 Docker Hub，单容器即含 UI 与 OTLP 接收端；K8s 提供 helm 与 kustomize 清单；生产用 PHOENIX_SQL_DATABASE_URL 指向 PostgreSQL，并开启 PHOENIX_ENABLE_AUTH 与 HTTPS 安全 Cookie。',
    },
    {
      title: '数据保留策略',
      desc: 'v9.0+ 支持按时间或 Trace 条数的项目级保留策略，默认 Default 策略为 0 天即永久保留；可用 PHOENIX_DEFAULT_RETENTION_POLICY_DAYS 设定默认保留天数，后台清理任务定期清除过期 Trace 以控制存储成本。',
    },
    {
      title: '大规模 Trace 采样',
      desc: '高流量场景应在应用侧 OTel SDK 或 OTel Collector 层配置采样后再上报，降低存储与摄取压力；Phoenix 服务端无状态，可挂接单一 PostgreSQL 横向扩多副本，并按负载监控内存与磁盘用量。',
    },
    {
      title: '常见坑：存储与鉴权',
      desc: '默认 SQLite 仅适合本地与小规模使用，生产不切 PostgreSQL 会在高并发写入下成为瓶颈；暴露公网时必须启用鉴权、配置 PHOENIX_SECRET 与安全 Cookie，否则 Trace 中的提示词与业务数据存在泄露风险。',
    },
  ],

  en: {
    tagline:
      'OpenTelemetry-native, open-source AI observability platform for tracing, evaluating, and debugging LLM agents — runs fully local or self-hosted.',
    summary:
      'Arize Phoenix is an open-source AI observability platform built natively on OpenTelemetry and the OpenInference semantic conventions. Auto-instrumentation packages capture LLM calls from 25+ frameworks as standard spans, which Phoenix stores, visualizes, and evaluates in a local-first web UI. Beyond tracing, it offers LLM-as-a-Judge evaluators, versioned datasets, experiments, and a prompt playground, closing the loop from debugging to measurable iteration. Vendor-neutral and self-hostable under the Elastic License 2.0, it suits teams that need deep agent visibility without sending data to a hosted vendor.',
  },
}
