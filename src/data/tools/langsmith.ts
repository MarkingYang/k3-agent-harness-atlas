import type { ToolDetail } from '../toolDetail'

/**
 * LangSmith 详情数据
 * 事实来源：langchain-ai/langsmith-sdk README（GitHub）、LangSmith 官方文档
 */
export const langsmithDetail: ToolDetail = {
  toolId: 'langsmith',
  tagline: 'Agent 全生命周期的调试与运维平台',
  problem:
    'LLM 应用由多步链式调用构成：一次请求会触发检索、多轮推理与工具调用，任一步出错都会导致最终结果失败，而传统日志只有零散文本，无法还原完整过程。LangSmith 提供端到端 Trace 记录与可视化调试，配合 Prompt 版本管理、数据集评估与线上监控，让开发者精确定位失败步骤、度量质量变化，把“看不见的 Agent 行为”变成可检索、可评估、可告警的工程对象。',
  architecture: [
    {
      title: '环境变量接入',
      desc: '设置 LANGSMITH_TRACING 与 API Key 后，LangChain 应用自动上报 Trace；其他框架用 @traceable 装饰器或 wrap_openai 包装客户端即可接入。',
    },
    {
      title: 'Run Tree 追踪',
      desc: '每次执行被组织为一棵 Run Tree：根 Run 代表整体请求，子 Run 对应 LLM 调用、检索与工具执行，完整记录输入输出、延迟与 token 用量，支持逐级下钻定位。',
    },
    {
      title: '异步上报',
      desc: 'SDK 通过异步回调在后台批量发送 Trace 到采集端，主请求路径不被阻塞；即使 LangSmith 服务出现故障，业务应用也能正常运行，不产生额外延迟。',
    },
    {
      title: '评估监控闭环',
      desc: 'Trace 可一键加入数据集，用 LLM-as-judge 或自定义评估器做离线回归；线上流量可按采样率自动打分并配置 Webhook 告警，形成“调试—评估—监控”的质量闭环。',
    },
  ],
  quickStart: {
    install: `pip install -U langsmith
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=<your-api-key>`,
    code: `import openai
from langsmith import traceable
from langsmith.wrappers import wrap_openai

client = wrap_openai(openai.Client())

@traceable  # 自动追踪该函数及其内部调用
def pipeline(question: str) -> str:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": question}],
    )
    return resp.choices[0].message.content

pipeline("什么是 Agent Harness？")`,
    lang: 'python',
    note: '需先在 smith.langchain.com 注册并创建 API Key；示例基于官方 Quickstart 精简。',
  },
  useCases: [
    {
      title: '调试复杂链式调用',
      desc: '当 Agent 输出不符合预期时，沿 Run Tree 逐级检查每一步的输入输出与中间状态，快速区分是检索召回不当、Prompt 问题还是工具执行失败。',
    },
    {
      title: 'Prompt 版本回归',
      desc: '在 Prompt Hub 中集中管理 Prompt 的版本与协作，改动后先在评测数据集上跑离线实验对比效果，达标再发布，避免“凭感觉上线”。',
    },
    {
      title: '生产质量监控',
      desc: '对线上流量配置在线评估器按采样自动打分，在仪表板持续跟踪延迟、成本与错误率，质量出现衰退或漂移时通过 Webhook 触发告警。',
    },
  ],
  ecosystem: [
    'LangChain / LangGraph',
    'OpenAI SDK',
    'Anthropic',
    'OpenTelemetry',
    'Prompt Hub',
    'LLM-as-judge',
    'Self-hosted',
  ],
  resources: [
    { label: 'GitHub：langsmith-sdk', url: 'https://github.com/langchain-ai/langsmith-sdk' },
    { label: '官方文档', url: 'https://docs.smith.langchain.com/' },
    { label: 'Observability 概念', url: 'https://docs.langchain.com/langsmith/observability' },
    { label: '产品官网', url: 'https://www.langchain.com/langsmith' },
  ],
  articles: [
    {
      title: 'Your AI Product Needs Evals',
      author: 'Hamel Husain',
      source: "Hamel's Blog",
      url: 'https://hamel.dev/blog/posts/evals/',
      note: '评估体系方法论经典：三级评估框架，文中直接以 LangSmith 管理 Trace',
    },
    {
      title:
        'Announcing LangSmith, a unified platform for debugging, testing, evaluating, and monitoring your LLM applications',
      author: 'LangChain 团队',
      source: 'LangChain 官方博客',
      url: 'https://blog.langchain.dev/announcing-langsmith/',
      note: '官方阐述 LangSmith 的设计初衷与调试、测试、评估、监控四大能力',
    },
    {
      title: 'Regression Testing with LangSmith',
      author: 'LangChain 团队',
      source: 'LangChain 官方博客',
      url: 'https://blog.langchain.dev/regression-testing/',
      note: '官方讲解 LangSmith 回归测试流程与多实验对比视图的设计思路',
    },
    {
      title: 'Evaluating the Effectiveness of LLM-Evaluators (aka LLM-as-Judge)',
      author: 'Eugene Yan',
      source: 'eugeneyan.com',
      url: 'https://eugeneyan.com/writing/llm-evaluators/',
      note: 'LLM-as-Judge 综述经典，涵盖用法、偏差与对齐策略，评估器必读',
    },
  ],
  faq: [
    {
      q: '必须使用 LangChain 才能用 LangSmith 吗？',
      a: '不需要。LangSmith 是独立的托管平台，与 LangChain/LangGraph 有原生集成，但 SDK 提供的 @traceable 装饰器与 wrap_openai 包装可用于任何 Python / TypeScript 应用，也支持通过 OpenTelemetry 接入现有可观测管线。',
    },
    {
      q: '上报 Trace 会影响线上性能吗？',
      a: '不会。SDK 采用异步回调在后台批量发送数据，主请求路径无阻塞；LangSmith 服务异常时应用照常运行。对数据驻留有要求的团队可选择自托管或 BYOC 部署，让 Trace 数据留在自己的环境中。',
    },
    {
      q: 'LangSmith 是开源软件吗？',
      a: '平台本身是 LangChain 公司的商业产品，GitHub 上开源的是 Python / JS SDK。平台提供免费开发者额度，企业版支持自托管。若需要完全开源、可本地运行的替代方案，可对照同层的 Arize Phoenix。',
    },
  ],
}
