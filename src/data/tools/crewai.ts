import type { ToolDetail } from '../toolDetail'

/**
 * CrewAI —— 角色扮演式多 Agent 协作框架
 * 事实来源：crewAIInc/crewAI GitHub README 与官方文档（docs.crewai.com）
 */
export const crewaiDetail: ToolDetail = {
  toolId: 'crewai',
  tagline: '角色扮演式的多 Agent 协作框架',
  problem:
    '真实任务往往超出单个 Agent 的能力边界：调研、写作、审校各有专长，让一个 Prompt 包揽全部往往质量失控。CrewAI 用"组建团队"的心智模型解决分工问题：每个 Agent 用 role / goal / backstory 明确定义职责，任务被显式分派并按顺序或层级流程协作，Agent 之间可相互委派与复核；需要确定性时再引入 Flows 做事件驱动的精确控制。框架轻量、纯 Python、可接任意模型，让多 Agent 系统从原型到生产保持同一套代码。',
  architecture: [
    {
      title: '角色三要素',
      desc: '每个 Agent 由 role（角色）、goal（目标）、backstory（背景故事）定义，职责边界清晰，LLM 据此进入"人设"执行专业分工。',
    },
    {
      title: 'Task 显式分派',
      desc: '任务用 description 与 expected_output 显式描述并绑定到 Agent，支持上下文传递、Pydantic/JSON 结构化输出与结果落盘。',
    },
    {
      title: 'Crew 协作流程',
      desc: 'Crew 把 Agent 与 Task 组装成团队：sequential 顺序执行，hierarchical 由自动指派的 Manager 规划、委派任务并校验结果。',
    },
    {
      title: 'Flows 精确控制',
      desc: '事件驱动工作流用 @start、@listen、@router 装饰器编排状态、分支与路由，可把 Crew 作为其中一步，平衡自主性与可控性。',
    },
    {
      title: '工具与生产化',
      desc: '支持自定义工具与 crewai-tools 工具包，内置记忆、知识、Checkpoint、异步执行与人工介入，并兼容 MCP / A2A 协议。',
    },
  ],
  quickStart: {
    install: "pip install crewai 'crewai[tools]'",
    code: `from crewai import Agent, Crew, Process, Task

researcher = Agent(
    role="资深行业研究员",
    goal="挖掘 {topic} 的最新进展",
    backstory="你擅长快速定位并总结最有价值的信息。",
)
research_task = Task(
    description="调研 {topic} 近期的重要动态",
    expected_output="一份 5 条要点的清单",
    agent=researcher,
)
crew = Crew(
    agents=[researcher],
    tasks=[research_task],
    process=Process.sequential,
)
crew.kickoff(inputs={"topic": "AI Agents"})`,
    lang: 'python',
    note: '需 Python >=3.10 <3.14 并配置 OPENAI_API_KEY 等模型密钥；官方推荐用 uv 安装（uv pip install crewai）。',
  },
  useCases: [
    {
      title: '调研报告流水线',
      desc: '研究员 Agent 搜集资料、分析师 Agent 撰写成稿，顺序协作输出 Markdown 报告，是官方示例中最典型的内容生产范式。',
    },
    {
      title: '业务流程自动化',
      desc: '用 Flows 把 Crew 嵌入带状态与分支的 Python 工作流，处理工单分类、数据校验、审批流转等需要确定性控制的环节。',
    },
    {
      title: '多角色复核机制',
      desc: '生成 Agent 产出初稿、审校 Agent 逐条复核，配合 human-in-the-loop 人工确认，显著降低幻觉进入交付物的风险。',
    },
  ],
  ecosystem: [
    'Python 3.10+',
    'OpenAI / 数百种 LLM',
    'crewai-tools 工具包',
    'Flows 事件驱动',
    'MCP / A2A 协议',
    'Ollama / LM Studio 本地模型',
    'YAML 项目脚手架',
  ],
  resources: [
    { label: 'GitHub 仓库', url: 'https://github.com/crewAIInc/crewAI' },
    { label: '官方文档', url: 'https://docs.crewai.com' },
    { label: '官方示例仓库', url: 'https://github.com/crewAIInc/crewAI-examples' },
    { label: '官方课程（learn.crewai.com）', url: 'https://learn.crewai.com' },
  ],
  articles: [
    {
      title: 'CrewAI OSS 1.0 - We are going GA',
      author: 'CrewAI 团队',
      source: 'CrewAI 官方博客',
      url: 'https://crewai.com/blog/crewai-oss-1-0---we-are-going-ga',
      note: '官方阐述 Crews 与 Flows 的设计哲学与 v1.0 生产化能力。',
    },
    {
      title: 'How we built our multi-agent research system',
      author: 'Anthropic',
      source: 'Anthropic Engineering',
      url: 'https://www.anthropic.com/engineering/built-multi-agent-research-system',
      note: '编排者-工作者架构、委派提示与生产可靠性的经典一手总结。',
    },
    {
      title: 'How and when to build multi-agent systems',
      author: 'Harrison Chase',
      source: 'LangChain Blog',
      url: 'https://www.langchain.com/blog/how-and-when-to-build-multi-agent-systems',
      note: '综合 Anthropic 与 Cognition 之争，讲清何时该建多智能体。',
    },
    {
      title: "Don't Build Multi-Agents",
      author: 'Walden Yan',
      source: 'Cognition Blog',
      url: 'https://cognition.ai/blog/dont-build-multi-agents',
      note: '多智能体脆弱性的经典檄文，提出上下文工程两大原则。',
    },
  ],
  faq: [
    {
      q: '必须使用 OpenAI 的模型吗？',
      a: '不是。Agent 默认走 OpenAI API，但可配置连接多种模型，也能通过 Ollama、LM Studio 等工具使用本地模型，详见官方 Connect CrewAI to LLMs 文档。',
    },
    {
      q: 'Crews 和 Flows 应该怎么选？',
      a: '需要 Agent 自主分工、动态协作用 Crews；需要精确状态管理、条件分支与确定性执行用 Flows。两者可自由组合：把一个 Crew 作为 Flow 中的单个步骤来编排。',
    },
    {
      q: '如何搭建标准项目结构？',
      a: '运行 crewai create crew <项目名> 生成官方脚手架：agents.yaml 定义角色、tasks.yaml 定义任务、crew.py 组装团队，配置好密钥后用 crewai run 一键运行。',
    },
  ],
}
