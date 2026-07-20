import type { ToolDeepDive } from '../deepDive'

/**
 * Ragas 深度解析 —— explodinggradients/ragas（已迁移至 vibrantlabsai/ragas，GitHub 自动重定向）
 * 事实来源：
 * - stats：GitHub API repos/vibrantlabsai/ragas（stars 14893 / forks 1567 / Apache-2.0），采集于 2026-07-18
 * - starHistory：OSS Insight api.ossinsight.io/v1/repos/vibrantlabsai/ragas/stargazers/history
 *   （39 点取首点 + 最近 35 点；末点已按 GitHub API 实时值修正）
 * - versions：GitHub releases API（v0.4.3 ~ v0.4.0）
 * - 架构：docs.ragas.io 官方文档（Faithfulness / Test Data Generation / General Purpose Metrics）
 *   及 vibrantlabsai/ragas 源码路径核验（2026-07-18）
 */
export const ragasDeep: ToolDeepDive = {
  toolId: 'ragas',

  stats: {
    stars: 14893,
    forks: 1567,
    license: 'Apache-2.0',
    checkedAt: '2026-07-18',
  },

  starHistory: [
    { date: '2023-05', stars: 15 },
    { date: '2023-09', stars: 745 },
    { date: '2023-10', stars: 1035 },
    { date: '2023-11', stars: 1531 },
    { date: '2023-12', stars: 1997 },
    { date: '2024-01', stars: 2506 },
    { date: '2024-02', stars: 3025 },
    { date: '2024-03', stars: 3856 },
    { date: '2024-04', stars: 4381 },
    { date: '2024-05', stars: 4863 },
    { date: '2024-06', stars: 5232 },
    { date: '2024-07', stars: 5603 },
    { date: '2024-08', stars: 6001 },
    { date: '2024-09', stars: 6332 },
    { date: '2024-10', stars: 6646 },
    { date: '2024-11', stars: 6948 },
    { date: '2024-12', stars: 7271 },
    { date: '2025-01', stars: 7539 },
    { date: '2025-02', stars: 7844 },
    { date: '2025-03', stars: 8128 },
    { date: '2025-04', stars: 8463 },
    { date: '2025-05', stars: 8740 },
    { date: '2025-06', stars: 8973 },
    { date: '2025-07', stars: 9197 },
    { date: '2025-08', stars: 9397 },
    { date: '2025-09', stars: 9625 },
    { date: '2025-10', stars: 9734 },
    { date: '2025-11', stars: 9870 },
    { date: '2025-12', stars: 10045 },
    { date: '2026-01', stars: 10207 },
    { date: '2026-02', stars: 10289 },
    { date: '2026-03', stars: 10372 },
    { date: '2026-04', stars: 10448 },
    { date: '2026-05', stars: 10472 },
    { date: '2026-06', stars: 10483 },
    { date: '2026-07', stars: 14893 },
  ],

  versions: [
    { version: 'v0.4.3', date: '2026-01-13', highlight: '新增 DSPyOptimizer 提示词优化' },
    { version: 'v0.4.2', date: '2025-12-23', highlight: '更多指标迁入 collections API' },
    { version: 'v0.4.1', date: '2025-12-10', highlight: 'BasePrompt 支持保存/加载' },
    { version: 'v0.4.0', date: '2025-12-03', highlight: '指标重构为模块化 BasePrompt 架构' },
  ],

  architecture: {
    intro:
      '生成面与评估面共用裁判接入：文档经转换管线建成 KnowledgeGraph，Persona 场景采样后由合成器产出测试集；evaluate 交 Executor 异步分发，成本与提示词治理统一收口。',
    diagram: {
      cols: 4,
      rows: 4,
      nodes: [
        { id: 'docs', label: '原始文档', sub: '业务语料', kind: 'external', col: 1, row: 1 },
        { id: 'transforms', label: '转换管线', sub: '摘要与NER抽取', kind: 'core', col: 2, row: 1, group: '测试集生成面' },
        { id: 'kg', label: '知识图谱', sub: 'KnowledgeGraph', kind: 'data', col: 3, row: 1, group: '测试集生成面' },
        { id: 'scenarios', label: '场景采样', sub: 'Persona·长度·风格', kind: 'control', col: 4, row: 1, group: '测试集生成面' },
        { id: 'synth', label: '查询合成器', sub: '单跳多跳合成', kind: 'core', col: 4, row: 2, group: '测试集生成面' },
        { id: 'testset', label: '合成测试集', sub: 'Testset·评测集', kind: 'data', col: 3, row: 2, group: '测试集生成面' },
        { id: 'engine', label: '评估引擎', sub: 'evaluate入口', kind: 'core', col: 2, row: 2, group: '评估执行面' },
        { id: 'executor', label: '执行器', sub: '异步并发调度', kind: 'control', col: 1, row: 2, group: '评估执行面' },
        { id: 'result', label: '评估结果', sub: '分数与原因', kind: 'data', col: 1, row: 3, group: '评估执行面' },
        { id: 'metrics', label: '指标集合', sub: 'collections', kind: 'core', col: 2, row: 3, group: '指标与裁判层' },
        { id: 'prompts', label: '提示词层', sub: 'BasePrompt', kind: 'control', col: 3, row: 3, group: '指标与裁判层' },
        { id: 'llmfactory', label: '裁判接入', sub: 'llm_factory', kind: 'control', col: 4, row: 3, group: '指标与裁判层' },
        { id: 'llm', label: '裁判模型', sub: '多厂商可插拔', kind: 'external', col: 4, row: 4 },
      ],
      edges: [
        { from: 'docs', to: 'transforms', label: '文档切块' },
        { from: 'transforms', to: 'kg', label: 'apply转换' },
        { from: 'kg', to: 'scenarios', label: '图遍历采样' },
        { from: 'scenarios', to: 'synth', label: '场景组合' },
        { from: 'synth', to: 'testset', label: '生成问答对' },
        { from: 'testset', to: 'engine', label: '作为评测集', dashed: true },
        { from: 'engine', to: 'executor', label: '构建执行计划' },
        { from: 'executor', to: 'metrics', label: '分发单样本' },
        { from: 'prompts', to: 'metrics', label: '指令模板' },
        { from: 'llmfactory', to: 'prompts', label: '结构化输出' },
        { from: 'llm', to: 'llmfactory', label: '厂商接入' },
        { from: 'executor', to: 'result', label: '聚合输出' },
        { from: 'metrics', to: 'result', label: '声明级得分' },
      ],
      note: 'Persona 场景采样决定测试集多样性，Executor 承接 evaluate 的异步并发分发。',
    },
  },

  dataFlow: {
    intro:
      '忠实度评估流程：回答先被 StatementGeneratorPrompt 拆成原子声明，再与拼接的检索上下文逐条 NLI 核对，得分取被支持声明比例，核对步可换本地 HHEM 分类器。',
    diagram: {
      cols: 6,
      rows: 2,
      direction: 'LR',
      nodes: [
        { id: 'sample', label: '评估样本', sub: '单轮评估样本', kind: 'data', col: 1, row: 1 },
        { id: 'decomp', label: '声明抽取', sub: '原子化拆解', kind: 'core', col: 2, row: 1 },
        { id: 'claims', label: '原子声明', sub: '结构化声明列表', kind: 'data', col: 3, row: 1 },
        { id: 'nli', label: '蕴含核对', sub: 'NLI蕴含判定', kind: 'core', col: 4, row: 1 },
        { id: 'contexts', label: '检索上下文', sub: '证据拼接', kind: 'data', col: 3, row: 2 },
        { id: 'verdicts', label: '支持判定', sub: '逐条verdict', kind: 'data', col: 5, row: 1 },
        { id: 'score', label: '忠实度得分', sub: '支持比例', kind: 'data', col: 6, row: 1 },
        { id: 'hhem', label: 'HHEM分类器', sub: '本地备选核对', kind: 'control', col: 4, row: 2 },
      ],
      edges: [
        { from: 'sample', to: 'decomp', label: '回答输入' },
        { from: 'decomp', to: 'claims', label: '结构化输出' },
        { from: 'claims', to: 'nli', label: '逐条送检' },
        { from: 'contexts', to: 'nli', label: '拼接证据' },
        { from: 'nli', to: 'verdicts', label: '逐条判定' },
        { from: 'verdicts', to: 'score', label: '汇总比例' },
        { from: 'hhem', to: 'nli', label: '替换核对步', dashed: true },
      ],
      note: '两次结构化输出完成声明级核对；核对步换 HHEM 后 API 成本随声明数的线性增长被切断。',
    },
  },

  sequence: {
    intro:
      '一次 evaluate 调用时序：引擎把数据集交给 Executor 异步分发，指标内部两次结构化 LLM 调用完成声明抽取与蕴含核对，得分回流聚合为 EvaluationResult。',
    diagram: {
      actors: [
        { id: 'app', label: '业务RAG应用', kind: 'user' },
        { id: 'engine', label: 'evaluate引擎', kind: 'agent' },
        { id: 'executor', label: 'Executor', kind: 'system' },
        { id: 'metric', label: '忠实度指标', kind: 'system' },
        { id: 'llm', label: '裁判LLM', kind: 'external' },
      ],
      messages: [
        { from: 'app', to: 'engine', label: 'evaluate() 提交评估' },
        { from: 'engine', to: 'executor', label: '构建异步执行计划' },
        { from: 'executor', to: 'metric', label: 'ascore() 分发样本' },
        { from: 'metric', to: 'llm', label: 'generate() 抽取声明' },
        { from: 'llm', to: 'metric', label: '返回原子声明列表', dashed: true },
        { from: 'metric', to: 'llm', label: 'generate() 蕴含核对' },
        { from: 'llm', to: 'metric', label: '返回verdict判定', dashed: true },
        { from: 'metric', to: 'executor', label: '声明级得分回流' },
        { from: 'engine', to: 'app', label: '返回结构化结果' },
      ],
      note: '指标间并行执行；单个样本两次裁判调用起，结果聚合为 EvaluationResult。',
    },
  },

  extension: [
    {
      title: '自定义指标：DiscreteMetric / AspectCritic / RubricsScore',
      desc: '用 DiscreteMetric 自定义离散评分，AspectCritic 按自然语言定义多次裁判投票取多数判决，RubricsScore 按 1-5 分档细则打分，均返回分数与理由。',
    },
    {
      title: '提示词适配：BasePrompt 改写与翻译',
      desc: '指标内置 prompt 可通过 BasePrompt 查看改写，adapt() 支持翻译为目标语言并保留少样本示例，save/load 持久化模板，让评估适配中文等本地化场景。',
    },
    {
      title: '裁判模型接入：llm_factory 与 Wrapper',
      desc: 'llm_factory 配合原生 SDK 客户端接入任意厂商，InstructorLLM 保证结构化输出，也可用 LangchainLLMWrapper 复用 LangChain 模型，成本隐私自控。',
    },
    {
      title: '自定义合成器与图谱转换器',
      desc: '继承 QuerySynthesizer 自定义场景生成与样本合成，或扩展 Extractor、RelationshipBuilder 改造知识图谱，生成贴合业务的测试集。',
    },
  ],

  challenges: [
    {
      title: '裁判模型偏差与成本',
      desc: '指标本质是多轮 LLM 调用，裁判偏差会直接传导到分数；大评测集下调用次数随声明数膨胀，需靠缓存、并发控制与 HHEM 小模型替代压住成本。',
    },
    {
      title: '声明抽取质量决定上限',
      desc: 'Faithfulness 的准确性取决于原子声明的抽取质量：长句嵌套与代词指代会造成声明重复或遗漏，使忠实度得分失真，需要 prompt 与结构化输出双重约束。',
    },
    {
      title: '合成数据的分布偏移',
      desc: '合成问题的分布未必匹配真实用户提问，知识图谱遍历偏向实体密集区域，需用 Persona、查询长度与风格等场景参数采样来缓解分布偏移。',
    },
    {
      title: '评估结果的可复现性',
      desc: '同一数据集重跑分数会波动：裁判模型的温度、采样与并发顺序都影响结果，需固定随机种子、低温设置并版本化 prompt，回归对比才可信。',
    },
  ],

  positioning:
    'Ragas 占据评估层的 RAG 专项位置：与 LangSmith、Phoenix 等以 trace 观测为中心的平台不同，它把评估做成可离线运行的指标库，无需人工标注即可量化检索精度与答案忠实度，区分"检索差"与"生成差"。上游对接可插拔裁判模型，下游送入 CI 回归与观测平台。v0.4 起指标重构为 collections API 与 BasePrompt 架构，评估范围从 RAG 扩展到 Agent 多轮对话。',

  landscape: {
    intro:
      '生态位置的关键是框架中立：上游从任意框架导出样本并接入可插拔裁判模型，下游把分数送入 CI 门禁与 Phoenix 观测平台并反哺 DSPy 优化，与 DeepEval 互补而非绑定。',
    diagram: {
      cols: 4,
      rows: 3,
      direction: 'LR',
      nodes: [
        { id: 'langchain', label: 'LangChain', sub: '样本导出', kind: 'external', col: 1, row: 1, group: '上游供给' },
        { id: 'llamaindex', label: 'LlamaIndex', sub: '检索管道', kind: 'external', col: 1, row: 2, group: '上游供给' },
        { id: 'judges', label: '裁判模型', sub: 'GPT与Claude', kind: 'external', col: 1, row: 3, group: '上游供给' },
        { id: 'corpus', label: '业务文档', sub: '合成原料', kind: 'external', col: 2, row: 1, group: '上游供给' },
        { id: 'ragas', label: 'Ragas', sub: '评估与测试集', kind: 'core', col: 2, row: 2, group: '本项目' },
        { id: 'testsetgen', label: '测试集生成', sub: '图谱驱动合成', kind: 'core', col: 2, row: 3, group: '本项目' },
        { id: 'deepeval', label: 'DeepEval', sub: '互补共存', kind: 'external', col: 3, row: 1 },
        { id: 'ci', label: 'CI门禁', sub: 'pytest断言', kind: 'external', col: 3, row: 2, group: '下游消费' },
        { id: 'phoenix', label: 'Phoenix', sub: '观测平台', kind: 'external', col: 3, row: 3, group: '下游消费' },
        { id: 'dspy', label: 'DSPy', sub: '提示词优化', kind: 'external', col: 4, row: 2, group: '下游消费' },
      ],
      edges: [
        { from: 'langchain', to: 'ragas', label: '导出评估样本' },
        { from: 'llamaindex', to: 'ragas', label: '导出评估样本' },
        { from: 'judges', to: 'ragas', label: '裁判接入' },
        { from: 'corpus', to: 'testsetgen', label: '构建知识图谱' },
        { from: 'testsetgen', to: 'ragas', label: '供给测试集' },
        { from: 'deepeval', to: 'ragas', label: '互补共存', dashed: true, bidirectional: true },
        { from: 'ragas', to: 'ci', label: '指标断言' },
        { from: 'ragas', to: 'phoenix', label: '导出分数' },
        { from: 'ragas', to: 'dspy', label: '驱动优化' },
      ],
      note: '框架中立 + 裁判可插拔，使 Ragas 能卡位评估层而不绑定任一上游框架。',
    },
  },

  competitors: [
    {
      name: 'DeepEval',
      relation: '直接竞品',
      diff: 'pytest 式断言与 CI 质量门禁见长；Ragas 强于 RAG 检索质量分解与知识图谱驱动的测试集合成。',
    },
    {
      name: 'TruLens',
      relation: '直接竞品',
      diff: '以反馈函数评估并深度绑定 Snowflake 生态；Ragas 的指标广度与测试集生成能力更独立完整。',
    },
    {
      name: 'Arize Phoenix',
      relation: '互补共存',
      diff: '以 trace 观测与在线评估为中心，Ragas 常作离线指标库与其搭配，评估分数可导出至 Phoenix。',
    },
    {
      name: 'LangSmith Evaluators',
      relation: '相邻替代',
      diff: '绑定 LangChain 生态的平台化评估；Ragas 框架中立、可离线运行，裁判模型完全自选。',
    },
  ],

  mechanism: [
    {
      title: '声明级忠实度核对链路',
      desc: '指标先用 StatementGeneratorPrompt 让裁判模型把回答拆成无代词、可独立理解的原子声明；再把全部检索上下文拼接，由 NLIStatementPrompt 逐条判定蕴含（verdict 1/0）；最终得分=被支持声明数/总声明数，无声明时返回 NaN。整条链路以两次结构化输出调用完成，判决粒度精确到单条声明。',
    },
    {
      title: '图谱驱动测试集合成',
      desc: 'TestsetGenerator 先把文档切块为图节点，默认转换管线抽取标题、摘要、主题与命名实体，计算摘要嵌入并构建节点关系；场景采样按 Persona、查询长度、查询风格组合场景，依设定概率分布在图上筛选节点；最后由单跳/多跳合成器生成问题、参考答案与上下文。',
    },
    {
      title: '提示词与裁判模型解耦',
      desc: '每个指标内置的 PydanticPrompt 把指令、少样本示例与结构化输出绑定为可替换对象：adapt() 调用裁判模型把示例与指令翻译成目标语言，save/load 持久化模板；裁判模型经 llm_factory 以 Instructor 结构化输出接入任意厂商，更换裁判不触碰指标逻辑。',
    },
  ],

  sourceLayout: [
    { path: 'src/ragas/metrics', role: 'legacy 指标与 DiscreteMetric、NumericMetric 等自定义指标基类' },
    { path: 'src/ragas/metrics/collections', role: 'v0.4 模块化指标，每指标独立目录，内含 metric 与提示词 util' },
    { path: 'src/ragas/testset', role: 'TestsetGenerator 入口、KnowledgeGraph 图结构与 persona 定义' },
    { path: 'src/ragas/testset/transforms', role: '默认转换管线：摘要/主题/NER 抽取器、过滤器与关系构建器' },
    { path: 'src/ragas/testset/synthesizers', role: '单跳/多跳场景合成器与样本生成逻辑' },
    { path: 'src/ragas/prompt', role: 'BasePrompt/PydanticPrompt 抽象、adapt 翻译适配与持久化' },
    { path: 'src/ragas/llms', role: 'llm_factory 统一入口与各厂商 Instructor/LiteLLM 封装' },
    { path: 'src/ragas/optimizers', role: 'DSPyOptimizer 提示词自动优化适配器' },
  ],

  tradeoffs: [
    {
      title: '声明级核对而非整体打分',
      choice: '拆成原子声明逐条蕴含核对',
      reason: '整体让 LLM 打一个分不可解释且易偏宽松；声明级核对能定位具体哪条事实无据可依，得分即被支持声明比例，粒度细、可审计，代价是每样本需多轮裁判调用。',
    },
    {
      title: '无参考评估的取舍',
      choice: '不依赖人工标注参考答案',
      reason: '以裁判 LLM 替代人工标注，解决评估数据冷启动；代价是裁判偏差直接传导进分数，官方因此提供裁判对齐指南与 HHEM 开源分类器作为核对步备选。',
    },
    {
      title: '裁判实现开放替换',
      choice: '核对步可换 HHEM 分类器',
      reason: '默认用 LLM 做 NLI 通用且零训练成本，但 API 费用随声明数线性增长；官方接入 Vectara HHEM-2.1-Open T5 分类器，免费可本地批量推理，更适合生产核对。',
    },
  ],

  production: [
    {
      title: '裁判模型选择与对齐',
      desc: '大规模评测用 gpt-4o-mini 级模型压成本，关键门禁前用更强模型复核；裁判须与人工判断对齐，官方提供 align LLM-as-judge 指南，用标注子集校准指标 prompt。',
    },
    {
      title: '成本控制：缓存与小模型',
      desc: '裁判调用次数随声明数膨胀；官方提供 DiskCacheBackend 磁盘缓存复用裁判响应，忠实度核对步可换 HHEM 开源分类器本地批量推理，把重复评测的 API 开销大幅压低。',
    },
    {
      title: 'CI 回归接入',
      desc: '用 pytest 封装 evaluate 作为发布前的端到端测试接入 CI；固定基准集与裁判模型版本、版本化 prompt，并用 RunConfig 控制超时与重试，回归对比才可复现。',
    },
    {
      title: '评测集规模与分数波动',
      desc: '裁判采样存在随机性，重跑分数会波动；评测集过小时单个样本显著拉动均分。生产上固定裁判模型版本与温度、版本化 prompt，用足够规模的基准集并设阈值断言而非盯单点。',
    },
  ],

  en: {
    tagline:
      'Reference-free evaluation for RAG and agents: faithfulness, context quality, and knowledge-graph-driven testset generation.',
    summary:
      'Ragas is an open-source evaluation framework for LLM applications, focused on RAG and agent pipelines. It scores faithfulness by decomposing responses into atomic claims and verifying each against retrieved contexts, while context precision and recall isolate retrieval failures from generation failures. Its TestsetGenerator builds a knowledge graph from your documents and synthesizes scenario-diverse questions with references, solving the cold-start problem of evaluation data. Judge models are pluggable through llm_factory or LangChain wrappers, and custom metrics, rubrics, and prompts adapt evaluations to any domain or language.',
  },
}
