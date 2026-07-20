import type { ToolDetail } from '../toolDetail'

/**
 * Dify —— 开源 LLM 应用开发平台
 * 事实来源：langgenius/dify GitHub README 与官方文档（docs.dify.ai）
 */
export const difyDetail: ToolDetail = {
  toolId: 'dify',
  tagline: '开源的 LLM 应用开发与运营平台',
  problem:
    '搭建一个 AI 应用远不止调一次模型：要设计 Prompt、接 RAG 检索、配工具、做日志与运营分析，每个环节都得写大量胶水代码，非深度工程团队很难快速落地。Dify 把这些能力做成开箱即用的产品：可视化画布编排工作流、内置知识库与完整 RAG 管线、数百种模型统一接入、应用发布即生成 API，再配合日志标注与 LLMOps 分析持续改进。它让"从原型到生产"的路径大幅缩短，也是观察 Agent 技术如何产品化的最佳参照样本。',
  architecture: [
    {
      title: '可视化 Workflow 编排',
      desc: '在低代码画布上拖拽 LLM、条件分支、代码执行、工具等节点组成 Workflow 或 Chatflow，支持单节点实时调试，复杂编排逻辑无需从零写代码。',
    },
    {
      title: 'RAG 管线与知识库',
      desc: '内置从文档解析、切分、索引到检索的完整 RAG 管线，开箱支持 PDF、PPT 等常见格式抽取，几分钟即可搭好基于私有文档的问答应用。',
    },
    {
      title: '统一模型接入',
      desc: '通过模型供应商机制无缝接入数百种专有与开源模型，覆盖 GPT、Llama3、Mistral 及任何 OpenAI API 兼容接口，换模型只改配置。',
    },
    {
      title: 'Agent 与工具生态',
      desc: '可基于 Function Calling 或 ReAct 构建 Agent，内置 50+ 工具（Google Search、DALL·E、WolframAlpha 等），也可自行开发自定义工具。',
    },
    {
      title: 'LLMOps 与 BaaS',
      desc: '所有能力都有对应 API（Backend-as-a-Service），内置应用日志监测与标注改进工具，并可对接 Opik、Langfuse、Phoenix 等可观测平台。',
    },
  ],
  quickStart: {
    install: 'git clone https://github.com/langgenius/dify.git',
    code: `# 官方 Quickstart：Docker Compose 自托管
cd dify
cd docker

# 复制环境变量配置
cp .env.example .env

# 启动全部服务（需 CPU >= 2 核、内存 >= 4 GiB）
docker compose up -d

# 浏览器访问 http://localhost/install 完成初始化`,
    lang: 'bash',
    note: '示例为官方 Docker Compose 快速部署流程，高级环境变量见 docker/.env.example 与 docker/envs/。',
  },
  useCases: [
    {
      title: '企业知识库问答',
      desc: '上传内部文档即可构建 RAG 问答机器人，通过 API 或 WebApp 嵌入官网、IM 与内部系统，适合客服与知识管理场景。',
    },
    {
      title: '复杂 AI 工作流',
      desc: '在画布上把检索、LLM 生成、条件分支、代码执行与人工审批串成可复用流程，快速实现内容生产与数据处理自动化。',
    },
    {
      title: 'AI 应用快速验证',
      desc: '产品与运营团队无需等待工程排期，用可视化界面几天内完成原型、调试 Prompt 并发布上线，验证可行性后再深度自研。',
    },
  ],
  ecosystem: [
    'Docker Compose 自托管',
    'OpenAI 兼容模型',
    'RAG / 向量检索',
    '插件与工具市场',
    'API 与 WebApp 发布',
    'Langfuse / Opik / Phoenix',
    'Kubernetes / Helm',
  ],
  resources: [
    { label: 'GitHub 仓库', url: 'https://github.com/langgenius/dify' },
    { label: '官方文档', url: 'https://docs.dify.ai' },
    { label: 'Docker 部署目录', url: 'https://github.com/langgenius/dify/tree/main/docker' },
    { label: 'Dify Cloud（免部署体验）', url: 'https://cloud.dify.ai' },
    { label: '插件市场', url: 'https://marketplace.dify.ai' },
  ],
  articles: [
    {
      title:
        'Introducing Hybrid Search and Rerank to Improve the Retrieval Accuracy of the RAG System',
      author: 'Luyu Zhang',
      source: 'Dify 官方博客',
      url: 'https://dify.ai/blog/hybrid-search-rerank-rag-improvement',
      note: 'Dify 官方讲透混合检索与重排原理，理解其 RAG 管线设计的最佳一手资料',
    },
    {
      title: 'A Cheat Sheet and Some Recipes For Building Advanced RAG',
      author: 'LlamaIndex 团队',
      source: 'LlamaIndex Blog',
      url: 'https://www.llamaindex.ai/blog/a-cheat-sheet-and-some-recipes-for-building-advanced-rag-803a9d94c41b',
      note: '高级 RAG 速查表：分块、重排、信息压缩等进阶技巧均附代码配方',
    },
    {
      title: 'Patterns for Building LLM-based Systems & Products',
      author: 'Eugene Yan',
      source: 'eugeneyan.com',
      url: 'https://eugeneyan.com/writing/llm-patterns/',
      note: '从评估、RAG 到护栏与反馈飞轮，LLM 应用平台工程模式的经典总结',
    },
    {
      title: 'Building LLM Applications for Production',
      author: 'Chip Huyen',
      source: 'huyenchip.com',
      url: 'https://huyenchip.com/2023/04/11/llm-engineering.html',
      note: '经典长文，系统讲清 LLM 应用从原型到生产的成本、延迟与可控性挑战',
    },
  ],
  faq: [
    {
      q: '自托管的最低配置要求是什么？',
      a: '官方要求 CPU ≥ 2 核、内存 ≥ 4 GiB，并安装 Docker 与 Docker Compose。克隆仓库后进入 docker 目录，复制 .env.example 为 .env 再执行 docker compose up -d，最后访问 http://localhost/install 完成初始化。',
    },
    {
      q: '开源版、云服务与许可证有什么区别？',
      a: '社区版可完全自托管，能力齐全；Dify Cloud 免部署、提供含免费额度的沙盒套餐，适合快速体验。许可证基于 Apache 2.0 附加条件（限制多租户 SaaS 转售），企业内部与单租户使用不受影响。',
    },
    {
      q: '能接入自己的模型或本地模型吗？',
      a: '可以。Dify 支持任何 OpenAI API 兼容接口的模型服务，配合 Ollama、Xinference 等本地推理方案即可使用本地模型；也支持 Hugging Face、Replicate 等托管与推理平台。',
    },
  ],
}
