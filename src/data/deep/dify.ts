import type { ToolDeepDive } from '../deepDive'

/**
 * Dify 深度解析
 * 事实来源：
 * - Star 历史：OSS Insight API（api.ossinsight.io/v1/repos/langgenius/dify/stargazers/history）
 * - 统计快照：GitHub API（api.github.com/repos/langgenius/dify），2026-07-18 采集
 * - 版本记录：github.com/langgenius/dify/releases 及官方 Release Notes
 * - 架构组件：官方 README、docker-compose 服务编排与 v1.14-1.16 Release Notes
 *   （GraphEngine、graphon、plugin-daemon、dify-sandbox、SSRF proxy 均为真实组件）
 * - 机制深潜：v1.9.0 队列化引擎 Release Notes（Dispatcher/WorkerPool/ResponseCoordinator）、
 *   api/core/rag/retrieval/dataset_retrieval.py、api/core/plugin/impl/plugin.py、
 *   api/extensions/ext_celery.py、docker/docker-compose.yaml、langgenius/graphon README、
 *   langgenius/dify-sandbox README、plugin-daemon 运行时模式官方解析
 */
export const difyDeep: ToolDeepDive = {
  toolId: 'dify',

  stats: {
    stars: 149209,
    forks: 23507,
    license: 'Apache-2.0（附加条件）',
    checkedAt: '2026-07-18',
  },

  // OSS Insight 月度 star：共 40 点，按规则保留首点 + 最近 35 点
  starHistory: [
    { date: '2023-04', stars: 16 },
    { date: '2023-09', stars: 8020 },
    { date: '2023-10', stars: 8592 },
    { date: '2023-11', stars: 11063 },
    { date: '2023-12', stars: 12769 },
    { date: '2024-01', stars: 14127 },
    { date: '2024-02', stars: 15758 },
    { date: '2024-03', stars: 17852 },
    { date: '2024-04', stars: 24503 },
    { date: '2024-05', stars: 30253 },
    { date: '2024-06', stars: 33896 },
    { date: '2024-07', stars: 37873 },
    { date: '2024-08', stars: 41584 },
    { date: '2024-09', stars: 44689 },
    { date: '2024-10', stars: 47921 },
    { date: '2024-11', stars: 50756 },
    { date: '2024-12', stars: 54047 },
    { date: '2025-01', stars: 57893 },
    { date: '2025-02', stars: 71379 },
    { date: '2025-03', stars: 83310 },
    { date: '2025-04', stars: 89863 },
    { date: '2025-05', stars: 93921 },
    { date: '2025-06', stars: 97038 },
    { date: '2025-07', stars: 99566 },
    { date: '2025-08', stars: 101645 },
    { date: '2025-09', stars: 103333 },
    { date: '2025-10', stars: 104124 },
    { date: '2025-11', stars: 105112 },
    { date: '2025-12', stars: 106948 },
    { date: '2026-01', stars: 108477 },
    { date: '2026-02', stars: 109323 },
    { date: '2026-03', stars: 110233 },
    { date: '2026-04', stars: 111049 },
    { date: '2026-05', stars: 111398 },
    { date: '2026-06', stars: 111524 },
    { date: '2026-07', stars: 149209 },
  ],

  versions: [
    { version: '1.16.0', date: '2026-07-17', highlight: 'Agent App 公测，内置沙箱与技能体系' },
    { version: '1.15.0', date: '2026-06-25', highlight: '新增 difyctl 命令行与 CoT 思考面板' },
    { version: '1.14.2', date: '2026-05-19', highlight: '租户隔离与工具凭据安全加固' },
    { version: '1.14.1', date: '2026-05-12', highlight: '安全加固与工作流稳定性改进' },
    { version: '1.14.0', date: '2026-04-29', highlight: '工作流协同编辑与在线状态同步' },
  ],

  architecture: {
    intro:
      '关键取舍是把不可信与可替换的部分全部进程化：编排下沉为独立引擎 graphon，插件与沙箱各自成服务，插件经 Inner API 反向取模型能力，沙箱与 SSRF 代理共筑隔离边界。',
    diagram: {
      cols: 3,
      rows: 5,
      nodes: [
        { id: 'nginx', label: 'Nginx 网关', sub: '反向代理', kind: 'external', col: 1, row: 1, group: '接入层' },
        { id: 'web', label: 'Web 前端', sub: 'Next.js 控制台', kind: 'core', col: 2, row: 1, group: '接入层' },
        { id: 'api', label: 'API 服务', sub: 'Flask REST 后端', kind: 'core', col: 1, row: 2, group: '控制面' },
        { id: 'worker', label: '异步任务', sub: 'Celery Worker', kind: 'control', col: 2, row: 2, group: '控制面' },
        { id: 'beat', label: '定时调度', sub: 'worker_beat', kind: 'control', col: 3, row: 2, group: '控制面' },
        { id: 'graph', label: '工作流引擎', sub: 'graphon 独立包', kind: 'core', col: 1, row: 3, group: '数据面' },
        { id: 'rag', label: 'RAG 管线', sub: '混合检索', kind: 'core', col: 2, row: 3, group: '数据面' },
        { id: 'plugin', label: '插件守护', sub: 'plugin-daemon', kind: 'core', col: 1, row: 4, group: '数据面' },
        { id: 'sandbox', label: '代码沙箱', sub: 'dify-sandbox', kind: 'external', col: 2, row: 4, group: '数据面' },
        { id: 'ssrf', label: 'SSRF 代理', sub: 'squid 正向代理', kind: 'external', col: 3, row: 4, group: '数据面' },
        { id: 'db', label: '主数据库', sub: 'PostgreSQL', kind: 'data', col: 1, row: 5, group: '存储层' },
        { id: 'redis', label: 'Redis', sub: '缓存·消息队列', kind: 'data', col: 2, row: 5, group: '存储层' },
        { id: 'vecdb', label: '向量库', sub: '多后端可插拔', kind: 'data', col: 3, row: 5, group: '存储层' },
      ],
      edges: [
        { from: 'nginx', to: 'web', label: '静态分发' },
        { from: 'nginx', to: 'api', label: 'API 转发' },
        { from: 'api', to: 'graph', label: '触发编排' },
        { from: 'graph', to: 'rag', label: '检索节点' },
        { from: 'graph', to: 'plugin', label: '工具调用' },
        { from: 'plugin', to: 'api', label: 'Inner API' },
        { from: 'graph', to: 'sandbox', label: '代码执行' },
        { from: 'sandbox', to: 'ssrf', label: '出站经代理' },
        { from: 'api', to: 'worker', label: 'Celery 派发' },
        { from: 'beat', to: 'worker', label: '周期任务' },
        { from: 'api', to: 'db', label: '元数据读写' },
        { from: 'api', to: 'redis', label: '缓存·队列' },
        { from: 'worker', to: 'db', label: '任务落库' },
        { from: 'rag', to: 'vecdb', label: '索引·召回' },
      ],
      note: 'plugin-daemon 反向经 Inner API 回调主服务取模型能力，是一条独立的受控通道。',
    },
  },

  dataFlow: {
    intro:
      '一次对话请求的全生命周期：API 载入图定义交给队列化引擎逐节点推进，节点事件全程以 SSE 实时回推。其中知识检索节点并行发起向量与全文召回再重排，是整条链路里分支最多的一段。',
    diagram: {
      cols: 7,
      rows: 3,
      direction: 'LR',
      nodes: [
        { id: 'user', label: '用户提问', sub: 'chat-messages', kind: 'external', col: 1, row: 2 },
        { id: 'api', label: 'API 服务', sub: 'Flask 接入', kind: 'core', col: 2, row: 2 },
        { id: 'ctx', label: '上下文组装', sub: 'Prompt 模板', kind: 'control', col: 3, row: 1 },
        { id: 'recall', label: '知识检索', sub: '向量+全文', kind: 'core', col: 3, row: 3 },
        { id: 'graph', label: '引擎执行', sub: 'graphon', kind: 'core', col: 4, row: 2 },
        { id: 'llm', label: 'LLM 节点', sub: '流式生成', kind: 'core', col: 5, row: 1 },
        { id: 'plugin', label: '工具插件', sub: 'plugin-daemon', kind: 'external', col: 5, row: 3 },
        { id: 'vdb', label: '向量索引', sub: 'Weaviate 等', kind: 'data', col: 4, row: 3 },
        { id: 'resp', label: '响应输出', sub: 'Answer 合成', kind: 'external', col: 6, row: 2 },
      ],
      edges: [
        { from: 'user', to: 'api', label: 'POST JSON' },
        { from: 'api', to: 'ctx', label: '变量注入' },
        { from: 'api', to: 'recall', label: '检索请求' },
        { from: 'api', to: 'graph', label: '图定义 JSON' },
        { from: 'recall', to: 'vdb', label: 'TopK 召回' },
        { from: 'vdb', to: 'graph', label: 'Rerank 片段' },
        { from: 'ctx', to: 'graph', label: 'Prompt 入图' },
        { from: 'graph', to: 'llm', label: '流式请求' },
        { from: 'graph', to: 'plugin', label: 'invoke 工具' },
        { from: 'llm', to: 'resp', label: 'SSE token' },
        { from: 'graph', to: 'resp', label: '节点事件' },
      ],
      note: '提问、上下文、知识片段三条支流在 LLM 节点汇合，工具调用全程被隔离在 plugin-daemon。',
    },
  },

  sequence: {
    intro:
      '以带工具调用的 Chatflow 为例看流式优先设计：请求由 GraphEngine 逐节点调度，途中做知识检索与插件调用，token 流与节点事件经 SSE 实时回推。',
    diagram: {
      actors: [
        { id: 'user', label: '终端用户', kind: 'user' },
        { id: 'api', label: 'API 服务', kind: 'system' },
        { id: 'engine', label: '工作流引擎', kind: 'agent' },
        { id: 'plugin', label: '插件守护进程', kind: 'external' },
        { id: 'llm', label: 'LLM 供应商', kind: 'external' },
      ],
      messages: [
        { from: 'user', to: 'api', label: 'chat-messages 请求' },
        { from: 'api', to: 'engine', label: 'graph.stream 启动' },
        { from: 'engine', to: 'engine', label: '知识库检索召回' },
        { from: 'engine', to: 'plugin', label: 'invoke 工具调用' },
        { from: 'plugin', to: 'engine', label: '工具结果 JSON', dashed: true },
        { from: 'engine', to: 'llm', label: '流式 chat 请求' },
        { from: 'llm', to: 'engine', label: 'token 增量回传', dashed: true },
        { from: 'engine', to: 'api', label: '节点事件 SSE' },
        { from: 'api', to: 'user', label: '流式渲染回答', dashed: true },
      ],
      note: 'HITL 节点会让执行在此处暂停挂起，人工提交后从断点恢复。',
    },
  },

  extension: [
    {
      title: '插件开发（Plugin Daemon 体系）',
      desc: '基于独立的 plugin-daemon 运行时开发插件：可打包模型供应商、工具、Agent 策略与 Endpoint，签名校验后安装，支持热更新并发布到 Marketplace。',
    },
    {
      title: '自定义模型供应商',
      desc: '实现供应商接口即可接入私有模型：声明模型类型、参数规则与凭据表单，运行时统一适配为标准化调用；任何 OpenAI 兼容端点（如 Ollama、vLLM）可零代码快速接入。',
    },
    {
      title: '自定义工具',
      desc: '在 50+ 内置工具之外，可用 OpenAPI/Swagger schema 生成 API 工具，或以插件 SDK 编写带鉴权表单的自定义工具供工作流调用。',
    },
    {
      title: '外部知识库 API',
      desc: '通过 External Knowledge API 把企业已有检索系统挂接为知识库，召回结果与内置 RAG 统一进入工作流与引用展示，无需迁移数据即可复用现有搜索基础设施。',
    },
  ],

  challenges: [
    {
      title: '图引擎的流式执行与状态恢复',
      desc: 'GraphEngine 把节点编排为可中断的有向图执行：要同时支持流式 token、HITL 暂停恢复与运行中停止，状态一致性处理不当会导致会话悬挂、事件乱序或重复计费。',
    },
    {
      title: '多租户安全隔离',
      desc: '平台集中托管多租户的模型凭据与用户文件，需全链路防御 SSRF、路径穿越与越权访问（近年披露多个 CVE），代码执行节点还须 Sandbox 隔离，攻击面治理成本高。',
    },
    {
      title: '多后端向量库语义一致',
      desc: '检索抽象层需兼容 Weaviate、Milvus、pgvector 等二十余种向量库的能力差异，混合检索、元数据过滤与 Rerank 语义要在所有后端保持一致，兼容性测试矩阵庞大。',
    },
    {
      title: '插件运行时治理',
      desc: '插件以独立进程运行并访问内网 API，需处理签名验证、权限边界、依赖安装（PyPI 镜像自动选择）与版本兼容，守护进程故障会直接影响全部插件调用。',
    },
  ],

  positioning:
    'Dify 位于 Agent 技术栈的「产品化平台层」：不与 LangGraph 等框架竞争底层编排，而是把编排画布、RAG、模型接入、权限与运营打包成可直接上线的完整产品。对上消化模型与向量库生态的多样性，对下以 API 与 WebApp 嵌入企业业务。相比 Coze 等闭源 SaaS，它以可自托管赢得数据敏感组织；相比 n8n 等通用自动化工具，它保有知识库与 LLMOps 原生深度，是观察 Agent 能力产品化治理的最佳样本。',

  landscape: {
    intro:
      'Dify 的生态位是应用平台层：上游以标准化接入消化模型与向量库的多样性，下游经 Service API 嵌入业务；外部知识库 API 让企业免迁移复用现有搜索系统。',
    diagram: {
      cols: 5,
      rows: 3,
      direction: 'LR',
      nodes: [
        { id: 'openai', label: '模型供应商', sub: 'OpenAI 等数百种', kind: 'external', col: 1, row: 1, group: '上游依赖' },
        { id: 'ollama', label: '本地模型', sub: 'Ollama·vLLM', kind: 'external', col: 1, row: 2, group: '上游依赖' },
        { id: 'vdb', label: '向量数据库', sub: 'Weaviate 等', kind: 'external', col: 1, row: 3, group: '上游依赖' },
        { id: 'docsrc', label: '文档数据源', sub: 'Unstructured', kind: 'external', col: 2, row: 1, group: '上游依赖' },
        { id: 'extkb', label: '外部知识库', sub: '外部知识库 API', kind: 'external', col: 2, row: 3, group: '上游依赖' },
        { id: 'dify', label: 'Dify', sub: 'LLM 应用平台', kind: 'core', col: 3, row: 2 },
        { id: 'market', label: '插件市场', sub: 'Marketplace', kind: 'control', col: 3, row: 1 },
        { id: 'apps', label: '业务系统', sub: 'Service API 集成', kind: 'external', col: 4, row: 1, group: '下游应用' },
        { id: 'embed', label: '嵌入组件', sub: 'WebApp·iframe', kind: 'external', col: 4, row: 3, group: '下游应用' },
        { id: 'obs', label: '可观测平台', sub: 'Langfuse', kind: 'external', col: 5, row: 2, group: '下游应用' },
        { id: 'notion', label: '站点同步', sub: 'Notion·网页', kind: 'external', col: 2, row: 2, group: '上游依赖' },
      ],
      edges: [
        { from: 'openai', to: 'dify', label: '模型接入' },
        { from: 'ollama', to: 'dify', label: 'OpenAI 兼容' },
        { from: 'vdb', to: 'dify', label: '向量存储' },
        { from: 'docsrc', to: 'dify', label: '知识摄取' },
        { from: 'extkb', to: 'dify', label: '召回接入' },
        { from: 'notion', to: 'dify', label: '文档同步' },
        { from: 'market', to: 'dify', label: '插件分发' },
        { from: 'dify', to: 'apps', label: 'REST 发布' },
        { from: 'dify', to: 'embed', label: '嵌入集成' },
        { from: 'dify', to: 'obs', label: 'Trace 上报' },
      ],
      note: '上游生态 → Dify 平台 → 下游应用与观测，构成完整生产闭环。',
    },
  },

  competitors: [
    {
      name: 'Coze（扣子）',
      relation: '直接竞品',
      diff: '字节跳动商业化 Bot 编排平台，插件生态与 C 端分发强，但以闭源 SaaS 为主，自托管与数据主权能力弱。',
    },
    {
      name: 'FastGPT',
      relation: '直接竞品',
      diff: '同为开源知识库问答平台，RAG 调优细致，但模型接入广度、插件体系与企业级多租户能力不及 Dify。',
    },
    {
      name: 'n8n',
      relation: '相邻替代',
      diff: '通用自动化工作流，SaaS 集成节点庞大，AI 编排为后加能力，缺少知识库与 LLMOps 的 LLM 原生深度。',
    },
    {
      name: 'Flowise',
      relation: '直接竞品',
      diff: 'LangChain 概念的可视化封装，适合链式原型验证，应用发布、运营分析与权限治理等产品化层较薄。',
    },
  ],

  mechanism: [
    {
      title: '队列调度与流式输出',
      desc: 'v1.9 起引擎改为队列驱动：就绪节点入统一队列，Dispatcher 管依赖顺序，WorkerPool 并行拉分支，ResponseCoordinator 汇聚流式输出保时序，CommandProcessor 接收停止命令；图级与节点级事件经 API 层转 SSE 推前端，引擎核心已拆为独立包 graphon。',
    },
    {
      title: '插件守护进程调用链',
      desc: 'plugin-daemon 为 Go 独立服务，API 侧 core/plugin 客户端以 HTTP+SERVER_KEY 调其接口；本地模式以子进程拉起 Python 插件，经 stdio 管道收发 JSON，调试模式改走 TCP 长连接；插件反向经 Inner API 回调主服务取模型能力，安装须过签名校验。',
    },
    {
      title: 'RAG 索引与混合召回',
      desc: '离线索引侧：文档经内置解析器或 Unstructured 抽取清洗切分，高质量模式双写向量库与 Jieba 关键词表，父子索引记录子块到父段的映射。在线召回侧：多线程并行检索多知识库，向量加全文混合后经重排模型或加权分融合，元数据过滤可由 LLM 自动生成条件，命中计数由后台线程异步回写主库。',
    },
    {
      title: 'Celery 异步分工',
      desc: 'API 只扛同步短请求；索引构建、标注生成、异步工作流触发、邮件等重活交给 Celery worker，worker 与 api 同镜像按 MODE 切角色；worker_beat 以 crontab 驱动消息清理、插件升级检查等周期任务，代码集中在 api/tasks 与 api/schedule。',
    },
  ],

  sourceLayout: [
    { path: 'api/core/workflow', role: '工作流引擎接入层与节点实现（LLM、知识检索等）' },
    { path: 'api/core/rag', role: 'RAG 管线：索引处理、混合召回、重排与关键词检索' },
    { path: 'api/core/plugin', role: '插件客户端：经 HTTP 调用 plugin-daemon' },
    { path: 'api/tasks', role: 'Celery 异步任务：索引构建、异步工作流触发' },
    { path: 'api/controllers', role: 'REST 入口层：console、service_api、web、trigger 等' },
    { path: 'web', role: 'Next.js 控制台与 WebApp 前端' },
    { path: 'docker', role: 'compose、nginx、ssrf_proxy 与向量库编排' },
    { path: 'dify-agent', role: '1.16 新增 Dify Agent 服务（Beta）' },
  ],

  tradeoffs: [
    {
      title: '插件独立进程化',
      choice: '拆出 plugin-daemon 进程',
      reason: '1.0 前模型与工具代码内嵌主进程，任一插件崩溃或依赖冲突都会拖垮 API。独立进程换来故障隔离、独立扩缩容与热更新，并可强制签名校验；代价是多一条 HTTP/stdio 调用链。',
    },
    {
      title: '平台化而非框架',
      choice: '做产品化平台而非代码框架',
      reason: '官方定位开源 LLM 应用平台：画布、RAG、LLMOps 打包成产品，从原型直达生产；灵活缺口由插件 SDK 与 Service API 补位，与 LangChain 框架互补。',
    },
    {
      title: '多服务部署形态',
      choice: '多服务拓扑加按需 profile',
      reason: 'api、worker、plugin_daemon、sandbox 分离可独立扩缩容，但运维面变大；官方以 compose profile 令向量库等按需启用，控制最小自托管规模。',
    },
  ],

  production: [
    {
      title: 'Compose 生产拓扑',
      desc: 'api 与 worker 同镜像按 MODE 切角色，web、db、redis、nginx 常驻，向量库等以 compose profile 按需拉起；worker 承载全部 Celery 队列。',
    },
    {
      title: 'SSRF 代理与沙箱',
      desc: 'sandbox 只挂 internal 内网，出站强制走 ssrf_proxy 防 SSRF；dify-sandbox 以 libseccomp 限制系统调用与资源；生产务必改默认 API_KEY。',
    },
    {
      title: '向量库选型',
      desc: '默认 weaviate；pgvector 复用 Postgres 省组件；economy 模式走纯关键词检索可省 Embedding；切换后端需重建索引，按规模与运维成本选。',
    },
    {
      title: '插件守护运维',
      desc: 'plugin_daemon 配独立库 dify_plugin，FORCE_VERIFYING_SIGNATURE 控签名安装；远程调试端口勿暴露公网，daemon 故障即中断全部插件调用。',
    },
  ],

  en: {
    tagline:
      'Open-source platform for building and operating production LLM applications with visual workflows, RAG, and agents.',
    summary:
      'Dify is an open-source LLM application development platform that combines a visual workflow canvas, a complete RAG pipeline, agent strategies, and unified model access behind one product. Its architecture pairs a Next.js console with a Flask API and Celery workers, while a dedicated plugin daemon runs model providers, tools, and endpoints in isolation. Teams compose chatflows and workflows from typed nodes, connect hundreds of models, index private documents, and publish every app as an API or embeddable web app. With built-in LLMOps logging, annotation, and tracing integrations, Dify shortens the path from prototype to production for engineering-light teams.',
  },
}
