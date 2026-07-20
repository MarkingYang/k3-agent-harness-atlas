import type { ToolDeepDive } from '@/data/deepDive'

/**
 * DeepEval 深度解析 —— confident-ai/deepeval
 * 数据来源：
 * - starHistory: https://api.ossinsight.io/v1/repos/confident-ai/deepeval/stargazers/history
 * - stats: https://api.github.com/repos/confident-ai/deepeval（2026-07-18 采集）
 * - versions: https://api.github.com/repos/confident-ai/deepeval/releases + PyPI 交叉验证
 * - 架构理解：官方 README、deepeval.com 文档与 v4.0/v4.1 release notes
 */
export const deepevalDeep: ToolDeepDive = {
  toolId: 'deepeval',
  stats: {
    stars: 16927,
    forks: 1672,
    license: 'Apache-2.0',
    checkedAt: '2026-07-18',
  },
  starHistory: [
    { date: '2023-08', stars: 241 },
    { date: '2023-09', stars: 366 },
    { date: '2023-10', stars: 564 },
    { date: '2023-11', stars: 697 },
    { date: '2023-12', stars: 887 },
    { date: '2024-01', stars: 1029 },
    { date: '2024-02', stars: 1163 },
    { date: '2024-03', stars: 1413 },
    { date: '2024-04', stars: 1655 },
    { date: '2024-05', stars: 1873 },
    { date: '2024-06', stars: 2143 },
    { date: '2024-07', stars: 2387 },
    { date: '2024-08', stars: 2646 },
    { date: '2024-09', stars: 2885 },
    { date: '2024-10', stars: 3214 },
    { date: '2024-11', stars: 3564 },
    { date: '2024-12', stars: 3852 },
    { date: '2025-01', stars: 4286 },
    { date: '2025-02', stars: 4887 },
    { date: '2025-03', stars: 5360 },
    { date: '2025-04', stars: 5654 },
    { date: '2025-05', stars: 6291 },
    { date: '2025-06', stars: 7311 },
    { date: '2025-07', stars: 7921 },
    { date: '2025-08', stars: 8376 },
    { date: '2025-09', stars: 8826 },
    { date: '2025-10', stars: 9047 },
    { date: '2025-11', stars: 9251 },
    { date: '2025-12', stars: 9419 },
    { date: '2026-01', stars: 9583 },
    { date: '2026-02', stars: 9764 },
    { date: '2026-03', stars: 9840 },
    { date: '2026-04', stars: 9948 },
    { date: '2026-05', stars: 10014 },
    { date: '2026-06', stars: 10034 },
    { date: '2026-07', stars: 16927 },
  ],
  versions: [
    { version: 'v4.1.0', date: '2026-07-12', highlight: '新增 AgentLoopDetection 等确定性 Agent 指标' },
    { version: 'v4.0.5', date: '2026-05-28', highlight: 'Claude Opus 4.8 模型预设 Day 0 支持' },
    { version: 'v4.0.3', date: '2026-05-21', highlight: '仿真决策图 API，细粒度控制对话模拟' },
    { version: 'v4.0.2', date: '2026-05-13', highlight: 'DeepEval 4.0：编程 Agent 评测与终端 TUI' },
    { version: 'v3.9.9', date: '2025-12-01', highlight: 'Agentic 指标与多轮合成 Golden 生成' },
  ],
  architecture: {
    intro:
      'DeepEval 最关键的设计决策是把评测复用到 pytest 肌肉记忆上：assert_test 执行器让 LLM 质量失败即构建失败。架构分四层，造数层生产 Golden 与会话用例，数据模型层统一 LLMTestCase 抽象，指标引擎经可插拔裁判模型打分，执行集成层对接 CI 与云端。',
    diagram: {
      cols: 4,
      rows: 3,
      nodes: [
        { id: 'synthesizer', label: '合成器', sub: 'Synthesizer', kind: 'core', col: 1, row: 1, group: '造数层' },
        { id: 'simulator', label: '对话仿真器', sub: 'simulate()', kind: 'core', col: 2, row: 1, group: '造数层' },
        { id: 'dataset', label: '评测数据集', sub: 'Golden 集合', kind: 'data', col: 3, row: 1, group: '数据模型' },
        { id: 'llmtestcase', label: '测试用例', sub: 'LLMTestCase', kind: 'data', col: 4, row: 1, group: '数据模型' },
        { id: 'geval', label: 'GEval 指标', sub: 'GEval', kind: 'core', col: 1, row: 2, group: '指标引擎' },
        { id: 'dag', label: 'DAG 指标', sub: 'DAGMetric', kind: 'core', col: 2, row: 2, group: '指标引擎' },
        { id: 'agentic', label: 'Agent指标', sub: 'TaskCompletion', kind: 'core', col: 3, row: 2, group: '指标引擎' },
        { id: 'judge', label: '裁判模型', sub: '可插拔 Judge', kind: 'external', col: 4, row: 2 },
        { id: 'tracing', label: '追踪装饰器', sub: '@observe', kind: 'core', col: 1, row: 3, group: '执行集成' },
        { id: 'runner', label: '评测执行器', sub: 'assert_test', kind: 'core', col: 2, row: 3, group: '执行集成' },
        { id: 'pytest', label: 'CI 门禁', sub: 'pytest 集成', kind: 'external', col: 3, row: 3, group: '执行集成' },
        { id: 'confident', label: '云端平台', sub: 'Confident AI', kind: 'external', col: 4, row: 3, group: '执行集成' },
      ],
      edges: [
        { from: 'synthesizer', to: 'dataset', label: '生成 Golden' },
        { from: 'simulator', to: 'dataset', label: '生成会话用例' },
        { from: 'dataset', to: 'runner', label: '批量加载' },
        { from: 'llmtestcase', to: 'runner', label: 'evaluate()' },
        { from: 'runner', to: 'geval', label: 'measure()' },
        { from: 'runner', to: 'dag', label: 'measure()' },
        { from: 'geval', to: 'judge', label: 'generate()', bidirectional: true },
        { from: 'dag', to: 'judge', label: '封闭式判定', bidirectional: true },
        { from: 'tracing', to: 'agentic', label: 'span 输入' },
        { from: 'geval', to: 'runner', label: 'score 返回', dashed: true },
        { from: 'runner', to: 'pytest', label: '阈值断言' },
        { from: 'runner', to: 'confident', label: '同步报告' },
      ],
      note: '用例与裁判双双抽象化，指标才可互换；执行器复用 pytest，让质量门禁零成本进入既有 CI。',
    },
  },
  dataFlow: {
    intro:
      '一次评测的生命周期从左到右展开：Golden 数据集的 input 驱动被测应用产出 actual_output，封装为 LLMTestCase 后由指标并发 measure()，裁判模型按 CoT 步骤打分，最终归一为 0-1 分数与阈值判定，沉淀成本地或云端的测试报告。',
    diagram: {
      direction: 'LR',
      cols: 6,
      rows: 2,
      nodes: [
        { id: 'golden', label: '金标准', sub: 'Golden 数据集', kind: 'data', col: 1, row: 1 },
        { id: 'app', label: '被测应用', sub: 'LLM 应用', kind: 'external', col: 2, row: 1 },
        { id: 'testcase', label: '测试用例', sub: 'LLMTestCase', kind: 'data', col: 3, row: 1 },
        { id: 'metrics', label: '指标集合', sub: 'BaseMetric', kind: 'core', col: 4, row: 1 },
        { id: 'judge', label: '裁判模型', sub: 'LLM Judge', kind: 'external', col: 4, row: 2 },
        { id: 'result', label: '评测结果', sub: 'TestResult', kind: 'data', col: 5, row: 1 },
        { id: 'report', label: '测试报告', sub: '本地或云端', kind: 'data', col: 6, row: 1 },
      ],
      edges: [
        { from: 'golden', to: 'app', label: 'input 触发' },
        { from: 'app', to: 'testcase', label: '输出回收' },
        { from: 'testcase', to: 'metrics', label: 'measure()' },
        { from: 'metrics', to: 'judge', label: 'CoT 打分', bidirectional: true },
        { from: 'metrics', to: 'result', label: 'score 汇总' },
        { from: 'result', to: 'report', label: '阈值判定' },
      ],
      note: '数据单向流动、逐段封装：所有指标产出统一归一到 0-1 分数，是整条链路的稳定性来源。',
    },
  },
  sequence: {
    intro:
      '以一次 assert_test 调用为例：测试函数提交用例与指标后，GEval 先依据 criteria 生成 CoT 评分步骤，再让裁判模型按步打分并回传分数与理由，执行器按 threshold 断言成败，结果异步同步 Confident AI，把主观评分拆成可审计的显式步骤。',
    diagram: {
      actors: [
        { id: 'dev', label: '测试函数', kind: 'user' },
        { id: 'runner', label: '评测执行器', kind: 'system' },
        { id: 'geval', label: 'GEval 指标', kind: 'agent' },
        { id: 'judge', label: '裁判 LLM', kind: 'external' },
        { id: 'confident', label: '云端平台', kind: 'external' },
      ],
      messages: [
        { from: 'dev', to: 'runner', label: 'assert_test 调用' },
        { from: 'runner', to: 'geval', label: 'measure 执行' },
        { from: 'geval', to: 'geval', label: '生成 CoT 步骤' },
        { from: 'geval', to: 'judge', label: 'generate 打分请求' },
        { from: 'judge', to: 'geval', label: '返回分数与理由', dashed: true },
        { from: 'geval', to: 'runner', label: 'score 与 reason' },
        { from: 'runner', to: 'runner', label: 'threshold 断言' },
        { from: 'runner', to: 'confident', label: '同步测试结果', dashed: true },
        { from: 'runner', to: 'dev', label: 'pass 或 fail', dashed: true },
      ],
      note: 'LLM-as-a-judge 的推理被拆成显式步骤执行，阈值断言决定成败，云端同步只是可选增强。',
    },
  },
  extension: [
    {
      title: '自定义指标 BaseMetric',
      desc: '继承 BaseMetric 实现 measure 与 is_success，可用 LLM 裁判或纯规则逻辑打分，注册后与内置指标一样参与 assert_test、阈值断言与批量 evaluate 流程。',
    },
    {
      title: 'GEval 自定义评分标准',
      desc: '用自然语言 criteria 或 evaluation_steps 声明评分细则，框架自动生成 chain-of-thought 步骤并按 0-1 打分，不写代码即可造出贴合业务的新指标。',
    },
    {
      title: '自定义裁判模型',
      desc: '实现 DeepEvalBaseLLM 的 load_model/generate 接口，即可把任何厂商 API 或 Ollama、vLLM 本地模型设为裁判，摆脱对 OpenAI 的依赖、成本与数据出境顾虑。',
    },
    {
      title: 'DAGMetric 决策图指标',
      desc: '用任务节点与有向边构建确定性评分树，LLM 只负责沿路径提取判定结论，把多条件、多分支的复杂评估逻辑组合成一个可复用指标。',
    },
  ],
  challenges: [
    {
      title: '裁判一致性与偏差',
      desc: 'LLM-as-a-judge 自带位置偏差与采样随机性，框架用 CoT 步骤分解、低温度与 Arena-GEval 盲测对换缓解，但关键场景仍需多次采样验证分数稳定性。',
    },
    {
      title: '评估成本与速度',
      desc: '每条用例乘以每个指标可能触发多次裁判调用，CI 大规模回归成本高；框架以异步并发执行、结果缓存与本地小模型裁判来压低延迟与账单。',
    },
    {
      title: '多轮与 Agent trace 评估',
      desc: '组件级评估需跨 LangChain、CrewAI 等框架捕获 span，并把异构 trace 归一成 Turn 与工具调用结构再喂给指标，适配与语义对齐成本高。',
    },
    {
      title: '阈值标定难题',
      desc: '0-1 分数到 pass/fail 的阈值缺少通用标准，不同任务分布差异大，需要基线标定配合 Confident AI 的历史回归对比，避免质量门禁误伤发布。',
    },
  ],
  positioning:
    'DeepEval 在 Agent Harness 技术栈中占据评测与质量保障层，回答"每次改动之后系统是否仍然够好"这一工程问题。与 Langfuse、LangSmith 等聚焦线上 trace 的观测平台不同，它把评估前置到开发与 CI 阶段：用 LLMTestCase 固化业务场景，用 G-Eval、DAG 等研究背书指标量化质量，用 pytest 断言充当发布门禁，与线上观测形成互补闭环。4.0 版本进一步推出面向编程 Agent 的 Eval Harness 与终端 TUI，把评测嵌入 Coding Agent 的迭代回路。上游依赖可插拔裁判模型与各框架 trace 集成，下游对接 Confident AI 做跨版本回归对比，是 Python 生态中工程化程度最高的开源 LLM 评测框架之一。',
  landscape: {
    intro:
      'DeepEval 的生态位是离线评测与线上观测之间的质量门禁层：上游接入 OpenAI 与 Ollama 等可插拔裁判、LangChain 系框架的 trace 与文档语料，下游把分数变成 pytest CI 门禁、Confident AI 回归对比，以及编程 Agent 的 eval 反馈回路。',
    diagram: {
      direction: 'LR',
      cols: 3,
      rows: 3,
      nodes: [
        { id: 'openai', label: 'OpenAI', sub: '裁判模型 API', kind: 'external', col: 1, row: 1, group: '上游依赖' },
        { id: 'ollama', label: 'Ollama', sub: '本地裁判模型', kind: 'external', col: 1, row: 2, group: '上游依赖' },
        { id: 'langchain', label: 'Agent 框架', sub: 'LangChain 等', kind: 'external', col: 1, row: 3, group: '上游依赖' },
        { id: 'deepeval', label: 'DeepEval', sub: '评测框架', kind: 'core', col: 2, row: 2, group: '本项目' },
        { id: 'pytest', label: 'CI 门禁', sub: 'pytest', kind: 'external', col: 3, row: 1, group: '下游应用' },
        { id: 'confident', label: '云端平台', sub: 'Confident AI', kind: 'external', col: 3, row: 2, group: '下游应用' },
        { id: 'coding', label: '编程 Agent', sub: 'Claude Code 等', kind: 'external', col: 3, row: 3, group: '下游应用' },
      ],
      edges: [
        { from: 'openai', to: 'deepeval', label: '裁判打分' },
        { from: 'ollama', to: 'deepeval', label: '本地裁判' },
        { from: 'langchain', to: 'deepeval', label: 'trace 集成' },
        { from: 'deepeval', to: 'pytest', label: '断言门禁' },
        { from: 'deepeval', to: 'confident', label: '报告同步' },
        { from: 'deepeval', to: 'coding', label: 'eval 反馈' },
      ],
      note: '左进模型与框架 trace，右出门禁、云端回归与 Coding Agent 回路，卡位开发与发布之间。',
    },
  },
  competitors: [
    {
      name: 'Ragas',
      relation: '直接竞品',
      diff: '专注 RAG 检索质量分解与测试集生成，学术味更浓；DeepEval 胜在 pytest 断言、CI 门禁与 Agentic 指标广度。',
    },
    {
      name: 'Promptfoo',
      relation: '直接竞品',
      diff: 'Node.js/YAML 配置驱动，红队安全测试与多模型 A/B 更强；DeepEval 更贴合 Python 工程栈与代码化断言。',
    },
    {
      name: 'TruLens',
      relation: '相邻替代',
      diff: '以 feedback 函数加运行时观测为主，偏重在线追踪评估；DeepEval 偏离线测试与发布前回归门禁。',
    },
    {
      name: 'OpenAI Evals',
      relation: '相邻替代',
      diff: '官方评测框架已归档停更，沉淀为基准数据集；DeepEval 接管了日常工程化评估场景。',
    },
  ],
  mechanism: [
    {
      title: 'GEval 两步 CoT 评分',
      desc: 'GEval 是两步算法：先用 CoT 依据 criteria 生成一串 evaluation_steps（用户显式提供步骤时跳过此步，分数跨轮次更稳定），再把步骤与 evaluation_params 指定的用例字段拼成"表单填充"式提示词，让裁判模型按步骤输出 1-5 分；最后取输出 token 的概率做加权求和，归一化为 0-1 分数并附 reason。',
    },
    {
      title: 'DAG 判定图执行',
      desc: 'DAGMetric 把评估拆成四类节点组成的有向无环图：TaskNode 将测试用例拆解为原子单元，Binary/NonBinaryJudgementNode 让裁判模型做出 yes/no 或封闭式选项判定并据此路由到下一节点，直到落入叶子 VerdictNode——返回硬编码分数或 GEval 分数。最终分由走过的路径决定，比单提示词裁判更确定、可审计。',
    },
    {
      title: 'assert_test 断言执行',
      desc: 'deepeval test run 命令底层是 pytest 集成：测试文件遵循 test_*.py 约定，parametrize 把每条 Golden 展开成独立用例，assert_test 对每条用例并发执行所有指标并逐一比较 score 与 threshold；任一指标 is_successful() 为假即测试失败、进程以非零码退出，被 CI 视为构建失败，-n 参数可起多进程并行。',
    },
    {
      title: 'Synthesizer 四步管线',
      desc: '合成管线固定四步：先由 LLM 基于文档切片或场景生成原始 input；Filtration 由 critic 模型按自洽性与清晰度打 0-1 质量分，低于阈值重新生成直至重试上限；Evolution 按 REASONING、MULTICONTEXT 等演化类型分布抽样改写 input 提升复杂度；最后 Styling 按 task、scenario 与格式要求重写 input 和 expected_output，产出 Golden。',
    },
  ],
  sourceLayout: [
    { path: 'deepeval/metrics', role: '50+ 指标实现：GEval、DAG、RAG 三元组与 Agentic 指标' },
    { path: 'deepeval/metrics/dag', role: 'TaskNode/判定节点/VerdictNode 决策图指标' },
    { path: 'deepeval/metrics/g_eval', role: 'GEval 的 CoT 步骤生成与加权打分实现' },
    { path: 'deepeval/synthesizer', role: 'Golden 合成管线：生成、过滤、演化与风格化' },
    { path: 'deepeval/evaluate', role: 'evaluate 与 assert_test 执行器、并发调度与报告' },
    { path: 'deepeval/test_case', role: 'LLMTestCase、ConversationalTestCase 数据模型' },
    { path: 'deepeval/tracing', role: '@observe 追踪与 span 模型，支撑组件级评估' },
    { path: 'deepeval/models', role: 'DeepEvalBaseLLM 及各厂商裁判模型适配层' },
  ],
  tradeoffs: [
    {
      title: '测试形态选型',
      choice: '复用 pytest 断言与 CLI 生态',
      reason: 'pytest 已是 Python 团队的肌肉记忆：parametrize、并行执行、非零退出码开箱即用，评测失败即构建失败，团队无需学习新的门禁概念，就能把 LLM 质量直接卡进既有 CI 流水线。',
    },
    {
      title: '分数模型统一',
      choice: '统一 0-1 分数加 threshold 判定',
      reason: 'QAG 比例分、GEval 加权分、DAG 路径分全部归一到 0-1，threshold 默认 0.5，is_successful() 成为唯一判定入口；strict_mode 可把分数压成 0/1 二值，换来指标间的完全可互换。',
    },
    {
      title: '确定性裁判设计',
      choice: '把裁判判定约束进决策图节点',
      reason: '官方博客坦言纯 LLM 裁判不够确定，用户被迫自写数百行提示链补丁；DAG 把判定拆成原子节点、答案限定为封闭式选项，由路径决定分数，牺牲自由度换取可复现与可审计。',
    },
  ],
  production: [
    {
      title: 'CI 质量门禁',
      desc: '把 deepeval test run 写进 CI 的 yaml 步骤即可做发布前门禁：分数低于阈值测试失败、进程非零退出阻断合并；-n 指定进程数并行跑大套件，parametrize 让每条 Golden 独立成用例，失败可定位到具体输入。',
    },
    {
      title: '裁判模型成本控制',
      desc: '每条用例乘以每个指标会触发多次裁判调用，成本随套件规模线性放大。实践上保持异步并发、开启结果缓存避免重复打分，用 cost tracking 跟踪 token 账单，并把裁判换成 mini 级或 Ollama/vLLM 本地模型。',
    },
    {
      title: '云端回归跟踪',
      desc: 'deepeval login 配置 CONFIDENT_API_KEY 后，每次测试运行自动同步 Confident AI：回归测试自动对比最近一次已知良好基线并列出退化的具体用例，数据集带版本历史，报告可共享给非技术干系人。',
    },
    {
      title: '合成数据人工抽检',
      desc: '官方明确建议尽可能人工检查并编辑合成数据：过滤阈值只保质量下限，重试耗尽后仍保留最高分的次优 Golden。纳入回归基线前应按业务分布抽检修正，避免把合成偏差固化进门禁。',
    },
  ],
  en: {
    tagline:
      'Unit-test your LLMs and agents like pytest: LLM-as-a-judge metrics, CI quality gates, synthetic data, and agent trace evaluation in one Python framework.',
    summary:
      'DeepEval is an open-source Python framework that turns LLM quality into pytest-style unit tests. It models every interaction as an LLMTestCase, scores outputs with 50+ research-backed metrics such as G-Eval, DAG, Faithfulness, and Task Completion, and asserts them against thresholds inside CI pipelines. A Synthesizer evolves documents into golden datasets, the Conversation Simulator generates multi-turn cases, and @observe tracing enables component-level agent evaluation. Judge models are pluggable—from OpenAI to local models—and results can sync to Confident AI for regression comparison across versions.',
  },
}
