import type { ToolDetail } from '@/data/toolDetail'

/**
 * Ragas 详情数据 —— explodinggradients/ragas
 * 事实来源：官方 GitHub README 与 docs.ragas.io 官方文档（Quickstart / Faithfulness / evaluate 参考）
 */
export const ragasDetail: ToolDetail = {
  toolId: 'ragas',
  tagline: '无人工标注的 RAG 量化评估框架',
  problem:
    'RAG 答得差只有两种根因：检索没找对资料，或生成没忠于资料。人工抽查无法量化，换模型、调 chunk、改 prompt 后效果全凭感觉。Ragas 提供无需人工标注的自动指标——Faithfulness 核对忠实度、Context Precision / Recall 分解检索质量等指标，让调优从试错变为数据驱动。',
  architecture: [
    {
      title: '样本与数据集',
      desc: 'SingleTurnSample 统一描述单轮交互的输入、回答、检索上下文与可选参考答案，多个样本组成 EvaluationDataset 批量评估。',
    },
    {
      title: '声明级忠实度',
      desc: 'Faithfulness 把答案拆解为若干事实声明，逐条核对能否从检索上下文推出，得分 = 被支持声明数 / 总声明数，幻觉无所遁形。',
    },
    {
      title: '批量评估入口',
      desc: 'evaluate(dataset, metrics, llm) 一行对数据集批量计算多个指标，返回结构化 EvaluationResult，可转 DataFrame 分析存档。',
    },
    {
      title: '裁判模型可插拔',
      desc: '通过 llm_factory 或 LangchainLLMWrapper 接入裁判模型：OpenAI、Anthropic、Ollama 等，指标与模型解耦。',
    },
    {
      title: '测试集自动生成',
      desc: 'TestsetGenerator 从自有文档自动合成多样化的问题与参考答案，解决"没有标注数据就无从评估"的冷启动难题。',
    },
  ],
  quickStart: {
    install: 'pip install ragas',
    lang: 'python',
    code: `from langchain_openai import ChatOpenAI
from ragas import EvaluationDataset, SingleTurnSample, evaluate
from ragas.llms import LangchainLLMWrapper
from ragas.metrics import Faithfulness, ResponseRelevancy

sample = SingleTurnSample(
    user_input="第一届超级碗是什么时候举办的？",
    response="第一届超级碗于 1967 年 1 月 15 日举行。",
    retrieved_contexts=[
        "第一届 AFL–NFL 世界冠军赛于 1967 年 1 月 15 日在洛杉矶纪念体育馆举行。"
    ],
)
dataset = EvaluationDataset(samples=[sample])
llm = LangchainLLMWrapper(ChatOpenAI(model="gpt-4o-mini"))
result = evaluate(dataset, metrics=[Faithfulness(), ResponseRelevancy()], llm=llm)
print(result)  # {'faithfulness': 1.0, 'answer_relevancy': ...}`,
    note: '需设置 OPENAI_API_KEY（也可改用 llm_factory 接入其他裁判模型）。示例为官方 Quickstart 精简版。',
  },
  useCases: [
    {
      title: 'RAG 管线调优',
      desc: '换 embedding、调 chunk、改 top-k 后重跑评估，用 Faithfulness 与 Context Recall 量化影响，替代拍脑袋调参。',
    },
    {
      title: '幻觉批量检测',
      desc: '用 Faithfulness 把答案拆成事实声明并逐条核对检索上下文，自动揪出"一本正经地编造"的回答，守住事实底线。',
    },
    {
      title: '评测集冷启动',
      desc: '没有人工标注数据时，用 TestsetGenerator 从业务文档自动合成多样化测试集，快速搭建评估基线，先跑起来再迭代。',
    },
  ],
  ecosystem: ['LangChain', 'LlamaIndex', 'OpenAI', 'Anthropic', 'Ollama', 'LangSmith', 'Arize Phoenix'],
  resources: [
    { label: 'GitHub 仓库', url: 'https://github.com/explodinggradients/ragas' },
    { label: '官方文档', url: 'https://docs.ragas.io/' },
    { label: '快速上手 · Evals', url: 'https://docs.ragas.io/en/latest/getstarted/evals/' },
    { label: '指标概念 · Metrics Overview', url: 'https://docs.ragas.io/en/latest/concepts/metrics/overview/' },
  ],
  articles: [
    {
      title: 'Your AI Product Needs Evals',
      author: 'Hamel Husain',
      source: 'hamel.dev',
      url: 'https://hamel.dev/blog/posts/evals/',
      note: '评估体系方法论经典：三层评估框架，含 RAG 评估专章',
    },
    {
      title: 'Evaluating Long-Context Question & Answer Systems',
      author: 'Eugene Yan',
      source: 'eugeneyan.com',
      url: 'https://eugeneyan.com/writing/qa-evals/',
      note: '把 Faithfulness 讲透：声明级核对、评测集构建与裁判校准',
    },
    {
      title: 'RAG Evaluation Using Ragas',
      author: 'Christy Bergman / Shahul Es / Jithin James',
      source: 'Zilliz Blog',
      url: 'https://zilliz.com/blog/rag-evaluation-using-ragas',
      note: 'Ragas 作者亲笔合著：核心指标口径详解与端到端实战',
    },
    {
      title: 'RAG Evaluation Metrics: Assessing Answer Relevancy, Faithfulness, Contextual Relevancy, And More',
      author: 'Confident AI',
      source: 'Confident AI Blog',
      url: 'https://www.confident-ai.com/blog/rag-evaluation-metrics-answer-relevancy-faithfulness-and-more',
      note: '检索与生成失败模式分解，五大 RAG 指标逐一配码讲清',
    },
  ],
  faq: [
    {
      q: '没有人工标注的参考答案能用吗？',
      a: '可以。Faithfulness、Response Relevancy 等核心指标不需要 reference；有参考答案时可再叠加 FactualCorrectness 等 reference-based 指标，评估维度更完整。',
    },
    {
      q: '评估必须用 OpenAI 模型当裁判吗？',
      a: '不是。通过 llm_factory 可接入 Anthropic、Gemini、Ollama 本地模型或任何 OpenAI 兼容端点，裁判模型与指标逻辑解耦，成本与隐私都可自控。',
    },
    {
      q: 'Ragas 和 DeepEval 怎么选？',
      a: 'Ragas 强于 RAG 检索质量分解（Context Precision / Recall）与测试集自动生成；DeepEval 强于 pytest 式断言与 CI 质量门禁。评估 RAG 管线时两者常搭配使用。',
    },
  ],
}
