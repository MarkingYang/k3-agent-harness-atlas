import type { ToolDetail } from '../toolDetail'

/**
 * LangGraph 详情数据
 * 事实来源：
 * - GitHub README: https://github.com/langchain-ai/langgraph（pip install -U langgraph、Durable execution / Human-in-the-loop 定位）
 * - 官方 Quickstart: https://docs.langchain.com/oss/python/langgraph/quickstart（StateGraph/START/END/add_conditional_edges/compile/invoke 用法）
 * - 官方 Persistence 文档: https://docs.langchain.com/oss/python/langgraph/persistence（InMemorySaver、thread_id、checkpointer 库）
 * - 官方 Graph API 文档: https://docs.langchain.com/oss/python/langgraph/graph-api（State/Node/Edge/reducer/super-step/Pregel）
 */
export const langgraphDetail: ToolDetail = {
  toolId: 'langgraph',
  tagline: '把 Agent 建模为可持久化、可恢复的状态图',
  problem:
    '用 while 循环包一个 LLM 调用就能跑通 Agent demo，但进入生产环境马上会遇到硬问题：循环中途崩溃要从头来过、跨天的长任务状态无处安放、关键操作想加人工审批却插不进去、多步推理的中间状态散落在变量里难以观察与回放。LangGraph 把 Agent 的执行显式建模为一张状态图，将编排、状态与持久化从业务代码中剥离，让 Agent 成为可调试、可恢复、可干预的工程对象。',
  architecture: [
    {
      title: 'State 全局状态',
      desc: '图的共享数据结构，通常用 TypedDict 定义 schema；每个 key 可挂 reducer 函数，决定节点返回的更新是覆盖还是累加，消息列表就是典型的累加场景。',
    },
    {
      title: 'Node 与 Edge',
      desc: '节点是普通 Python 函数，接收当前状态、返回状态更新；边定义流转方向，条件边根据状态动态路由，可构成循环，直至没有节点被激活时图终止。',
    },
    {
      title: 'Super-step 模型',
      desc: '灵感来自 Google Pregel：执行按离散的 super-step 推进，同一步内的节点并行运行，完成后沿边把消息传给下游，全部节点静默即执行结束。',
    },
    {
      title: 'Checkpointer 持久化',
      desc: '编译时挂载 checkpointer（如 InMemorySaver、PostgresSaver），每个 super-step 自动把状态快照存入指定 thread，崩溃后可从断点精确恢复。',
    },
    {
      title: 'Interrupt 人工介入',
      desc: '在任意节点调用 interrupt() 即可暂停执行，人工审查或修改状态后，再以 Command(resume=...) 从中断处继续，实现可靠的 Human-in-the-loop。',
    },
  ],
  quickStart: {
    install: 'pip install -U langgraph',
    code: `from typing import Annotated, TypedDict
import operator
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver

class State(TypedDict):          # 全局状态：messages 按 reducer 累加
    messages: Annotated[list, operator.add]

def chatbot(state: State):       # 节点：接收状态，返回状态更新
    return {"messages": [llm.invoke(state["messages"])]}

builder = StateGraph(State)
builder.add_node("chatbot", chatbot)
builder.add_edge(START, "chatbot")   # 入口边
builder.add_edge("chatbot", END)
graph = builder.compile(checkpointer=InMemorySaver())  # 开启检查点

config = {"configurable": {"thread_id": "1"}}
graph.invoke({"messages": [("user", "你好")]}, config)`,
    lang: 'python',
    note: '示例已简化：llm 可用 langchain 的 init_chat_model 初始化（需配置模型 API Key）；带工具调用的完整循环见官方 Quickstart。',
  },
  useCases: [
    {
      title: '生产级对话助手',
      desc: '在线客服、Copilot 等需要多轮记忆与故障恢复的场景：checkpointer 按 thread_id 保存每轮状态，进程重启后对话无缝继续。',
    },
    {
      title: '长时运行工作流',
      desc: '深度研究、批量处理等可能运行数小时的任务：Durable Execution 保证跨进程不丢进度，失败时只重跑未完成的节点。',
    },
    {
      title: '多 Agent 系统编排',
      desc: '用子图与 Command 把多个专职 Agent 组成层级系统：每个子 Agent 维护独立状态，父图统一调度、移交与汇总结果。',
    },
  ],
  ecosystem: ['LangChain', 'LangSmith', 'Deep Agents', 'LangGraph.js', 'Postgres Checkpointer', 'LangSmith Studio'],
  resources: [
    { label: 'GitHub 仓库', url: 'https://github.com/langchain-ai/langgraph' },
    { label: '官方文档', url: 'https://docs.langchain.com/oss/python/langgraph/overview' },
    { label: '官方 Quickstart', url: 'https://docs.langchain.com/oss/python/langgraph/quickstart' },
    { label: 'LangChain Academy 免费课程', url: 'https://academy.langchain.com/courses/intro-to-langgraph' },
    { label: 'API Reference', url: 'https://reference.langchain.com/python/langgraph' },
  ],
  articles: [
    {
      title: 'Building effective agents',
      author: 'Erik Schluntz & Barry Zhang',
      source: 'Anthropic 官方博客',
      url: 'https://www.anthropic.com/engineering/building-effective-agents',
      note: '经典之作：划清 workflow 与 agent 的分界，五种编排模式是图编排设计的起点',
    },
    {
      title: 'LLM Powered Autonomous Agents',
      author: 'Lilian Weng',
      source: "Lil'Log（个人博客）",
      url: 'https://lilianweng.github.io/posts/2023-06-23-agent/',
      note: '引用最多的 Agent 综述：规划、记忆、工具三要素，理解状态图设计的理论底座',
    },
    {
      title: 'What is a "cognitive architecture"?',
      author: 'Harrison Chase',
      source: 'LangChain 官方博客',
      url: 'https://www.langchain.com/blog/what-is-a-cognitive-architecture',
      note: 'LangGraph 设计哲学源头：从单次调用到自主 agent 的自主性光谱',
    },
    {
      title: 'How and when to build multi-agent systems',
      author: 'Harrison Chase',
      source: 'LangChain 官方博客',
      url: 'https://www.langchain.com/blog/how-and-when-to-build-multi-agent-systems',
      note: '评析多 agent 之争：何时该上多 agent 系统，上下文工程是关键',
    },
  ],
  faq: [
    {
      q: 'LangGraph 和 LangChain 是什么关系？',
      a: 'LangGraph 由 LangChain 团队开发，但可以完全独立安装使用，不依赖 LangChain。需要模型、工具等集成时配合 LangChain 生态更顺滑——官方 quickstart 中的消息类型与 init_chat_model 就来自 langchain 包。',
    },
    {
      q: '什么时候该用 LangGraph，而不是自己写 Agent 循环？',
      a: '当你需要持久化状态、人工审批、故障恢复、复杂分支循环或精细的流式控制时。一次性、几步就能完成的任务，用简单循环或更高层封装（如官方的 Deep Agents）反而更快。',
    },
    {
      q: '检查点存到哪里？生产环境用什么？',
      a: '开发期用自带的 InMemorySaver 即可；本地实验可装 langgraph-checkpoint-sqlite；生产环境官方推荐 langgraph-checkpoint-postgres（PostgresSaver），也是 LangSmith 托管服务使用的实现。',
    },
  ],
}
