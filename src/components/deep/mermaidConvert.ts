import type { GridDiagramData, GridNode, SeqDiagramData } from '@/data/deepDive'
import { DEEP_DIVES } from '@/data/deep/index'

/**
 * GridDiagramData / SeqDiagramData → Mermaid 源码转换器（纯函数）
 * - 节点 id 净化为 [A-Za-z0-9_]，label 一律双引号包裹防特殊字符
 * - grid 图 kind 语义：core 走主题注入（MermaidDiagram 的 %%init%%），
 *   data / control / external 使用固定 classDef 实色语义色（高对比白字）
 * - 支持 GridDiagramData.direction（TD/LR）与 GridNode.group（subgraph 分组框）
 */

/** mermaid 保留关键字（作节点 id 会触发语法错误），命中时加 n_ 前缀 */
const RESERVED_IDS = new Set([
  'graph', 'flowchart', 'subgraph', 'node', 'end', 'style', 'class', 'classdef',
  'click', 'call', 'callback', 'linkstyle', 'direction', 'default', 'acc_title',
  'acc_descr', 'participant', 'actor', 'loop', 'alt', 'else', 'opt', 'par', 'and',
  'note', 'activate', 'deactivate', 'autonumber', 'title', 'section',
])

/** mermaid 安全节点 id：仅字母数字下划线，数字开头或保留字加前缀 */
function safeId(id: string): string {
  const s = id.replace(/[^A-Za-z0-9_]/g, '_')
  if (/^[0-9]/.test(s) || RESERVED_IDS.has(s.toLowerCase())) return `n_${s}`
  return s
}

/** flowchart 引号字符串转义：双引号 → mermaid 实体 #quot; */
function q(text: string): string {
  return `"${text.replace(/"/g, '#quot;')}"`
}

/** 节点显示文本：含 sub 时用 <br/> 折行 */
function nodeText(label: string, sub?: string): string {
  return sub ? `${label}<br/>${sub}` : label
}

/** kind → 节点形状 + class 指派（core 不指派 class，继承主题 primary 色） */
function nodeDecl(n: GridNode): { decl: string; cls?: string } {
  const id = safeId(n.id)
  const text = q(nodeText(n.label, n.sub))
  switch (n.kind) {
    case 'data':
      // 圆柱形
      return { decl: `${id}[(${text})]`, cls: 'data' }
    case 'control':
      // 圆角矩形（classDef control 提供酒红实底白字）
      return { decl: `${id}(${text})`, cls: 'control' }
    case 'external':
      return { decl: `${id}[${text}]`, cls: 'external' }
    case 'core':
    default:
      // 圆角矩形，继承主题 primaryColor / primaryBorderColor（accent 系）
      return { decl: `${id}(${text})` }
  }
}

function edgeDecl(e: { from: string; to: string; label?: string; dashed?: boolean; bidirectional?: boolean }): string {
  const from = safeId(e.from)
  const to = safeId(e.to)
  const label = e.label?.trim()
  if (e.bidirectional) {
    return label ? `${from} <-- ${q(label)} --> ${to}` : `${from} <--> ${to}`
  }
  if (e.dashed) {
    return label ? `${from} -. ${q(label)} .-> ${to}` : `${from} -.-> ${to}`
  }
  return label ? `${from} -- ${q(label)} --> ${to}` : `${from} --> ${to}`
}

/** 网格图（架构 / 数据流 / 技术版图）→ flowchart，支持 direction 与 group 分组 */
export function gridToMermaid(data: GridDiagramData): string {
  const lines: string[] = [`flowchart ${data.direction ?? 'TD'}`]
  const classIds: Record<string, string[]> = {}

  const pushNode = (n: GridNode, indent: string) => {
    const { decl, cls } = nodeDecl(n)
    lines.push(`${indent}${decl}`)
    if (cls) (classIds[cls] ??= []).push(safeId(n.id))
  }

  // 按节点首次出现顺序为 group 分配子图 id（g0、g1…）；无 group 的节点放顶层
  const groupOrder: string[] = []
  const groupNodes = new Map<string, GridNode[]>()
  for (const n of data.nodes) {
    if (n.group) {
      if (!groupNodes.has(n.group)) {
        groupNodes.set(n.group, [])
        groupOrder.push(n.group)
      }
      groupNodes.get(n.group)!.push(n)
    } else {
      pushNode(n, '  ')
    }
  }

  for (const [i, name] of groupOrder.entries()) {
    lines.push(`  subgraph g${i}[${q(name)}]`)
    for (const n of groupNodes.get(name)!) pushNode(n, '    ')
    lines.push('  end')
  }

  for (const e of data.edges) {
    lines.push(`  ${edgeDecl(e)}`)
  }

  // 语义色 classDef（实色高对比；core 色由主题注入，不指派 class）
  lines.push(
    '  classDef data fill:#9C6B1E,color:#FFFFFF',
    '  classDef control fill:#934F5C,color:#FFFFFF',
    '  classDef external fill:#FFFDF8,stroke:#C9C2B8,color:#57534E',
  )
  for (const [cls, ids] of Object.entries(classIds)) {
    lines.push(`  class ${ids.join(',')} ${cls}`)
  }

  return lines.join('\n')
}

/** 时序图消息文本安全处理：冒号/分号等替换为全角，去掉引号 */
function safeMsg(text: string): string {
  return text
    .replace(/;/g, '；')
    .replace(/:/g, '：')
    .replace(/"/g, "'")
    .trim()
}

/** 时序图 → sequenceDiagram */
export function seqToMermaid(data: SeqDiagramData): string {
  const lines: string[] = ['sequenceDiagram']

  for (const a of data.actors) {
    const id = safeId(a.id)
    const keyword = a.kind === 'user' ? 'actor' : 'participant'
    lines.push(`  ${keyword} ${id} as ${a.label}`)
  }

  for (const m of data.messages) {
    const from = safeId(m.from)
    const to = safeId(m.to)
    const arrow = m.dashed ? '-->>' : '->>'
    lines.push(`  ${from}${arrow}${to}: ${safeMsg(m.label)}`)
  }

  return lines.join('\n')
}

export interface DiagramValidationResult {
  ok: boolean
  errors: { toolId: string; section: string; message: string }[]
}

/**
 * 全量校验：对 16 个工具的 architecture / dataFlow / landscape / sequence
 * 生成 mermaid 源并调用 mermaid.parse 校验语法。
 * mermaid 动态引入，避免把解析器拉进纯转换模块的同步依赖。
 */
export async function validateAllDiagrams(): Promise<DiagramValidationResult> {
  const mermaid = (await import('mermaid')).default
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'base' })

  const errors: DiagramValidationResult['errors'] = []

  for (const [toolId, deep] of Object.entries(DEEP_DIVES)) {
    const sections: { section: string; source: string }[] = [
      { section: 'architecture', source: gridToMermaid(deep.architecture.diagram) },
      { section: 'dataFlow', source: gridToMermaid(deep.dataFlow.diagram) },
      { section: 'landscape', source: gridToMermaid(deep.landscape.diagram) },
      { section: 'sequence', source: seqToMermaid(deep.sequence.diagram) },
    ]
    for (const { section, source } of sections) {
      try {
        await mermaid.parse(source)
      } catch (err) {
        errors.push({
          toolId,
          section,
          message: err instanceof Error ? err.message : String(err),
        })
      }
    }
  }

  return { ok: errors.length === 0, errors }
}
