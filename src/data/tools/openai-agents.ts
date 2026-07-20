import type { ToolDetail } from '../toolDetail'

/**
 * OpenAI Agents SDK 详情数据
 * 事实来源：
 * - GitHub README: https://github.com/openai/openai-agents-python（pip install openai-agents、Python 3.10+、Runner.run_sync hello world）
 * - 官方文档首页: https://openai.github.io/openai-agents-python/（Agent/Handoff/Guardrails/Tracing 原语、Agent loop、Sessions）
 * - Handoffs 文档: https://openai.github.io/openai-agents-python/handoffs/（handoffs 参数、transfer_to_<agent> 工具形态）
 * - Tracing 文档: https://openai.github.io/openai-agents-python/tracing/（默认开启、Traces 面板、外部 processor 列表）
 */
export const openaiAgentsDetail: ToolDetail = {
  toolId: 'openai-agents',
  tagline: 'OpenAI 官方轻量 Agent 框架，少量原语覆盖多 Agent',
  problem:
    '自己手写 Agent 循环，很快就要重复处理一堆横切问题：工具 schema 的生成与参数校验、多轮工具结果的回灌、多 Agent 之间的分工移交、输入输出的安全校验、执行过程的追踪调试。OpenAI Agents SDK 是其实验项目 Swarm 的生产级升级版：用 Agent、Handoff、Guardrails、Tracing 这一小组正交原语封装这些通用能力，让开发者专注业务指令与工具实现，而不是重复搭建脚手架。',
  architecture: [
    {
      title: 'Agent 原语',
      desc: 'Agent = 名称 + instructions + 模型 + 工具 + handoffs 的封装单元，是框架最小的调度对象；定义即普通 Python 对象，没有隐藏魔法。',
    },
    {
      title: 'Agent Loop 循环',
      desc: 'Runner 内置执行循环：调用模型、解析并执行工具调用、把结果回灌给模型，直到产出最终回答；提供 run / run_sync / run_streamed 三种入口。',
    },
    {
      title: 'Handoff 移交',
      desc: 'handoff 对 LLM 表现为名为 transfer_to_<agent> 的工具，模型自主判断时机，把对话控制权转交给更专业的 Agent，实现轻量多 Agent 协作。',
    },
    {
      title: 'Guardrails 护栏',
      desc: '输入与输出校验和 Agent 执行并行运行，一旦不通过立即中断（fail fast），用于拦截越界请求、PII 泄漏等风险，不拖慢正常请求。',
    },
    {
      title: 'Tracing 追踪',
      desc: '追踪默认开启，自动记录 LLM 调用、工具调用、guardrail 与 handoff 等 span，可在 OpenAI Traces 面板回放，也支持导出到 Langfuse 等后端。',
    },
  ],
  quickStart: {
    install: 'pip install openai-agents',
    code: `from agents import Agent, Runner

spanish_agent = Agent(
    name="Spanish agent",
    instructions="你只负责用西班牙语回答。",
)
triage_agent = Agent(
    name="Triage agent",
    instructions="检测用户语言，必要时移交给对应 Agent。",
    handoffs=[spanish_agent],  # 对 LLM 表现为 transfer_to_spanish_agent 工具
)

result = Runner.run_sync(triage_agent, "Hola, ¿cómo estás?")
print(result.final_output)`,
    lang: 'python',
    note: '需要 Python 3.10+；运行前设置 OPENAI_API_KEY 环境变量。示例演示最小 Agent + Handoff 形态，完整版见官方文档。',
  },
  useCases: [
    {
      title: '客服分诊系统',
      desc: 'Triage Agent 识别用户意图后 handoff 给账单、退款等专职 Agent；每个 Agent 只维护自己的 instructions 与工具，职责清晰、易于扩展。',
    },
    {
      title: '工具型任务助手',
      desc: '用 @function_tool 把搜索、查库等 Python 函数包装成工具，schema 自动生成、参数经 Pydantic 校验，几行代码让 Agent 获得真实行动力。',
    },
    {
      title: '面向外部用户的产品',
      desc: '用 Guardrails 对输入输出做并行校验，拦截越狱与不合规内容；配合内置 Tracing 在 Traces 面板持续监控线上 Agent 行为。',
    },
  ],
  ecosystem: [
    'OpenAI Responses API',
    'Chat Completions',
    'LiteLLM 100+ 模型',
    'MCP',
    'Sessions 会话记忆',
    'Realtime 语音 Agent',
    'Pydantic',
  ],
  resources: [
    { label: 'GitHub 仓库', url: 'https://github.com/openai/openai-agents-python' },
    { label: '官方文档', url: 'https://openai.github.io/openai-agents-python/' },
    { label: 'Handoffs 指南', url: 'https://openai.github.io/openai-agents-python/handoffs/' },
    { label: 'Tracing 指南', url: 'https://openai.github.io/openai-agents-python/tracing/' },
  ],
  articles: [
    {
      title: 'A practical guide to building agents',
      author: 'OpenAI',
      source: 'OpenAI 官方指南',
      url: 'https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/',
      note: '官方34页指南：设计三要素、编排与护栏方法论，示例全部基于Agents SDK',
    },
    {
      title: 'Building effective agents',
      author: 'Erik Schluntz & Barry Zhang',
      source: 'Anthropic 工程博客',
      url: 'https://www.anthropic.com/engineering/building-effective-agents',
      note: 'Anthropic经典对照：workflow与agent之分，何时该用Agent',
    },
    {
      title: 'Orchestrating Agents: Routines and Handoffs',
      author: 'OpenAI',
      source: 'OpenAI Cookbook',
      url: 'https://cookbook.openai.com/examples/orchestrating_agents',
      note: '源头：routines与handoffs最小实现，Agents SDK的设计原型',
    },
    {
      title: 'New tools for building agents',
      author: 'OpenAI',
      source: 'OpenAI 官方博客',
      url: 'https://openai.com/index/new-tools-for-building-agents/',
      note: '官方发布文：SDK与Responses API的设计动机、原语与案例',
    },
  ],
  faq: [
    {
      q: '必须使用 OpenAI 的模型吗？',
      a: '不是。SDK 默认走 OpenAI Responses API，也兼容 Chat Completions，并可通过官方 LiteLLM 集成接入 100+ 第三方模型——框架本身是 provider-agnostic 的，在非 OpenAI 模型下同样可以使用追踪能力。',
    },
    {
      q: '和 LangGraph 这类框架有什么区别？',
      a: 'Agents SDK 抽象更少、心智负担低，适合标准工具调用与多 Agent 移交场景，几行代码即可跑通；LangGraph 提供底层状态图编排与持久化控制，更适合复杂分支与精细状态管理的长流程。',
    },
    {
      q: '如何查看与调试 Agent 的执行过程？',
      a: '追踪默认开启：每次运行的 LLM 调用、工具调用与 handoff 都会记录为 span，可在 OpenAI Traces 面板可视化回放；也可通过自定义 processor 导出到 Langfuse、LangSmith 等第三方后端。',
    },
  ],
}
