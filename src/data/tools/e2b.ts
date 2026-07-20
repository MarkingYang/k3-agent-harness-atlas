import type { ToolDetail } from '../toolDetail'

/**
 * E2B 详情数据 —— 沙箱执行层
 * 事实来源：e2b-dev/E2B GitHub README、e2b.dev 官方文档与 PyPI 官方页面
 */
export const e2bDetail: ToolDetail = {
  toolId: 'e2b',
  tagline: 'Firecracker 微虚拟机上的云端代码沙箱',
  problem:
    'LLM 写代码容易，安全运行它是难事：本地 exec 等于交出文件与网络，自建容器又扛不住冷启动与运维，数据分析还需跨多轮保持变量的有状态执行。E2B 基于 Firecracker 微虚拟机提供毫秒级云端沙箱，强隔离、用完即焚；Code Interpreter SDK 让 Agent 运行 Python、处理文件、生成图表，是 AI 数据分析产品的常用底座。',
  architecture: [
    {
      title: '微虚拟机级隔离',
      desc: '每个沙箱运行在独立的 Firecracker microVM 中——与 AWS Lambda 同源的虚拟化技术，提供虚拟机级隔离边界，同时保留接近容器的启动速度。',
    },
    {
      title: '毫秒级按需创建',
      desc: 'Sandbox.create() 一次调用即获得就绪环境，无需管理任何服务器；沙箱按超时时间自动回收，成本随实际使用伸缩。',
    },
    {
      title: '有状态代码解释器',
      desc: 'Code Interpreter 沙箱内置 Jupyter 风格内核：同一沙箱内多次 run_code 之间变量、导入与文件互相可见，天然适配多轮分析对话。',
    },
    {
      title: '模板化运行环境',
      desc: '执行环境由沙箱模板定义、基于 Docker 镜像构建，可预装任意系统依赖、语言运行时与工具链，保证执行环境一致可复现。',
    },
    {
      title: '开源且可自托管',
      desc: '基础设施代码完全开源，官方提供基于 Terraform 的自托管方案，支持 AWS、GCP、Azure 与通用 Linux 主机，也可直接使用托管云。',
    },
  ],
  quickStart: {
    install: 'pip install e2b-code-interpreter  # 通用沙箱：pip install e2b',
    code: `from e2b_code_interpreter import Sandbox

# 需先设置环境变量 E2B_API_KEY
with Sandbox.create() as sandbox:
    sandbox.run_code("x = 1")
    execution = sandbox.run_code("x+=1; x")
    print(execution.text)  # 输出 2：同一沙箱内变量保持`,
    lang: 'python',
    note: '示例为官方 Quickstart 核心形态；API Key 在 e2b.dev 控制台免费获取。',
  },
  useCases: [
    {
      title: 'AI 数据分析助手',
      desc: '把 CSV 传入沙箱，LLM 生成的 pandas 代码真实执行，图表与结论回传前端，是类 ChatGPT 数据分析产品的常用开源底座。',
    },
    {
      title: 'Coding Agent 安全执行',
      desc: 'Agent 写出的代码在微虚拟机中跑测试与构建，宿主机零暴露；stdout 与报错回读，供 Agent 自我修正。',
    },
    {
      title: '多租户代码运行平台',
      desc: '每个用户会话分配独立沙箱，毫秒级创建、按超时自动回收，支撑在线判题、编程教学等高并发场景。',
    },
  ],
  ecosystem: [
    'Python SDK',
    'JavaScript SDK',
    'Code Interpreter',
    'Firecracker microVM',
    '自定义沙箱模板',
    'Terraform 自托管',
    'LangChain / LlamaIndex 集成',
  ],
  resources: [
    { label: 'GitHub 仓库', url: 'https://github.com/e2b-dev/E2B' },
    { label: '官方文档', url: 'https://e2b.dev/docs' },
    { label: 'Code Interpreter (PyPI)', url: 'https://pypi.org/project/e2b-code-interpreter/' },
    { label: 'LLM 接入指南', url: 'https://e2b.dev/docs/quickstart/connect-llms' },
  ],
  articles: [
    {
      title: 'Firecracker vs QEMU',
      author: 'E2B',
      source: 'E2B 官方博客',
      url: 'https://e2b.dev/blog/firecracker-vs-qemu',
      note: 'E2B 官方深度对比两种虚拟化方案，理解沙箱隔离选型的最佳入口。',
    },
    {
      title: 'Launching the Code Interpreter SDK',
      author: 'E2B',
      source: 'E2B 官方博客',
      url: 'https://e2b.dev/blog/launching-the-code-interpreter-sdk',
      note: '官方发布文，讲清 Code Interpreter SDK 的设计动机与典型用法。',
    },
    {
      title: 'Code execution with MCP: building more efficient AI agents',
      author: 'Adam Jones & Conor Kelly',
      source: 'Anthropic Engineering',
      url: 'https://www.anthropic.com/engineering/code-execution-with-mcp',
      note: 'Anthropic 官方论述代码执行范式：工具即代码 API，大幅省 token。',
    },
    {
      title: 'Firecracker – Lightweight Virtualization for Serverless Computing',
      author: 'Jeff Barr',
      source: 'AWS News Blog',
      url: 'https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/',
      note: 'Firecracker 经典发布文：125ms 启动微虚拟机的设计取舍与起源。',
    },
  ],
  faq: [
    {
      q: 'e2b 和 e2b-code-interpreter 两个包怎么选？',
      a: '需要 Jupyter 式有状态代码执行（run_code、图表与富文本输出）就装 e2b-code-interpreter；只需要通用沙箱能力（commands.run 执行 shell、文件读写、跑服务）装 e2b 即可，后者也是前者的底座。',
    },
    {
      q: '沙箱的安全性到什么程度？',
      a: '每个沙箱是独立的 Firecracker 微虚拟机（与 AWS Lambda 同源的虚拟化技术），提供虚拟机级隔离而非共享内核的容器隔离，适合运行不可信的 AI 生成代码。',
    },
    {
      q: '数据敏感，可以私有化部署吗？',
      a: '可以。E2B 基础设施完全开源，官方提供基于 Terraform 的自托管方案，支持 AWS、Google Cloud、Azure 与通用 Linux 主机；不在意运维时也可直接使用其托管云。',
    },
  ],
}
