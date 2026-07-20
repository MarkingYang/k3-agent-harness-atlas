import type { ToolDeepDive } from '../deepDive'

/**
 * Daytona 深度解析
 * 数据来源：
 * - starHistory：OSS Insight API（daytonaio/daytona stargazers/history），共 29 个全量月度点
 * - stats：GitHub REST API /repos/daytonaio/daytona（2026-07-18 采集；默认分支已清空无 LICENSE 文件，license 字段省略）
 * - versions：github.com/daytonaio/daytona/releases（v0.186.0–v0.190.0）
 * - 架构：daytona.io 官方 Architecture 文档（Interface / Control / Compute 三平面）与 GitHub README
 * - mechanism / tradeoffs / production：daytona.io 官方文档（Architecture / Sandboxes / Snapshots / Limits / Regions / BYOC）与归档仓库 README 公告
 * - sourceLayout：github.com/daytonaio/daytona tag v0.190.0 目录树及该 tag README 的 Applications/Client libraries 说明（默认分支已清空为 README+assets）
 * - 注：官方公告 2026 年 6 月起核心开发转入私有代码库，开源仓库归档停更
 */
export const daytonaDeep: ToolDeepDive = {
  toolId: 'daytona',
  stats: {
    stars: 72265,
    forks: 5666,
    checkedAt: '2026-07-18',
  },
  starHistory: [
    { date: '2024-03', stars: 4559 },
    { date: '2024-04', stars: 4942 },
    { date: '2024-05', stars: 5090 },
    { date: '2024-06', stars: 6307 },
    { date: '2024-07', stars: 6623 },
    { date: '2024-08', stars: 7381 },
    { date: '2024-09', stars: 7944 },
    { date: '2024-10', stars: 9166 },
    { date: '2024-11', stars: 11853 },
    { date: '2024-12', stars: 13363 },
    { date: '2025-01', stars: 13654 },
    { date: '2025-02', stars: 14182 },
    { date: '2025-03', stars: 14399 },
    { date: '2025-04', stars: 16596 },
    { date: '2025-05', stars: 19845 },
    { date: '2025-06', stars: 20012 },
    { date: '2025-07', stars: 20371 },
    { date: '2025-08', stars: 20689 },
    { date: '2025-09', stars: 20811 },
    { date: '2025-10', stars: 22144 },
    { date: '2025-11', stars: 25181 },
    { date: '2025-12', stars: 28044 },
    { date: '2026-01', stars: 31968 },
    { date: '2026-02', stars: 35192 },
    { date: '2026-03', stars: 37028 },
    { date: '2026-04', stars: 37428 },
    { date: '2026-05', stars: 37484 },
    { date: '2026-06', stars: 37507 },
    { date: '2026-07', stars: 72265 },
  ],
  versions: [
    { version: 'v0.190.0', date: '2026-06-23', highlight: '沙箱新增 pause 暂停操作与域名访问白名单' },
    { version: 'v0.189.0', date: '2026-06-19', highlight: '控制台升级 Tailwind v4，代理连接加固' },
    { version: 'v0.188.0', date: '2026-06-16', highlight: '新增默认快照支持与区域化用量统计' },
    { version: 'v0.187.0', date: '2026-06-11', highlight: '限制分级标签页，推送权限收紧（破坏性变更）' },
    { version: 'v0.186.0', date: '2026-06-10', highlight: 'API 支持 Windows 沙箱快照与 fork' },
  ],
  architecture: {
    intro:
      'Daytona 分三平面：接入层仅 SDK、CLI、MCP 薄入口；控制面 API 编排生命周期并 reconcile；计算面 Runner 无入站端口、靠轮询领任务，可藏身 NAT 之后。',
    diagram: {
      cols: 4,
      rows: 4,
      nodes: [
        { id: 'sdk', label: '五语言 SDK', sub: 'OpenAPI client', kind: 'external', col: 1, row: 1, group: '接入层' },
        { id: 'cli', label: 'CLI', sub: 'apps/cli', kind: 'external', col: 2, row: 1, group: '接入层' },
        { id: 'dash', label: '控制台', sub: 'Dashboard', kind: 'external', col: 3, row: 1, group: '接入层' },
        { id: 'mcp', label: 'MCP 服务', sub: 'MCP Server', kind: 'external', col: 4, row: 1, group: '接入层' },
        { id: 'api', label: 'API 服务', sub: 'apps/api', kind: 'core', col: 1, row: 2, group: '控制面' },
        { id: 'manager', label: '沙箱管理器', sub: 'reconcile 调度', kind: 'control', col: 2, row: 2, group: '控制面' },
        { id: 'builder', label: '快照构建器', sub: 'Dockerfile·镜像', kind: 'control', col: 3, row: 2, group: '控制面' },
        { id: 'proxy', label: 'Proxy', sub: 'Host 路由', kind: 'control', col: 4, row: 2, group: '控制面' },
        { id: 'runner', label: 'Runner', sub: 'apps/runner', kind: 'core', col: 1, row: 3, group: '计算面' },
        { id: 'daemon', label: 'Daemon', sub: 'Toolbox API', kind: 'core', col: 2, row: 3, group: '计算面' },
        { id: 'sshgw', label: 'SSH 网关', sub: 'SSH 接入', kind: 'control', col: 3, row: 3, group: '计算面' },
        { id: 'persist', label: '持久存储', sub: 'PG·Redis·S3', kind: 'data', col: 1, row: 4, group: '存储层' },
        { id: 'registry', label: '快照仓库', sub: 'OCI Registry', kind: 'data', col: 2, row: 4, group: '存储层' },
        { id: 'otel', label: 'OTel 收集器', sub: '遥测指标', kind: 'data', col: 3, row: 4, group: '可观测' },
      ],
      edges: [
        { from: 'sdk', to: 'api', label: 'REST 调用' },
        { from: 'cli', to: 'api', label: 'REST 调用' },
        { from: 'dash', to: 'api', label: 'REST 调用' },
        { from: 'mcp', to: 'api', label: '工具调用' },
        { from: 'api', to: 'manager', label: '下发任务' },
        { from: 'api', to: 'persist', label: '状态读写' },
        { from: 'manager', to: 'runner', label: '调度沙箱' },
        { from: 'runner', to: 'api', label: '轮询领任务', dashed: true },
        { from: 'builder', to: 'registry', label: '推送快照' },
        { from: 'runner', to: 'registry', label: '拉取快照' },
        { from: 'runner', to: 'daemon', label: '启动注入' },
        { from: 'proxy', to: 'daemon', label: '流量转发' },
        { from: 'sshgw', to: 'daemon', label: 'SSH 转发' },
        { from: 'sdk', to: 'daemon', label: 'Toolbox 直连', dashed: true },
        { from: 'runner', to: 'otel', label: '指标上报', dashed: true },
      ],
      note: 'Runner 纯出站轮询换取网络位置自由，是三平面分离中最关键的一笔取舍。',
    },
  },
  dataFlow: {
    intro:
      '一次代码执行分两段：daytona.create() 走控制面，API 校验配额后交 Runner 拉起沙箱；此后 code_run 经 Toolbox API 与 Daemon 直连，不再过控制面。',
    diagram: {
      cols: 4,
      rows: 2,
      direction: 'LR',
      nodes: [
        { id: 'agent', label: 'Agent 应用', sub: '生成不可信代码', kind: 'external', col: 1, row: 1 },
        { id: 'sdk', label: 'SDK', sub: 'daytona.create', kind: 'external', col: 2, row: 1 },
        { id: 'api', label: 'API 控制面', sub: 'apps/api', kind: 'core', col: 3, row: 1 },
        { id: 'runner', label: 'Runner', sub: 'apps/runner', kind: 'core', col: 4, row: 1 },
        { id: 'registry', label: '快照仓库', sub: 'OCI Registry', kind: 'data', col: 1, row: 2 },
        { id: 'daemon', label: 'Daemon', sub: 'Toolbox API', kind: 'core', col: 2, row: 2 },
        { id: 'volume', label: 'Volumes', sub: 'S3 持久卷', kind: 'data', col: 3, row: 2 },
      ],
      edges: [
        { from: 'agent', to: 'sdk', label: 'create()' },
        { from: 'sdk', to: 'api', label: 'HTTP POST' },
        { from: 'api', to: 'runner', label: '分配任务' },
        { from: 'runner', to: 'registry', label: 'OCI 拉取', dashed: true },
        { from: 'runner', to: 'daemon', label: '启动注入' },
        { from: 'runner', to: 'volume', label: 'S3 挂载' },
        { from: 'sdk', to: 'daemon', label: 'Toolbox 执行', dashed: true, bidirectional: true },
      ],
      note: '创建走控制面、执行走 Toolbox 直连，两条路径解耦，高频执行不冲击控制面。',
    },
  },
  sequence: {
    intro:
      'daytona.create() 触发配额校验，Runner 轮询领到任务后拉取预构建快照并启动沙箱；就绪后 code_run 经 Toolbox API 直达 Daemon，全程低于 90 毫秒。',
    diagram: {
      actors: [
        { id: 'app', label: 'Agent 应用', kind: 'agent' },
        { id: 'api', label: 'API 控制面', kind: 'system' },
        { id: 'runner', label: 'Runner', kind: 'system' },
        { id: 'daemon', label: 'Daemon', kind: 'system' },
      ],
      messages: [
        { from: 'app', to: 'api', label: 'daytona.create()' },
        { from: 'api', to: 'api', label: '校验配额·分配 Runner' },
        { from: 'runner', to: 'api', label: 'GET 轮询任务' },
        { from: 'api', to: 'runner', label: '下发创建任务', dashed: true },
        { from: 'runner', to: 'runner', label: '拉快照·启动沙箱' },
        { from: 'runner', to: 'api', label: '沙箱就绪', dashed: true },
        { from: 'app', to: 'daemon', label: 'code_run 执行代码' },
        { from: 'daemon', to: 'app', label: '输出·退出码', dashed: true },
      ],
      note: '就绪后 SDK 与 Daemon 直连交互，控制面不参与每次代码执行。',
    },
  },
  extension: [
    {
      title: '自定义快照与声明式构建',
      desc: 'Snapshot Builder 支持从 Dockerfile 或任意 OCI 兼容镜像仓库的预构建镜像生成沙箱快照，Declarative Builder 把基础镜像、包与工具链写成可版本化配置，团队环境一次定义、处处复现。',
    },
    {
      title: '多语言 SDK 与 OpenAPI',
      desc: 'Python、TypeScript、Ruby、Go、Java 五种 SDK 均由 OpenAPI 规范生成 REST 客户端，覆盖沙箱生命周期、文件系统、进程执行与运行时配置，任何技术栈的 Agent 都能直接接入。',
    },
    {
      title: 'MCP Server 与 Agent 工具',
      desc: '官方提供 MCP Server 与 Toolbox API，把文件操作、Git、LSP、Computer Use、日志流等能力以标准工具形式暴露给 LangChain、LangGraph 等框架，Agent 无需自建工具层。',
    },
    {
      title: 'Runner、区域与持久卷扩展',
      desc: 'Runner 计算节点可横向扩容并支持共享/专属区域与 GPU 配额；Volumes 以 S3 兼容存储为后端，可挂载进多个沙箱共享数据，配合 BYOC 形态把算力延伸到自有基础设施。',
    },
  ],
  challenges: [
    {
      title: '90 毫秒冷启动',
      desc: '官方指标为"从代码到执行低于 90ms"：关键在于快照即镜像——环境预先构建并推入内部 OCI 仓库，Runner 提前拉取预热、资源预分配，创建时省去现场构建与依赖安装，只做实例启动。',
    },
    {
      title: '并发调度与状态一致',
      desc: 'Sandbox Manager 要在海量短生命周期沙箱下调度 Runner、持续 reconcile 期望与实际状态；Redis 承担缓存、会话与分布式锁，避免并发创建时的资源争抢与状态漂移。',
    },
    {
      title: '隔离强度与多租户',
      desc: '每个沙箱拥有独立内核、Linux namespace、文件系统与网络栈，资源按 vCPU/内存/磁盘配额隔离；平台在组织边界强制访问控制，并以网络限制、域名白名单约束出网行为。',
    },
    {
      title: '有状态与用完即毁的矛盾',
      desc: '沙箱设计为 ephemeral，但 Agent 长任务需要延续性：Daytona 以有状态环境快照冻结/恢复整体环境，结合 Volumes 持久卷与备份恢复机制，在弹性回收与状态持久之间取得平衡。',
    },
  ],
  positioning:
    'Daytona 定位于沙箱执行层：上承 LangChain、LangGraph 等框架的执行调用，下接 OCI/Docker 镜像生态与 S3 存储，把安全运行 AI 生成代码做成基础设施。与 E2B 相比，它强调完整开发环境语义（LSP、Git、SSH）、声明式快照与自托管/BYOC 形态，并以五语言 SDK 与 MCP Server 降低接入成本。2026 年 6 月核心开发转入私有库，开源仓库归档停更，选型须评估治理变化。',
  landscape: {
    intro:
      'Daytona 立于开放标准之上：上游靠 OCI 镜像、S3 存储与 OIDC 认证，经 Helm 落入 K8s；下游以 SDK 与 MCP 向 LangChain、LangGraph 输出执行后端。',
    diagram: {
      cols: 3,
      rows: 4,
      direction: 'LR',
      nodes: [
        { id: 'docker', label: 'Docker', sub: 'Hub·GHCR·ECR', kind: 'external', col: 1, row: 1, group: '上游依赖' },
        { id: 's3', label: 'S3 对象存储', sub: '快照与卷后端', kind: 'external', col: 1, row: 2, group: '上游依赖' },
        { id: 'auth0', label: 'Auth0', sub: 'OIDC 认证', kind: 'external', col: 1, row: 3, group: '上游依赖' },
        { id: 'k8s', label: 'K8s', sub: 'Helm charts', kind: 'external', col: 1, row: 4, group: '上游依赖' },
        { id: 'daytona', label: 'Daytona', sub: '沙箱执行底座', kind: 'core', col: 2, row: 2, group: '本项目' },
        { id: 'langgraph', label: 'LangGraph', sub: 'Agent 编排', kind: 'external', col: 3, row: 2, group: '下游应用' },
        { id: 'langchain', label: 'LangChain', sub: '官方工具集成', kind: 'external', col: 3, row: 3, group: '下游应用' },
      ],
      edges: [
        { from: 'docker', to: 'daytona', label: '基础镜像' },
        { from: 's3', to: 'daytona', label: '存储后端' },
        { from: 'auth0', to: 'daytona', label: 'OIDC 登录' },
        { from: 'k8s', to: 'daytona', label: 'Helm 部署' },
        { from: 'daytona', to: 'langgraph', label: 'MCP 工具' },
        { from: 'daytona', to: 'langchain', label: '官方工具包' },
      ],
      note: '上游全是开放标准、下游不绑定单一框架，执行层中立性由此而来。',
    },
  },
  competitors: [
    {
      name: 'E2B',
      relation: '直接竞品',
      diff: '同样面向 AI 代码执行的沙箱云，基于 Firecracker microVM；Daytona 更强调 OCI/Docker 兼容、完整开发环境语义与 BYOC 自托管形态。',
    },
    {
      name: 'Modal',
      relation: '相邻替代',
      diff: 'Serverless Python 计算平台，强项在 GPU 批处理与推理；交互式开发环境、快照语义与 Agent 工具链不如 Daytona 完整。',
    },
    {
      name: 'Fly.io Machines',
      relation: '相邻替代',
      diff: '通用 microVM 编排可自建沙箱底座，但缺少面向 Agent 的 SDK、快照管理与 Toolbox API，需自行补齐控制面。',
    },
    {
      name: 'Docker 直用',
      relation: '互补共存',
      diff: 'Docker 是 Daytona 兼容的底层标准；单机容器没有调度、快照仓库与多租户控制面，Daytona 在其上补齐基础设施层。',
    },
  ],
  mechanism: [
    {
      title: '快照预构建直达 90ms',
      desc: '官方口径为"从代码到执行低于 90 毫秒"，路径是消除现场构建：Snapshot Builder 预先把环境构建为镜像并推入内部 OCI 快照仓库（S3 后端），Runner 就近拉取预热，默认快照连 Python/Node 常用依赖都已预装；创建沙箱时只剩实例启动与 vCPU/内存/磁盘分配，镜像传输与依赖安装均不在关键路径上。',
    },
    {
      title: '快照即 OCI 镜像',
      desc: '快照不是私有格式：Snapshot Builder 把 Dockerfile 构建产物或外部仓库（Docker Hub、GHCR、GAR、ECR）的镜像统一推入实现 OCI 分发规范的内部快照仓库，Runner 创建沙箱时直接从中拉取。快照有 Pending→Building/Pulling→Active 状态机，两周未使用自动失活；容器、Linux VM、Windows 快照分属不同沙箱类，不能混用。',
    },
    {
      title: '控制面与 Toolbox 双路径',
      desc: 'SDK 同时内置两套生成客户端：创建、停止、快照等生命周期操作走控制面 OpenAPI REST，由 API 完成认证、配额校验与调度；代码执行、文件、Git、LSP、日志流等高频交互则由沙箱内 Daemon 暴露的 Toolbox API 直接处理，不再经过控制面。外部访问沙箱内服务由 Proxy 按 {port}-{sandboxId}.{proxy-domain} 的 Host 头路由并注入鉴权。',
    },
    {
      title: 'Runner 轮询调度与隔离',
      desc: 'Runner 不开放入站指令通道，而是主动轮询控制面 API 领取任务，执行沙箱创建、启动、停止、销毁、扩容与备份，因此可置于 NAT 与私有网络之后，这也是 BYOC 接入自有算力的基础。每个沙箱以独立 Linux namespace（进程、网络、挂载、IPC）隔离运行，由 Runner 分配专属 vCPU、内存与磁盘，Sandbox Manager 持续 reconcile 期望与实际状态。',
    },
  ],
  sourceLayout: [
    { path: 'apps/api', role: 'NestJS 控制面 REST 服务：认证、沙箱生命周期与资源分配主入口' },
    { path: 'apps/runner', role: '计算节点代理：轮询控制面领取任务并托管沙箱运行' },
    { path: 'apps/daemon', role: '沙箱内代码执行代理，暴露 Toolbox API（文件/Git/进程/终端）' },
    { path: 'apps/snapshot-manager', role: '快照创建编排：构建镜像并推入内部 OCI 快照仓库' },
    { path: 'apps/proxy', role: '反向代理：Host 路由转发沙箱流量与预览 URL' },
    { path: 'apps/dashboard', role: 'Web 可视化管理控制台，沙箱与组织管理界面' },
    { path: 'libs', role: '五语言 SDK 及 OpenAPI/toolbox 生成客户端（sdk-python 等）' },
    { path: 'docker', role: 'Docker Compose 开源自托管全栈部署清单' },
  ],
  tradeoffs: [
    {
      title: '三平面分离',
      choice: '接口/控制/计算各自独立部署',
      reason: '控制面只做编排与状态 reconcile，不承载代码执行流量；Runner 在计算面按区域横向扩容，接口面仅保留 SDK/CLI/MCP 薄入口。职责解耦让控制与计算两侧独立扩展，支撑海量短生命周期沙箱并发。',
    },
    {
      title: 'OCI 兼容的代价',
      choice: '默认容器隔离换镜像生态',
      reason: '兼容 OCI/Docker 可直接复用 Docker Hub、GHCR、ECR 等镜像生态与 Dockerfile 心智模型，接入成本极低；代价是默认容器隔离弱于 Firecracker 类 microVM，平台另以 Linux VM、Windows 沙箱类补足强隔离场景。',
    },
    {
      title: '闲置即回收',
      choice: '默认 15 分钟 auto-stop',
      reason: '沙箱按 Agent 短任务设计，闲置自动停止以释放 CPU/内存配额、控制平台成本；停止后文件系统保留，归档进一步把文件系统移入对象存储。长任务须显式 auto_stop_interval=0 或 refresh_activity 保活，否则会被中途停掉。',
    },
  ],
  production: [
    {
      title: '归档仓库的采用策略',
      desc: '官方公告 2026 年 6 月起核心开发转入私有代码库，开源仓库（AGPL-3.0）保持公开、可自由使用与 fork，但不再有更新与支持。生产采用应锁定 v0.190.0 等 tag 自行维护，或直接选用托管平台，并把治理变化纳入评估。',
    },
    {
      title: '自托管组件清单',
      desc: '全栈用 docker/ 的 Compose 起栈，依赖 PG、Redis、S3 与 OIDC；BYOC 区域挂自有 Runner，可用 Helm charts 部署区域 Proxy 与可选快照管理器。',
    },
    {
      title: '分层配额与速率限制',
      desc: '组织级多租户，访问控制在组织边界强制执行。托管平台按 Tier 发放计算池：Tier1 为 10 vCPU/30GiB 存储，Tier4 达 500 vCPU/5000GiB；沙箱创建限速 300-600 次/分钟，触发 429 按 Retry-After 指数退避，并以 X-RateLimit-* 头监控余量。',
    },
    {
      title: '闲置生命周期避坑',
      desc: '默认 15 分钟无外部交互即 auto-stop，后台进程不算活动，仅 Toolbox 调用、SSH、预览请求重置计时；停止 7 天自动归档到对象存储并停止计费。长任务（如 LLM 推理）须设 auto_stop_interval=0 或定期 refresh_activity，否则中途被停。',
    },
  ],
  en: {
    tagline:
      'Secure, elastic sandbox infrastructure for running AI-generated code — full composable computers, from code to execution in under 90 milliseconds.',
    summary:
      'Daytona is an open-source platform that gives AI agents secure, isolated sandboxes — composable computers with a dedicated kernel, filesystem, network stack, and allocated vCPU, RAM, and disk. Built on OCI/Docker compatibility, it organizes the platform into interface, control, and compute planes: SDKs in five languages, a NestJS control plane, and runners that spin up sandboxes in under 90ms. Stateful snapshots, volumes, an MCP server, and a Toolbox API make it a production-grade execution backend for coding agents and untrusted-code evaluation.',
  },
}
