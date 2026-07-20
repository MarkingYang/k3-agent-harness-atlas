import type { ToolDetail } from '../toolDetail'

/**
 * MCP 详情数据（工具协议层）
 * 事实来源：modelcontextprotocol.io 官方文档（Architecture）与
 * modelcontextprotocol/python-sdk 官方 GitHub README（v1.x 稳定版 FastMCP Quickstart）
 */
export const mcpDetail: ToolDetail = {
  toolId: 'mcp',
  tagline: 'AI 应用的 USB-C：工具一次实现、处处接入',
  problem:
    '每个 Agent 框架都各造一套工具集成：LangChain 的 Tool、OpenAI 的 function calling、各插件市场的私有格式……同一个数据库查询能力要为每个宿主重复开发，N 个应用乘以 M 个工具就是 N×M 次集成。同时工具调用缺乏统一的发现、授权与审计机制，安全边界靠各应用自觉。MCP 把"Agent 如何发现、描述、调用外部工具与数据"标准化为开放协议：Server 暴露能力，Client 连接取用，Host 负责授权与协调，集成成本从 N×M 降为 N+M。',
  architecture: [
    {
      title: '三方架构',
      desc: 'Host 是 AI 应用（如 Claude Desktop、VS Code），为每个 Server 创建一个 Client；Client 与 Server 维持一对一连接，Server 本地或远程运行均可。',
    },
    {
      title: '三类原语',
      desc: 'Server 可暴露 Tools（可执行动作）、Resources（上下文数据）、Prompts（交互模板），覆盖从读取数据到执行操作的完整工具面。',
    },
    {
      title: 'JSON-RPC 2.0',
      desc: '数据层基于 JSON-RPC 2.0：initialize 握手协商协议版本与能力，tools/list 动态发现、tools/call 执行调用，通知消息实时推送变更。',
    },
    {
      title: '双传输通道',
      desc: 'Stdio 传输用于本地进程间通信，零网络开销；Streamable HTTP 传输面向远程 Server，支持 bearer token 与 OAuth 等标准鉴权。',
    },
    {
      title: '反向能力',
      desc: 'Server 也可反向请求 Client：sampling 请求模型补全、elicitation 向用户追问确认、logging 回传调试日志，实现双向交互。',
    },
  ],
  quickStart: {
    install: 'pip install "mcp[cli]"',
    code: `from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Demo")


@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b


@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """Get a personalized greeting"""
    return f"Hello, {name}!"


if __name__ == "__main__":
    mcp.run()  # 默认 stdio 传输`,
    lang: 'python',
    note: '示例按官方 FastMCP Quickstart 精简；可用 mcp dev server.py 在 MCP Inspector 中交互调试。',
  },
  useCases: [
    {
      title: '给 IDE 助手接工具',
      desc: '为 Claude Code、Cursor、VS Code 等 Host 一次性接入数据库、Issue 系统与内部 API，所有兼容 Host 即时可用。',
    },
    {
      title: '企业能力开放',
      desc: '把内部系统包装为远程 MCP Server（Streamable HTTP + OAuth），多团队、多应用共享同一套受管控的工具与数据。',
    },
    {
      title: '本地数据接入',
      desc: '以 stdio Server 把本地文件系统、Git 仓库、笔记库暴露给桌面 AI 应用，数据不出本机，权限由 Host 逐一审批。',
    },
  ],
  ecosystem: ['Claude Desktop', 'Claude Code', 'VS Code', 'Cursor', 'FastMCP', 'TypeScript SDK', 'MCP Inspector', '官方 Servers 合集'],
  resources: [
    { label: '官网与文档', url: 'https://modelcontextprotocol.io' },
    { label: '架构概念 · Architecture', url: 'https://modelcontextprotocol.io/docs/learn/architecture' },
    { label: 'Python SDK', url: 'https://github.com/modelcontextprotocol/python-sdk' },
    { label: '官方 Server 合集', url: 'https://github.com/modelcontextprotocol/servers' },
    { label: 'MCP Inspector 调试工具', url: 'https://github.com/modelcontextprotocol/inspector' },
  ],
  articles: [
    {
      title: 'Introducing the Model Context Protocol',
      author: 'Anthropic',
      source: 'Anthropic 官方博客',
      url: 'https://www.anthropic.com/news/model-context-protocol',
      note: 'MCP 发布原点：N×M 集成困境与协议设计目标的一手权威表述。',
    },
    {
      title: 'Code execution with MCP: Building more efficient agents',
      author: 'Adam Jones & Conor Kelly',
      source: 'Anthropic 工程博客',
      url: 'https://www.anthropic.com/engineering/code-execution-with-mcp',
      note: '官方工程视角：以代码执行替代直接工具调用，化解千级工具的上下文膨胀。',
    },
    {
      title: 'Why MCP Won',
      author: 'Shawn Wang (swyx)',
      source: 'Latent Space',
      url: 'https://www.latent.space/p/why-mcp-won',
      note: 'swyx 复盘 MCP 胜出的七个原因，理解开放协议生态演进的经典分析。',
    },
    {
      title: 'MCP Security Notification: Tool Poisoning Attacks',
      author: 'Luca Beurer-Kellner & Marc Fischer',
      source: 'Invariant Labs Blog',
      url: 'https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks',
      note: '首篇系统披露工具投毒攻击的研究，接入第三方 Server 前的必读安全警示。',
    },
  ],
  faq: [
    {
      q: 'MCP 和 function calling 是什么关系？',
      a: '互补而非替代：function calling 是模型侧的调用格式，MCP 是应用与工具之间的开放协议。Host 把 MCP Server 的工具转成模型认识的 tool schema，因此 MCP 可与任意模型搭配使用。',
    },
    {
      q: '只有 Claude 系产品能用 MCP 吗？',
      a: '不是。MCP 由 Anthropic 发起但属于开放协议，VS Code、Cursor 等众多 Host 均已支持，Server 端有 Python、TypeScript 等多语言 SDK，不绑定任何模型厂商。',
    },
    {
      q: '远程 Server 的安全如何保证？',
      a: 'Streamable HTTP 传输支持标准 HTTP 鉴权，官方推荐用 OAuth 获取访问令牌；工具列表与每次调用都经 Host 呈现给用户授权，全程可审计、可拒绝。',
    },
  ],
}
