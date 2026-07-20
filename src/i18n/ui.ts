import type { Lang } from '@/hooks/use-language'
import type { Priority, StackLayer } from '@/data/stack'

/** 站点 UI 文案（中英对照） */
export const UI = {
  zh: {
    siteName: 'Agent Harness 全景指南',
    badge: 'Agent 基础设施完全指南',
    heroTitle: '技术栈全景',
    heroBody:
      '模型是大脑，Harness 是骨架与神经系统。把一个 LLM 变成可靠的 Agent，需要一整套基础设施：运行时负责把任务做完，记忆系统沉淀经验，工具协议连接外部世界，可观测与评估守住质量底线，沙箱与网关保障安全与成本。本指南精选社区最具代表性的开源项目，按能力分层拆解，并给出一条循序渐进的优先级路线。',
    statProjects: '精选开源项目',
    statLayers: '大能力层',
    statPriority: '级优先级路线',
    ctaMap: '开始探索架构地图',
    ctaPath: '查看学习路径',
    layersTitle: '九大能力层',
    layersSub: '自运行时 · 至应用平台',
    toc: '目录',
    navPage: '页面导航',
    navPageDesc: '跳转到指南的各个分区',
    mapTitle: '九层架构地图',
    mapBody:
      'Agent Harness 不是单一框架，而是一套分层协作的基础设施。这张图把 9 大能力层按价值流向排成一条垂直通道：自下而上，越靠下越接近标准与资源（模型接入、工具协议、沙箱执行），越靠上越接近产品与协作（运行时编排、记忆评估观测、应用平台）。点击任意一层，即可跳转到对应的详解分区。',
    mapClick: '点击查看详解 →',
    mapLegendStars: '星级 = 推荐学习优先级（5 星核心必读 · 4 星重点掌握 · 3 星了解参考）',
    mapLegendClick: '点击任意层可跳转到对应详解分区',
    pathTitle: '三级学习路径',
    pathBody:
      '无需按九层顺序逐层攻克——推荐按优先级推进：先用 5 星项目建立对 Agent 主干（运行时与可观测性）的认知骨架，再以 4 星项目补齐记忆、评估、网关、协议与沙箱等关键能力件，最后通过 3 星平台项目理解 Agent 技术的产品化形态。',
    pathSuggested: '建议推进顺序',
    tableTitle: (n: number) => `${n} 个项目全景对照表`,
    tableBody:
      '开篇那张静态优先级表，在这里变成一张可筛选、可跳转的活表格：按优先级或能力层过滤，点击任意一行（或一张卡片）即可直达对应项目的详情页。',
    filterAll: '全部',
    filterPriority: '优先级',
    filterLayer: '能力层',
    resetFilters: '重置筛选',
    emptyFilter: '没有匹配的项目',
    colProject: '项目',
    colLayer: '能力层',
    colPriority: '优先级',
    colRole: '核心作用',
    colModule: 'Harness 模块',
    colFocus: '关注重点',
    viewDetail: (name: string) => `查看 ${name} 详细介绍`,
    home: '首页',
    groupProduct: '产品层',
    groupProductHint: '能力最终落地为可使用的产品',
    groupOrchestration: '编排层',
    groupOrchestrationHint: '定义 Agent 如何思考、行动与协作',
    groupCapability: '能力层',
    groupCapabilityHint: '让 Agent 可记忆、可度量、可调试',
    groupFoundation: '基础层',
    groupFoundationHint: '贴近标准与资源的最底层设施',
  },
  en: {
    siteName: 'Agent Harness Stack Guide',
    badge: 'Complete Guide to Agent Infrastructure',
    heroTitle: 'Stack Atlas',
    heroBody:
      'The model is the brain; the Harness is the skeleton and nervous system. Turning an LLM into a reliable Agent needs a full infrastructure stack: runtimes finish the work, memory accumulates experience, tool protocols connect the outside world, observability and evaluation guard quality, while sandboxes and gateways protect safety and cost. This guide maps representative open-source projects by capability layer and offers a progressive learning path.',
    statProjects: 'Curated projects',
    statLayers: 'Capability layers',
    statPriority: 'Priority tracks',
    ctaMap: 'Explore the stack map',
    ctaPath: 'View learning path',
    layersTitle: 'Nine layers',
    layersSub: 'From runtime to platform',
    toc: 'Contents',
    navPage: 'Page navigation',
    navPageDesc: 'Jump to sections of the guide',
    mapTitle: 'Nine-Layer Stack Map',
    mapBody:
      'An Agent Harness is not a single framework but layered infrastructure. This map arranges nine capability layers by value flow: lower layers sit closer to standards and resources (model access, tool protocols, sandboxes); upper layers sit closer to products and collaboration (runtimes, memory/eval/observability, application platforms). Click any layer to jump to its deep-dive section.',
    mapClick: 'View details →',
    mapLegendStars: 'Stars = learning priority (5 must-read · 4 core · 3 reference)',
    mapLegendClick: 'Click any layer to jump to its section',
    pathTitle: 'Three-Track Learning Path',
    pathBody:
      'You do not need to climb all nine layers in order. Prefer priority: start with ★★★★★ projects to form the Agent spine (runtime + observability), then ★★★★☆ projects for memory, evaluation, gateway, protocol and sandbox, and finally ★★★☆☆ platforms to see how Agent tech becomes product.',
    pathSuggested: 'Suggested order',
    tableTitle: (n: number) => `${n}-Project Comparison Table`,
    tableBody:
      'A filterable, clickable table of all projects: filter by priority or layer, then open any row or card to go to the project detail page.',
    filterAll: 'All',
    filterPriority: 'Priority',
    filterLayer: 'Layer',
    resetFilters: 'Reset',
    emptyFilter: 'No matching projects',
    colProject: 'Project',
    colLayer: 'Layer',
    colPriority: 'Priority',
    colRole: 'Core role',
    colModule: 'Harness module',
    colFocus: 'Focus',
    viewDetail: (name: string) => `View ${name} details`,
    home: 'Home',
    groupProduct: 'Product',
    groupProductHint: 'Capabilities become usable products',
    groupOrchestration: 'Orchestration',
    groupOrchestrationHint: 'How Agents think, act, and collaborate',
    groupCapability: 'Capability',
    groupCapabilityHint: 'Memory, measurement, and debugging',
    groupFoundation: 'Foundation',
    groupFoundationHint: 'Standards and resource primitives',
  },
} as const

export type UiKey = Exclude<keyof (typeof UI)['zh'], 'tableTitle' | 'viewDetail'>

export function t(lang: Lang, key: UiKey): string {
  return UI[lang][key]
}

/** 各能力层英文 tagline / description（中文仍用 stack.ts 原文） */
export const LAYER_EN: Record<string, { tagline: string; description: string }> = {
  runtime: {
    tagline: 'The Agent engine',
    description:
      'The runtime wraps an LLM into an executable, controllable work unit: step orchestration, state transitions, interrupt/resume, and human intervention. The model thinks; the runtime gets the job done.',
  },
  'multi-agent': {
    tagline: 'From one Agent to a team',
    description:
      'When a task exceeds one Agent, you need roles, division of labor, and conversation protocols so Agents collaborate like a team: who speaks, who decides, and when to stop.',
  },
  observability: {
    tagline: 'The Agent black box recorder',
    description:
      'Every inference, retrieval, and tool call becomes Trace/Span data with metrics and logs, so production Agents are replayable, debuggable, and measurable—not opaque black boxes.',
  },
  memory: {
    tagline: 'The Agent memory system',
    description:
      'Context windows are finite while needed information is huge. Memory organizes knowledge, selects context, and stores long-term facts so Agents accumulate experience across sessions.',
  },
  evaluation: {
    tagline: 'The Agent quality gate',
    description:
      'LLM outputs are uncertain—“feels good” is not “measurable pass.” Evaluation uses datasets and metrics for regression tests and release gates when models or prompts change.',
  },
  gateway: {
    tagline: 'The model bus',
    description:
      'Providers differ in APIs, rate limits, and billing. A gateway unifies calls with routing, retries, fallbacks, and cost tracking so Agent code stays model-agnostic.',
  },
  protocol: {
    tagline: 'USB-C for Agents',
    description:
      'Tools are an Agent’s hands and eyes. Protocol standards define discovery, description, and invocation so tools are implemented once and reused across frameworks.',
  },
  sandbox: {
    tagline: 'The Agent safety lab',
    description:
      'Writing code is easy; running it safely is hard. Sandboxes provide on-demand, disposable isolation so Agent-generated code can execute without risking the host.',
  },
  platform: {
    tagline: 'From framework to product',
    description:
      'Above infrastructure you still need shippable products: visual orchestration, knowledge bases, publishing and ops. Platforms show how Agent tech becomes real applications.',
  },
}

export function localizedLayer(layer: StackLayer, lang: Lang) {
  const en = LAYER_EN[layer.id]
  return {
    title: lang === 'zh' ? layer.zhName : layer.name,
    subtitle: lang === 'zh' ? layer.name : layer.zhName,
    tagline: lang === 'zh' ? layer.tagline : en?.tagline ?? layer.tagline,
    description: lang === 'zh' ? layer.description : en?.description ?? layer.description,
  }
}

export function priorityLabel(meta: { label: string; labelEn?: string }, lang: Lang) {
  return lang === 'en' && meta.labelEn ? meta.labelEn : meta.label
}

export function priorityDesc(meta: { desc: string; descEn?: string }, lang: Lang) {
  return lang === 'en' && meta.descEn ? meta.descEn : meta.desc
}

export function navLabel(item: { label: string; labelEn?: string }, lang: Lang) {
  return lang === 'en' && item.labelEn ? item.labelEn : item.label
}

export type { Priority }
