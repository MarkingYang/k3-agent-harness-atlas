import type { ToolDeepDive } from '../deepDive'

/**
 * LiteLLM 深度解析（模型网关层）
 * 真实数据来源：
 * - starHistory：OSS Insight API https://api.ossinsight.io/v1/repos/BerriAI/litellm/stargazers/history（历史点 2026-07-17 采集，
 *   末点 2026-07-18 以 GitHub REST API 当前 star 数校正）
 * - stats：GitHub REST API repos/BerriAI/litellm（2026-07-18 采集；stars/forks 为当日快照，
 *   与 OSS Insight 月度序列存在口径与刷新延迟差异，属正常）
 * - versions：GitHub Releases（BerriAI/litellm/releases，2026-07-18 核对）
 * - 架构与机制：官方 README（github.com/BerriAI/litellm）与 docs.litellm.ai
 */
export const litellmDeep: ToolDeepDive = {
  toolId: 'litellm',

  stats: {
    stars: 53909,
    forks: 9862,
    license: 'MIT（enterprise/ 目录商业授权）',
    checkedAt: '2026-07-18',
  },

  // OSS Insight 月度 star 序列：37 点超过上限，保留首点 + 最近 35 点
  starHistory: [
    { date: '2023-07', stars: 124 },
    { date: '2023-09', stars: 1379 },
    { date: '2023-10', stars: 2303 },
    { date: '2023-11', stars: 3041 },
    { date: '2023-12', stars: 3774 },
    { date: '2024-01', stars: 4597 },
    { date: '2024-02', stars: 5334 },
    { date: '2024-03', stars: 6692 },
    { date: '2024-04', stars: 7852 },
    { date: '2024-05', stars: 8788 },
    { date: '2024-06', stars: 9532 },
    { date: '2024-07', stars: 10236 },
    { date: '2024-08', stars: 11020 },
    { date: '2024-09', stars: 11839 },
    { date: '2024-10', stars: 12628 },
    { date: '2024-11', stars: 13570 },
    { date: '2024-12', stars: 14633 },
    { date: '2025-01', stars: 15855 },
    { date: '2025-02', stars: 17143 },
    { date: '2025-03', stars: 18732 },
    { date: '2025-04', stars: 20330 },
    { date: '2025-05', stars: 21782 },
    { date: '2025-06', stars: 22609 },
    { date: '2025-07', stars: 23774 },
    { date: '2025-08', stars: 24702 },
    { date: '2025-09', stars: 25402 },
    { date: '2025-10', stars: 25776 },
    { date: '2025-11', stars: 26310 },
    { date: '2025-12', stars: 26818 },
    { date: '2026-01', stars: 27479 },
    { date: '2026-02', stars: 28176 },
    { date: '2026-03', stars: 28949 },
    { date: '2026-04', stars: 29506 },
    { date: '2026-05', stars: 29770 },
    { date: '2026-06', stars: 29852 },
    { date: '2026-07', stars: 53909 },
  ],

  versions: [
    { version: 'v1.92.0', date: '2026-07-12', highlight: 'AES-256 凭证加密，新增 Sonnet 5' },
    { version: 'v1.91.0', date: '2026-07-04', highlight: 'MCP 共享 OAuth 与 headroom 压缩护栏' },
    { version: 'v1.90.5', date: '2026-07-17', highlight: '稳定分支回移 Docker 镜像修复' },
    { version: 'v1.90.3', date: '2026-07-03', highlight: '回移 Bedrock toolSpec 与 MCP 日志修复' },
  ],

  architecture: {
    intro:
      'LiteLLM 的核心分层决策是双形态共享内核：SDK 与 Proxy 复用同一套 Router、厂商适配层与成本表，Proxy 只叠加虚拟 Key、预算与回调等治理面，翻译与治理逻辑不分叉。',
    diagram: {
      cols: 4,
      rows: 4,
      nodes: [
        { id: 'app', label: '调用方应用', sub: 'SDK/Agent 代码', kind: 'external', col: 1, row: 1 },
        { id: 'sdk', label: 'SDK 入口', sub: 'completion()', kind: 'core', col: 2, row: 1, group: '接入层' },
        { id: 'proxy', label: 'Proxy 网关', sub: 'FastAPI', kind: 'core', col: 3, row: 1, group: '接入层' },
        { id: 'providers', label: 'LLM 厂商', sub: '100+ 云端本地模型', kind: 'external', col: 4, row: 1 },
        { id: 'auth', label: '虚拟Key鉴权', sub: 'proxy/auth', kind: 'control', col: 1, row: 2, group: '控制面' },
        { id: 'budget', label: '预算限流', sub: 'tpm/rpm 上限', kind: 'control', col: 2, row: 2, group: '控制面' },
        { id: 'guard', label: '内容护栏', sub: 'Guardrails', kind: 'control', col: 3, row: 2, group: '控制面' },
        { id: 'router', label: 'Router', sub: 'router.py', kind: 'core', col: 1, row: 3, group: '路由内核' },
        { id: 'strategy', label: '策略路由', sub: 'simple-shuffle', kind: 'core', col: 2, row: 3, group: '路由内核' },
        { id: 'cooldown', label: '冷却降级', sub: '失败冷却回池', kind: 'core', col: 3, row: 3, group: '路由内核' },
        { id: 'adapt', label: '厂商适配层', sub: 'litellm/llms', kind: 'core', col: 4, row: 3, group: '路由内核' },
        { id: 'costmap', label: '成本表', sub: 'model_prices', kind: 'data', col: 1, row: 4, group: '数据观测' },
        { id: 'spend', label: '计费落库', sub: 'SpendLogs', kind: 'data', col: 2, row: 4, group: '数据观测' },
        { id: 'callbacks', label: '日志回调', sub: 'CustomLogger', kind: 'data', col: 3, row: 4, group: '数据观测' },
      ],
      edges: [
        { from: 'app', to: 'sdk', label: 'SDK 调用' },
        { from: 'app', to: 'proxy', label: 'OpenAI 兼容' },
        { from: 'proxy', to: 'auth', label: 'Key 校验' },
        { from: 'proxy', to: 'budget', label: '预算限流' },
        { from: 'proxy', to: 'guard', label: '前置护栏' },
        { from: 'sdk', to: 'router', label: '可选路由' },
        { from: 'sdk', to: 'adapt', label: '直接调用' },
        { from: 'proxy', to: 'router', label: '转发请求' },
        { from: 'router', to: 'strategy', label: '策略选择' },
        { from: 'router', to: 'cooldown', label: '异常冷却', dashed: true },
        { from: 'router', to: 'adapt', label: '选定部署' },
        { from: 'adapt', to: 'providers', label: '原生 API' },
        { from: 'proxy', to: 'costmap', label: '查价计费', dashed: true },
        { from: 'proxy', to: 'spend', label: '记账落库', dashed: true },
        { from: 'proxy', to: 'callbacks', label: '日志分发', dashed: true },
      ],
      note: 'SDK 与 Proxy 共用 Router、适配层与成本表，治理面只是内核之上的一层薄叠加。',
    },
  },

  dataFlow: {
    intro:
      '一次请求在网关内经两次翻译：先校验虚拟 Key 与预算，Router 选定部署后由适配层把参数译为厂商格式；响应归一为 OpenAI 格式，usage 同步进入计费管线。',
    diagram: {
      direction: 'LR',
      cols: 4,
      rows: 2,
      nodes: [
        { id: 'req', label: '客户端请求', sub: 'OpenAI 格式', kind: 'external', col: 1, row: 1 },
        { id: 'auth', label: '鉴权与预算', sub: '虚拟 Key', kind: 'control', col: 2, row: 1 },
        { id: 'guard', label: '前置护栏', sub: 'Guardrails', kind: 'control', col: 3, row: 1 },
        { id: 'route', label: 'Router', sub: 'router.py', kind: 'core', col: 4, row: 1 },
        { id: 'bill', label: '计费落库', sub: 'SpendLogs', kind: 'data', col: 1, row: 2 },
        { id: 'norm', label: '响应归一化', sub: 'OpenAI 格式', kind: 'core', col: 2, row: 2 },
        { id: 'llm', label: 'LLM API', sub: '各厂商端点', kind: 'external', col: 3, row: 2 },
        { id: 'trans', label: '请求翻译', sub: 'llms/ 适配器', kind: 'core', col: 4, row: 2 },
      ],
      edges: [
        { from: 'req', to: 'auth', label: '携带 Key' },
        { from: 'auth', to: 'guard', label: '通过校验' },
        { from: 'guard', to: 'route', label: '放行请求' },
        { from: 'route', to: 'trans', label: '选定部署' },
        { from: 'trans', to: 'llm', label: '翻译后请求' },
        { from: 'llm', to: 'norm', label: 'SSE 流式响应', dashed: true },
        { from: 'norm', to: 'bill', label: 'usage 计费' },
        { from: 'norm', to: 'req', label: 'OpenAI 格式', dashed: true },
      ],
      note: '请求与响应在网关内各经一次翻译，计费随 usage 在归一化阶段一并落库。',
    },
  },

  sequence: {
    intro:
      '以主部署 429 限流自动降级为例：客户端只发一次请求，网关内部完成虚拟 Key 校验、冷却判定与 fallback 切换，全程对调用方透明，返回仍是标准 OpenAI 格式。',
    diagram: {
      actors: [
        { id: 'client', label: '客户端', kind: 'user' },
        { id: 'proxy', label: 'LiteLLM 网关', kind: 'system' },
        { id: 'router', label: 'Router', kind: 'agent' },
        { id: 'gpt', label: '主模型 GPT', kind: 'external' },
        { id: 'claude', label: '备用 Claude', kind: 'external' },
      ],
      messages: [
        { from: 'client', to: 'proxy', label: 'chat/completions' },
        { from: 'proxy', to: 'proxy', label: '校验虚拟 Key 预算' },
        { from: 'proxy', to: 'router', label: '请求模型部署' },
        { from: 'router', to: 'gpt', label: 'acompletion() 转发' },
        { from: 'gpt', to: 'router', label: '429 限流', dashed: true },
        { from: 'router', to: 'router', label: '冷却并触发 fallback' },
        { from: 'router', to: 'claude', label: '重试备用部署' },
        { from: 'claude', to: 'router', label: '流式返回响应', dashed: true },
        { from: 'proxy', to: 'client', label: '统一格式响应', dashed: true },
      ],
      note: '限流切换发生在网关内部，客户端无感知；花费随响应一并记入 SpendLogs。',
    },
  },

  extension: [
    {
      title: '自定义 Provider',
      desc: '继承 BaseLLM 实现请求/响应双向转换，注册进 custom_provider_map 后，新厂商立刻获得统一接口、重试、流式归一化与成本核算能力。',
    },
    {
      title: 'Callbacks 回调',
      desc: 'success_callback 一行接入 Langfuse、MLflow、Helicone，或继承 CustomLogger 自写处理器，不改业务代码即可扩展日志、评估与告警。',
    },
    {
      title: 'Proxy 钩子与护栏',
      desc: '通过 custom_auth、pre_call_hook 与 Guardrails 框架在请求前后注入自定义鉴权、PII 脱敏、内容审核等逻辑，企业策略以插件落在网关侧。',
    },
    {
      title: '自定义路由策略',
      desc: 'Router 开放 CustomRoutingStrategy 接口，可按租户等级、流量时段、A/B 分组等业务信号实现专属部署选择，与内置延迟/成本策略并存。',
    },
  ],

  challenges: [
    {
      title: '参数语义对齐',
      desc: '各厂商对 thinking、tool_choice、response_format 等参数的支持与语义各异，适配层需逐一翻译、降级或丢弃，映射维护量持续增长。',
    },
    {
      title: '流式响应归一化',
      desc: 'SSE chunk 结构百家争鸣：content、tool_calls、usage 位置各异，须统一拼装为增量格式且不丢计费信息，边界情况是 bug 高发区。',
    },
    {
      title: '高并发状态一致性',
      desc: '网关需在毫秒级完成鉴权、预算校验与记账（官方基准 1k RPS 下 P95 约 8ms），多实例时冷却名单与 spend 计数需经 Redis 保持一致。',
    },
    {
      title: '异常体系归一',
      desc: '限流、鉴权失败、内容过滤的错误码与结构各不相同，需统一映射为 OpenAI 异常类型，并让 Router 据此区分"该重试、该冷却还是该降级"。',
    },
  ],

  positioning:
    'LiteLLM 占据模型网关层，是 Agent 与厂商之间的"模型总线"。SDK+Proxy 双形态：开发者用 completion() 统一调用 100+ 厂商，平台团队用自托管网关收口流量与 Key、预算、护栏。上游对接闭源厂商、云平台与本地推理，下游被各框架及 OpenAI 兼容客户端零改动消费。相比托管聚合的 OpenRouter，它数据不出域、按量不加价，把"换模型"从重构降为配置，是 Agent 成本治理与高可用的支点。',

  landscape: {
    intro:
      'LiteLLM 卡在模型供给与 Agent 消费之间的总线位：上游统一接入闭源厂商、云平台与本地推理，下游以 OpenAI 兼容接口服务 Agent 框架与客户端，日志与指标再导出到观测平台。',
    diagram: {
      direction: 'LR',
      cols: 3,
      rows: 4,
      nodes: [
        { id: 'openai', label: 'OpenAI', sub: 'GPT 系列', kind: 'external', col: 1, row: 1, group: '上游模型供给' },
        { id: 'claude', label: 'Claude', sub: 'Anthropic', kind: 'external', col: 1, row: 2, group: '上游模型供给' },
        { id: 'cloud', label: '云模型平台', sub: 'Bedrock/Vertex', kind: 'external', col: 1, row: 3, group: '上游模型供给' },
        { id: 'local', label: '本地推理', sub: 'Ollama/vLLM', kind: 'external', col: 1, row: 4, group: '上游模型供给' },
        { id: 'litesdk', label: 'LiteLLM', sub: 'Python SDK', kind: 'core', col: 2, row: 1, group: '模型网关' },
        { id: 'liteproxy', label: 'Proxy 网关', sub: 'AI Gateway', kind: 'core', col: 2, row: 2, group: '模型网关' },
        { id: 'agentfw', label: 'Agent 框架', sub: 'LangGraph 等', kind: 'external', col: 3, row: 1, group: '下游消费' },
        { id: 'clients', label: '客户端IDE', sub: 'Cursor/Cline', kind: 'external', col: 3, row: 2, group: '下游消费' },
        { id: 'obs', label: '观测平台', sub: 'Langfuse/OTel', kind: 'external', col: 3, row: 3, group: '下游消费' },
      ],
      edges: [
        { from: 'openai', to: 'litesdk', label: '统一接入' },
        { from: 'claude', to: 'litesdk', label: '统一接入' },
        { from: 'cloud', to: 'liteproxy', label: '统一接入' },
        { from: 'local', to: 'liteproxy', label: '统一接入' },
        { from: 'litesdk', to: 'agentfw', label: '库级嵌入' },
        { from: 'liteproxy', to: 'agentfw', label: 'OpenAI 兼容' },
        { from: 'liteproxy', to: 'clients', label: 'OpenAI 兼容' },
        { from: 'liteproxy', to: 'obs', label: '日志回调', dashed: true },
      ],
      note: '任何 OpenAI 兼容客户端把 base_url 指向 LiteLLM 网关即可零改动接入。',
    },
  },

  competitors: [
    {
      name: 'OpenRouter',
      relation: '直接竞品',
      diff: '托管聚合免运维但数据出域且按用量加价；LiteLLM 自托管、零加价，Key 与预算自主可控。',
    },
    {
      name: 'Portkey',
      relation: '直接竞品',
      diff: '同为开源 AI Gateway 且治理功能相近；LiteLLM 厂商覆盖更广、社区迭代更快，部署更轻。',
    },
    {
      name: 'One API / New API',
      relation: '相邻替代',
      diff: '国内流行的轻量分发网关，擅长 Key 管理与转发，但策略路由、成本核算与企业治理能力较浅。',
    },
    {
      name: '各家原生 SDK',
      relation: '相邻替代',
      diff: '零依赖最直接，但多模型切换、降级容错与成本归集都要自建，规模化后维护成本陡增。',
    },
  ],

  // 核心机制与源码结构来源：docs.litellm.ai（routing / virtual_keys / cost_tracking）、
  // GitHub BerriAI/litellm 顶层与 git tree 递归核对（2026-07-18 核实真实路径）
  mechanism: [
    {
      title: '两次格式翻译',
      desc: 'completion() 按 provider/model 前缀定位 litellm/llms 适配器：transform_request 把 OpenAI 参数翻译、降级或丢弃；transform_response 将响应归一为 OpenAI 格式，流式逐块拼装不丢 usage；错误码映射为 OpenAI 异常类型。',
    },
    {
      title: '冷却与策略路由',
      desc: 'Router 为每个部署按 litellm_params 哈希生成唯一 model_id 追踪健康：429 立即冷却，分钟失败率超 50% 或 401/404/408 同样触发，冷却部署移出候选池、到期自动回池；simple-shuffle 按 rpm/weight 加权抽取，多实例经 Redis 共享冷却与用量。',
    },
    {
      title: '虚拟Key校验链',
      desc: '网关只存哈希后的 Key。user_api_key_auth 先查内存/Redis 缓存还原 Key 对象，未命中再查 Postgres，随后依次校验有效期、blocked、models 白名单、Key/Team 预算与 tpm/rpm 并发上限；任一失败即返回 OpenAI 类型错误，全链毫秒级。',
    },
    {
      title: '计费日志管线',
      desc: 'completion_cost() 用 usage 乘内置成本表算出美元花费（含缓存 token 分级定价），异步写入：明细进 LiteLLM_SpendLogs 供审计，聚合并发更新 Key/User/Team 三表 spend 并批量落库削峰；x-litellm-response-cost 响应头同步返回。',
    },
  ],

  sourceLayout: [
    { path: 'litellm/main.py', role: 'completion() 统一入口：解析 provider 前缀并分发调用' },
    { path: 'litellm/llms/', role: '100+ 厂商适配器，每家实现请求/响应双向翻译' },
    { path: 'litellm/router.py', role: 'Router 主体：部署选择、重试、fallback 编排' },
    { path: 'litellm/router_strategy/', role: '路由策略实现：加权/最低延迟/最少忙碌/成本' },
    { path: 'litellm/proxy/', role: 'FastAPI 网关：OpenAI 兼容路由与管理端点' },
    { path: 'litellm/proxy/auth/', role: '虚拟 Key 鉴权、预算与限流校验链' },
    { path: 'litellm/caching/', role: '内存/Redis 缓存与限流用量计数' },
    { path: 'litellm-rust/', role: '分阶段 Rust 实现：纯转换核心+axum 网关+PyO3 桥' },
  ],

  tradeoffs: [
    {
      title: '双形态交付',
      choice: '同一内核，库与网关两种交付',
      reason: '开发者要库级集成、零运维直接嵌进代码；平台团队要集中服务收口 Key、预算与护栏。两者共享 Router 与适配层，避免治理逻辑与翻译逻辑各自分叉。',
    },
    {
      title: '异常归一化',
      choice: '全部映射为 OpenAI 异常类型',
      reason: '调用方只需捕获一套异常体系即可兼容 100+ 厂商；Router 的 RetryPolicy 与冷却判定也才能按统一异常类型区分"重试、冷却还是降级"，否则策略层要写厂商特例。',
    },
    {
      title: '内置成本表',
      choice: '价格 JSON 随版本发布',
      reason: '成本表让调用离线算费，无需联网询价；代价是厂商调价后数据滞后，官方文档专设"成本与账单不符"排查流程（model_prices_and_context_window.json）。',
    },
  ],

  production: [
    {
      title: '高可用部署形态',
      desc: '官方 Terraform 模块拆网关为 gateway/backend/UI 三服务，配托管 Postgres 与 Redis；生产镜像用 -stable 标签，发布前过 12 小时负载测试。',
    },
    {
      title: 'Redis 缓存与限流',
      desc: '官方建议生产必须接 Redis：多实例共享冷却名单与 tpm/rpm 计数，避免限流口径漂移；cache_responses 响应缓存可降本提速。纯内存模式状态不出进程，扩容后即失效。',
    },
    {
      title: '计费落地与常见坑',
      desc: 'Spend 追踪依赖 DATABASE_URL，按 Key/User/Team 聚合。官方警告：终端用户可自报 user 参数绕过统计，发 Key 必须绑定 user_id 由后端代发。',
    },
    {
      title: 'Rust 迁移现状',
      desc: 'litellm-rust 分阶段重写：Rust 先做纯转换核心，鉴权、网络 IO、重试、日志、spend 仍归 Python，逐项对等后才切换；PyO3 桥暴露给 Python SDK。',
    },
  ],

  en: {
    tagline:
      'One OpenAI-compatible interface and AI gateway for 100+ LLMs — switch models with one line, with routing, fallbacks, budgets and spend tracking built in.',
    summary:
      'LiteLLM is an open-source model gateway available as both a Python SDK and a self-hosted proxy. Its completion() API maps 100+ providers — OpenAI, Anthropic, Azure, Bedrock, Vertex, Ollama and more — into the OpenAI request/response format, normalizing parameters, streaming chunks and exceptions. The Router adds deployment-level load balancing, cooldowns and fallbacks, while the proxy contributes virtual keys, per-team budgets, guardrails and an admin UI. A built-in model cost map powers accurate per-call spend tracking, and callbacks stream logs to Langfuse, MLflow or OpenTelemetry, making LiteLLM the default "model bus" for production agents.',
  },
}
