import type { ToolDetail } from '../toolDetail'

/**
 * OpenViking 详情数据
 * 事实来源：volcengine/OpenViking GitHub README 与官方文档（openviking.ai/docs）
 * 官方定位：为 AI Agent 而生的开源上下文数据库（Context Database）
 */
export const openvikingDetail: ToolDetail = {
  toolId: 'openviking',
  tagline: '为 AI Agent 而生的开源上下文数据库',
  problem:
    'Agent 的记忆、资源与技能常散落于代码与向量库各处；长程任务不断产出上下文，截断压缩必然丢信息；传统 RAG 平铺存储缺全局视野、检索黑箱难调。OpenViking 是火山引擎开源的 Agent 上下文数据库：用文件系统范式把记忆、资源、技能统一组织为 viking:// 虚拟目录，配合分层加载与目录递归检索，让 Agent 大脑像本地文件般可管理。',
  architecture: [
    {
      title: '文件系统范式',
      desc: '记忆、资源与技能统一映射为 viking:// 协议下的虚拟目录，每个条目有唯一 URI；Agent 可像开发者一样用 ls、find、grep 等标准指令精确定位与操作上下文。',
    },
    {
      title: '分层上下文加载',
      desc: '上下文写入时自动加工为三层：L0 摘要约 100 tokens 快速判断相关性，L1 概览约 2k tokens 供规划决策，L2 为完整原文按需深读，大幅降低 token 消耗。',
    },
    {
      title: '目录递归检索',
      desc: '先经意图分析生成多个检索条件，向量检索锁定高分目录后在目录内二次检索，逐层递归下探并汇总结果，兼顾语义匹配与信息所在的完整语境。',
    },
    {
      title: '检索轨迹可视',
      desc: '每次检索的目录浏览与文件定位轨迹被完整留存，可清晰回放并定位检索偏差的根源，指导检索逻辑优化，让上下文链路从黑箱变为可观测。',
    },
    {
      title: '会话自迭代',
      desc: '会话结束时可主动触发记忆提取，系统异步分析任务执行结果与用户反馈，自动更新用户偏好记忆与 Agent 经验记忆，让 Agent 越用越聪明。',
    },
  ],
  quickStart: {
    install: 'pip install openviking',
    code: `import openviking as ov

# 需先在 ~/.openviking/ov.conf 配置 Embedding 与 VLM 模型
client = ov.SyncOpenViking(path="./data")
client.initialize()

# 添加资源（支持 URL、文件或目录），映射为 viking:// 虚拟目录
result = client.add_resource(path="https://github.com/volcengine/OpenViking")
root_uri = result["root_uri"]

client.wait_processed()  # 等待语义处理完成（生成 L0/L1 层）
results = client.find("what is openviking", target_uri=root_uri)
for r in results.resources:
    print(r.uri, r.score)

client.close()`,
    lang: 'python',
    note: '示例基于官方 Quickstart 精简；也可改用 openviking-server 服务 + ov CLI 方式操作。',
  },
  useCases: [
    {
      title: 'Coding Agent 记忆底座',
      desc: '作为 Claude Code、OpenClaw 等编程 Agent 的记忆插件，LoCoMo 评测准确率 24.20%→82.08%，token 降约 91%。',
    },
    {
      title: '企业知识库问答',
      desc: '把文档、代码库、网页导入为结构化知识目录，多跳问答基准 HotpotQA 上 top-20 检索准确率达 91%，单次检索延迟仅约 0.23 秒。',
    },
    {
      title: '长期个性化记忆',
      desc: '跨会话沉淀用户偏好与 Agent 任务经验，自动压缩对话内容并提取长期记忆，支撑客服、陪伴等需要长期个性化的 Agent 应用。',
    },
  ],
  ecosystem: ['火山引擎 Doubao', 'OpenAI', 'Ollama', 'VikingDB', 'Claude Code', 'OpenClaw', 'VikingBot', 'Docker'],
  resources: [
    { label: 'GitHub 仓库', url: 'https://github.com/volcengine/OpenViking' },
    { label: '官方文档', url: 'https://www.openviking.ai/docs' },
    { label: '项目官网', url: 'https://www.openviking.ai' },
    { label: 'VikingMem 论文（VLDB 2026）', url: 'https://arxiv.org/abs/2605.29640' },
  ],
  articles: [
    {
      title: '挣脱上下文的枷锁：OpenViking，为 AI Agent 而生的开源上下文数据库',
      author: '火山引擎 Viking 团队',
      source: '火山引擎开发者社区',
      url: 'https://developer.volcengine.com/articles/7601061353612116004',
      note: '官方出品，系统阐述 OpenViking 设计动机、四大核心理念与文件系统范式',
    },
    {
      title: 'Effective context engineering for AI agents',
      author: 'Anthropic Applied AI team',
      source: 'Anthropic Engineering Blog',
      url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents',
      note: '上下文工程奠基长文：注意力预算、上下文腐化与压缩/笔记/子代理策略',
    },
    {
      title: 'Context Engineering for AI Agents: Lessons from Building Manus',
      author: "Yichao 'Peak' Ji",
      source: 'Manus 官方博客',
      url: 'https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus',
      note: 'Manus 实战复盘：文件系统即上下文等经验，OpenViking 设计的重要参照',
    },
    {
      title: 'Context Engineering for Agents',
      author: 'Lance Martin',
      source: 'LangChain Blog',
      url: 'https://blog.langchain.com/context-engineering-for-agents/',
      note: '梳理 write/select/compress/isolate 四大上下文工程策略与记忆实践',
    },
  ],
  faq: [
    {
      q: 'OpenViking 与传统 RAG / 向量数据库有什么区别？',
      a: '传统 RAG 把文本切片平铺进向量库，检索即结束；OpenViking 是上下文数据库，以文件系统范式统一管理记忆、资源与技能，提供 L0/L1/L2 分层加载、目录递归检索与检索轨迹可视化，并内置会话记忆的自动提取与迭代。',
    },
    {
      q: '本地运行 OpenViking 需要哪些模型与配置？',
      a: '需要一个 Embedding 模型和一个 VLM 模型：可选火山引擎豆包、OpenAI，也可用 Ollama 本地模型（openviking-server init 向导可自动检测安装）。配置文件为 ~/.openviking/ov.conf，openviking-server doctor 可随时校验。',
    },
    {
      q: '开源版与商业版 OpenViking Personal 是什么关系？',
      a: '开源版可完全本地自托管；商业版为官方托管服务，由 VikingDB 支撑更大规模存储，附带更丰富的集成与专业支持，并提供迁移工具帮助开源用户平滑迁移。',
    },
  ],
}
