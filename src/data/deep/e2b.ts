import type { ToolDeepDive } from '../deepDive'

/**
 * E2B 深度解析 —— Firecracker 微虚拟机上的云端代码执行沙箱
 * 数据来源：
 *  - stats：GitHub API repos/e2b-dev/E2B（2026-07-18 采集）
 *  - starHistory：OSS Insight stargazers/history API（月度累计，首点 + 最近 35 点）
 *  - versions：github.com/e2b-dev/E2B/releases（monorepo 双 SDK 标签）
 *  - 架构事实：e2b-dev/E2B README、e2b-dev/infra DEV-LOCAL.md（api/orchestrator/client-proxy/envd）、官方文档
 *  - 新字段事实：e2b.dev 文档（template/how-it-works、sandbox/lifecycle、sandbox/persistence、code-interpreting/contexts）、
 *    infra self-host.md、code-interpreter template README、pkg.go.dev infra/packages/envd、jsdelivr 仓库文件树
 */
export const e2bDeep: ToolDeepDive = {
  toolId: 'e2b',

  stats: {
    stars: 13023,
    forks: 967,
    license: 'Apache-2.0',
    checkedAt: '2026-07-18',
  },

  starHistory: [
    { date: '2023-03', stars: 402 },
    { date: '2023-09', stars: 5075 },
    { date: '2023-10', stars: 5173 },
    { date: '2023-11', stars: 5248 },
    { date: '2023-12', stars: 5349 },
    { date: '2024-01', stars: 5442 },
    { date: '2024-02', stars: 5524 },
    { date: '2024-03', stars: 5624 },
    { date: '2024-04', stars: 5793 },
    { date: '2024-05', stars: 5921 },
    { date: '2024-06', stars: 6007 },
    { date: '2024-07', stars: 6133 },
    { date: '2024-08', stars: 6253 },
    { date: '2024-09', stars: 6381 },
    { date: '2024-10', stars: 6573 },
    { date: '2024-11', stars: 6710 },
    { date: '2024-12', stars: 6831 },
    { date: '2025-01', stars: 7043 },
    { date: '2025-02', stars: 7228 },
    { date: '2025-03', stars: 7487 },
    { date: '2025-04', stars: 7669 },
    { date: '2025-05', stars: 7998 },
    { date: '2025-06', stars: 8215 },
    { date: '2025-07', stars: 8373 },
    { date: '2025-08', stars: 8526 },
    { date: '2025-09', stars: 8617 },
    { date: '2025-10', stars: 8697 },
    { date: '2025-11', stars: 8811 },
    { date: '2025-12', stars: 8926 },
    { date: '2026-01', stars: 9074 },
    { date: '2026-02', stars: 9184 },
    { date: '2026-03', stars: 9274 },
    { date: '2026-04', stars: 9361 },
    { date: '2026-05', stars: 9402 },
    { date: '2026-06', stars: 9416 },
    { date: '2026-07', stars: 13023 },
  ],

  versions: [
    {
      version: 'e2b@2.35.0',
      date: '2026-07-17',
      highlight: '新增 sandbox.fork() 原地分叉运行中沙箱',
    },
    {
      version: '@e2b/python-sdk@2.34.0',
      date: '2026-07-17',
      highlight: 'Python 版同步支持沙箱 fork 分叉',
    },
    {
      version: 'e2b@2.34.0',
      date: '2026-07-16',
      highlight: 'listSnapshots 新增快照名称过滤',
    },
    {
      version: '@e2b/python-sdk@2.33.0',
      date: '2026-07-16',
      highlight: 'Python 版快照列表支持名称过滤',
    },
    {
      version: 'e2b@2.33.1',
      date: '2026-07-15',
      highlight: '修复模板构建默认文件上下文路径解析',
    },
  ],

  architecture: {
    intro:
      'E2B 最关键的取舍是控制面与数据面分离：SDK 只在创建沙箱时走 API 与编排器，之后的执行与文件操作经 Client Proxy 直连沙箱内 envd，控制面故障不影响已运行的沙箱会话。',
    diagram: {
      cols: 4,
      rows: 3,
      nodes: [
        { id: 'agent', label: 'Agent 应用', sub: 'LLM 工具调用', kind: 'external', col: 1, row: 1, group: '接入层' },
        { id: 'sdk', label: 'SDK', sub: 'Python / JS', kind: 'core', col: 2, row: 1, group: '接入层' },
        { id: 'cli', label: 'CLI', sub: 'e2b template', kind: 'external', col: 3, row: 1, group: '接入层' },
        { id: 'api', label: 'API 服务', sub: '沙箱生命周期', kind: 'core', col: 1, row: 2, group: '控制面' },
        { id: 'orch', label: '编排器', sub: 'Orchestrator', kind: 'core', col: 2, row: 2, group: '控制面' },
        { id: 'nomad', label: '调度集群', sub: 'Nomad + Consul', kind: 'control', col: 3, row: 2, group: '控制面' },
        { id: 'proxy', label: '边缘代理', sub: 'Client Proxy', kind: 'core', col: 1, row: 3, group: '数据面' },
        { id: 'envd', label: 'envd', sub: '沙箱内守护进程', kind: 'core', col: 2, row: 3, group: '数据面' },
        { id: 'fcvm', label: '微虚拟机', sub: 'Firecracker', kind: 'core', col: 3, row: 3, group: '沙箱运行时' },
        { id: 'kernel', label: '执行内核', sub: 'Jupyter Kernel', kind: 'data', col: 4, row: 3, group: '沙箱运行时' },
      ],
      edges: [
        { from: 'agent', to: 'sdk', label: '工具调用' },
        { from: 'cli', to: 'api', label: '模板构建' },
        { from: 'sdk', to: 'api', label: '创建沙箱' },
        { from: 'api', to: 'orch', label: '调度沙箱' },
        { from: 'nomad', to: 'orch', label: '集群编排', dashed: true },
        { from: 'orch', to: 'fcvm', label: '启动与回收' },
        { from: 'sdk', to: 'proxy', label: '连接沙箱' },
        { from: 'proxy', to: 'envd', label: 'RPC 转发' },
        { from: 'envd', to: 'fcvm', label: '驻留其中', dashed: true },
        { from: 'envd', to: 'kernel', label: 'run_code' },
      ],
      note: '数据面直连让海量短会话的执行流量不经过控制面，两者可独立扩缩容。',
    },
  },

  dataFlow: {
    intro:
      '以 Code Interpreter 一次 run_code 为例：SDK 经 Client Proxy 按沙箱域名路由到 envd，再交 Jupyter 内核执行；文件一次写入即可跨轮复用，结果与图表流式回传，全程不经过控制面 API。',
    diagram: {
      direction: 'LR',
      cols: 4,
      rows: 2,
      nodes: [
        { id: 'dev', label: 'Agent 代码', sub: '用户脚本', kind: 'external', col: 1, row: 1 },
        { id: 'sdk', label: 'SDK', sub: 'run_code', kind: 'core', col: 2, row: 1 },
        { id: 'proxy', label: '边缘代理', sub: 'Client Proxy', kind: 'core', col: 3, row: 1 },
        { id: 'envd', label: 'envd', sub: 'Connect RPC', kind: 'core', col: 4, row: 1 },
        { id: 'result', label: '执行结果', sub: '文本与图表', kind: 'data', col: 1, row: 2 },
        { id: 'kernel', label: '执行内核', sub: 'Jupyter Kernel', kind: 'data', col: 2, row: 2 },
        { id: 'fs', label: '沙箱文件', sub: 'CSV 与工作区', kind: 'data', col: 3, row: 2 },
      ],
      edges: [
        { from: 'dev', to: 'sdk', label: 'run_code' },
        { from: 'sdk', to: 'proxy', label: 'RPC 请求' },
        { from: 'proxy', to: 'envd', label: '按域名路由' },
        { from: 'envd', to: 'kernel', label: '执行代码' },
        { from: 'envd', to: 'fs', label: '读写文件' },
        { from: 'kernel', to: 'fs', label: '读取数据', dashed: true },
        { from: 'kernel', to: 'result', label: '流式输出' },
        { from: 'result', to: 'sdk', label: '回传', dashed: true },
      ],
      note: '执行右行、结果左回；有状态内核让多轮 run_code 共享变量与文件。',
    },
  },

  sequence: {
    intro:
      '一次典型的 Code Interpreter 调用：创建沙箱时 API 从模板快照恢复微虚拟机并返回域名句柄；此后每次 run_code 经 Client Proxy 直连同一沙箱并流式返回，超时后由控制面自动回收。',
    diagram: {
      actors: [
        { id: 'dev', label: '开发者代码', kind: 'user' },
        { id: 'sdk', label: 'E2B SDK', kind: 'system' },
        { id: 'api', label: 'E2B API', kind: 'system' },
        { id: 'proxy', label: '边缘代理', kind: 'system' },
        { id: 'envd', label: '沙箱 envd', kind: 'external' },
      ],
      messages: [
        { from: 'dev', to: 'sdk', label: 'Sandbox.create()' },
        { from: 'sdk', to: 'api', label: 'POST /sandboxes' },
        { from: 'api', to: 'sdk', label: '沙箱句柄与域名', dashed: true },
        { from: 'dev', to: 'sdk', label: 'run_code(代码)' },
        { from: 'sdk', to: 'proxy', label: 'Connect RPC 请求' },
        { from: 'proxy', to: 'envd', label: '按域名路由' },
        { from: 'envd', to: 'sdk', label: '流式结果与图表', dashed: true },
        { from: 'api', to: 'envd', label: '超时自动回收', dashed: true },
      ],
      note: '同一沙箱句柄内多次 run_code 保持变量、导入与文件状态。',
    },
  },

  extension: [
    {
      title: '自定义沙箱模板',
      desc: '用 Dockerfile 子集或 Template.fromDockerfile 定义环境，预装系统依赖与语言运行时；构建产物为 rootfs 加快照，每次启动即得一致环境。',
    },
    {
      title: '持久化与暂停恢复',
      desc: '沙箱默认按超时回收；lifecycle on_timeout 设为 pause 可到期自动暂停，内存与文件系统整体保留并可随时恢复；新版 fork() 还能把运行中沙箱原地快照克隆出多份并行副本。',
    },
    {
      title: 'LLM 框架集成',
      desc: '官方 Cookbook 提供 OpenAI、LangChain 等接入示例：把 run_code 包装为 function calling 工具，结果回传模型形成闭环。',
    },
    {
      title: '文件系统与网络控制',
      desc: 'SDK 支持文件读写与上传下载、目录变更 watch、后台命令与端口对外暴露；updateNetwork 可动态调整沙箱出站规则，按域名放行或封禁，满足企业级网络治理需求。',
    },
  ],

  challenges: [
    {
      title: '毫秒级冷启动',
      desc: '虚拟机级隔离天然启动慢，E2B 靠预构建模板快照、UFFD 按需加载内存页与定制内核裁剪，把 Firecracker 沙箱就绪时间压到百毫秒量级，才能支撑交互式 Agent。',
    },
    {
      title: '有状态执行抽象',
      desc: 'Jupyter 内核的中断、重启与富文本输出等复杂生命周期，要映射为一次简单的 run_code 调用，同时流式回传 stdout、结果与图表，协议设计需兼顾简洁与完备。',
    },
    {
      title: '多租户网络治理',
      desc: '微虚拟机隔离只保护宿主机，出站流量仍需管控：沙箱默认可联网，E2B 引入结构化网络规则与访问令牌代理，在不影响开发体验的前提下防止恶意代码外泄数据。',
    },
    {
      title: '海量短会话调度',
      desc: 'Agent 负载是海量秒级沙箱，创建销毁频率远超传统云服务；需要 Nomad 集群编排、模板层缓存与超时自动回收协同工作，才能同时控制住成本与尾延迟。',
    },
  ],

  positioning:
    'E2B 位于 Agent 技术栈的执行隔离层：上承各类编排框架的工具调用，下接云基础设施，把"LLM 生成代码"封装为毫秒级可得的微虚拟机沙箱。相比容器方案，它以 Firecracker 独立内核换取强隔离；相比通用无服务器平台，它专注 Agent 会话：有状态内核、模板环境与超时回收。开源加 Terraform 自托管满足合规需求，托管云把接入压到一次 SDK 调用，成为 AI 数据分析与编码 Agent 的常用底座。',

  landscape: {
    intro:
      'E2B 不重复造底层：隔离交给 Firecracker，调度交给 Nomad 与 Consul，环境标准复用 Docker 镜像与 Jupyter 内核；自身聚焦沙箱编排，再以 SDK 形态嵌入 LangChain、OpenAI 等下游 Agent 生态。',
    diagram: {
      direction: 'LR',
      cols: 3,
      rows: 4,
      nodes: [
        { id: 'firecracker', label: '微虚拟机', sub: 'Firecracker', kind: 'external', col: 1, row: 1, group: '上游依赖' },
        { id: 'nomad', label: 'Nomad', sub: '+ Consul 调度', kind: 'external', col: 1, row: 2, group: '上游依赖' },
        { id: 'docker', label: 'Docker', sub: '镜像生态', kind: 'external', col: 1, row: 3, group: '上游依赖' },
        { id: 'jupyter', label: 'Jupyter', sub: '内核协议', kind: 'external', col: 1, row: 4, group: '上游依赖' },
        { id: 'e2bfoss', label: 'E2B 开源', sub: 'Apache-2.0', kind: 'core', col: 2, row: 2, group: '本项目' },
        { id: 'e2bcloud', label: 'E2B 托管云', sub: '托管服务', kind: 'core', col: 2, row: 3, group: '本项目' },
        { id: 'frameworks', label: 'LLM 框架', sub: 'LangChain 等', kind: 'external', col: 3, row: 1, group: '下游应用' },
        { id: 'openai', label: 'OpenAI', sub: '工具调用', kind: 'external', col: 3, row: 2, group: '下游应用' },
        { id: 'coding', label: '编码 Agent', sub: '安全执行', kind: 'external', col: 3, row: 3, group: '下游应用' },
        { id: 'dataapp', label: '数据分析', sub: 'CI 底座', kind: 'external', col: 3, row: 4, group: '下游应用' },
      ],
      edges: [
        { from: 'firecracker', to: 'e2bfoss', label: '隔离底座' },
        { from: 'nomad', to: 'e2bfoss', label: '集群调度' },
        { from: 'docker', to: 'e2bfoss', label: '镜像生态' },
        { from: 'jupyter', to: 'e2bfoss', label: '内核协议' },
        { from: 'e2bfoss', to: 'e2bcloud', label: '同源托管', dashed: true },
        { from: 'e2bcloud', to: 'frameworks', label: 'SDK 集成' },
        { from: 'e2bcloud', to: 'openai', label: '工具结果' },
        { from: 'e2bcloud', to: 'coding', label: '沙箱服务' },
        { from: 'e2bcloud', to: 'dataapp', label: '执行底座' },
      ],
      note: '上游全是成熟基础设施，E2B 的价值在于把它们组装成面向 Agent 的沙箱层。',
    },
  },

  competitors: [
    {
      name: 'Daytona',
      relation: '直接竞品',
      diff: '同为开源 Agent 沙箱 SDK；Daytona 主打容器隔离与长周期工作区，E2B 胜在微虚拟机强隔离与毫秒冷启动。',
    },
    {
      name: 'Modal',
      relation: '相邻替代',
      diff: '通用 Python 无服务器算力平台（含 GPU），沙箱执行只是其子集，不专注 Agent 会话与有状态解释器。',
    },
    {
      name: 'Replit Agent 沙箱',
      relation: '相邻替代',
      diff: '与 Replit IDE 及 Agent 生态绑定的闭源托管环境，不提供独立开源 SDK、模板体系与自托管路径。',
    },
    {
      name: 'Jupyter Kernel Gateway',
      relation: '互补共存',
      diff: '提供远程 Jupyter 内核协议；E2B 的 CI 内核与 Jupyter 生态兼容，可视为底层能力补充。',
    },
  ],

  mechanism: [
    {
      title: '快照恢复冷启动',
      desc: '沙箱不在创建时才装环境，而是直接从模板快照恢复。恢复时借助定制 Firecracker 的 UFFD（userfaultfd）按需拉取内存页——进程访问到某页才从快照文件载入，不必先读全整份内存，因此含已运行进程的整机约 80ms 就绪，且每个沙箱跑独立的 6.1 LTS 内核。',
    },
    {
      title: 'envd 数据面直连',
      desc: '每个沙箱内驻留 envd 守护进程（监听 49983 端口），以 Connect RPC 暴露进程执行、文件读写等流式接口。SDK 仅创建沙箱时走控制面 API，之后的执行与文件操作按“沙箱ID-端口.域名”经 Client Proxy 边缘路由直连本沙箱 envd，数据面不经过控制面。',
    },
    {
      title: '有状态内核上下文',
      desc: 'Code Interpreter 模板内以 systemd 常驻 Jupyter 与解释器服务。run_code 默认进入沙箱默认 context——持久的 Jupyter 内核会话，代码在同一进程命名空间顺序执行，变量、导入与图表跨调用保留；restart 清空重建，另建 context 则相互隔离可并行。',
    },
    {
      title: '模板快照构建链',
      desc: '模板构建先按 Dockerfile 起容器、提取文件系统为 rootfs 并完成依赖配置，再以该 rootfs 启动真实沙箱，执行 start command 并等待就绪检查（默认 20 秒），最后把整机状态（文件系统加运行中进程）序列化为快照——此后每次创建沙箱都是该快照的克隆，构建支持分层缓存加速迭代。',
    },
  ],

  sourceLayout: [
    { path: 'packages/js-sdk', role: 'JS/TS SDK：连接配置、沙箱与模板 API' },
    { path: 'packages/python-sdk', role: 'Python SDK，e2b 内含同步/异步双客户端与 envd 绑定' },
    { path: 'packages/cli', role: 'e2b CLI：模板构建与沙箱管理命令（src/commands）' },
    { path: 'packages/connect-python', role: 'envd Connect RPC 的 Python 客户端生成工具链' },
    { path: 'spec', role: 'openapi.yml 与 envd proto 契约，供双 SDK 生成代码' },
    { path: 'templates/base', role: '官方 base 模板定义（e2b.Dockerfile + e2b.toml）' },
  ],

  tradeoffs: [
    {
      title: '隔离方案选型',
      choice: 'Firecracker 而非容器',
      reason: 'LLM 生成代码不可信，容器共享宿主机内核存在逃逸风险；Firecracker 基于 KVM 给每个沙箱独立内核，与 AWS Lambda 同级隔离，配合快照仍能把启动压进百毫秒。',
    },
    {
      title: '执行模型选型',
      choice: '有状态内核而非无状态函数',
      reason: '数据分析与编码 Agent 多轮迭代，变量与导入需在会话中持续可用（官方示例即 x+=1 跨轮累加）；代价是需管理内核生命周期，暴露 restart 与多 context 语义。',
    },
    {
      title: '模板产物形态',
      choice: '模板即运行中沙箱的整机快照',
      reason: '构建期先跑 start command 再做就绪检查，快照把已运行进程一并序列化，恢复即热就绪约 80ms；代价是快照与内核版本绑定，老模板无法原地升级内核。',
    },
  ],

  production: [
    {
      title: '超时与回收策略',
      desc: '沙箱默认按超时自动回收；on_timeout 设为 pause 可到期自动暂停，内存与文件系统整体保留。连续运行上限 Base 1 小时、Pro 24 小时，暂停重置运行窗口，长任务用暂停与恢复接力。',
    },
    {
      title: '自托管部署形态',
      desc: '官方以 Terraform 部署 GCP/AWS，Nomad 加 Consul 集群编排；编排节点须裸金属或嵌套虚拟化（如 m8i.4xlarge），还需 huge pages 与 NBD 模块。',
    },
    {
      title: '内核与模板运维',
      desc: '内核版本在模板构建时固定（当前 6.1.158），不能原地升级，安全补丁只能靠重建模板发布；构建支持分层缓存，迭代时尽量复用缓存层避免全量重装依赖。',
    },
    {
      title: '常见踩坑点',
      desc: '自定义模板必须保持 envd（49983 端口）可用并通过就绪检查，否则沙箱无法创建；Jupyter 与解释器服务以 systemd 运行，构建失败先查 journalctl 服务日志。',
    },
  ],

  en: {
    tagline:
      'Open-source Firecracker microVM sandboxes for running AI-generated code securely in the cloud.',
    summary:
      'E2B is an open-source (Apache-2.0) runtime that executes AI-generated code inside secure cloud sandboxes built on Firecracker microVMs, the same isolation technology behind AWS Lambda. Each sandbox boots in about 80 milliseconds, gets its own kernel, and is recycled automatically on timeout. The Code Interpreter SDK adds a Jupyter-style stateful kernel, so an agent can run Python across multiple turns with variables, files, and charts preserved. Custom templates compiled from Dockerfiles reproduce any toolchain, while pause and resume, network egress rules, and Terraform-based self-hosting cover production and compliance needs.',
  },
}
