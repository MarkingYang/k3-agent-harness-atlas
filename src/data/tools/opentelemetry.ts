import type { ToolDetail } from '../toolDetail'

/**
 * OpenTelemetry 详情数据
 * 事实来源：opentelemetry.io 官方文档（Python Getting Started）、
 * open-telemetry/semantic-conventions 仓库 GenAI 语义约定
 */
export const opentelemetryDetail: ToolDetail = {
  toolId: 'opentelemetry',
  tagline: '厂商中立的可观测性事实标准',
  problem:
    'Agent 系统往往混合多种框架、模型与工具：若各组件都用私有格式记录链路，排查时要在几套系统间拼接，既低效又容易丢失上下文。OpenTelemetry 用厂商中立的 API 与 SDK 统一 Trace、Metrics、Logs 的采集与导出，并通过 GenAI 语义约定为 LLM 调用规定标准属性——模型名、token 用量、会话 ID 都有统一字段，一次埋点即可导出到任意兼容后端。',
  architecture: [
    {
      title: 'API 与 SDK 分层',
      desc: 'API 只定义埋点接口，SDK 负责采样、聚合与导出。应用代码面向 API 编程，更换后端时无需改动业务埋点，实现“埋点一次、后端任选”。',
    },
    {
      title: '自动埋点机制',
      desc: 'opentelemetry-instrument 配合各类 instrumentation 库，可对 Flask、requests、数据库驱动等依赖零代码自动埋点，生成标准 Span。',
    },
    {
      title: 'OTLP 收集器',
      desc: '遥测数据经 OTLP 协议发往 Collector 做批处理、脱敏与路由，再分发到多个后端；默认端点为 localhost:4317（gRPC），应用与存储彻底解耦。',
    },
    {
      title: 'GenAI 语义约定',
      desc: '为 LLM 调用定义标准属性：gen_ai.request.model 记录模型，gen_ai.usage.input_tokens 与 output_tokens 统计输入输出用量。',
    },
    {
      title: '上下文传播',
      desc: '基于 W3C Trace Context 在进程与服务之间传递链路 ID，Agent 跨框架、跨服务的多次调用可以拼接为一条端到端的完整调用链。',
    },
  ],
  quickStart: {
    install: `pip install opentelemetry-distro
opentelemetry-bootstrap -a install`,
    code: `from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter

provider = TracerProvider()
provider.add_span_processor(BatchSpanProcessor(ConsoleSpanExporter()))
trace.set_tracer_provider(provider)

tracer = trace.get_tracer("agent.tracer")

with tracer.start_as_current_span("chat gpt-4o-mini") as span:
    span.set_attribute("gen_ai.operation.name", "chat")
    span.set_attribute("gen_ai.request.model", "gpt-4o-mini")
    span.set_attribute("gen_ai.usage.input_tokens", 12)
    span.set_attribute("gen_ai.usage.output_tokens", 30)`,
    lang: 'python',
    note: 'Span 将输出到控制台；接入后端可换用 OTLP exporter，或用 opentelemetry-instrument 自动埋点。',
  },
  useCases: [
    {
      title: '统一 Agent 链路追踪',
      desc: '为 Agent 的每次 LLM 调用、工具执行与检索创建标准 Span，跨框架、跨服务拼接成完整调用链，导出到 Jaeger 或 Phoenix 中回放分析。',
    },
    {
      title: '成本与性能度量',
      desc: '持续采集延迟、错误率与 gen_ai.usage 系列 token 用量指标，按模型、功能与租户维度聚合，搭建成本看板与预算告警。',
    },
    {
      title: '多后端免锁定',
      desc: '埋点与后端解耦：今天用 Jaeger，明天换 Grafana Tempo 或 LangSmith，只需调整 Collector 的导出配置，业务代码零改动。',
    },
  ],
  ecosystem: [
    'OTLP / Collector',
    'Jaeger',
    'Grafana Tempo',
    'Prometheus',
    'Arize Phoenix',
    'LangSmith',
    'GenAI 语义约定',
  ],
  resources: [
    { label: '官方文档', url: 'https://opentelemetry.io/docs/' },
    {
      label: 'Python 快速上手',
      url: 'https://opentelemetry.io/docs/languages/python/getting-started/',
    },
    {
      label: 'GenAI 语义约定',
      url: 'https://github.com/open-telemetry/semantic-conventions/blob/main/docs/gen-ai/gen-ai-spans.md',
    },
    {
      label: 'GitHub：规范仓库',
      url: 'https://github.com/open-telemetry/opentelemetry-specification',
    },
  ],
  articles: [
    {
      title: 'Inside the LLM Call: GenAI Observability with OpenTelemetry',
      author: 'James Newton-King (Microsoft)',
      source: 'OpenTelemetry 官方博客',
      url: 'https://opentelemetry.io/blog/2026/genai-observability/',
      note: '官方演示 GenAI 语义约定从埋点、导出到可视化的完整链路，与本页字段逐一对应。',
    },
    {
      title: 'OpenTelemetry Architecture: Design Concepts',
      author: 'Nitin Rohidas',
      source: 'SigNoz 博客',
      url: 'https://signoz.io/blog/opentelemetry-architecture/',
      note: '图解 API/SDK 分层、上下文传播与 Collector 服务端架构，入门首选。',
    },
    {
      title: 'A deep dive into OpenTelemetry metrics',
      author: 'James Blackwood-Sewell',
      source: 'CNCF 博客',
      url: 'https://www.cncf.io/blog/2022/06/08/a-deep-dive-into-opentelemetry-metrics/',
      note: 'CNCF 官方深文，讲透 OTel 指标的数据模型、六类 Instrument 与聚合机制。',
    },
    {
      title: 'Logs vs Structured Events',
      author: 'Charity Majors',
      source: 'charity.wtf（作者个人博客）',
      url: 'https://charity.wtf/2019/02/05/logs-vs-structured-events/',
      note: '可观测性奠基之作：为什么现代遥测应是宽结构化事件而非日志行。',
    },
  ],
  faq: [
    {
      q: 'OpenTelemetry 是一个后端系统吗？',
      a: '不是。它是采集与传输标准，包含 API、SDK、Collector 与 OTLP 协议，本身不存储数据，需要搭配 Jaeger、Grafana、Phoenix 等后端做存储与展示。埋点与存储解耦，正是它不被单一厂商锁定的关键。',
    },
    {
      q: 'GenAI 语义约定现在稳定吗？',
      a: '目前仍处于 Development（实验）阶段，属性名可能继续演进。官方建议通过 OTEL_SEMCONV_STABILITY_OPT_IN 环境变量控制 instrumentation 发射的约定版本，升级依赖时留意对应变更说明。',
    },
    {
      q: '自动埋点和手动埋点怎么选？',
      a: '先用 opentelemetry-instrument 零代码接入，快速获得框架级 Span 与指标；再对 Agent 的关键业务步骤（如任务规划、工具选择）用 tracer.start_as_current_span 手动补充自定义属性与事件，两层叠加效果最好。',
    },
  ],
}
