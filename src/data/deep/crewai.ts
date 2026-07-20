import type { ToolDeepDive } from '../deepDive'

/**
 * CrewAI 深度解析
 * 事实来源：
 * - Star 历史：OSS Insight API（api.ossinsight.io/v1/repos/crewAIInc/crewAI/stargazers/history）
 * - 仓库统计：GitHub API（api.github.com/repos/crewAIInc/crewAI），采集于 2026-07-18
 * - 版本数据：GitHub Releases API（api.github.com/repos/crewAIInc/crewAI/releases），采集于 2026-07-18
 * - 架构理解：crewAIInc/crewAI 官方 README 与官方文档（docs.crewai.com）
 * - 机制深潜：docs.crewai.com/en/concepts/{processes,flows,tasks,memory,knowledge,agents,checkpointing}
 * - 源码结构：github.com/crewAIInc/crewAI main 分支 lib/ monorepo（lib/crewai/src/crewai 等，实测于 1.15.4，git/trees 递归核对）
 */
export const crewaiDeep: ToolDeepDive = {
  toolId: 'crewai',

  stats: {
    stars: 55721,
    forks: 7867,
    license: 'MIT',
    checkedAt: '2026-07-18',
  },

  starHistory: [
    { date: '2023-11', stars: 87 },
    { date: '2023-12', stars: 901 },
    { date: '2024-01', stars: 6058 },
    { date: '2024-02', stars: 8075 },
    { date: '2024-03', stars: 10226 },
    { date: '2024-04', stars: 12383 },
    { date: '2024-05', stars: 14342 },
    { date: '2024-06', stars: 15717 },
    { date: '2024-07', stars: 16832 },
    { date: '2024-08', stars: 17717 },
    { date: '2024-09', stars: 18609 },
    { date: '2024-10', stars: 19581 },
    { date: '2024-11', stars: 20650 },
    { date: '2024-12', stars: 22087 },
    { date: '2025-01', stars: 24323 },
    { date: '2025-02', stars: 25952 },
    { date: '2025-03', stars: 27689 },
    { date: '2025-04', stars: 29058 },
    { date: '2025-05', stars: 30328 },
    { date: '2025-06', stars: 31114 },
    { date: '2025-07', stars: 32064 },
    { date: '2025-08', stars: 32745 },
    { date: '2025-09', stars: 34056 },
    { date: '2025-10', stars: 34515 },
    { date: '2025-11', stars: 34946 },
    { date: '2025-12', stars: 35425 },
    { date: '2026-01', stars: 35961 },
    { date: '2026-02', stars: 36405 },
    { date: '2026-03', stars: 36926 },
    { date: '2026-04', stars: 37399 },
    { date: '2026-05', stars: 37596 },
    { date: '2026-06', stars: 37660 },
    { date: '2026-07', stars: 55721 },
  ],

  versions: [
    { version: '1.15.4', date: '2026-07-17', highlight: '技能仓库脱离实验状态转正' },
    { version: '1.15.3', date: '2026-07-16', highlight: '新增执行拦截点与 @on 钩子体系' },
    { version: '1.15.2', date: '2026-07-08', highlight: '内联 skill 定义与模板化 Flow 输入' },
    { version: '1.15.1', date: '2026-06-27', highlight: '强制显式项目定义并自动初始化 Git' },
    { version: '1.15.0', date: '2026-06-25', highlight: '声明式 Flow 统一加载与对话式 Flow' },
  ],

  architecture: {
    intro:
      'CrewAI 双圈分层：Agent、Task、Crew 与执行器构成执行内核，Flow、Manager、事件钩子外挂为编排控制面；模型、工具、记忆与知识沉入可插拔数据面，守卫把关产出，换层不动内核。',
    diagram: {
      cols: 5,
      rows: 3,
      nodes: [
        { id: 'entry', label: 'CLI 装配', sub: 'CLI·@CrewBase', kind: 'external', col: 1, row: 1, group: '接入与编排' },
        { id: 'flow', label: 'Flow 工作流', sub: '@start·@router', kind: 'control', col: 2, row: 1, group: '接入与编排' },
        { id: 'process', label: '执行策略', sub: '顺序·层级', kind: 'control', col: 3, row: 1, group: '接入与编排' },
        { id: 'manager', label: 'Manager', sub: 'manager_agent', kind: 'control', col: 4, row: 1, group: '接入与编排' },
        { id: 'events', label: '事件钩子', sub: 'Events·Hooks', kind: 'control', col: 5, row: 1, group: '接入与编排' },
        { id: 'crew', label: 'Crew 团队', sub: 'Crew', kind: 'core', col: 1, row: 2, group: '执行内核' },
        { id: 'task', label: 'Task 任务', sub: 'Task', kind: 'core', col: 2, row: 2, group: '执行内核' },
        { id: 'agent', label: 'Agent 角色', sub: 'Agent', kind: 'core', col: 3, row: 2, group: '执行内核' },
        { id: 'executor', label: '执行器', sub: 'AgentExecutor', kind: 'core', col: 4, row: 2, group: '执行内核' },
        { id: 'guard', label: '守卫校验', sub: 'guardrail', kind: 'control', col: 5, row: 2, group: '执行内核' },
        { id: 'llm', label: 'LLM 接入', sub: 'LLM·LiteLLM', kind: 'external', col: 1, row: 3, group: '模型与工具' },
        { id: 'tools', label: '工具层', sub: 'BaseTool·MCP', kind: 'external', col: 2, row: 3, group: '模型与工具' },
        { id: 'memory', label: '记忆存储', sub: 'LanceDB·SQLite', kind: 'data', col: 3, row: 3, group: '记忆与知识' },
        { id: 'rag', label: '知识检索', sub: 'Knowledge·RAG', kind: 'data', col: 4, row: 3, group: '记忆与知识' },
      ],
      edges: [
        { from: 'entry', to: 'crew', label: '装配运行' },
        { from: 'flow', to: 'crew', label: '嵌套为步骤' },
        { from: 'crew', to: 'process', label: '按策略执行' },
        { from: 'process', to: 'manager', label: '层级模式', dashed: true },
        { from: 'manager', to: 'agent', label: '委派与校验' },
        { from: 'crew', to: 'agent', label: '组队' },
        { from: 'crew', to: 'task', label: '分派' },
        { from: 'task', to: 'agent', label: '绑定执行' },
        { from: 'task', to: 'guard', label: '产出校验' },
        { from: 'agent', to: 'executor', label: '执行循环' },
        { from: 'executor', to: 'llm', label: '模型调用' },
        { from: 'executor', to: 'tools', label: '工具调用' },
        { from: 'agent', to: 'memory', label: '读写记忆' },
        { from: 'agent', to: 'rag', label: '检索注入' },
        { from: 'crew', to: 'events', label: 'emit 事件', dashed: true },
      ],
      note: '内核对象少而职责清晰，守卫在出口把关，支撑能力可整体替换。',
    },
  },

  dataFlow: {
    intro:
      '一次 kickoff 是单向管道加一个重试回路：inputs 注入 Flow 的 Pydantic 状态后，Crew 把渲染好的任务上下文交给 Agent 推理循环；原始输出须穿过 guardrail 守卫才成为 TaskOutput，失败带反馈重试，最终聚合为 CrewOutput。',
    diagram: {
      cols: 8,
      rows: 2,
      direction: 'LR',
      nodes: [
        { id: 'inputs', label: '调用输入', sub: 'kickoff inputs', kind: 'data', col: 1, row: 1 },
        { id: 'state', label: 'Flow 状态', sub: 'Pydantic State', kind: 'data', col: 2, row: 1 },
        { id: 'crew', label: 'Crew 启动', sub: 'kickoff()', kind: 'core', col: 3, row: 1 },
        { id: 'task', label: '任务上下文', sub: 'Task prompt', kind: 'core', col: 4, row: 1 },
        { id: 'agent', label: 'Agent 循环', sub: 'execute_task', kind: 'core', col: 5, row: 1 },
        { id: 'guard', label: '守卫校验', sub: 'guardrail', kind: 'control', col: 6, row: 1 },
        { id: 'output', label: '任务产出', sub: 'TaskOutput', kind: 'data', col: 7, row: 1 },
        { id: 'result', label: '聚合输出', sub: 'CrewOutput', kind: 'data', col: 8, row: 1 },
        { id: 'memory', label: '记忆读写', sub: 'Memory', kind: 'data', col: 5, row: 2 },
      ],
      edges: [
        { from: 'inputs', to: 'state', label: '参数注入' },
        { from: 'state', to: 'crew', label: '传入 inputs' },
        { from: 'crew', to: 'task', label: '渲染提示词' },
        { from: 'task', to: 'agent', label: '执行上下文' },
        { from: 'agent', to: 'guard', label: '原始输出' },
        { from: 'guard', to: 'agent', label: '带错重试', dashed: true },
        { from: 'guard', to: 'output', label: '结构化校验' },
        { from: 'output', to: 'result', label: '聚合返回' },
        { from: 'agent', to: 'memory', label: '召回写入', dashed: true, bidirectional: true },
      ],
      note: '守卫是数据管道中唯一的回路，校验不过的产出永远流不到下游任务。',
    },
  },

  sequence: {
    intro:
      '以层级模式一次 kickoff 为例：Crew 自动创建 Manager 接管控制权，由其规划并把子任务委派给执行 Agent；执行侧在 execute_task 循环中交替调用 LLM 与工具，产出回交后 Manager 复核汇总，最终把 CrewOutput 返回调用方。',
    diagram: {
      actors: [
        { id: 'user', label: '用户', kind: 'user' },
        { id: 'crew', label: 'Crew', kind: 'system' },
        { id: 'manager', label: 'Manager', kind: 'agent' },
        { id: 'worker', label: '执行 Agent', kind: 'agent' },
        { id: 'llm', label: 'LLM', kind: 'external' },
      ],
      messages: [
        { from: 'user', to: 'crew', label: 'kickoff(inputs)' },
        { from: 'crew', to: 'manager', label: '层级流程接管' },
        { from: 'manager', to: 'worker', label: '拆解委派子任务' },
        { from: 'worker', to: 'llm', label: 'execute_task()' },
        { from: 'llm', to: 'worker', label: '推理与工具结果', dashed: true },
        { from: 'worker', to: 'manager', label: '提交 TaskOutput', dashed: true },
        { from: 'manager', to: 'manager', label: '复核校验' },
        { from: 'manager', to: 'crew', label: '汇总最终结果', dashed: true },
        { from: 'crew', to: 'user', label: '返回 CrewOutput', dashed: true },
      ],
      note: '层级模式下 Manager 负责规划、委派与结果校验，worker 专注执行。',
    },
  },

  extension: [
    {
      title: '自定义工具（BaseTool）',
      desc: '继承 BaseTool 定义名称、描述与 Pydantic 参数模型并实现 _run()，即可装配给任意 Agent；也可用 @tool 装饰器快速包装函数，或通过 MCP 接入外部工具服务。',
    },
    {
      title: '自定义 LLM',
      desc: '用 crewai.LLM 显式指定 provider、model 与采样参数，底层经 LiteLLM 接入数百种模型（含 Ollama 本地模型）；亦可继承 BaseLLM 实现私有推理后端并纳入 checkpoint。',
    },
    {
      title: 'Flow 状态机扩展',
      desc: '用 @start、@listen、@router 与 or_/and_ 组合事件驱动流程，Pydantic 结构化 State 跨方法共享，@persist 支持持久化恢复，并可把整个 Crew 作为 Flow 中的一个步骤编排。',
    },
    {
      title: '声明式项目装配',
      desc: '@CrewBase 装饰器配合 agents.yaml / tasks.yaml 把角色与任务配置化；v1.15 起支持 JSON-first Crew 与声明式 FlowDefinition，无需编写 Python 即可定义流程并交给 CLI 运行。',
    },
  ],

  challenges: [
    {
      title: '自主性与确定性的平衡',
      desc: 'Crews 的动态委派灵活但执行路径不可预知，层级模式的质量依赖 Manager 的规划能力；框架以 Flows 的状态、路由与条件分支把关键业务路径拉回确定性控制。',
    },
    {
      title: '上下文与 token 成本',
      desc: '多 Agent 反复委派与复核会迅速累积上下文与调用成本，任务 context 传递、记忆写入与结果聚合都需精细设计；框架已支持聚合统计全链路 token 用量便于治理。',
    },
    {
      title: '状态持久化与恢复',
      desc: '长耗时流程中断后需要可靠恢复，框架为此引入 RuntimeState、Checkpoint 存储与 fork 机制，并要求 Agent、工具回调等运行态可序列化，设计与实现复杂度高。',
    },
    {
      title: '多角色协作的质量兜底',
      desc: '多角色协作不能天然避免幻觉沿链路放大，需要任务级 guardrail 自动校验重试、结构化输出约束与 human-in-the-loop 人工复核共同兜底，才能稳定进入生产。',
    },
  ],

  positioning:
    'CrewAI 在多 Agent 框架版图中的位置是"轻量高层抽象 + 商业化平台"：与 LangGraph 的图状态机、AutoGen 的对话式协作相比，它用 Agent/Task/Crew/Process 四个对象把多 Agent 协作压缩成"组建团队"的直觉模型，学习成本最低、原型速度最快；又以 Flows 补足事件驱动的确定性控制，覆盖从原型到生产的完整路径。生态上它保持模型中立（经 LiteLLM 接入数百种模型）、工具开放（crewai-tools 与 MCP），并通过 AMP Suite 控制平面切入企业部署、观测与治理市场，形成开源框架加企业平台的商业闭环。',

  landscape: {
    intro:
      'CrewAI 的站位是模型中立加平台闭环：上游经 LiteLLM 接入数百种模型、经 MCP 引入外部工具、以 LanceDB 承载记忆，自身专注编排内核与官方工具包；下游观测交给 Langfuse 等第三方，企业部署治理由自家 AMP Suite 承接。',
    diagram: {
      cols: 3,
      rows: 4,
      direction: 'LR',
      nodes: [
        { id: 'litellm', label: 'LiteLLM', sub: '模型统一接入', kind: 'external', col: 1, row: 1, group: '上游依赖' },
        { id: 'mcp', label: 'MCP 生态', sub: '外部工具服务', kind: 'external', col: 1, row: 2, group: '上游依赖' },
        { id: 'lancedb', label: 'LanceDB', sub: '记忆向量存储', kind: 'external', col: 1, row: 3, group: '上游依赖' },
        { id: 'otel', label: '遥测埋点', sub: 'OpenTelemetry', kind: 'external', col: 1, row: 4, group: '上游依赖' },
        { id: 'tools', label: '官方工具包', sub: 'crewai-tools', kind: 'core', col: 2, row: 1, group: '本项目' },
        { id: 'crewai', label: 'CrewAI', sub: 'Crews + Flows', kind: 'core', col: 2, row: 2, group: '本项目' },
        { id: 'amp', label: 'AMP 平台', sub: 'AMP Suite', kind: 'control', col: 3, row: 1, group: '下游应用' },
        { id: 'obs', label: '观测平台', sub: 'Langfuse 等', kind: 'external', col: 3, row: 2, group: '下游应用' },
        { id: 'examples', label: '示例模板', sub: '官方示例仓库', kind: 'external', col: 3, row: 3, group: '下游应用' },
      ],
      edges: [
        { from: 'litellm', to: 'crewai', label: '统一接入' },
        { from: 'mcp', to: 'crewai', label: '工具注入' },
        { from: 'lancedb', to: 'crewai', label: '记忆读写' },
        { from: 'crewai', to: 'otel', label: 'OTLP 上报', dashed: true },
        { from: 'tools', to: 'crewai', label: '装配工具' },
        { from: 'crewai', to: 'amp', label: '部署治理' },
        { from: 'crewai', to: 'obs', label: '追踪成本' },
        { from: 'crewai', to: 'examples', label: '范式沉淀', dashed: true },
      ],
      note: '框架本体保持中立可替换，商业价值沉淀在自家 AMP 控制平面。',
    },
  },

  competitors: [
    {
      name: 'AutoGen',
      relation: '直接竞品',
      diff: '微软出品的对话式多 Agent 框架，0.4 起转向事件驱动；CrewAI 的角色分工心智更轻、上手更快。',
    },
    {
      name: 'LangGraph',
      relation: '相邻替代',
      diff: '图结构状态机可精确控制每一步，表达力更强但学习曲线陡；CrewAI 以高层抽象换开发速度。',
    },
    {
      name: 'OpenAI Agents SDK',
      relation: '直接竞品',
      diff: 'OpenAI 官方轻量 SDK，handoffs 交接简洁但深度绑定其生态；CrewAI 模型中立、流程抽象更完整。',
    },
    {
      name: 'MetaGPT',
      relation: '相邻替代',
      diff: '以 SOP 角色流水线模拟软件公司，偏重代码生成场景；CrewAI 面向通用业务自动化覆盖更广。',
    },
  ],

  mechanism: [
    {
      title: '层级委派循环',
      desc: '层级模式下任务不预分配：Crew 自动创建（或指定）Manager agent，由其 LLM 负责规划，把任务拆解后经委派工具分派给能力匹配的 agent，回收产出后复核质量、判断是否完成，不达标则继续委派或追问，直至汇总最终结果。manager_llm 或 manager_agent 必须显式配置，层级流程才能启动。',
    },
    {
      title: 'Flow 事件路由',
      desc: 'Flow 把每个方法变成事件节点：@start 标记入口（可多个并行触发），方法返回值即事件载荷；@listen 订阅上游方法，其完成时被触发并接收输出作参数；@router 返回字符串标签，把控制权交给监听同名标签的方法，or_/and_ 可组合触发条件。状态经 self.state 跨方法共享，可为自由字典（自动附 UUID）或 Pydantic 结构化模型。',
    },
    {
      title: '记忆知识注入时机',
      desc: '开启 memory=True 后，Crew 在每个任务执行前先从统一记忆召回相关上下文注入任务提示，任务完成后用 LLM 把产出拆成原子事实写入记忆，kickoff 收尾时会等待后台写入完成。知识检索发生在 agent 执行当下：先用 agent 自己的 LLM 把任务描述改写为优化检索查询，命中后注入上下文，全程发出可监听事件。',
    },
    {
      title: '守卫校验重试',
      desc: 'Task 的 guardrail 可为 Python 函数或自然语言描述（自动包装成 LLMGuardrail，用执行 agent 的 LLM 评判），多个守卫按序执行、逐个传递输出。任一守卫返回 (False, 错误反馈) 时，反馈被回传给 agent 并带错重试，直到校验通过或达到 guardrail_max_retries（默认 3 次），通过后的输出才流向下一任务；企业版另有 HallucinationGuardrail，把产出与参考上下文比对评分以拦截幻觉。',
    },
  ],

  sourceLayout: [
    { path: 'lib/crewai/src/crewai', role: '框架主包：Agent/Crew/Task/Flow/LLM 顶层对象' },
    { path: 'lib/crewai/src/crewai/flow', role: 'Flow 事件驱动编排：状态、路由与持久化' },
    { path: 'lib/crewai/src/crewai/tasks', role: '任务输出、条件任务与 LLMGuardrail 守卫' },
    { path: 'lib/crewai/src/crewai/memory', role: '统一记忆系统，LanceDB 后端与召回流水线' },
    { path: 'lib/crewai/src/crewai/knowledge', role: 'RAG 知识源、查询改写与向量存储' },
    { path: 'lib/crewai/src/crewai/project', role: '@CrewBase 装饰器，YAML 声明式装配' },
    { path: 'lib/crewai-tools', role: '官方工具包，独立发布的检索/抓取工具集' },
    { path: 'lib/cli', role: 'crewai CLI：脚手架、运行与部署命令' },
  ],

  tradeoffs: [
    {
      title: 'Crews 与 Flows 双轨',
      choice: '自主协作与确定编排双轨并存',
      reason: '官方 README：Crews 适合需要灵活决策与动态交互的场景，Flows 提供事件驱动的精确路径与状态控制；两者可嵌套组合，把整个 Crew 作为 Flow 的一步，兼顾自主性与可控性。',
    },
    {
      title: '三要素人设模型',
      choice: '三要素定义 Agent 人设',
      reason: '官方文档：role 界定职能专长、goal 引导决策方向、backstory 注入背景与个性；三者必填并直接拼入提示词模板，用最小抽象塑造 agent 行为，把学习成本压到最低。',
    },
    {
      title: '独立自研内核',
      choice: '从零自建、不依赖 LangChain',
      reason: 'README 明确框架完全从零构建、独立于任何 agent 框架，换来更轻量、更快的执行与无外部依赖约束；代价是生态与工具适配需要自行建设维护。',
    },
  ],

  production: [
    {
      title: 'YAML 工程化装配',
      desc: 'crewai create crew 生成项目骨架，agents.yaml/tasks.yaml 配置角色与任务，@CrewBase 类配合 @agent/@task/@crew 装饰器装配，crewai run 一键运行；YAML 中 {变量} 由 kickoff(inputs) 注入，便于版本化管理。',
    },
    {
      title: '可观测性接入',
      desc: '框架内置 OpenTelemetry 与事件总线，记忆/知识检索等节点均发事件；官方文档推荐 Langfuse、MLflow、OpenLIT、Arize Phoenix 等平台追踪 token 与成本，匿名遥测可用 OTEL_SDK_DISABLED 关闭。',
    },
    {
      title: 'AMP 平台边界',
      desc: '开源框架只负责编排执行；企业级部署、Tracing、统一管控与安全合规由 AMP Suite 控制平面承接，支持云端或本地部署，Crew Control Plane 可免费试用，治理需求上平台而非塞进框架。',
    },
    {
      title: '记忆存储运维坑',
      desc: '默认记忆落在本地 LanceDB（./.crewai/memory，CREWAI_STORAGE_DIR 可调）；默认嵌入模型已换 3072 维 text-embedding-3-large，与旧 1536 维存储不兼容，需 crewai reset-memories -m 重置或显式沿用旧模型。',
    },
  ],

  en: {
    tagline:
      'A lean Python framework where role-based agent Crews collaborate autonomously and event-driven Flows deliver precise, production-grade control.',
    summary:
      'CrewAI is an open-source Python framework for orchestrating multi-agent automations. Developers define agents with a role, goal, and backstory, assign them explicit tasks, and compose them into Crews that run sequentially or under an auto-assigned manager in hierarchical mode. For deterministic control, event-driven Flows manage state, branching, and routing, and can embed a whole Crew as a single step. The framework is model-agnostic through LiteLLM, extensible with custom BaseTool integrations and MCP servers, and ships with memory, knowledge, checkpointing, and guardrails. CrewAI AMP adds a commercial control plane for deployment, observability, and governance.',
  },
}
