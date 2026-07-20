import type { ToolDetail } from '../toolDetail'

/**
 * Microsoft AutoGen 详情
 * 事实来源：microsoft/autogen GitHub 与 AutoGen 官方文档（stable 版 AgentChat Quickstart）
 */
export const autogenDetail: ToolDetail = {
  toolId: 'autogen',
  tagline: '用对话驱动多 Agent 协作的微软开源框架',
  problem:
    '单个 LLM Agent 的能力存在天花板：一段系统提示很难同时装下规划、执行、评审等多种职责，复杂任务容易在一条对话里跑偏。AutoGen 把任务拆给多个分工明确的 Agent，让它们通过结构化消息往返协作——谁发言、用哪个模型、挂哪些工具、何时终止，都有工程化控制点，把"一个全能助手"升级为"一支可编排的 Agent 团队"，人类也能随时加入对话。',
  architecture: [
    {
      title: '分层 API 设计',
      desc: 'autogen-core 是事件驱动的 Actor 运行时，负责消息与生命周期；autogen-agentchat 提供 AssistantAgent、Team 等高层抽象。',
    },
    {
      title: '对话驱动协作',
      desc: 'Agent 之间通过结构化消息（文本、工具调用、执行结果）通信，任务本身即一段对话：每个 Agent 读取共享上下文后发言或调用工具，逐步把任务推向完成。',
    },
    {
      title: 'Team 发言编排',
      desc: 'RoundRobinGroupChat 轮流发言，SelectorGroupChat 由模型动态挑选发言人，GraphFlow 支持自定义工作流图，覆盖多种协作拓扑。',
    },
    {
      title: '可组合终止条件',
      desc: '用 TextMentionTermination、MaxMessageTermination 等条件声明"何时算完成"，多条件可用逻辑运算组合，防止对话失控空转。',
    },
  ],
  quickStart: {
    install: 'pip install -U "autogen-agentchat" "autogen-ext[openai]"',
    code: `import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.conditions import TextMentionTermination
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_ext.models.openai import OpenAIChatCompletionClient

async def main() -> None:
    model = OpenAIChatCompletionClient(model="gpt-4o")
    writer = AssistantAgent(name="writer", model_client=model, system_message="你是撰稿人，按评审意见修改文案。")
    critic = AssistantAgent(name="critic", model_client=model, system_message="你是评审，文案合格后只回复 TERMINATE。")
    team = RoundRobinGroupChat([writer, critic], termination_condition=TextMentionTermination("TERMINATE"))
    await team.run(task="写一句关于多智能体协作的标语")
    await model.close()

asyncio.run(main())`,
    lang: 'python',
    note: '示例基于官方 AgentChat 文档精简为双 Agent 团队形态；需 Python 3.10+ 并配置 OPENAI_API_KEY。',
  },
  useCases: [
    {
      title: '复杂任务分解协作',
      desc: '把研究、编码、评审等职责分给不同 Agent：研究员检索资料、程序员编写并执行代码、评审把关质量，通过群聊协作完成单 Agent 难以胜任的长链路任务。',
    },
    {
      title: '人机协同工作流',
      desc: '人类可作为对话一方随时介入：审批关键决策、补充领域知识或纠正方向，适合需要专业判断兜底的内容生产与决策辅助场景。',
    },
    {
      title: '协作范式试验台',
      desc: '作为微软研究院主导的项目，AutoGen 是验证角色设计、发言机制、工具组合等多 Agent 协作范式的首选框架，配套论文与原型迭代非常活跃。',
    },
  ],
  ecosystem: [
    'AgentChat',
    'autogen-core',
    'autogen-ext 扩展',
    'AutoGen Studio',
    'OpenAI / Azure OpenAI',
    'MCP 工具接入',
    'OpenTelemetry Tracing',
  ],
  resources: [
    { label: 'GitHub 仓库', url: 'https://github.com/microsoft/autogen' },
    { label: '官方文档', url: 'https://microsoft.github.io/autogen/stable/' },
    {
      label: 'AgentChat Quickstart',
      url: 'https://microsoft.github.io/autogen/stable//user-guide/agentchat-user-guide/quickstart.html',
    },
    { label: 'PyPI: autogen-agentchat', url: 'https://pypi.org/project/autogen-agentchat/' },
  ],
  articles: [
    {
      title: 'AutoGen: Enabling next-generation large language model applications',
      author: 'Microsoft Research',
      source: 'Microsoft Research 官方博客',
      url: 'https://www.microsoft.com/en-us/research/blog/autogen-enabling-next-generation-large-language-model-applications/',
      note: '官方首篇发布文，阐述多智能体对话框架的设计初衷与核心协作范式。',
    },
    {
      title:
        'AutoGen v0.4: Reimagining the foundation of agentic AI for scale, extensibility, and robustness',
      author: 'Microsoft Research',
      source: 'Microsoft Research 官方博客',
      url: 'https://www.microsoft.com/en-us/research/blog/autogen-v0-4-reimagining-the-foundation-of-agentic-ai-for-scale-extensibility-and-robustness/',
      note: '读懂 0.4 重写的动机：异步事件驱动架构、分层 API 与可观测性设计。',
    },
    {
      title: 'Magentic-One: A Generalist Multi-Agent System for Solving Complex Tasks',
      author: 'Adam Fourney, Gagan Bansal, Hussein Mozannar, Victor Dibia, Saleema Amershi',
      source: 'Microsoft Research 官方博客',
      url: 'https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/',
      note: 'Magentic-One 发布文：Orchestrator 双循环与五智能体分工的权威解读。',
    },
    {
      title: 'Building effective agents',
      author: 'Erik Schluntz & Barry Zhang',
      source: 'Anthropic 工程博客',
      url: 'https://www.anthropic.com/engineering/building-effective-agents',
      note: 'Agent 工程经典：何时上多智能体、Orchestrator-Workers 模式的务实权衡。',
    },
  ],
  faq: [
    {
      q: 'AutoGen 0.2 与 0.4+ 的 API 有什么区别？',
      a: '0.4 是完全重写：底层改为事件驱动的 Actor 架构（autogen-core），上层 AssistantAgent、Team 等 API 全部异步化，旧版 pyautogen 包的用法不再兼容。新项目请直接使用 autogen-agentchat 包，存量代码需参考官方迁移指南改造。',
    },
    {
      q: '必须使用 OpenAI 的模型吗？',
      a: '不是。autogen-ext 扩展提供 Azure OpenAI、Anthropic、Ollama、Google 等多种模型客户端，任何实现 ChatCompletionClient 接口的模型都可接入，也可以经 LiteLLM 等模型网关统一调用国产模型。',
    },
    {
      q: '如何观察多 Agent 对话的执行过程？',
      a: '开发期可用 autogen_agentchat.ui 的 Console 把消息流实时打印到终端；生产环境 autogen-core 内置 OpenTelemetry 追踪，可将 Trace 导出到 Phoenix 等后端逐步回放分析。',
    },
  ],
}
