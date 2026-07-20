import type { ToolDeepDive } from '../deepDive'

/**
 * OpenAI Agents SDK 深度解析
 * 数据来源：
 * - Star 历史：OSS Insight API https://api.ossinsight.io/v1/repos/openai/openai-agents-python/stargazers/history
 * - 仓库统计：GitHub API https://api.github.com/repos/openai/openai-agents-python（2026-07-18）
 * - 版本：https://github.com/openai/openai-agents-python/releases（亮点取自 release notes 首行）
 *   版本日期以 PyPI 上传时间为准：https://pypi.org/pypi/openai-agents/json
 * - 架构：官方 README 与文档（Runner / Agent Loop / Handoffs / Guardrails / Sessions / Tracing / Realtime / Model 接口）
 * - mechanism：官方文档 running_agents / handoffs / guardrails / sessions 页（2026-07 抓取）
 * - sourceLayout：GitHub API 仓库目录树 openai/openai-agents-python（2026-07-18 抓取）
 * - tradeoffs：官方文档 handoffs 页、guardrails 页注释与 README provider-agnostic 定位
 * - production：官方文档 tracing / models(litellm) / sessions / running_agents 页
 */
export const openaiAgentsDeep: ToolDeepDive = {
  toolId: 'openai-agents',

  stats: {
    stars: 27984,
    forks: 4346,
    license: 'MIT',
    checkedAt: '2026-07-18',
  },

  // OSS Insight 共 17 个采样点（2025-03 仓库创建起），未超上限，全量保留
  starHistory: [
    { date: '2025-03', stars: 7008 },
    { date: '2025-04', stars: 8669 },
    { date: '2025-05', stars: 9727 },
    { date: '2025-06', stars: 10435 },
    { date: '2025-07', stars: 10983 },
    { date: '2025-08', stars: 11570 },
    { date: '2025-09', stars: 12141 },
    { date: '2025-10', stars: 12688 },
    { date: '2025-11', stars: 12953 },
    { date: '2025-12', stars: 13167 },
    { date: '2026-01', stars: 13392 },
    { date: '2026-02', stars: 13600 },
    { date: '2026-03', stars: 13835 },
    { date: '2026-04', stars: 14729 },
    { date: '2026-05', stars: 14862 },
    { date: '2026-06', stars: 14879 },
    { date: '2026-07', stars: 27984 },
  ],

  versions: [
    { version: '0.18.3', date: '2026-07-17', highlight: 'task 与 turn 追踪 span 可配置' },
    { version: '0.18.2', date: '2026-07-11', highlight: '支持 GPT-5.6 请求控制参数' },
    { version: '0.18.1', date: '2026-07-09', highlight: '新增 GPT-5.6 模型默认配置' },
    { version: '0.18.0', date: '2026-07-07', highlight: 'Realtime 默认改用 gpt-realtime-2.1' },
    { version: '0.17.8', date: '2026-07-06', highlight: '新增非法最终输出恢复处理器' },
  ],

  architecture: {
    intro:
      '能力收敛于 Runner 驱动的 Agent Loop：run 系列与 Realtime 会话共用同一编排核心，函数工具与 MCP 横切扩展，护栏钩子就近挂载，模型会话追踪沉淀数据平面。',
    diagram: {
      cols: 4,
      rows: 4,
      nodes: [
        { id: 'user', label: '用户代码', sub: 'Runner.run 系列', kind: 'external', col: 1, row: 1, group: '接入层' },
        { id: 'realtime', label: 'Realtime', sub: 'RealtimeRunner', kind: 'core', col: 2, row: 1, group: '接入层' },
        { id: 'agent', label: 'Agent 原语', sub: 'Agent 类', kind: 'core', col: 1, row: 2, group: '编排核心' },
        { id: 'runner', label: 'Runner', sub: 'Agent Loop', kind: 'core', col: 2, row: 2, group: '编排核心' },
        { id: 'handoff', label: 'Handoff', sub: 'transfer_to_*', kind: 'core', col: 3, row: 2, group: '编排核心' },
        { id: 'tool', label: '函数工具', sub: '@function_tool', kind: 'core', col: 1, row: 3, group: '能力扩展' },
        { id: 'mcp', label: 'MCP 工具', sub: 'MCPServer', kind: 'core', col: 2, row: 3, group: '能力扩展' },
        { id: 'guard', label: '护栏', sub: '输入·输出·工具', kind: 'control', col: 3, row: 3, group: '能力扩展' },
        { id: 'hooks', label: '生命周期钩子', sub: 'RunHooks', kind: 'control', col: 4, row: 3, group: '能力扩展' },
        { id: 'model', label: 'Model 接口', sub: 'get_response', kind: 'core', col: 1, row: 4, group: '数据平面' },
        { id: 'session', label: 'Sessions', sub: 'SQLite/Redis', kind: 'data', col: 2, row: 4, group: '数据平面' },
        { id: 'tracing', label: 'Tracing', sub: 'TraceProcessor', kind: 'data', col: 3, row: 4, group: '数据平面' },
        { id: 'provider', label: '模型提供方', sub: 'OpenAI·LiteLLM', kind: 'external', col: 4, row: 4 },
      ],
      edges: [
        { from: 'user', to: 'runner', label: 'run_sync' },
        { from: 'user', to: 'realtime', label: '启动会话' },
        { from: 'realtime', to: 'agent', label: '复用 Agent', dashed: true },
        { from: 'runner', to: 'agent', label: '组装配置' },
        { from: 'agent', to: 'handoff', label: '声明移交' },
        { from: 'agent', to: 'tool', label: '声明工具' },
        { from: 'runner', to: 'tool', label: 'tool_calls' },
        { from: 'runner', to: 'mcp', label: '调用执行' },
        { from: 'runner', to: 'handoff', label: '移交切换' },
        { from: 'runner', to: 'guard', label: '校验拦截' },
        { from: 'runner', to: 'hooks', label: '触发回调', dashed: true },
        { from: 'runner', to: 'model', label: '模型调用' },
        { from: 'model', to: 'provider', label: '多 provider' },
        { from: 'runner', to: 'session', label: '读写历史', bidirectional: true },
        { from: 'runner', to: 'tracing', label: '记录 span', dashed: true },
      ],
      note: '四平面共用一个循环：工具、移交、护栏、钩子都汇入 Agent Loop，直到产出 final_output 或触达 max_turns。',
    },
  },

  dataFlow: {
    intro:
      '一次运行的全部状态就是消息列表：输入与 Session 历史拼接后发给模型，工具结果回灌同一列表循环，Handoff 只换当前 Agent 不换历史，终答经输出护栏后封装为 RunResult。',
    diagram: {
      cols: 8,
      rows: 2,
      direction: 'LR',
      nodes: [
        { id: 'input', label: '用户输入', sub: '消息列表', kind: 'external', col: 1, row: 1 },
        { id: 'session', label: '会话历史', sub: 'get_items', kind: 'data', col: 2, row: 1 },
        { id: 'call', label: '模型调用', sub: 'get_response', kind: 'core', col: 3, row: 1 },
        { id: 'resp', label: '模型响应', sub: 'ModelResponse', kind: 'data', col: 4, row: 1 },
        { id: 'tool', label: '工具执行', sub: 'function_tool', kind: 'core', col: 5, row: 2 },
        { id: 'handoff', label: 'Handoff', sub: '切换 Agent', kind: 'core', col: 6, row: 2 },
        { id: 'guard', label: '输出护栏', sub: 'tripwire', kind: 'control', col: 7, row: 2 },
        { id: 'result', label: '运行结果', sub: 'RunResult', kind: 'data', col: 8, row: 2 },
      ],
      edges: [
        { from: 'input', to: 'call', label: '拼接输入' },
        { from: 'session', to: 'call', label: 'get_items' },
        { from: 'call', to: 'resp', label: '生成响应' },
        { from: 'resp', to: 'tool', label: 'tool_calls' },
        { from: 'tool', to: 'call', label: '结果回灌', dashed: true },
        { from: 'resp', to: 'handoff', label: '移交调用' },
        { from: 'handoff', to: 'call', label: '切换重跑', dashed: true },
        { from: 'resp', to: 'guard', label: '最终输出' },
        { from: 'guard', to: 'result', label: '校验通过' },
      ],
      note: '循环的终止条件只有一个：模型既不再发起 tool_calls 也不再 handoff。',
    },
  },

  sequence: {
    intro:
      '以退款触发 handoff 为例：Runner 并行跑输入护栏，同时把指令与工具列表发给模型；模型返回 transfer_to 调用即移交退款 Agent，终答过输出护栏后返回 RunResult。',
    diagram: {
      actors: [
        { id: 'user', label: '用户', kind: 'user' },
        { id: 'runner', label: 'Runner', kind: 'system' },
        { id: 'guard', label: '输入护栏', kind: 'system' },
        { id: 'llm', label: '模型 API', kind: 'external' },
        { id: 'refund', label: '退款 Agent', kind: 'agent' },
      ],
      messages: [
        { from: 'user', to: 'runner', label: 'run_sync 提交输入' },
        { from: 'runner', to: 'guard', label: '@input_guardrail' },
        { from: 'runner', to: 'llm', label: 'get_response 请求' },
        { from: 'llm', to: 'runner', label: '返回 handoff 调用', dashed: true },
        { from: 'runner', to: 'refund', label: 'on_handoff 移交' },
        { from: 'refund', to: 'llm', label: 'get_response 再调用' },
        { from: 'llm', to: 'refund', label: '返回 final_output', dashed: true },
        { from: 'refund', to: 'runner', label: '输出护栏校验', dashed: true },
        { from: 'runner', to: 'user', label: '返回 RunResult', dashed: true },
      ],
      note: '护栏与主流程并行执行，tripwire 一旦触发立即取消在途任务并中断运行。',
    },
  },

  extension: [
    {
      title: 'Model 接口与 ModelProvider',
      desc: '所有模型调用收敛到 Model 接口（get_response/stream_response）：默认走 OpenAI Responses，可切 Chat Completions，或经 LiteLLM、Any-LLM 官方适配接入上百种第三方模型，RunConfig 可全局替换。',
    },
    {
      title: 'TraceProcessor 追踪扩展',
      desc: '实现 TraceProcessor 接口并用 add_trace_processor 注册，即可把 trace/span 流导出到自有后端；官方文档已列出 Langfuse、LangSmith、Braintrust 等外部处理器，且追踪默认开启、无需埋点。',
    },
    {
      title: 'Session 会话协议',
      desc: 'Session 协议仅 get_items、add_items、pop_item、clear_session 四个方法，实现它即可接入任意存储；官方已提供 SQLite、Redis、SQLAlchemy、MongoDB 与 OpenAI Conversations 等多种实现。',
    },
    {
      title: 'RunHooks 生命周期钩子',
      desc: 'RunHooks 与 AgentHooks 暴露 on_start、on_tool_start、on_handoff、on_end 等生命周期回调，可在不改动 Agent 定义的前提下注入日志、指标、审批等横切逻辑，按单次运行或单个 Agent 挂载。',
    },
  ],

  challenges: [
    {
      title: '循环失控防护',
      desc: '模型可能反复调用工具或在 handoff 之间乒乓，Runner 用 max_turns（默认 10）兜底并抛 MaxTurnsExceeded；0.16 起允许 max_turns=None 关闭限制，防长循环失控的责任随之移交应用层。',
    },
    {
      title: 'Handoff 上下文一致性',
      desc: '移交后新 Agent 继承同一份消息历史，嵌套 handoff 的内容保留、input_filter 对历史的裁剪都直接影响新 Agent 看到的上下文；release 中多次修复嵌套历史丢失、过滤残留等边界。',
    },
    {
      title: '并发与取消的清理',
      desc: '输入护栏与主流程并行、函数工具并发执行、流式事件交错，任一护栏触发 tripwire 都要立即取消兄弟任务并回收现场；「取消兄弟护栏任务」这类修复说明并发取消路径极易踩坑。',
    },
    {
      title: '跨 provider 能力对齐',
      desc: 'Responses 与 Chat Completions 在托管工具、reasoning、严格 schema 上能力不对齐，LiteLLM 背后的异构模型差异更大；SDK 要在 Model 层抹平 tool calling、流式事件与用量统计的语义差异。',
    },
  ],

  positioning:
    'OpenAI Agents SDK 是实验项目 Swarm 的生产级续作，定位「最小可用 Agent 抽象」：不画状态图、不搭角色扮演，只用 Agent、Handoff、Guardrails、Sessions、Tracing 五个正交原语覆盖单 Agent 到多 Agent 的常见形态。它向上承接 OpenAI 平台红利——Responses API、Traces 面板、Realtime 语音开箱即用；向下通过 Model 接口与 LiteLLM 保持 provider-agnostic，不被单一厂商锁定。在版图中它介于裸 API 与 LangGraph 式重型编排之间，胜在心智负担低、与官方模型能力同步快，适合快速产品化的团队；Python/JS 双实现与周级发版节奏，使它成为 OpenAI 生态事实上的 Agent 入口。',

  landscape: {
    intro:
      '向上依赖 OpenAI Responses、LiteLLM 与 MCP 工具生态，Pydantic 负责 schema；向下把 span 导出到 Traces 或 Langfuse 等后端，支撑分诊、语音等产品，JS 孪生保持能力对齐。',
    diagram: {
      cols: 4,
      rows: 4,
      direction: 'LR',
      nodes: [
        { id: 'openai', label: 'OpenAI', sub: 'Responses API', kind: 'external', col: 1, row: 1, group: '上游依赖' },
        { id: 'sdk', label: 'SDK 核心', sub: 'openai-agents', kind: 'core', col: 2, row: 1, colSpan: 2, group: '本项目' },
        { id: 'traces', label: 'Traces', sub: 'OpenAI 面板', kind: 'external', col: 4, row: 1, group: '下游应用' },
        { id: 'litellm', label: 'LiteLLM', sub: '100+ 模型', kind: 'external', col: 1, row: 2, group: '上游依赖' },
        { id: 'js', label: 'JS 版 SDK', sub: 'TypeScript', kind: 'external', col: 2, row: 2, group: '本项目' },
        { id: 'langfuse', label: 'Langfuse', sub: '可观测后端', kind: 'external', col: 3, row: 2, group: '下游应用' },
        { id: 'voice', label: '语音助手', sub: 'Realtime 应用', kind: 'external', col: 4, row: 2, group: '下游应用' },
        { id: 'mcp', label: 'MCP 服务器', sub: 'stdio/sse/http', kind: 'external', col: 1, row: 3, group: '上游依赖' },
        { id: 'cs', label: '客服分诊', sub: '多 Agent 应用', kind: 'external', col: 4, row: 3, group: '下游应用' },
        { id: 'pydantic', label: 'Pydantic', sub: 'schema 校验', kind: 'external', col: 1, row: 4, group: '上游依赖' },
      ],
      edges: [
        { from: 'openai', to: 'sdk', label: '模型调用' },
        { from: 'litellm', to: 'sdk', label: '模型适配' },
        { from: 'mcp', to: 'sdk', label: '工具接入' },
        { from: 'pydantic', to: 'sdk', label: 'schema 生成' },
        { from: 'sdk', to: 'js', label: '能力对齐', dashed: true },
        { from: 'sdk', to: 'traces', label: '导出 span' },
        { from: 'sdk', to: 'langfuse', label: '外部处理器' },
        { from: 'sdk', to: 'voice', label: 'Realtime' },
        { from: 'sdk', to: 'cs', label: '支撑落地' },
      ],
      note: 'provider-agnostic 是官方承诺：换模型不改 Agent 代码，追踪能力在非 OpenAI 模型下同样可用。',
    },
  },

  competitors: [
    {
      name: 'LangGraph',
      relation: '直接竞品',
      diff: '状态图+检查点的重型编排，复杂分支与精细控制更强；Agents SDK 原语少、上手快，但长流程控制力弱。',
    },
    {
      name: 'AutoGen',
      relation: '直接竞品',
      diff: '微软对话驱动的多 Agent 框架，GroupChat 协作拓扑丰富；Agents SDK 更轻量，与 OpenAI 平台及 Tracing 集成更深。',
    },
    {
      name: 'CrewAI',
      relation: '相邻替代',
      diff: '角色扮演式 crew 编排，任务分工模板化程度高；Agents SDK 无 crew 抽象，靠 handoff 自由组合，灵活但需自行设计分工。',
    },
    {
      name: 'Google ADK',
      relation: '相邻替代',
      diff: '谷歌官方 Agent 框架，深度绑定 Gemini/Vertex 生态；Agents SDK 绑定 OpenAI 生态，但可经 LiteLLM 接入百种模型。',
    },
  ],

  mechanism: [
    {
      title: 'Agent Loop 终止判定',
      desc: 'Runner 每轮调用当前 Agent 的模型后做三路判定：返回 tool_calls 则本地执行工具、把结果回灌后继续循环；命中 handoff 则更新当前 Agent 与输入重跑；只有既无工具调用也无移交、且文本符合 output_type 时才视为 final_output 结束循环。tool_use_behavior 可改为首个工具输出即终答，max_turns 兜底抛 MaxTurnsExceeded。',
    },
    {
      title: 'Handoff 工具化移交',
      desc: 'handoffs 列表被展开成 transfer_to_<agent_name> 形式的普通工具暴露给模型；模型发起该调用时 SDK 并不真正执行函数，而是由 Runner 捕获后切换 current agent 与输入并重跑循环。新 Agent 默认看到完整对话历史，可用 input_filter 裁剪；input_type 声明的调用参数经本地 schema 校验后才传给 on_handoff 回调。',
    },
    {
      title: '护栏并行与 tripwire',
      desc: '输入护栏默认 run_in_parallel=True，与主 Agent 流程并发启动以求最低延迟；每个护栏产出 GuardrailFunctionOutput，一旦 tripwire_triggered 为真，立即抛出 InputGuardrailTripwireTriggered 异常并中断运行、取消在途任务。改 run_in_parallel=False 则先跑完护栏再放行模型，用延迟换取零 token 浪费的 fail-fast。',
    },
    {
      title: 'Session 历史注入',
      desc: '启用 session 后，Runner 在每次 run 前调用 get_items 取出该会话全部历史并前置拼接到本轮输入，run 结束后把本轮新产生的 items 自动写回存储。可用 SessionSettings(limit=N) 只检索最近 N 条，或用 session_input_callback 自定义历史与新输入的合并方式——回调只影响发给模型的内容，不改写已存历史。',
    },
  ],

  sourceLayout: [
    { path: 'src/agents/run.py', role: 'Runner 入口与 Agent Loop 主循环实现' },
    { path: 'src/agents/agent.py', role: 'Agent 原语定义：指令、工具、handoffs、护栏' },
    { path: 'src/agents/handoffs/', role: 'transfer_to_* 工具生成与 input_filter 管道' },
    { path: 'src/agents/guardrail.py', role: '输入/输出护栏执行与 tripwire 中断' },
    { path: 'src/agents/models/', role: 'Model 接口、OpenAI 双 API 与 multi_provider 路由' },
    { path: 'src/agents/memory/', role: 'Session 协议及 SQLite、OpenAI Conversations 实现' },
    { path: 'src/agents/tracing/', role: 'trace/span 生命周期与批量导出处理器' },
    { path: 'src/agents/extensions/', role: '官方扩展：handoff_filters、扩展会话与模型适配' },
  ],

  tradeoffs: [
    {
      title: '移交为何用工具调用',
      choice: 'handoff 暴露为 transfer_to_* 工具',
      reason:
        '把移交时机与目标的判断交给 LLM 而非框架硬编码路由；移交与普通工具复用同一套 schema、执行与追踪管线，框架更简单、行为全程可观测。',
    },
    {
      title: '默认 provider-agnostic',
      choice: 'Model 接口抽象＋LiteLLM 适配',
      reason:
        'README 明确定位 provider-agnostic：所有调用收敛到 Model 接口，LiteLLM 适配接入 100+ 模型；换模型不改 Agent 代码，避免厂商锁定，Tracing 与护栏能力随之复用。',
    },
    {
      title: '护栏挂在 Agent 上',
      choice: '护栏是 Agent 属性而非 run 参数',
      reason:
        '官方文档解释：护栏通常与具体 Agent 的业务语义绑定，就近声明可读性更好；代价是输入护栏只对链上首个 Agent 生效、输出护栏只对产出终答者生效。',
    },
  ],

  production: [
    {
      title: 'Tracing 数据驻留',
      desc: 'trace 默认批量上传 OpenAI 后端，ZDR 策略的组织不可用 Tracing；可用 trace_include_sensitive_data=False 过滤 LLM 与工具的输入输出，或用 set_trace_processors 只导出到 Langfuse 等自建后端。',
    },
    {
      title: 'LiteLLM 接国产模型',
      desc: '装 openai-agents[litellm] 后用 LitellmModel 或 litellm/ 前缀路由，属 beta 适配；部分 provider 需 include_usage=True 才有用量统计；无 OpenAI key 时用 set_tracing_export_api_key 或关闭 tracing，避免上传 401。',
    },
    {
      title: '会话存储选型',
      desc: '本地开发用 SQLiteSession；多 worker 共享选 RedisSession；已有生产库用 SQLAlchemySession；超长对话用 OpenAIResponsesCompactionSession 自动压缩；敏感场景用 EncryptedSession 叠加透明加密与 TTL。',
    },
    {
      title: '成本与失控防护',
      desc: '并行护栏模式下护栏失败时贵模型可能已消耗 token，省钱场景改用 run_in_parallel=False 先校验再放行；max_turns 默认 10 兜底工具/移交死循环，可配 error_handlers 把超限转为可控终答。',
    },
  ],

  en: {
    tagline:
      "OpenAI's official lightweight framework for multi-agent workflows: a small set of orthogonal primitives — Agent, Handoff, Guardrails, Sessions, Tracing — covers everything from a single assistant to production agent systems.",
    summary:
      'The OpenAI Agents SDK is the production successor to Swarm, built around an Agent loop run by the Runner: call the model, execute tool calls, feed results back, and repeat until a final answer appears. Handoffs are exposed to the LLM as transfer_to_* tools, enabling lightweight multi-agent delegation, while input/output guardrails validate in parallel and fail fast. Sessions manage conversation history, and built-in tracing records every span to the OpenAI Traces dashboard or external processors. A provider-agnostic Model interface plus LiteLLM support covers 100+ LLMs, and Realtime agents extend the same primitives to voice.',
  },
}
