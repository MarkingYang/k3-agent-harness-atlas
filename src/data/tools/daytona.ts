import type { ToolDetail } from '../toolDetail'

/**
 * Daytona 详情数据 —— 沙箱执行层
 * 事实来源：daytonaio/daytona GitHub README 与 daytona.io 官方文档
 */
export const daytonaDetail: ToolDetail = {
  toolId: 'daytona',
  tagline: 'AI 生成代码的安全弹性运行底座',
  problem:
    '让 Agent 写代码容易，让它安全地运行代码很难：本地直接执行有删改文件、越权联网与依赖污染风险，自建容器又扛不住冷启动、状态管理与并发弹性成本。Daytona 把开发环境变成可编程基础设施：一次 SDK 调用即可获得带独立内核、文件系统与网络栈的隔离沙箱，90 毫秒内从代码到执行，支持快照与大规模并发，让"编码—运行—验证"闭环安全落地生产。',
  architecture: [
    {
      title: '可组合计算机',
      desc: 'Sandbox 不是裸容器，而是带独立内核、文件系统、网络栈与配额 vCPU / 内存 / 磁盘的完整计算机，基于 OCI/Docker 兼容构建，环境一致可预期。',
    },
    {
      title: '亚秒级冷启动',
      desc: '官方数据：沙箱从创建到可执行代码低于 90 毫秒，且支持大规模并行创建，匹配 Agent 高频、突发、短生命周期的执行特征。',
    },
    {
      title: 'SDK 全周期操控',
      desc: '通过 SDK 以 daytona.create() 创建沙箱，再经 process、fs 等模块执行代码、读写文件与管理进程，运行时配置亦可编程调整。',
    },
    {
      title: '快照与持久化',
      desc: '有状态的环境快照（Snapshot）可将沙箱整体冻结保存、跨会话恢复，Agent 的中间产物与环境状态不因沙箱回收而丢失。',
    },
    {
      title: '多语言开放接口',
      desc: '提供 Python、TypeScript、Ruby、Go、Java 五种 SDK 与符合 OpenAPI 规范的平台 API，任何技术栈的 Agent 都能直接接入。',
    },
  ],
  quickStart: {
    install: 'pip install daytona  # TypeScript：npm install @daytonaio/sdk',
    code: `from daytona import Daytona, DaytonaConfig

config = DaytonaConfig(api_key="YOUR_API_KEY")  # 替换为你的 API Key
daytona = Daytona(config)

sandbox = daytona.create()  # 创建隔离沙箱
response = sandbox.process.code_run('print("Hello World")')
print(response.result)`,
    lang: 'python',
    note: '示例为官方 Quickstart 核心形态；API Key 在 app.daytona.io 控制台生成。',
  },
  useCases: [
    {
      title: 'Coding Agent 执行后端',
      desc: 'Agent 生成代码后在隔离沙箱中安装依赖、运行测试、读取报错并自我修正，"编码—运行—验证"闭环完整落地。',
    },
    {
      title: '不可信代码批量评测',
      desc: '批量评测 LLM 产出或第三方提交的代码时，每个任务分配独立沙箱、用完即毁，并发弹性且互不污染。',
    },
    {
      title: '有状态的 Agent 工作区',
      desc: '借助环境快照为长期任务保存开发环境，Agent 跨会话继续工作，文件、依赖与中间成果完整保留。',
    },
  ],
  ecosystem: [
    'Python SDK',
    'TypeScript SDK',
    'Ruby / Go / Java',
    'OCI / Docker 兼容',
    '环境快照 Snapshot',
    'Platform API + CLI',
  ],
  resources: [
    { label: 'GitHub 仓库', url: 'https://github.com/daytonaio/daytona' },
    { label: '官方文档', url: 'https://www.daytona.io/docs/en/' },
    { label: 'Python SDK 参考', url: 'https://www.daytona.io/docs/en/python-sdk/' },
    { label: '官方网站', url: 'https://www.daytona.io/' },
  ],
  articles: [
    {
      title: 'Sandbox Infrastructure for Reinforcement Learning Agents',
      author: 'Ivan Burazin',
      source: 'Daytona 官方博客（Dotfiles Insider）',
      url: 'https://www.daytona.io/dotfiles/sandbox-infrastructure-for-reinforcement-learning-agents',
      note: 'Daytona CEO 亲述沙箱与推理分离的架构逻辑，理解 Agent 执行层设计',
    },
    {
      title: 'Firecracker – Lightweight Virtualization for Serverless Computing',
      author: 'Jeff Barr',
      source: 'AWS News Blog',
      url: 'https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/',
      note: '微虚拟机隔离的经典发布文，125ms 启动是当代代码沙箱的技术底座',
    },
    {
      title: 'Modal Sandboxes are generally available',
      author: 'Modal',
      source: 'Modal Blog（官方）',
      url: 'https://modal.com/blog/sandbox-launch',
      note: '对照阅读：gVisor 隔离沙箱的工程设计，含 SWE-bench 与 Quora 实战',
    },
    {
      title: 'Introducing Open SWE: An Open-Source Asynchronous Coding Agent',
      author: 'LangChain',
      source: 'LangChain Blog（官方）',
      url: 'https://blog.langchain.com/introducing-open-swe-an-open-source-asynchronous-coding-agent/',
      note: 'LangChain 复盘异步编码 Agent：为何每个任务都跑在独立 Daytona 沙箱',
    },
  ],
  faq: [
    {
      q: 'Daytona 和直接在 Docker 里跑代码有什么区别？',
      a: 'Docker 解决的是单机容器隔离，Daytona 在此之上提供面向 Agent 的完整基础设施：亚 90 毫秒冷启动、SDK/API 全生命周期管理、环境快照持久化与大规模并发编排，省去自建容器编排与控制平面的成本。',
    },
    {
      q: '沙箱里的状态和文件会保留吗？',
      a: '沙箱本身是用完即毁的隔离环境，但 Daytona 提供有状态的环境快照（Snapshot），可将整个环境冻结保存、跨会话恢复，适合需要延续性的长任务 Agent 工作流。',
    },
    {
      q: '如何把 Daytona 接入现有 Agent 框架？',
      a: '在 Agent 的工具函数中调用 Daytona SDK 即可：例如在 LangGraph、CrewAI 里把"执行代码"工具实现为 sandbox.process.code_run 调用，Python 与 TypeScript 栈都有官方 SDK。',
    },
  ],
}
