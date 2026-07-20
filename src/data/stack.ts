/**
 * Agent Harness 技术栈全景数据
 * 单一数据源：所有分区组件从这里读取层级与工具信息
 */

export type Priority = 3 | 4 | 5

export interface StackLayer {
  id: string
  /** 英文层名 */
  name: string
  /** 中文层名 */
  zhName: string
  /** 一句话定位（类比） */
  tagline: string
  /** 这一层解决什么问题的讲解 */
  description: string
  /** 主强调色（低饱和暖色系） */
  accent: string
  /** 浅底色 */
  softBg: string
}

export interface StackConcept {
  term: string
  desc: string
}

export interface StackTool {
  id: string
  /** 项目名 */
  name: string
  /** GitHub Repo 展示名 */
  repo: string
  layerId: string
  priority: Priority
  /** 核心作用 */
  coreRole: string
  /** Harness 中对应模块 */
  harnessModule: string
  /** 推荐关注重点 */
  focusPoints: string[]
  /** 通俗讲解（1-3 句） */
  summary: string
  /** 关键概念展开 */
  concepts: StackConcept[]
}

export const PRIORITY_META: Record<Priority, { label: string; desc: string }> = {
  5: { label: '核心必读', desc: '构成现代 Agent Harness 的骨架，建议深入源码级理解' },
  4: { label: '重点掌握', desc: '生产级 Agent 系统不可或缺的能力组件' },
  3: { label: '了解参考', desc: '作为产品形态与协作范式的参考实现' },
}

export const LAYERS: StackLayer[] = [
  {
    id: 'runtime',
    name: 'Agent Runtime',
    zhName: '智能体运行时',
    tagline: 'Agent 的发动机',
    description:
      '运行时负责把 LLM 包装成可执行、可控制的工作单元：定义 Agent 的步骤编排与状态流转，支持中断、恢复与人工介入。模型只负责"想"，运行时负责"把事情做完"。',
    accent: '#B45309',
    softBg: '#F7EADC',
  },
  {
    id: 'multi-agent',
    name: 'Multi-Agent Runtime',
    zhName: '多智能体协作',
    tagline: '从单个 Agent 到 Agent 团队',
    description:
      '当任务复杂到单个 Agent 难以胜任时，需要定义多个 Agent 的角色、分工与对话机制，让它们像团队一样协作：谁发言、谁决策、何时终止，都是这一层要回答的问题。',
    accent: '#8A5A33',
    softBg: '#F3EAE0',
  },
  {
    id: 'observability',
    name: 'Agent Observability',
    zhName: '可观测性',
    tagline: 'Agent 的黑匣子记录仪',
    description:
      'Agent 的每一次推理、检索与工具调用都被记录为 Trace/Span，配合指标与日志，让线上 Agent 的每一步可回放、可定位、可度量。没有可观测性，Agent 就是无法调试的黑盒。',
    accent: '#4F7247',
    softBg: '#EAF0E4',
  },
  {
    id: 'memory',
    name: 'Agent Memory',
    zhName: '记忆与知识',
    tagline: 'Agent 的记忆系统',
    description:
      '上下文窗口是有限的，而任务需要的信息是海量的。记忆层负责知识组织、上下文挑选与长期记忆沉淀，让 Agent 跨会话积累经验、记住用户偏好，而不是每次都从零开始。',
    accent: '#9C6B1E',
    softBg: '#F6EEDA',
  },
  {
    id: 'evaluation',
    name: 'Agent Evaluation',
    zhName: '评估与测试',
    tagline: 'Agent 的质量关卡',
    description:
      'LLM 输出具有不确定性，"感觉不错"不等于"可量化达标"。评估层用数据集与指标为 Agent 建立回归测试与质量门禁，让每次模型或 Prompt 变更的影响都可度量。',
    accent: '#934F5C',
    softBg: '#F5E8E9',
  },
  {
    id: 'gateway',
    name: 'Model Gateway',
    zhName: '模型网关',
    tagline: '模型总线',
    description:
      '不同厂商模型的接口、限流与计费各不相同。网关层用统一接口屏蔽差异，提供路由、重试、降级与成本追踪，让上层 Agent 代码与具体模型解耦。',
    accent: '#4A6E6A',
    softBg: '#E6EFED',
  },
  {
    id: 'protocol',
    name: 'Tool Protocol',
    zhName: '工具协议',
    tagline: 'Agent 的 USB-C 接口',
    description:
      '工具是 Agent 的手和眼。协议层为"Agent 如何发现、描述、调用外部工具与数据"定义开放标准，让工具一次实现、处处接入，避免每个框架各造一套私有集成。',
    accent: '#6E5F43',
    softBg: '#F0ECE2',
  },
  {
    id: 'sandbox',
    name: 'Sandbox Execution',
    zhName: '沙箱执行',
    tagline: 'Agent 的安全实验室',
    description:
      '让 Agent 写代码容易，让 Agent 安全地"运行"代码很难。沙箱层提供按需创建、用完即毁的隔离执行环境，让 Agent 生成的代码可以被真实运行与验证，而不危及宿主机。',
    accent: '#716252',
    softBg: '#EDEAE4',
  },
  {
    id: 'platform',
    name: 'AI Application Platform',
    zhName: '应用平台',
    tagline: '从框架到产品',
    description:
      '基础设施之上，还需要把能力组装成真正可用的产品：可视化编排、知识库管理、应用发布与运营。平台层是理解"Agent 技术如何落地为产品"的最佳参照。',
    accent: '#7C6A58',
    softBg: '#EFEBE5',
  },
]

export const TOOLS: StackTool[] = [
  {
    id: 'langgraph',
    name: 'LangGraph',
    repo: 'langchain-ai/langgraph',
    layerId: 'runtime',
    priority: 5,
    coreRole: 'Agent 工作流编排、状态管理、持久化执行',
    harnessModule: 'Agent Execution Engine',
    focusPoints: ['State Machine', 'Checkpoint', 'Human-in-the-loop', 'Durable Execution'],
    summary:
      'LangGraph 把 Agent 建模为一张"状态图"：节点是计算步骤，边是流转条件，全局状态在节点间显式传递。它让 Agent 从一段不可控的 prompt 循环，升级为可持久化、可恢复、可人工干预的确定性工作流。',
    concepts: [
      { term: 'State Machine 状态机', desc: '用图结构显式定义 Agent 的步骤与转移条件，执行路径清晰可见，避免黑盒循环失控。' },
      { term: 'Checkpoint 检查点', desc: '每一步执行后自动快照全局状态，进程崩溃后可从断点精确恢复。' },
      { term: 'Human-in-the-loop 人机协同', desc: '可在任意节点暂停执行，等待人工审批或修改状态后再继续。' },
      { term: 'Durable Execution 持久化执行', desc: '长任务可跨进程、跨天运行不丢状态，是生产级 Agent 的关键能力。' },
    ],
  },
  {
    id: 'openai-agents',
    name: 'OpenAI Agents SDK',
    repo: 'openai/openai-agents-python',
    layerId: 'runtime',
    priority: 5,
    coreRole: 'OpenAI 官方 Agent 抽象',
    harnessModule: 'Agent Runtime Core',
    focusPoints: ['Agent', 'Tool', 'Handoff', 'Guardrails', 'Tracing'],
    summary:
      'OpenAI 官方的轻量级 Agent 框架，用少量核心原语（Agent / Tool / Handoff / Guardrails）覆盖从单 Agent 到多 Agent 的常见场景，并内置 Tracing，是理解"最小可用 Agent 抽象"的最佳样本。',
    concepts: [
      { term: 'Agent', desc: '指令（Instructions）+ 工具 + 模型的封装单元，是框架的最小调度对象。' },
      { term: 'Tool', desc: '以函数调用形式赋予 Agent 行动能力，schema 自动从函数签名生成。' },
      { term: 'Handoff 移交', desc: '一个 Agent 可将对话控制权转交给更合适的 Agent，是多 Agent 协作的轻量实现。' },
      { term: 'Guardrails 护栏', desc: '对输入与输出做并行校验，拦截越界请求与不安全内容。' },
      { term: 'Tracing 追踪', desc: '内置执行追踪，每次运行的 LLM 调用与工具调用全程可视。' },
    ],
  },
  {
    id: 'autogen',
    name: 'Microsoft AutoGen',
    repo: 'microsoft/autogen',
    layerId: 'multi-agent',
    priority: 5,
    coreRole: '多 Agent 协作框架',
    harnessModule: 'Multi-Agent Orchestrator',
    focusPoints: ['Agent 协作模式', 'Role Design', 'Conversation Flow'],
    summary:
      '微软开源的多 Agent 框架，核心思想是"用对话驱动协作"：多个具备不同角色、工具与模型的 Agent 通过消息往返共同完成任务，人类也可以作为一方加入对话。',
    concepts: [
      { term: 'Agent 协作模式', desc: '支持双人对话、群聊（GroupChat）、层级协作等多种协作拓扑。' },
      { term: 'Role Design 角色设计', desc: '为每个 Agent 定义系统提示、职责边界与专属工具集，像组建真实团队一样分工。' },
      { term: 'Conversation Flow 对话流', desc: '通过发言选择机制与终止条件控制多 Agent 对话的节奏与收尾。' },
    ],
  },
  {
    id: 'phoenix',
    name: 'Arize Phoenix',
    repo: 'Arize-ai/phoenix',
    layerId: 'observability',
    priority: 5,
    coreRole: 'Agent Trace、评估、调试平台',
    harnessModule: 'Agent Observability Platform',
    focusPoints: ['Trace', 'Span', 'LLM Call 分析', '错误定位'],
    summary:
      '开源的 AI 可观测平台（OpenTelemetry 原生，可完全本地运行）。它把 Agent 的每一步推理、工具调用与检索记录成结构化的 Trace/Span，并提供评估与实验能力，堪称调试 Agent 的"X 光机"。',
    concepts: [
      { term: 'Trace 追踪', desc: '一次完整 Agent 执行的端到端记录，从用户输入到最终输出。' },
      { term: 'Span 跨度', desc: 'Trace 中的单个步骤，如一次 LLM 调用、一次工具执行、一次检索。' },
      { term: 'LLM Call 分析', desc: '查看每次模型调用的完整 prompt、响应、token 消耗与延迟分布。' },
      { term: '错误定位', desc: '沿调用链快速下钻到失败步骤，区分是检索错、推理错还是工具错。' },
    ],
  },
  {
    id: 'langsmith',
    name: 'LangSmith',
    repo: 'langchain-ai/langsmith-sdk',
    layerId: 'observability',
    priority: 5,
    coreRole: 'LangChain 商业化 Agent 运维平台',
    harnessModule: 'Agent Monitoring',
    focusPoints: ['调试', 'Prompt 管理', '线上质量分析'],
    summary:
      'LangChain 团队的商业化平台，覆盖 Agent 开发与运维全生命周期：链式调用调试、Prompt 版本管理、数据集评估，以及对生产流量的持续质量监控。',
    concepts: [
      { term: '调试', desc: '可视化每一步链式调用的输入输出与中间状态，快速复现问题会话。' },
      { term: 'Prompt 管理', desc: 'Prompt 的版本化、多人协作与一键回滚，改动全程可追溯。' },
      { term: '线上质量分析', desc: '对生产流量自动打分与聚类分析，及时发现质量衰退与漂移。' },
    ],
  },
  {
    id: 'opentelemetry',
    name: 'OpenTelemetry',
    repo: 'open-telemetry/opentelemetry-specification',
    layerId: 'observability',
    priority: 5,
    coreRole: '通用可观测标准',
    harnessModule: 'Trace/Metrics Infrastructure',
    focusPoints: ['Agent 调用链', '指标采集', '生态兼容'],
    summary:
      '云原生时代可观测性的事实标准（Trace / Metrics / Logs 三支柱），厂商中立。其 GenAI 语义约定让 LLM 与 Agent 调用也能以统一格式被任意后端采集，一次埋点、处处可查。',
    concepts: [
      { term: 'Agent 调用链', desc: '用标准 Span 属性描述模型名、token 用量、成本与工具调用，跨框架统一。' },
      { term: '指标采集', desc: '延迟、错误率、token 消耗等关键指标的持续采集与聚合。' },
      { term: '生态兼容', desc: '数据可导出到 Jaeger、Grafana、Phoenix 等任意兼容后端，不被单一厂商锁定。' },
    ],
  },
  {
    id: 'openviking',
    name: 'OpenViking',
    repo: 'volcengine/OpenViking',
    layerId: 'memory',
    priority: 4,
    coreRole: 'Agent 原生知识库与上下文管理',
    harnessModule: 'Memory Control Plane',
    focusPoints: ['Context Management', 'Knowledge Organization', 'Agent Memory'],
    summary:
      '面向 Agent 的数据与上下文管理层：把文档、对话与事实组织成 Agent 可直接消费的上下文，系统化地回答"该给 Agent 喂什么信息、喂多少、以什么结构喂"的问题。',
    concepts: [
      { term: 'Context Management 上下文管理', desc: '在有限的上下文窗口内挑选、压缩与排序最相关的信息。' },
      { term: 'Knowledge Organization 知识组织', desc: '对知识做切分、索引与版本管理，保证检索的精度与新鲜度。' },
      { term: 'Agent Memory', desc: '让 Agent 跨会话记住用户偏好与历史结论，形成持续积累。' },
    ],
  },
  {
    id: 'mem0',
    name: 'Mem0',
    repo: 'mem0ai/mem0',
    layerId: 'memory',
    priority: 4,
    coreRole: '长期记忆管理框架',
    harnessModule: 'User/Task Memory Layer',
    focusPoints: ['Semantic Memory', 'Vector Memory', 'Memory Retrieval'],
    summary:
      '一行接入的 Agent 长期记忆层：自动从对话中抽取事实、去重与更新，向量化存储后在后续对话中按需召回注入 prompt，让 Agent "越用越懂你"。',
    concepts: [
      { term: 'Semantic Memory 语义记忆', desc: '从对话中抽取出的结构化事实，例如"用户对花生过敏"。' },
      { term: 'Vector Memory 向量记忆', desc: '用 embedding 存储记忆条目，支持按语义相似度检索。' },
      { term: 'Memory Retrieval 记忆检索', desc: '根据当前对话动态召回相关记忆并注入上下文，控制 token 成本。' },
    ],
  },
  {
    id: 'deepeval',
    name: 'DeepEval',
    repo: 'confident-ai/deepeval',
    layerId: 'evaluation',
    priority: 4,
    coreRole: 'Agent 测试与质量评估',
    harnessModule: 'Agent Test Framework',
    focusPoints: ['Regression Test', 'LLM Evaluation', 'Quality Gate'],
    summary:
      '像写单元测试一样测试 LLM 与 Agent：用 pytest 风格的断言语句对输出质量指标做断言，可直接接入 CI 流水线，防止模型升级或 prompt 改动导致质量悄悄回退。',
    concepts: [
      { term: 'Regression Test 回归测试', desc: '固定评测数据集，每次变更后重跑并对比历史结果。' },
      { term: 'LLM Evaluation', desc: '内置 G-Eval、幻觉检测、答案相关性等数十种评估指标。' },
      { term: 'Quality Gate 质量门禁', desc: '指标不达标则阻断发布，把质量要求固化进工程流程。' },
    ],
  },
  {
    id: 'ragas',
    name: 'Ragas',
    repo: 'explodinggradients/ragas',
    layerId: 'evaluation',
    priority: 4,
    coreRole: 'RAG/Agent 评估框架',
    harnessModule: 'Retrieval Evaluation',
    focusPoints: ['Faithfulness', 'Answer Quality', 'Context Evaluation'],
    summary:
      '专注 RAG 管线的评估框架：从"检索好不好"与"答案忠不忠实"两个维度量化 RAG 质量，无需人工标注即可自动打分，帮你定位问题出在检索还是生成。',
    concepts: [
      { term: 'Faithfulness 忠实度', desc: '答案是否完全基于检索到的上下文，检测幻觉与编造。' },
      { term: 'Answer Quality 答案质量', desc: '答案与问题的相关性与完整程度。' },
      { term: 'Context Evaluation 上下文评估', desc: '检索结果的精度与召回，区分"检索差"与"生成差"。' },
    ],
  },
  {
    id: 'litellm',
    name: 'LiteLLM',
    repo: 'BerriAI/litellm',
    layerId: 'gateway',
    priority: 4,
    coreRole: '多模型统一调用层',
    harnessModule: 'Model Routing Layer',
    focusPoints: ['Model Switching', 'Cost Control', 'Fallback'],
    summary:
      '用统一的 OpenAI 兼容接口调用 100+ 厂商模型，并提供路由、重试、降级与成本追踪能力。它是 Agent 的"模型总线"，让换模型从一次重构变成一行配置。',
    concepts: [
      { term: 'Model Switching 模型切换', desc: '上层代码零改动即可在 GPT、Claude、Gemini、国产模型间切换。' },
      { term: 'Cost Control 成本控制', desc: '按 API Key、团队、项目维度统计 token 花费并设置预算告警。' },
      { term: 'Fallback 降级容错', desc: '主模型超时或限流时自动切换到备用模型，保障可用性。' },
    ],
  },
  {
    id: 'mcp',
    name: 'MCP',
    repo: 'modelcontextprotocol/servers',
    layerId: 'protocol',
    priority: 4,
    coreRole: 'Agent 工具标准协议',
    harnessModule: 'Tool Integration Layer',
    focusPoints: ['Tool Discovery', 'Resource', 'Permission'],
    summary:
      'Model Context Protocol，Anthropic 发起的开放协议，为 Agent 连接外部工具与数据定义统一标准：工具一次实现、处处接入，被称为 AI 应用的 USB-C 接口。',
    concepts: [
      { term: 'Tool Discovery 工具发现', desc: 'Client 可动态列出 Server 提供的全部工具及其参数 schema。' },
      { term: 'Resource 资源', desc: '以标准化方式向模型暴露文件、数据库记录等数据内容。' },
      { term: 'Permission 权限', desc: '宿主应用对每次工具调用进行授权与审计，安全边界清晰。' },
    ],
  },
  {
    id: 'daytona',
    name: 'Daytona',
    repo: 'daytonaio/daytona',
    layerId: 'sandbox',
    priority: 4,
    coreRole: 'Agent 安全开发环境',
    harnessModule: 'Agent Sandbox Runtime',
    focusPoints: ['Code Execution', 'Environment Isolation'],
    summary:
      '为 Agent 提供按需创建的安全开发环境：Agent 生成的代码在隔离容器中运行、安装依赖、执行测试并读取结果，形成完整的"编码—运行—验证"闭环。',
    concepts: [
      { term: 'Code Execution 代码执行', desc: 'Agent 产出的代码获得真实运行能力，输出可回读用于自我修正。' },
      { term: 'Environment Isolation 环境隔离', desc: '每次执行在独立环境中进行，用完即毁，不危及宿主机。' },
    ],
  },
  {
    id: 'e2b',
    name: 'E2B',
    repo: 'e2b-dev/E2B',
    layerId: 'sandbox',
    priority: 4,
    coreRole: '云端代码执行沙箱',
    harnessModule: 'Execution Isolation Layer',
    focusPoints: ['Secure Runtime', 'Code Interpreter'],
    summary:
      '云端托管的代码执行沙箱（基于 Firecracker 微虚拟机），毫秒级启动、用完即焚，为 Agent 提供安全的 Code Interpreter 能力，是众多 AI 数据分析产品的底层。',
    concepts: [
      { term: 'Secure Runtime 安全运行时', desc: '微虚拟机级隔离，防止恶意或错误代码逃逸影响宿主系统。' },
      { term: 'Code Interpreter 代码解释器', desc: '让 LLM 像数据分析师一样运行 Python、处理文件、生成图表。' },
    ],
  },
  {
    id: 'dify',
    name: 'Dify',
    repo: 'langgenius/dify',
    layerId: 'platform',
    priority: 3,
    coreRole: 'AI 应用开发平台',
    harnessModule: 'Product Layer Reference',
    focusPoints: ['Workflow UI', 'Knowledge Base', 'App Management'],
    summary:
      '开源的 LLM 应用开发平台：可视化拖拽编排工作流、内置 RAG 知识库与应用管理，让非深度工程团队也能快速搭建并上线 AI 应用，是观察"Agent 技术产品化"的最佳样本。',
    concepts: [
      { term: 'Workflow UI', desc: '低代码画布，可视化编排 LLM 调用、条件分支与工具节点。' },
      { term: 'Knowledge Base 知识库', desc: '开箱即用的文档解析、索引与检索能力，快速搭建 RAG 应用。' },
      { term: 'App Management 应用管理', desc: '应用发布、API 生成、日志与运营分析一体化。' },
    ],
  },
  {
    id: 'crewai',
    name: 'CrewAI',
    repo: 'crewAIInc/crewAI',
    layerId: 'platform',
    priority: 3,
    coreRole: '角色型多 Agent 框架',
    harnessModule: 'Agent Collaboration Reference',
    focusPoints: ['Role Agent', 'Task Delegation'],
    summary:
      '以"角色扮演"为核心的多 Agent 框架：像组建团队一样为每个 Agent 定义角色、目标与背景故事，再分配任务让它们按流程协作执行，心智模型直观、上手极快。',
    concepts: [
      { term: 'Role Agent 角色智能体', desc: '每个 Agent 由 role / goal / backstory 三要素定义，职责边界清晰。' },
      { term: 'Task Delegation 任务委派', desc: '任务可顺序或层级分派，Agent 之间可相互求助与复核。' },
    ],
  },
]

/** 按层级取工具（保持 TOOLS 中定义的顺序） */
export function toolsByLayer(layerId: string): StackTool[] {
  return TOOLS.filter((t) => t.layerId === layerId)
}

/** 按 id 取层级 */
export function layerById(layerId: string): StackLayer {
  const layer = LAYERS.find((l) => l.id === layerId)
  if (!layer) throw new Error(`Unknown layerId: ${layerId}`)
  return layer
}

/** 按优先级取工具 */
export function toolsByPriority(priority: Priority): StackTool[] {
  return TOOLS.filter((t) => t.priority === priority)
}

/** 站点锚点定义（Navbar / StackMap / Footer 共用） */
export const NAV_ITEMS: { id: string; label: string }[] = [
  { id: 'top', label: '首页' },
  { id: 'map', label: '架构地图' },
  { id: 'runtime', label: '运行时' },
  { id: 'observability', label: '可观测' },
  { id: 'memory', label: '记忆与评估' },
  { id: 'infra', label: '基础设施' },
  { id: 'platform', label: '平台层' },
  { id: 'path', label: '学习路径' },
  { id: 'table', label: '全景对照表' },
]
