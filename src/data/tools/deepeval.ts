import type { ToolDetail } from '@/data/toolDetail'

/**
 * DeepEval 详情数据 —— confident-ai/deepeval
 * 事实来源：官方 GitHub README 与 deepeval.com 官方文档（Getting Started / Metrics）
 */
export const deepevalDetail: ToolDetail = {
  toolId: 'deepeval',
  tagline: '像写单元测试一样测试 LLM 与 Agent',
  problem:
    'LLM 输出具有不确定性，传统断言只能验证确定性逻辑，"感觉不错"不等于"可量化达标"：每次换模型、改 prompt、升级框架，都可能让质量悄悄回退而无人察觉。DeepEval 把评估变成 pytest 风格的单元测试——用 LLM-as-a-judge 指标为输出打分并按阈值断言，可直接嵌入 CI 流水线，让每次变更的质量影响可度量、可回归、可门禁。',
  architecture: [
    {
      title: '测试用例抽象',
      desc: 'LLMTestCase 封装一次 LLM 交互：input、actual_output 必填，expected_output、retrieval_context 可选。',
    },
    {
      title: '指标即裁判',
      desc: '内置 G-Eval、Faithfulness、Task Completion 等数十种指标，由 LLM 裁判或本地模型打分，0-1 分按 threshold 判定。',
    },
    {
      title: 'pytest 式断言',
      desc: 'assert_test 把用例与指标变成标准测试函数，deepeval test run 一键执行，与 pytest 生态兼容，可无缝挂入 CI/CD 充当质量门禁。',
    },
    {
      title: '端到端与组件级',
      desc: '黑盒端到端评估之外，@observe 装饰器可追踪 Agent 内部组件，对检索、工具调用等中间步骤逐 span 打分。',
    },
    {
      title: '可选云端平台',
      desc: 'deepeval login 后结果自动同步 Confident AI，生成可分享报告并对比历史版本；不登录也能纯本地运行。',
    },
  ],
  quickStart: {
    install: 'pip install -U deepeval',
    lang: 'python',
    code: `from deepeval import assert_test
from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, SingleTurnParams

def test_correctness():
    metric = GEval(
        name="Correctness",
        criteria="根据 expected output 判断 actual output 是否正确。",
        evaluation_params=[SingleTurnParams.ACTUAL_OUTPUT, SingleTurnParams.EXPECTED_OUTPUT],
        threshold=0.5,
    )
    case = LLMTestCase(
        input="如果这双鞋不合脚怎么办？",
        actual_output="您可以在 30 天内获得全额退款，无需额外费用。",
        expected_output="我们提供 30 天全额退款，不收取任何额外费用。",
    )
    assert_test(case, [metric])`,
    note: '运行：deepeval test run test_example.py（需先设置 OPENAI_API_KEY）。示例为官方 Quickstart 精简版，完整版见官方文档。',
  },
  useCases: [
    {
      title: 'Prompt / 模型回归测试',
      desc: '把核心业务场景固化成评测数据集，每次改 prompt、换模型后重跑测试，指标低于阈值即阻断发布，防止质量悄悄回退。',
    },
    {
      title: 'RAG 质量门禁',
      desc: '用 Answer Relevancy、Faithfulness、Contextual Recall 组合评估 RAG 管线，在 CI 中监控检索与生成质量。',
    },
    {
      title: 'Agent 行为验收',
      desc: '用 Task Completion、Tool Correctness 等 Agentic 指标验证 Agent 是否达成目标、调对工具，适合上线前验收。',
    },
  ],
  ecosystem: ['pytest', 'CI/CD', 'OpenAI', 'LangChain', 'LangGraph', 'CrewAI', 'Pydantic AI', 'Confident AI'],
  resources: [
    { label: 'GitHub 仓库', url: 'https://github.com/confident-ai/deepeval' },
    { label: '官方文档 · Getting Started', url: 'https://deepeval.com/docs/getting-started' },
    { label: '指标目录 · Metrics', url: 'https://deepeval.com/docs/metrics-introduction' },
    { label: 'Confident AI 平台', url: 'https://www.confident-ai.com' },
  ],
  articles: [
    {
      title: 'Your AI Product Needs Evals',
      author: 'Hamel Husain',
      source: "Hamel's Blog",
      url: 'https://hamel.dev/blog/posts/evals/',
      note: '评估体系三层级方法论奠基之作，其单元测试级评估正是 DeepEval 的设计原点。',
    },
    {
      title: 'Evaluating the Effectiveness of LLM-Evaluators (aka LLM-as-Judge)',
      author: 'Eugene Yan',
      source: 'eugeneyan.com',
      url: 'https://eugeneyan.com/writing/llm-evaluators/',
      note: '融汇二十余篇论文，讲透 LLM 裁判的用法、对齐与局限，读懂指标打分本质。',
    },
    {
      title: 'LLM Evaluation Metrics: The Ultimate LLM Evaluation Guide',
      author: 'Jeffrey Ip',
      source: 'Confident AI 官方博客',
      url: 'https://www.confident-ai.com/blog/llm-evaluation-metrics-everything-you-need-for-llm-evaluation',
      note: 'DeepEval 作者亲述指标体系设计，G-Eval、DAG 等核心指标原理全解。',
    },
    {
      title: 'We Need Better Evals for LLM Applications',
      author: 'Andrew Ng',
      source: 'DeepLearning.AI · The Batch',
      url: 'https://www.deeplearning.ai/the-batch/we-need-better-evals-for-llm-applications',
      note: '吴恩达谈 LLM 应用评估为何难、贵、慢，理解评估框架存在的意义。',
    },
  ],
  faq: [
    {
      q: '评估打分一定要调 OpenAI 吗？',
      a: '不必。指标默认以 OpenAI 模型为裁判，但可为任何指标指定自定义模型——其他厂商 API 或本地模型均可；部分指标还基于本地 NLP 模型运行，可完全离线评估。',
    },
    {
      q: '和 Ragas 有什么区别、怎么选？',
      a: 'DeepEval 更像"测试框架"：pytest 断言、CI 质量门禁、Task Completion 等 Agentic 指标是强项；Ragas 更专注 RAG 检索质量分解与测试集生成。实践中两者常互补使用。',
    },
    {
      q: '必须注册 Confident AI 云平台吗？',
      a: '不是。DeepEval 完全开源、可纯本地运行；deepeval login 只是可选增强，用于云端测试报告、数据集管理与跨版本回归对比。',
    },
  ],
}
