import type { ToolDetail } from '../toolDetail'

/**
 * Mem0 详情数据
 * 事实来源：mem0ai/mem0 GitHub README 与官方文档（docs.mem0.ai）
 * 官方定位：Universal memory layer for AI Agents
 */
export const mem0Detail: ToolDetail = {
  toolId: 'mem0',
  tagline: 'AI Agent 的通用长期记忆层',
  problem:
    'LLM 本身无状态：会话一结束，用户是谁、说过什么就被遗忘；把历史对话全量塞进 prompt 又贵又慢，还会挤爆上下文窗口。Mem0 是面向 AI Agent 的通用记忆层：自动从对话中抽取关键事实，经过去重与一致性维护后向量化存储，并在后续对话中按需召回、注入上下文，让 Agent 跨会话记住用户偏好与任务历史，越用越懂你，且 token 成本可控。',
  architecture: [
    {
      title: '事实自动抽取',
      desc: '内置 LLM 记忆管线：从对话中自动抽取关键事实（如饮食偏好、项目背景），与既有记忆比对、去重并维护一致性，全程无需人工编写规则。',
    },
    {
      title: '多级记忆作用域',
      desc: '记忆按 user_id、agent_id、run_id 分级归属，同时覆盖用户长期偏好、单次会话状态与 Agent 自身状态，检索时按作用域精确过滤。',
    },
    {
      title: '多信号混合检索',
      desc: '语义向量、BM25 关键词与实体匹配三路并行打分后融合排序，并具备时间推理能力，针对现状、过往、计划类问题返回正确时态的记忆。',
    },
    {
      title: '可插拔存储后端',
      desc: '向量库、图存储与 LLM 均可替换：默认本地 Qdrant + SQLite 开箱即用，可选 Neo4j 图记忆与多家向量库，LLM 可换 Anthropic、Ollama 等。',
    },
  ],
  quickStart: {
    install: 'pip install mem0ai',
    code: `from mem0 import Memory

# 默认使用 OpenAI，请先 export OPENAI_API_KEY="..."
m = Memory()

messages = [
    {"role": "user", "content": "Hi, I'm Alex. I love basketball and gaming."},
    {"role": "assistant", "content": "Hey Alex! I'll remember your interests."},
]
m.add(messages, user_id="alex")

results = m.search("What do you know about me?", filters={"user_id": "alex"})
print(results)`,
    lang: 'python',
    note: '官方 OSS Quickstart 核心形态；托管平台改用 MemoryClient + MEM0_API_KEY。',
  },
  useCases: [
    {
      title: '个性化 AI 助手',
      desc: '跨会话记住用户偏好、习惯与背景，让聊天助手、编程助手在每次对话中自动带上用户上下文，回答更贴合个人需求。',
    },
    {
      title: '客服与支持机器人',
      desc: '召回用户历史工单与偏好，避免重复询问；官方公布的托管平台 LoCoMo 长对话评测得分 92.5，p50 检索延迟约 0.9 秒。',
    },
    {
      title: '多 Agent 共享记忆',
      desc: '以 user_id / agent_id 为 CrewAI、LangGraph 等框架提供共享记忆层，20+ 框架开箱集成，支持 MCP 接入。',
    },
  ],
  ecosystem: ['OpenAI', 'Anthropic', 'Ollama', 'LangChain / LangGraph', 'CrewAI', 'Qdrant', 'Neo4j', 'MCP'],
  resources: [
    { label: 'GitHub 仓库', url: 'https://github.com/mem0ai/mem0' },
    { label: '官方文档', url: 'https://docs.mem0.ai' },
    { label: 'Mem0 云平台', url: 'https://app.mem0.ai' },
    { label: '论文（arXiv）', url: 'https://arxiv.org/abs/2504.19413' },
  ],
  articles: [
    {
      title: 'AI Memory Benchmarks 2026: LoCoMo, LongMemEval & BEAM',
      author: 'Mem0 团队',
      source: 'Mem0 官方博客',
      url: 'https://mem0.ai/blog/ai-memory-benchmarks-in-2026',
      note: '官方深度解读三大记忆基准的测量口径与 Mem0 得分，读分数先读这篇',
    },
    {
      title: 'Agent Memory: How to Build Agents that Learn and Remember',
      author: 'Letta',
      source: 'Letta 官方博客',
      url: 'https://www.letta.com/blog/agent-memory/',
      note: 'MemGPT 团队系统梳理记忆类型与工程化技术，与 Mem0 对照阅读',
    },
    {
      title: 'Context Engineering for Agents',
      author: 'Lance Martin',
      source: 'LangChain 官方博客',
      url: 'https://blog.langchain.com/context-engineering-for-agents/',
      note: '经典论述：写入/选择/压缩/隔离四大上下文策略，记忆是其中一环',
    },
    {
      title: 'Effective context engineering for AI agents',
      author: 'Anthropic Applied AI 团队',
      source: 'Anthropic Engineering',
      url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents',
      note: '提出 context rot 概念与压缩、结构化笔记等长程记忆技法',
    },
  ],
  faq: [
    {
      q: '开源库、自托管服务与云平台怎么选？',
      a: '官方建议：测试与原型直接用 pip 库（默认本地 Qdrant 存储）；团队自建基础设施用 Docker Compose 起自托管 Server，带控制台与 API Key；不想运维则用云平台 app.mem0.ai，功能最全。',
    },
    {
      q: 'Mem0 必须使用 OpenAI 吗？',
      a: '不必须。默认配置用 OpenAI 的 gpt-5-mini 做事实抽取、text-embedding-3-small 做向量化，但通过 Configuration 可换成 Anthropic、Ollama 等 LLM 与其他 embedding 模型，向量存储后端也可替换。',
    },
    {
      q: '官方评测数字对开源版同样适用吗？',
      a: '官方注明 LoCoMo 92.5 等成绩来自托管平台的专有优化，开源 SDK 方向一致但数值不完全相同；评测框架已开源，可自行复现验证。',
    },
  ],
}
