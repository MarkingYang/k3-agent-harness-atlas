import type { ToolDetail } from '../toolDetail'

/**
 * Arize Phoenix 详情
 * 事实来源：Arize-ai/phoenix GitHub、arize-phoenix PyPI 与 Phoenix 官方文档
 */
export const phoenixDetail: ToolDetail = {
  toolId: 'phoenix',
  tagline: 'OpenTelemetry 原生的开源 AI 可观测平台',
  problem:
    'LLM 应用尤其是多步 Agent 如同黑盒：一次回答背后可能有多次模型调用、工具执行与检索，出错时难以判断问题出在哪一环。Phoenix 基于 OpenTelemetry 与 OpenInference 标准，把每次执行记录为结构化 Trace/Span，在本地 UI 回放完整调用链，并叠加评估与实验能力，让 Agent 调试与迭代变成可量度的工程实践。',
  architecture: [
    {
      title: 'OTel 原生采集',
      desc: '构建于 OpenTelemetry 之上，用 OpenInference 语义约定记录 LLM 调用：模型、prompt、token 用量都是标准 Span 属性，厂商中立。',
    },
    {
      title: '自动埋点生态',
      desc: 'openinference-instrumentation-* 埋点包一行 instrument() 即可自动追踪 OpenAI、AutoGen 等 25+ 框架与 SDK。',
    },
    {
      title: 'Trace 可视化 UI',
      desc: '本地或自托管的 Web UI 按项目组织 Trace：可下钻每个 Span 的输入输出、延迟与错误，支持按属性过滤与聚合统计，快速定位失败步骤与性能瓶颈。',
    },
    {
      title: '评估与实验闭环',
      desc: '内置 LLM-as-a-Judge 评估器（忠实度、相关性、幻觉检测等）、版本化数据集与 Experiments：对同一数据集反复跑实验，量化对比 prompt 与模型改动效果。',
    },
  ],
  quickStart: {
    install: 'pip install arize-phoenix arize-phoenix-otel openinference-instrumentation-openai',
    code: `import phoenix as px
from phoenix.otel import register
from openinference.instrumentation.openai import OpenAIInstrumentor
from openai import OpenAI

px.launch_app()  # 本地启动 UI：http://localhost:6006
tracer_provider = register(project_name="my-agent")
OpenAIInstrumentor().instrument(tracer_provider=tracer_provider)

client = OpenAI()
client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "用一句话介绍 Phoenix"}],
)  # 本次调用将自动作为 Trace 出现在 UI 中`,
    lang: 'python',
    note: '常驻部署可改用 phoenix serve 命令或 Docker 镜像 arizephoenix/phoenix（默认端口 6006）。',
  },
  useCases: [
    {
      title: 'Agent 调用链调试',
      desc: '把多步 Agent 的每次推理、工具调用与检索还原成可下钻的调用树，出错时沿 Span 逐层定位：是检索召回错了、prompt 不对，还是工具返回异常。',
    },
    {
      title: 'RAG 与回答质量评估',
      desc: '用内置评估器对生产 Trace 批量打分：检测幻觉、答案相关性与检索质量，无需人工逐条标注即可及时发现质量衰退。',
    },
    {
      title: 'Prompt 迭代与实验',
      desc: '在 Playground 中调参并对比多个模型，或基于版本化数据集反复跑 Experiments，用量化指标判断每次 prompt 或模型变更是否真的更好。',
    },
  ],
  ecosystem: [
    'OpenTelemetry',
    'OpenInference',
    'LangChain / LlamaIndex',
    'OpenAI / Anthropic / Bedrock',
    'arize-phoenix-evals',
    'Docker 自托管',
    'Phoenix Cloud',
    'Python / TypeScript',
  ],
  resources: [
    { label: 'GitHub 仓库', url: 'https://github.com/Arize-ai/phoenix' },
    { label: '官方文档', url: 'https://arize.com/docs/phoenix' },
    { label: 'PyPI: arize-phoenix', url: 'https://pypi.org/project/arize-phoenix/' },
    { label: 'OpenInference 项目', url: 'https://github.com/Arize-ai/openinference' },
  ],
  articles: [
    {
      title: 'LLM Observability for AI Agents and Applications',
      author: 'Arize AI',
      source: 'Arize 官方博客',
      url: 'https://arize.com/blog/llm-observability-for-ai-agents-and-applications/',
      note: '官方 101：trace/span/session 概念体系，即 Phoenix 的心智模型',
    },
    {
      title: 'Add Observability to Your Open Agent Spec Agents with Arize Phoenix',
      author: 'Arize AI',
      source: 'Arize 官方博客',
      url: 'https://arize.com/blog/add-observability-to-your-open-agent-spec-agents-with-arize-phoenix/',
      note: '官方实战：一行埋点接入 Phoenix，跨运行时对比 trace 与评估',
    },
    {
      title: 'Your AI Product Needs Evals',
      author: 'Hamel Husain',
      source: 'hamel.dev',
      url: 'https://hamel.dev/blog/posts/evals/',
      note: 'LLM 评估经典：单元测试、人工看 trace、LLM-as-Judge 三层体系',
    },
    {
      title: 'Demystifying evals for AI agents',
      author: 'Anthropic Engineering',
      source: 'Anthropic 工程博客',
      url: 'https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents',
      note: 'Anthropic 官方：agent 评估中任务、评分器与轨迹设计全景指南',
    },
  ],
  faq: [
    {
      q: 'Phoenix 收费吗？数据会离开本机吗？',
      a: 'Phoenix 是开源软件，pip 安装后可完全在本地运行，Trace 数据默认不出本机、无需注册账号，适合数据敏感的团队；Arize 另售托管版 Phoenix Cloud 与企业平台，可按需选用。',
    },
    {
      q: '我的框架不在官方支持列表里，还能接入吗？',
      a: '可以。Phoenix 接收标准 OpenTelemetry 数据：任何应用只要能发出 OTLP Trace 并指向 Phoenix 的 6006 端口即可被收集展示；也可用 phoenix.otel 提供的装饰器手动埋点，或通过 Span Processor 转换 OpenLLMetry 等其他埋点体系的数据。',
    },
    {
      q: '与 LangSmith 这类托管平台相比怎么选？',
      a: 'Phoenix 开源、可离线自托管且厂商中立，适合重视数据合规或不想绑定单一生态的团队；LangSmith 与 LangChain 生态整合更深，但属于商业托管服务。两者的 Trace 心智模型相近，可按合规要求与生态偏好选择。',
    },
  ],
}
