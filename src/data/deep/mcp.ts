import type { ToolDeepDive } from '../deepDive'

/**
 * MCP（Model Context Protocol）深度解析
 * 数据来源：
 * - starHistory：OSS Insight API（modelcontextprotocol/servers），共 21 个月度点；
 *   2026-07 末点修正为 GitHub 当前值
 * - stats：GitHub REST API /repos/modelcontextprotocol/servers（2026-07-18 经 ungh.cc 代理核对）；
 *   License 依仓库 README：存量代码 MIT、新贡献 Apache-2.0
 * - versions：modelcontextprotocol/python-sdk GitHub Releases API（亮点取自 release notes 首段）
 * - 架构：modelcontextprotocol.io 官方文档（Host/Client/Server、能力协商、原语、传输、反向能力）；
 *   高层 API 按 v2 更名 MCPServer（原 FastMCP）
 * - mechanism/tradeoffs/production：MCP 2025-06-18 规范（lifecycle/transports/tools/sampling/
 *   elicitation/authorization/architecture）与官方 Security Best Practices、Python SDK v2 部署文档
 * - sourceLayout：modelcontextprotocol/python-sdk main 分支（v2）真实目录树
 */
export const mcpDeep: ToolDeepDive = {
  toolId: 'mcp',
  stats: {
    stars: 88596,
    forks: 11238,
    license: 'MIT/Apache-2.0',
    checkedAt: '2026-07-18',
  },
  starHistory: [
    { date: '2024-11', stars: 2774 },
    { date: '2024-12', stars: 5312 },
    { date: '2025-01', stars: 6929 },
    { date: '2025-02', stars: 10301 },
    { date: '2025-03', stars: 25487 },
    { date: '2025-04', stars: 38057 },
    { date: '2025-05', stars: 44451 },
    { date: '2025-06', stars: 48313 },
    { date: '2025-07', stars: 51547 },
    { date: '2025-08', stars: 53907 },
    { date: '2025-09', stars: 55553 },
    { date: '2025-10', stars: 56396 },
    { date: '2025-11', stars: 57176 },
    { date: '2025-12', stars: 57890 },
    { date: '2026-01', stars: 58759 },
    { date: '2026-02', stars: 59380 },
    { date: '2026-03', stars: 59970 },
    { date: '2026-04', stars: 60366 },
    { date: '2026-05', stars: 60527 },
    { date: '2026-06', stars: 60572 },
    { date: '2026-07', stars: 88596 },
  ],
  versions: [
    { version: '2.0.0b2', date: '2026-07-14', highlight: '第二个 v2 beta，HTTP 栈迁移至 httpx2' },
    { version: '2.0.0b1', date: '2026-06-30', highlight: '首个 v2 beta，完整支持 2026-07-28 规范' },
    { version: '1.28.0', date: '2026-06-16', highlight: '弃用 WebSocket 传输与实验性 tasks API' },
    { version: '1.27.0', date: '2026-04-02', highlight: 'OAuth RFC 8707 校验与 HTTP 会话空闲超时' },
    { version: '1.25.0', date: '2025-12-18', highlight: '确立 main/v1.x 分支策略，v1 转入维护' },
  ],
  architecture: {
    intro:
      'MCP 的核心取舍是把授权与编排收口在 Host：它为每个 Server 建立一对一 Client 会话，协议层只定义 JSON-RPC 双向消息帧与两种传输，Server 侧保持极简、仅以三类原语暴露能力，模型厂商、宿主与能力提供方由此各自独立演进。',
    diagram: {
      cols: 4,
      rows: 3,
      nodes: [
        { id: 'user', label: '用户', sub: '最终授权人', kind: 'control', col: 1, row: 1 },
        { id: 'host', label: 'Host 应用', sub: 'Claude·Cursor 宿主', kind: 'core', col: 2, row: 1, group: '宿主层' },
        { id: 'authz', label: '授权审计', sub: 'Host 逐次审批', kind: 'control', col: 3, row: 1, group: '宿主层' },
        { id: 'llm', label: 'LLM 模型', sub: '任意模型厂商', kind: 'external', col: 4, row: 1 },
        { id: 'client', label: 'Client 会话', sub: '每 Server 一对一', kind: 'core', col: 1, row: 2, group: '宿主层' },
        { id: 'rpc', label: '消息协议', sub: 'JSON-RPC 2.0', kind: 'data', col: 2, row: 2, group: '协议层' },
        { id: 'transport', label: '双传输', sub: 'stdio/HTTP', kind: 'data', col: 3, row: 2, group: '协议层' },
        { id: 'rev', label: '反向能力', sub: 'sampling 等', kind: 'control', col: 4, row: 2 },
        { id: 'fastmcp', label: 'MCPServer', sub: '原 FastMCP', kind: 'core', col: 1, row: 3, group: '服务端' },
        { id: 'lowlevel', label: '低层服务', sub: 'lowlevel 模块', kind: 'core', col: 2, row: 3, group: '服务端' },
        { id: 'prims', label: '三类原语', sub: '工具/资源/提示', kind: 'data', col: 3, row: 3, group: '服务端' },
        { id: 'data', label: '外部数据源', sub: '数据库·SaaS·文件', kind: 'external', col: 4, row: 3 },
      ],
      edges: [
        { from: 'user', to: 'host', label: '下达指令' },
        { from: 'host', to: 'llm', label: '注入工具上下文' },
        { from: 'host', to: 'client', label: '创建一对一连接' },
        { from: 'host', to: 'authz', label: '授权收口' },
        { from: 'client', to: 'rpc', label: '封装消息帧' },
        { from: 'rpc', to: 'transport', label: '传输无关' },
        { from: 'transport', to: 'fastmcp', label: 'stdio/HTTP', bidirectional: true },
        { from: 'transport', to: 'lowlevel', label: '双向会话', bidirectional: true },
        { from: 'fastmcp', to: 'prims', label: '装饰器注册' },
        { from: 'lowlevel', to: 'prims', label: '手动注册' },
        { from: 'prims', to: 'data', label: '读写数据' },
        { from: 'lowlevel', to: 'rev', label: '反向调用', dashed: true },
        { from: 'rev', to: 'client', label: '采样求助', dashed: true },
      ],
      note: '能力在 initialize 一次协商，授权在 Host 逐次把关，Server 永远看不到完整对话。',
    },
  },
  dataFlow: {
    intro:
      '一次 tools/call 的全生命周期走同一条双向通道：工具 schema 随上下文下行，模型的 tool_use 决策经 Host 授权后由 Client 发出 JSON-RPC 请求，Server 校验入参执行并返回结构化结果，沿原路回注上下文生成答复，全程可审计。',
    diagram: {
      cols: 4,
      rows: 2,
      direction: 'LR',
      nodes: [
        { id: 'u', label: '用户', sub: '自然语言请求', kind: 'external', col: 1, row: 1 },
        { id: 'host', label: 'Host 编排', sub: '授权与注入', kind: 'core', col: 2, row: 1 },
        { id: 'llm', label: 'LLM', sub: '输出 tool_use', kind: 'external', col: 3, row: 1 },
        { id: 'client', label: 'Client 会话', sub: '协议封装', kind: 'core', col: 4, row: 1 },
        { id: 'ans', label: '最终答复', sub: '呈现给用户', kind: 'external', col: 1, row: 2 },
        { id: 'res', label: '结构化结果', sub: 'content 数组', kind: 'data', col: 2, row: 2 },
        { id: 'tool', label: '工具执行', sub: '校验入参', kind: 'data', col: 3, row: 2 },
        { id: 'server', label: 'MCP Server', sub: '能力提供方', kind: 'core', col: 4, row: 2 },
      ],
      edges: [
        { from: 'u', to: 'host', label: '提问' },
        { from: 'host', to: 'llm', label: '上下文+schema' },
        { from: 'llm', to: 'host', label: 'tool_use' },
        { from: 'host', to: 'client', label: 'tools/call' },
        { from: 'client', to: 'server', label: 'JSON-RPC 帧' },
        { from: 'server', to: 'tool', label: '执行/读取' },
        { from: 'tool', to: 'res', label: '结果封装' },
        { from: 'res', to: 'llm', label: '回注上下文', dashed: true },
        { from: 'llm', to: 'ans', label: '生成答复', dashed: true },
      ],
      note: 'schema 下行与结果上行共用同一连接，Host 在每一次调用处都保有审计切面。',
    },
  },
  sequence: {
    intro:
      '一次典型会话的关键在于 initialize 只发生一次：握手完成协议版本与能力协商后，工具发现与调用都按协商结果进行；此后每次工具调用都由 Host 授权把关，经 Client 以 JSON-RPC 直达 Server 并拿回结构化结果。',
    diagram: {
      actors: [
        { id: 'user', label: '用户', kind: 'user' },
        { id: 'host', label: 'Host 应用', kind: 'agent' },
        { id: 'client', label: 'MCP Client', kind: 'system' },
        { id: 'server', label: 'MCP Server', kind: 'external' },
      ],
      messages: [
        { from: 'client', to: 'server', label: 'initialize 握手' },
        { from: 'server', to: 'client', label: '版本与能力声明', dashed: true },
        { from: 'client', to: 'server', label: 'initialized 通知' },
        { from: 'client', to: 'server', label: 'tools/list' },
        { from: 'server', to: 'client', label: '工具与 schema', dashed: true },
        { from: 'user', to: 'host', label: '提问并授权' },
        { from: 'host', to: 'client', label: 'tools/call' },
        { from: 'client', to: 'server', label: 'JSON-RPC 调用' },
        { from: 'server', to: 'client', label: '结构化结果', dashed: true },
      ],
      note: '协商一次、调用多次；协议版本互不兼容时 Client 应直接断开连接。',
    },
  },
  extension: [
    {
      title: '自有 Server（MCPServer）',
      desc: '用 Python SDK 的 MCPServer（v2 原名 FastMCP）或 TS SDK 的装饰器 API，几行代码把任意函数、数据源暴露为 Tools/Resources/Prompts，参数 schema 由类型标注自动推断，即刻被所有兼容 Host 接入。',
    },
    {
      title: '低层 Server API',
      desc: '绕过装饰器、以构造参数传入 handler，可精细控制能力协商、列表分页、变更通知与错误码，适合需要定制协议行为或对接复杂后端的高级场景。',
    },
    {
      title: '自定义 Transport',
      desc: 'SDK 将协议层与传输层解耦，实现 Transport 接口即可跑在任意通道上：进程内内存传输用于测试，WebSocket、消息队列等私有通道亦可接入。',
    },
    {
      title: '中间件与扩展 API',
      desc: 'v2 SDK 引入 (ctx, call_next) 形式的服务端中间件与可插拔扩展 API，可在不改动工具实现的前提下叠加鉴权、日志、OpenTelemetry 追踪与响应缓存。',
    },
  ],
  challenges: [
    {
      title: '双向会话与死锁',
      desc: 'sampling/elicitation 允许 Server 反向请求 Client，若回调处理不当会阻塞接收循环甚至互相等待死锁，SDK 需以 dispatcher 并发化调度双向请求。',
    },
    {
      title: '传输语义统一',
      desc: 'stdio 是单行 JSON 的进程管道，Streamable HTTP 涉及会话、断线续传与多实例路由，把两种迥异的语义抽象成同一套 Transport 接口是持续的工程难点。',
    },
    {
      title: '安全授权模型',
      desc: '工具本质是可执行代码，须防范混淆代理与令牌泄露：Host 逐次呈现授权、远程 Server 走 OAuth，令牌还要绑定受众与授权服务器，设计稍松即成攻击面。',
    },
    {
      title: '多版本协议演进',
      desc: '规范按日期版本快速迭代（2025 系列到 2026-07-28 无状态化），SDK 要按协商版本做线上校验、新旧并存服务，同时提供迁移指南帮助用户平滑过渡。',
    },
  ],
  positioning:
    'MCP 由 Anthropic 于 2024 年底发起并开源，已迅速成为 Agent 连接外部工具与数据的事实标准：OpenAI、Google、Microsoft 相继宣布支持，Claude Desktop/Code、Cursor、VS Code 等主流宿主均内置 MCP Client。其生态呈三层结构——上游是数据库、SaaS、文件系统等能力提供方，中游是覆盖十种语言的官方 SDK 与参考 Server，下游是官方 Registry 与社区市场上数以千计的 Server 实现。它与 function calling、A2A 并非零和：MCP 专注"应用—工具"这一垂直面，与模型侧调用格式及 Agent 间协议互补，共同构成 Agent 互操作栈的底座。',
  landscape: {
    intro:
      '生态分三段流动：上游由发起方与开放标准提供协议基座、数据服务沉淀可封装的能力；中游官方规范与多语言 SDK 加装饰器 API 摊薄接入成本；下游 Claude、Cursor、VS Code 等宿主经 Registry 即插即用，把 N×M 集成降为 N+M。',
    diagram: {
      cols: 4,
      rows: 3,
      direction: 'LR',
      nodes: [
        { id: 'anthropic', label: '发起方', sub: 'Anthropic', kind: 'external', col: 1, row: 1, group: '上游依赖' },
        { id: 'std', label: '开放标准', sub: 'JSON-RPC·OAuth', kind: 'data', col: 2, row: 1, group: '上游依赖' },
        { id: 'saas', label: '数据服务', sub: 'GitHub·Slack', kind: 'external', col: 3, row: 1, group: '上游依赖' },
        { id: 'spec', label: 'MCP 规范', sub: '开放协议', kind: 'core', col: 1, row: 2, group: '本项目' },
        { id: 'sdk', label: '官方 SDK', sub: 'Python/TS 等十种', kind: 'core', col: 2, row: 2, group: '本项目' },
        { id: 'fastmcp', label: 'MCPServer', sub: '原 FastMCP', kind: 'core', col: 3, row: 2, group: '本项目' },
        { id: 'servers', label: '参考实现', sub: 'servers 仓库', kind: 'core', col: 4, row: 2, group: '本项目' },
        { id: 'claude', label: 'Claude', sub: 'Desktop·Code', kind: 'core', col: 1, row: 3, group: '下游应用' },
        { id: 'cursor', label: 'Cursor', sub: 'IDE 宿主', kind: 'core', col: 2, row: 3, group: '下游应用' },
        { id: 'vscode', label: 'VS Code', sub: 'Copilot 集成', kind: 'core', col: 3, row: 3, group: '下游应用' },
        { id: 'registry', label: 'Registry', sub: 'Server 市场', kind: 'data', col: 4, row: 3, group: '下游应用' },
      ],
      edges: [
        { from: 'anthropic', to: 'spec', label: '发起开源' },
        { from: 'std', to: 'sdk', label: '协议基座' },
        { from: 'saas', to: 'fastmcp', label: '能力封装' },
        { from: 'spec', to: 'sdk', label: '多语言实现' },
        { from: 'sdk', to: 'fastmcp', label: '高层 API' },
        { from: 'sdk', to: 'servers', label: '官方示范' },
        { from: 'fastmcp', to: 'registry', label: '发布上架' },
        { from: 'servers', to: 'registry', label: '汇入生态' },
        { from: 'registry', to: 'claude', label: '即插即用' },
        { from: 'registry', to: 'cursor', label: '一键接入' },
        { from: 'registry', to: 'vscode', label: '统一配置' },
      ],
      note: '上游能力经规范与 SDK 汇入 Registry，宿主按需接入，长尾 Server 生态持续扩张。',
    },
  },
  competitors: [
    {
      name: 'OpenAI Function Calling',
      relation: '相邻替代',
      diff: '模型侧的私有调用格式，无跨应用发现与授权机制；MCP 是应用与工具间的开放协议，可与任意模型搭配。',
    },
    {
      name: 'OpenAPI 插件',
      relation: '相邻替代',
      diff: '面向 REST API 的静态描述，缺会话、双向交互与动态发现；MCP 原生支持双向通信与能力协商。',
    },
    {
      name: 'Google A2A 协议',
      relation: '互补共存',
      diff: 'A2A 解决 Agent 之间的协作委派，MCP 解决 Agent 接入工具与数据，实践中常组合使用。',
    },
    {
      name: 'LangChain Tools',
      relation: '相邻替代',
      diff: '框架内的私有工具抽象，绑定 LangChain 生态；MCP 跨框架跨语言，一次实现多宿主复用。',
    },
  ],
  mechanism: [
    {
      title: 'initialize 握手协商',
      desc: '连接建立后，Client 首个请求必须是 initialize，携带 protocolVersion、capabilities 与 clientInfo；Server 回以自身支持的协议版本和能力声明，Client 再发 notifications/initialized 才进入操作期。若 Server 返回的版本 Client 不支持应直接断开；此后双方只能使用协商成功的能力，期间仅放行 ping 与日志。',
    },
    {
      title: 'tools/list 与 tools/call 帧',
      desc: '两者都是标准 JSON-RPC 2.0 帧：jsonrpc、id、method、params 四字段，id 用于请求响应配对。tools/list 以 cursor 分页返回工具的 name、description 与 inputSchema；tools/call 以 name 加 arguments 触发执行，结果装在 result.content 内容数组中，可附 structuredContent。错误分两层：未知工具等协议错误走 error 对象，执行失败则以 isError: true 的正常响应返回。',
    },
    {
      title: '两种传输的会话管理',
      desc: 'stdio 下 Client 把 Server 拉为子进程，stdin/stdout 传输不含内嵌换行的单行 JSON 帧，stdout 禁止输出非协议内容，stderr 仅作日志，关闭输入流即触发退出。Streamable HTTP 用单一端点承接 POST/GET，Server 可在 initialize 响应头下发 Mcp-Session-Id，此后每个请求必带；会话被终止返回 404，Client 须重新握手，SSE 流可按 Last-Event-ID 断点续传。',
    },
    {
      title: 'sampling/elicitation 反向调用',
      desc: '仅当 Client 在握手时声明对应能力，Server 才能在会话中反向发起请求，典型场景是嵌套在 tools/call 执行途中。sampling/createMessage 让 Server 免配 API key 借用宿主模型，modelPreferences 只是建议，选模型的最终权在 Client；elicitation/create 用受限的扁平 JSON Schema 向用户索取结构化输入，响应分 accept、decline、cancel 三态，全程由人把关，2025-11-25 起新增 URL 模式可把用户引导至外部页面完成输入。',
    },
  ],
  sourceLayout: [
    { path: 'src/mcp/client', role: 'Client 会话与 stdio/SSE/Streamable HTTP 传输实现' },
    { path: 'src/mcp/client/auth', role: 'OAuth 客户端：元数据发现、动态注册与令牌管理' },
    { path: 'src/mcp/server/mcpserver', role: '高层 MCPServer API，装饰器注册工具/资源/提示' },
    { path: 'src/mcp/server/lowlevel', role: '低层 Server，手动注册 handler 精细控制协议行为' },
    { path: 'src/mcp/server/auth', role: '服务端 OAuth：资源服务器与访问令牌校验' },
    { path: 'src/mcp/shared', role: '会话、JSON-RPC 双向调度器与消息模型等协议内核' },
    { path: 'src/mcp/cli', role: 'mcp dev/run 等开发调试命令行入口' },
    { path: 'schema', role: '按日期版本固化的 MCP 规范 JSON Schema' },
  ],
  tradeoffs: [
    {
      title: '消息协议选型',
      choice: 'JSON-RPC 2.0 双向消息帧',
      reason: '会话需要 Server 反向调用与无响应的通知，REST 的资源语义表达不了双向交互；JSON 文本免代码生成、任何语言都能快速实现，且传输无关，让 stdio 与 HTTP 共用同一套帧格式。',
    },
    {
      title: '授权决策归属',
      choice: '授权与安全收口 Host',
      reason: '官方设计原则要求 Server 看不到完整对话与其他 Server，由 Host 统一执行安全策略并逐次呈现授权。集中收口收窄了攻击面，也让 Server 保持极简、易于构建与组合。',
    },
    {
      title: '协议扩展方式',
      choice: '能力协商渐进扩展',
      reason: '核心协议保持最小功能集，可选特性都在 initialize 握手中以能力声明协商启用，Server 与 Client 可各自独立演进，新旧版本并存而不破坏向后兼容。',
    },
  ],
  production: [
    {
      title: '两种部署形态',
      desc: '本地 Server 由 Host 以 stdio 子进程拉起、一对一随会话生灭；远程 Server 用 Streamable HTTP 独立部署、服务多客户端。SDK 的 DNS 重绑定保护默认关闭，上线须显式配置 allowed_hosts 与 allowed_origins，非法 Host 请求一律 421 拒绝。',
    },
    {
      title: 'OAuth 授权流',
      desc: '远程访问基于 OAuth 2.1：Server 以 WWW-Authenticate 头暴露 RFC 9728 资源元数据，Client 按 RFC 8414 发现授权服务器、经 RFC 7591 动态注册，全程强制 PKCE，令牌按 RFC 8707 绑定受众；令牌透传给下游 API 被规范明确禁止。',
    },
    {
      title: '多实例与粘性会话',
      desc: '2026-07-28 协议的请求自包含、无会话，多 worker 可任意路由；旧版有状态会话须靠 Mcp-Session-Id 粘到同一 worker 或共享事件队列。会话 ID 必须加密随机并绑定用户身份，否则会被劫持注入恶意事件。',
    },
    {
      title: 'Tool Poisoning 防护',
      desc: '工具描述与 annotations 会注入模型上下文，可能被恶意 Server 投毒。官方规范要求客户端把 annotations 视为不可信、调用前向用户展示工具与入参、敏感操作逐次确认，并校验结果后再回注模型。',
    },
  ],
  en: {
    tagline:
      'The USB-C of AI apps: an open protocol letting any host discover, authorize, and invoke tools from any MCP server.',
    summary:
      'Model Context Protocol (MCP) is an open protocol, initiated by Anthropic, that standardizes how AI applications connect to external tools and data. Its three-party design separates concerns: hosts like Claude, Cursor, and VS Code create one client per server; servers expose tools, resources, and prompts over JSON-RPC 2.0 via stdio or Streamable HTTP. Capability negotiation, per-call user authorization, and reverse features such as sampling and elicitation make integrations secure and auditable. With official SDKs in ten languages and thousands of community servers, MCP turns N×M tool integration into N+M.',
  },
}
