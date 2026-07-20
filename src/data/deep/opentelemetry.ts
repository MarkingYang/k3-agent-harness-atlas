import type { ToolDeepDive } from '../deepDive'

/**
 * OpenTelemetry 深度解析
 * 数据来源：
 * - starHistory：OSS Insight API（open-telemetry/opentelemetry-specification），首点 + 最近 35 点
 * - stats：GitHub REST API /repos/open-telemetry/opentelemetry-specification（2026-07-18 采集）
 * - versions：github.com/open-telemetry/opentelemetry-specification/releases（规范版本，非 SDK 版本）
 * - 架构：opentelemetry.io 官方文档（API/SDK 分层、Collector 管线、OTLP、GenAI 语义约定）
 * - mechanism/tradeoffs：opentelemetry.io 文档、opentelemetry-python README、W3C tracecontext 规范、BatchSpanProcessor API 参考
 * - sourceLayout：github.com/open-telemetry/opentelemetry-python 仓库顶层目录（2026-07 核实）
 * - production：opentelemetry.io Collector 部署文档、语义约定迁移指南、SDK 环境变量规范
 */
export const opentelemetryDeep: ToolDeepDive = {
  toolId: 'opentelemetry',
  stats: {
    stars: 4284,
    forks: 993,
    license: 'Apache-2.0',
    checkedAt: '2026-07-18',
  },
  starHistory: [
    { date: '2019-05', stars: 71 },
    { date: '2023-07', stars: 3251 },
    { date: '2023-08', stars: 3288 },
    { date: '2023-09', stars: 3333 },
    { date: '2023-10', stars: 3356 },
    { date: '2023-11', stars: 3392 },
    { date: '2023-12', stars: 3427 },
    { date: '2024-01', stars: 3459 },
    { date: '2024-02', stars: 3483 },
    { date: '2024-03', stars: 3513 },
    { date: '2024-04', stars: 3540 },
    { date: '2024-05', stars: 3563 },
    { date: '2024-06', stars: 3581 },
    { date: '2024-07', stars: 3604 },
    { date: '2024-08', stars: 3623 },
    { date: '2024-09', stars: 3658 },
    { date: '2024-10', stars: 3682 },
    { date: '2024-11', stars: 3712 },
    { date: '2024-12', stars: 3730 },
    { date: '2025-01', stars: 3746 },
    { date: '2025-02', stars: 3767 },
    { date: '2025-03', stars: 3808 },
    { date: '2025-04', stars: 3841 },
    { date: '2025-05', stars: 3867 },
    { date: '2025-06', stars: 3883 },
    { date: '2025-07', stars: 3909 },
    { date: '2025-08', stars: 3929 },
    { date: '2025-09', stars: 3949 },
    { date: '2025-10', stars: 3966 },
    { date: '2025-11', stars: 3980 },
    { date: '2025-12', stars: 3994 },
    { date: '2026-01', stars: 4006 },
    { date: '2026-02', stars: 4012 },
    { date: '2026-03', stars: 4016 },
    { date: '2026-04', stars: 4025 },
    { date: '2026-05', stars: 4027 },
    { date: '2026-07', stars: 4284 },
  ],
  versions: [
    { version: '1.59.0', date: '2026-07-10', highlight: '新增 Profiles 数据模型规范' },
    { version: '1.58.0', date: '2026-06-22', highlight: 'Prometheus 导出器多处转稳定' },
    { version: '1.57.0', date: '2026-05-20', highlight: '同步指标新增实验性 Bind API' },
    { version: '1.56.0', date: '2026-04-20', highlight: 'Tracer enabled 与 AlwaysRecord 采样器转稳定' },
    { version: '1.55.0', date: '2026-03-05', highlight: 'Tracing 并发要求写入规范' },
  ],
  architecture: {
    intro:
      'OpenTelemetry 的关键设计是三段解耦：API 与 SDK 分层，埋点库零实现依赖；采样批处理在 SDK 内异步化，不阻塞业务；信号只讲 OTLP，由 Collector 路由到任意后端。',
    diagram: {
      cols: 4,
      rows: 5,
      nodes: [
        { id: 'app', label: '应用与埋点', sub: 'App·instrument', kind: 'core', col: 1, row: 1, group: '埋点层' },
        { id: 'api', label: 'OTel API', sub: '三大信号接口', kind: 'core', col: 2, row: 1, group: '埋点层' },
        { id: 'semconv', label: '语义约定', sub: 'gen_ai.* 属性', kind: 'control', col: 3, row: 1, group: '埋点层' },
        { id: 'ctx', label: '上下文传播', sub: 'tracecontext', kind: 'control', col: 1, row: 2, group: 'SDK 层' },
        { id: 'sdk', label: 'SDK 核心', sub: 'Provider 配置', kind: 'core', col: 2, row: 2, group: 'SDK 层' },
        { id: 'sampler', label: '采样器', sub: '头部采样决策', kind: 'control', col: 3, row: 2, group: 'SDK 层' },
        { id: 'resource', label: '资源', sub: 'service.name', kind: 'data', col: 4, row: 2, group: 'SDK 层' },
        { id: 'proc', label: '批量处理器', sub: 'SpanProcessor', kind: 'core', col: 2, row: 3, group: 'SDK 层' },
        { id: 'otlp', label: '导出器', sub: 'OTLP gRPC 4317', kind: 'data', col: 3, row: 3, group: 'SDK 层' },
        { id: 'recv', label: '接收器', sub: 'OTLP Receiver', kind: 'core', col: 1, row: 4, group: '收集器' },
        { id: 'pipe', label: '处理管线', sub: 'Processor 链', kind: 'core', col: 2, row: 4, group: '收集器' },
        { id: 'conn', label: '连接器', sub: 'spanmetrics', kind: 'control', col: 3, row: 4, group: '收集器' },
        { id: 'cexp', label: '导出分发', sub: 'Exporter 广播', kind: 'core', col: 4, row: 4, group: '收集器' },
        { id: 'backend', label: '观测后端', sub: 'Jaeger·Prom', kind: 'external', col: 4, row: 5 },
      ],
      edges: [
        { from: 'app', to: 'api', label: '面向 API 埋点' },
        { from: 'semconv', to: 'api', label: '属性规范', dashed: true },
        { from: 'ctx', to: 'sdk', label: '注入提取', dashed: true },
        { from: 'api', to: 'sdk', label: 'SDK 实现' },
        { from: 'resource', to: 'sdk', label: '身份属性', dashed: true },
        { from: 'sdk', to: 'sampler', label: '采样决策' },
        { from: 'sampler', to: 'proc', label: 'on_end 入队' },
        { from: 'proc', to: 'otlp', label: '批量导出' },
        { from: 'otlp', to: 'recv', label: 'OTLP gRPC' },
        { from: 'recv', to: 'pipe', label: 'pdata 解码' },
        { from: 'pipe', to: 'conn', label: 'Span 转指标', dashed: true },
        { from: 'conn', to: 'cexp', label: '指标入流', dashed: true },
        { from: 'pipe', to: 'cexp', label: '批处理路由' },
        { from: 'cexp', to: 'backend', label: 'OTLP 导出' },
      ],
      note: 'API 稳定、SDK 可换、OTLP 统一，三重解耦让换后端时业务埋点零改动。',
    },
  },
  dataFlow: {
    intro:
      '遥测数据的生命周期是两段异步：应用侧 BatchSpanProcessor 攒批经 OTLP 上报，Collector 侧限流再攒批，过载只丢数据不拖垮业务。',
    diagram: {
      direction: 'LR',
      cols: 5,
      rows: 2,
      nodes: [
        { id: 'agent', label: 'Agent 应用', sub: 'LLM 工具调用', kind: 'core', col: 1, row: 1 },
        { id: 'span', label: 'Span', sub: 'gen_ai.* 属性', kind: 'data', col: 2, row: 1 },
        { id: 'bsp', label: '批量处理器', sub: 'Batch 队列', kind: 'core', col: 3, row: 1 },
        { id: 'otlp', label: 'OTLP 编码', sub: 'protobuf', kind: 'data', col: 4, row: 1 },
        { id: 'recv', label: 'Receiver', sub: 'OTLP 4317', kind: 'core', col: 5, row: 1 },
        { id: 'mem', label: '内存限流', sub: 'memory_limiter', kind: 'control', col: 4, row: 2 },
        { id: 'batch', label: '批处理', sub: 'batch', kind: 'core', col: 3, row: 2 },
        { id: 'exp', label: 'Exporter', sub: 'OTLP 转发', kind: 'core', col: 2, row: 2 },
        { id: 'store', label: '观测后端', sub: 'Jaeger Tempo', kind: 'external', col: 1, row: 2 },
      ],
      edges: [
        { from: 'agent', to: 'span', label: '埋点生成' },
        { from: 'span', to: 'bsp', label: 'on_end 入队' },
        { from: 'bsp', to: 'otlp', label: '每 5 秒批量' },
        { from: 'otlp', to: 'recv', label: 'gRPC 上报' },
        { from: 'recv', to: 'mem', label: 'pdata 流入' },
        { from: 'mem', to: 'batch', label: '限流通过' },
        { from: 'batch', to: 'exp', label: '攒批路由' },
        { from: 'exp', to: 'store', label: '写入查询' },
      ],
      note: '应用侧与 Collector 侧各有一道 batch 缓冲，双重攒批是 OTel 扛住高流量的核心手段。',
    },
  },
  sequence: {
    intro:
      'Agent 的 LLM 调用：start_span 时 SDK 即做 should_sample 采样，Span 结束入批量队列，再由导出器 POST /v1/traces 上报 Collector。',
    diagram: {
      actors: [
        { id: 'app', label: 'Agent 应用', kind: 'agent' },
        { id: 'api', label: 'OTel API', kind: 'system' },
        { id: 'sdk', label: 'OTel SDK', kind: 'system' },
        { id: 'col', label: 'Collector', kind: 'external' },
        { id: 'backend', label: 'Jaeger', kind: 'external' },
      ],
      messages: [
        { from: 'app', to: 'api', label: 'start_span 埋点' },
        { from: 'api', to: 'sdk', label: 'should_sample 决策' },
        { from: 'app', to: 'app', label: '执行 LLM 工具调用' },
        { from: 'app', to: 'api', label: 'span.end 写属性' },
        { from: 'sdk', to: 'sdk', label: 'on_end 入队攒批' },
        { from: 'sdk', to: 'col', label: 'POST /v1/traces' },
        { from: 'col', to: 'backend', label: '批处理路由写入' },
        { from: 'col', to: 'sdk', label: '200 ACK', dashed: true },
      ],
      note: '头部采样在 start_span 瞬间完成，跨服务时 traceparent 头随请求注入，下游提取后接续同一 Trace。',
    },
  },
  extension: [
    {
      title: '自定义 SpanProcessor',
      desc: '实现 on_start / on_end 钩子，在 Span 生命周期内富化属性、过滤敏感字段或按规则丢弃；多个处理器可链式组合，先执行的处理结果向后传递。',
    },
    {
      title: '自定义 Exporter',
      desc: '实现 SpanExporter / MetricExporter 等接口，把遥测数据发往私有存储或内部平台；只要遵循信号数据模型，任何协议与目的地都能接入。',
    },
    {
      title: '自定义 Instrumentation',
      desc: '为内部框架或私有库编写埋点包，复用 OTel API 生成标准 Span；打包发布后 opentelemetry-instrument 可自动发现并加载，业务代码零侵入。',
    },
    {
      title: 'Collector 插件',
      desc: '用 Go 编写自定义 Receiver / Processor / Exporter 组件，通过 OCB 构建工具编译进专属 Collector 发行版，实现私有协议接入与定制路由策略。',
    },
  ],
  challenges: [
    {
      title: '高基数属性爆炸',
      desc: 'gen_ai.* 中会话 ID、用户 ID 等高基数字段若直接写入指标标签，会撑爆时序数据库；需在 View 聚合与 Span 属性之间精细划分字段去向。',
    },
    {
      title: '采样策略取舍',
      desc: '头部采样简单但会丢掉低频错误链路；Collector 尾部采样需缓存完整 Trace 再决策，带来显著内存与延迟压力，策略需按业务调优。',
    },
    {
      title: '上下文跨边界传播',
      desc: '异步任务、消息队列与多语言服务之间传递 traceparent / baggage 极易断链，每个边界都要正确注入与提取，全链路治理成本高。',
    },
    {
      title: 'GenAI 约定持续演进',
      desc: 'gen_ai.* 语义约定仍处 Development 阶段，字段名随版本变化；instrumentation 与后端看板都要跟随升级，存在长期的兼容性维护负担。',
    },
  ],
  positioning:
    'OpenTelemetry 是 CNCF 旗下、由 OpenTracing 与 OpenCensus 合并而成的可观测性事实标准，覆盖 Trace、Metrics、Logs 三大信号的 API、SDK、OTLP 协议与 Collector，本身不存储数据。它的战略价值在于把「埋点」与「后端」解耦：业务一次埋点，Jaeger、Tempo、Datadog、Phoenix 等任意兼容后端随意切换，避免厂商锁定。随着 GenAI 语义约定的推进，它正从云原生基础设施标准延伸为 LLM 与 Agent 可观测性的通用底座——模型名、token 用量、工具调用都有了跨框架的统一字段。在 Agent Harness 技术栈中，它是观测层的地基：LangSmith、Phoenix 等上层平台均支持 OTLP 接入，Agent 的链路与成本数据最终都汇流于此标准之上。',
  landscape: {
    intro:
      'OTel 处于版图枢纽：向上继承 W3C 标准与 OpenTracing 遗产，向下只凭 OTLP 对接 Jaeger、Tempo、Datadog 与 Phoenix 等后端，厂商中立由此成立。',
    diagram: {
      direction: 'LR',
      cols: 3,
      rows: 4,
      nodes: [
        { id: 'w3c', label: 'W3C', sub: 'tracecontext', kind: 'external', col: 1, row: 1, group: '上游与标准' },
        { id: 'legacy', label: '前身项目', sub: 'OpenTracing 等', kind: 'external', col: 1, row: 2, group: '上游与标准' },
        { id: 'k8s', label: 'K8s 生态', sub: 'Kubernetes', kind: 'external', col: 1, row: 3, group: '上游与标准' },
        { id: 'api', label: 'OTel API', sub: '多语言 SDK', kind: 'core', col: 2, row: 1, group: '本项目' },
        { id: 'otlp', label: 'OTLP 协议', sub: 'gRPC HTTP', kind: 'data', col: 2, row: 2, group: '本项目' },
        { id: 'col', label: '收集器', sub: 'Collector 管线', kind: 'core', col: 2, row: 3, group: '本项目' },
        { id: 'jaeger', label: 'Jaeger', sub: '链路存储', kind: 'external', col: 3, row: 1, group: '下游应用' },
        { id: 'tempo', label: 'Tempo', sub: 'Grafana 系', kind: 'external', col: 3, row: 2, group: '下游应用' },
        { id: 'datadog', label: 'Datadog', sub: '商业 APM', kind: 'external', col: 3, row: 3, group: '下游应用' },
        { id: 'phoenix', label: 'Phoenix', sub: 'LLM 观测', kind: 'external', col: 3, row: 4, group: '下游应用' },
      ],
      edges: [
        { from: 'w3c', to: 'api', label: '传播标准' },
        { from: 'legacy', to: 'api', label: '合并演进' },
        { from: 'k8s', to: 'col', label: 'Sidecar 部署' },
        { from: 'api', to: 'otlp', label: '埋点数据' },
        { from: 'otlp', to: 'col', label: '4317 上报' },
        { from: 'col', to: 'jaeger', label: 'OTLP 导出' },
        { from: 'col', to: 'tempo', label: 'OTLP 导出' },
        { from: 'col', to: 'datadog', label: 'OTLP 接入' },
        { from: 'col', to: 'phoenix', label: 'GenAI 语义' },
      ],
      note: '上游是标准与遗产，下游是存储与分析，中间只认 OTLP，枢纽位置就是护城河。',
    },
  },
  competitors: [
    {
      name: 'Datadog APM',
      relation: '直接竞品',
      diff: '商业一体化 SaaS，探针开箱即用、体验顺滑，但数据与计费锁定在自家平台，成本随流量持续上涨。',
    },
    {
      name: 'Jaeger / Grafana Tempo',
      relation: '互补共存',
      diff: '它们是 Trace 存储与查询后端，不定义采集标准；通常作为 OTLP 的下游与 OTel 配套部署。',
    },
    {
      name: 'OpenInference',
      relation: '互补共存',
      diff: 'Arize 主导的 LLM 语义规范，在 gen_ai.* 之上细化 RAG 与 Agent 属性，可与 OTel 属性共存混用。',
    },
    {
      name: 'Apache SkyWalking',
      relation: '相邻替代',
      diff: '国产 APM，探针、存储与看板一体化交付；与 OTel「标准与后端分离」的开放路线形成不同取舍。',
    },
  ],
  mechanism: [
    {
      title: 'tracecontext 传播',
      desc: 'W3C tracecontext 规定 traceparent 头格式为 版本-trace_id-span_id-flags，采样位写在 flags 末位；SDK 的 Propagator 在发出请求时 inject 当前 SpanContext，接收方 extract 后以其为父 Span，Trace 由此跨进程接续。SpanContext 本身不可变，只携带 trace_id、span_id 与 trace_flags，业务键值对则走独立的 baggage 头。',
    },
    {
      title: '批量处理器缓冲',
      desc: 'BatchSpanProcessor 在 Span 结束的 on_end 回调中把它推入内存队列（默认 2048 条，满则丢弃新 Span）；独立 worker 线程每 5 秒唤醒，从队首取至多 512 条编码成一批交给导出器，单次导出超时 30 秒。force_flush 与 shutdown 会强制排空队列，保证进程退出前缓冲数据尽量落地。',
    },
    {
      title: 'Collector 管线',
      desc: 'Collector 用 service.pipelines 按信号声明式组装流水线：receiver 在 4317/4318 端口收 OTLP 并解码为内部 pdata 结构，processor 链（memory_limiter、batch、attributes 等）依序原地修改或丢弃数据，exporter 再编码发往后端。同一数据可进多条 pipeline，一条 pipeline 也能配多个 exporter 广播。',
    },
    {
      title: '头部与尾部采样',
      desc: '头部采样在 Span 创建瞬间由 SDK 的 Sampler 决定，parentbased 系列跟随上游 traceparent 的采样位，决策零成本但看不到请求结局；尾部采样由 Collector 的 tail_sampling processor 把同一 Trace 的 Span 缓存在内存，等凑齐或超时后按错误、延迟等策略整体取舍，更聪明但吃内存与吞吐。',
    },
  ],
  sourceLayout: [
    { path: 'opentelemetry-api', role: '抽象 API 与 no-op 实现，埋点库的唯一依赖' },
    { path: 'opentelemetry-sdk', role: 'API 参考实现：Provider、采样器、资源与配置' },
    {
      path: 'opentelemetry-sdk/src/opentelemetry/sdk/trace',
      role: 'Span、Sampler 与 Batch/Simple SpanProcessor 实现',
    },
    { path: 'opentelemetry-semantic-conventions', role: '由语义约定 YAML 生成的属性常量代码' },
    { path: 'exporter', role: 'OTLP gRPC/HTTP、Zipkin、Prometheus 等导出器包' },
    { path: 'propagator', role: 'B3、Jaeger 等第三方上下文传播器扩展' },
    { path: 'opentelemetry-proto', role: 'OTLP protobuf 定义及生成的 Python 代码' },
  ],
  tradeoffs: [
    {
      title: 'API 与 SDK 分层',
      choice: '库只依赖 API，应用选定 SDK',
      reason: '官方 README 明确：产出遥测的库只应依赖 opentelemetry-api，SDK 选择权交给应用开发者。埋点库因此不绑定具体实现、避免依赖冲突，全应用的采样与导出策略才能统一收口。',
    },
    {
      title: 'OTLP 而非直写后端',
      choice: '统一 OTLP 协议先送 Collector',
      reason: '埋点与后端解耦是 OTel 的核心承诺：应用只讲 OTLP，批处理、重试、脱敏与多后端路由全部下沉到 Collector，更换观测后端时业务代码零改动，从根上避免厂商锁定。',
    },
    {
      title: '批量导出优先',
      choice: '默认 BatchSpanProcessor 异步批量',
      reason: '官方建议生产环境使用批量处理器：合并导出摊薄网络开销、避免埋点阻塞业务线程；代价是进程崩溃时队列中未导出的数据会丢，因此仅调试场景用逐条发送的 SimpleSpanProcessor。',
    },
  ],
  production: [
    {
      title: 'Agent 与 Gateway 两层部署',
      desc: '官方部署文档推荐组合使用：agent 模式以 DaemonSet 或 sidecar 贴紧应用收集本机遥测，gateway 模式作为独立集群统一接收，集中做批处理、路由与降采样后再转发后端。',
    },
    {
      title: '尾部采样需按 Trace 路由',
      desc: 'tail_sampling 只有同一 Trace 的全部 Span 到达同一实例才能正确决策；多实例 gateway 前必须加 loadbalancing exporter，以 traceID 为 routing_key 做一致性路由，否则链路被拆散。',
    },
    {
      title: '语义约定灰度开关',
      desc: 'OTEL_SEMCONV_STABILITY_OPT_IN 以逗号分隔类别值（http、database、gen_ai_latest_experimental）切到新约定；默认仍发旧字段，升级埋点库而未同步后端看板是字段断更的常见坑。',
    },
    {
      title: '采样率分层控成本',
      desc: 'SDK 默认 parentbased_always_on；生产常以 OTEL_TRACES_SAMPLER=parentbased_traceidratio 配 OTEL_TRACES_SAMPLER_ARG 定比例做头部降采样，gateway 层再尾部采样保住错误链路，双层控制数据量与成本。',
    },
  ],
  en: {
    tagline:
      'The vendor-neutral observability standard: instrument traces, metrics, and logs once — including GenAI calls — and export to any backend.',
    summary:
      'OpenTelemetry is the CNCF-backed, vendor-neutral standard for observability, merging OpenTracing and OpenCensus. Its layered design separates a stable instrumentation API from the SDK that handles sampling, aggregation, and export. Telemetry travels over OTLP to the Collector, whose receiver-processor-exporter pipelines batch, sanitize, and route data to any backend — Jaeger, Tempo, Prometheus, or commercial platforms. For agent systems, the emerging GenAI semantic conventions standardize attributes like model name, token usage, and session IDs, so LLM and tool calls become uniformly traceable across frameworks. W3C tracecontext propagation stitches cross-service calls into end-to-end traces, eliminating vendor lock-in.',
  },
}
