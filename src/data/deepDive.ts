/**
 * 工具深度解析数据契约（架构图 / 时序图 / 数据流 / 扩展机制 / 技术难点 / 生态 / 竞品 / 版本 / Star 趋势 / 双语）
 * 每个工具的深度内容存放在 src/data/deep/{toolId}.ts，由 src/pages/ToolDetail.tsx 渲染。
 */

/** ---- 真实数据快照 ---- */

export interface StarPoint {
  /** 月份，格式 'YYYY-MM' */
  date: string
  stars: number
}

export interface VersionEntry {
  version: string
  /** 发布日期 'YYYY-MM-DD' */
  date: string
  /** 一句话亮点（≤30 字，取自 release notes 首行） */
  highlight: string
}

export interface RepoStats {
  stars: number
  forks: number
  license?: string
  /** 数据采集日期，如 '2026-07-17' */
  checkedAt: string
}

/** ---- 网格图（架构图 / 数据流图 / 技术版图通用） ---- */

export type DiagramNodeKind = 'core' | 'external' | 'data' | 'control'

export interface GridNode {
  id: string
  /** 节点名（≤8 字为宜） */
  label: string
  /** 副标题（≤14 字，可选） */
  sub?: string
  kind?: DiagramNodeKind
  /** 1-based 列（1..cols） */
  col: number
  /** 1-based 行（1..rows） */
  row: number
  /** 跨列数，默认 1；同一格子区域不得与其他节点重叠 */
  colSpan?: number
  /**
   * 分组名（可选）：相同 group 的节点会被渲染进同一个 Mermaid subgraph 分组框。
   * 用于表达架构分层，如「接入层 / 控制面 / 数据面 / 存储层」。
   * 建议 2-4 个分组，组名 ≤10 字；不设 group 的节点独立于分组框之外。
   */
  group?: string
}

export interface GridEdge {
  /** from/to 为 GridNode.id */
  from: string
  to: string
  /** 边标签（≤10 字） */
  label?: string
  dashed?: boolean
  bidirectional?: boolean
}

export interface GridDiagramData {
  /** 网格列数（建议 3-4）与行数（建议 2-4） */
  cols: number
  rows: number
  nodes: GridNode[]
  edges: GridEdge[]
  /** 图下注（一句话，可选） */
  note?: string
  /**
   * 布局方向（可选）：'TD' 自上而下（默认，适合分层架构），
   * 'LR' 从左到右（适合 pipeline / 数据流 / 版图类图）。
   */
  direction?: 'TD' | 'LR'
}

/** ---- 时序图 ---- */

export interface SeqActor {
  id: string
  /** 参与者名（≤10 字） */
  label: string
  kind?: 'user' | 'agent' | 'system' | 'external'
}

export interface SeqMessage {
  /** from/to 为 SeqActor.id；from === to 表示自调用 */
  from: string
  to: string
  /** 消息标签（≤16 字） */
  label: string
  /** 返回/异步消息用虚线 */
  dashed?: boolean
}

export interface SeqDiagramData {
  actors: SeqActor[]
  /** 自上而下按时间顺序排列（5-9 条） */
  messages: SeqMessage[]
  note?: string
}

/** ---- 深度内容 ---- */

export interface FeatureItem {
  title: string
  desc: string
}

export interface Competitor {
  name: string
  /** 关系：直接竞品 / 相邻替代 / 互补共存 */
  relation: string
  /** 关键差异（≤60 字） */
  diff: string
}

/** 源码结构条目 */
export interface SourceDir {
  /** 真实仓库路径（如 packages/core） */
  path: string
  /** 职责说明（≤40 字） */
  role: string
}

/** 核心机制深潜条目 */
export interface MechanismItem {
  /** 机制名（≤12 字） */
  title: string
  /** 内部工作原理剖析（90-260 字，行为级而非组件级，允许深入展开） */
  desc: string
}

/** 设计取舍条目 */
export interface TradeoffItem {
  /** 取舍主题（≤12 字） */
  title: string
  /** 项目的选择（≤20 字） */
  choice: string
  /** 为什么这样选（50-90 字） */
  reason: string
}

/** 生产实践条目 */
export interface ProductionItem {
  title: string
  /** 部署/规模化/避坑要点（60-100 字） */
  desc: string
}

export interface DiagramSection {
  /** 一段引言（50-100 字） */
  intro: string
  diagram: GridDiagramData
}

export interface ToolDeepDive {
  /** 必须与 src/data/stack.ts 中 TOOLS 的 id 完全一致 */
  toolId: string
  /** GitHub 实时统计快照（真实数据） */
  stats: RepoStats
  /** 月度 star 序列（OSS Insight 真实数据，≤36 点） */
  starHistory: StarPoint[]
  /** 最近 3-5 个版本（真实 release 数据） */
  versions: VersionEntry[]
  /** 架构图：核心组件与职责（6-12 节点） */
  architecture: DiagramSection
  /** 数据流设计图：数据/状态如何流动（5-9 节点） */
  dataFlow: DiagramSection
  /** 时序图：一次典型调用的交互顺序 */
  sequence: { intro: string; diagram: SeqDiagramData }
  /** 扩展机制（3-4 条，每条 desc 40-90 字） */
  extension: FeatureItem[]
  /** 技术难点（3-4 条，每条 desc 40-90 字） */
  challenges: FeatureItem[]
  /** 生态定位（150-220 字段落） */
  positioning: string
  /** 技术版图：上游依赖 / 同级组件 / 下游应用（5-10 节点） */
  landscape: DiagramSection
  /** 竞品分析（3-4 条） */
  competitors: Competitor[]
  /** 核心机制深潜（3-4 条，剖析关键机制的内部工作方式） */
  mechanism: MechanismItem[]
  /** 源码结构导览（5-8 条真实仓库路径及职责） */
  sourceLayout: SourceDir[]
  /** 关键设计取舍（2-3 条，有官方文档/博客依据） */
  tradeoffs: TradeoffItem[]
  /** 生产实践要点（3-4 条：部署、规模化、常见坑） */
  production: ProductionItem[]
  /** 英文简述（双语切换用；tagline ≤40 词，summary 60-100 词） */
  en: { tagline: string; summary: string }
}
