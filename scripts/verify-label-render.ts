/**
 * 全量标签渲染校验：16 工具 × 4 图（architecture / dataFlow / landscape / sequence）
 * 在 jsdom 中真实执行 mermaid.render（源码经 withTheme 注入、accent/softBg 取该工具所属层真实色值），断言：
 *   (a) 每条边 label 与每条时序消息文本都出现在对应 SVG 产物字符串中；
 *   (b) 组件注入的 SVG_STATIC_STYLE 含 edgeLabel 文字颜色覆盖（防止 #id .label{color:#FFFFFF} 白撞白回归）。
 * 用法：npx tsx scripts/verify-label-render.ts（任一断言失败 exit 1）
 */
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
})

const g = globalThis as Record<string, unknown>
g.window = dom.window
g.document = dom.window.document
g.DOMParser = dom.window.DOMParser
g.XMLSerializer = dom.window.XMLSerializer
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
  writable: true,
})

// jsdom 缺少 SVG 布局 API，给常量桩让 mermaid 跑通（尺寸不重要，只为产出 markup）
const proto = dom.window.SVGElement.prototype as Record<string, unknown>
proto.getBBox = () => ({ x: 0, y: 0, width: 80, height: 24 })
proto.getComputedTextLength = () => 80
const identityMatrix = {
  a: 1, b: 0, c: 0, d: 1, e: 0, f: 0,
  inverse() { return identityMatrix },
  multiply() { return identityMatrix },
}
proto.getScreenCTM = () => identityMatrix
proto.getCTM = () => identityMatrix

// jsdom 没有构造样式表 CSSStyleSheet，给最小桩（mermaid 只用 insertRule/replaceSync/cssRules）
class FakeCSSStyleSheet {
  private rules: string[] = []
  get cssRules() {
    return this.rules.map((t) => ({ cssText: t }))
  }
  insertRule(rule: string, index?: number) {
    this.rules.splice(index ?? this.rules.length, 0, rule)
    return (index ?? this.rules.length) - 1
  }
  replaceSync(css: string) {
    this.rules = [css]
  }
}
g.CSSStyleSheet = FakeCSSStyleSheet
;(dom.window as unknown as Record<string, unknown>).CSSStyleSheet = FakeCSSStyleSheet

const mermaid = (await import('mermaid')).default
mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'base' })

const { gridToMermaid, seqToMermaid } = await import('../src/components/deep/mermaidConvert')
const { withTheme, SVG_STATIC_STYLE } = await import('../src/components/deep/MermaidDiagram')
const { DEEP_DIVES } = await import('../src/data/deep/index')
const { TOOLS, layerById } = await import('../src/data/stack')

let renderCounter = 0
const failures: string[] = []

/** 全局断言 (b)：注入样式必须包含 edgeLabel 颜色覆盖（html span 与 svg text 双通道） */
const REQUIRED_OVERRIDES = ['.edgeLabel', 'color:#44403C!important', 'fill:#44403C!important']
for (const frag of REQUIRED_OVERRIDES) {
  if (!SVG_STATIC_STYLE.includes(frag)) {
    failures.push(`SVG_STATIC_STYLE 缺少边标签覆盖片段: ${frag}`)
  }
}

type DiagramKind = 'architecture' | 'dataFlow' | 'landscape' | 'sequence'

for (const tool of TOOLS) {
  const deep = DEEP_DIVES[tool.id]
  if (!deep) {
    failures.push(`${tool.id}: 缺少 deep 数据`)
    continue
  }
  const layer = layerById(tool.layerId)
  const stats: string[] = []

  for (const kind of ['architecture', 'dataFlow', 'landscape', 'sequence'] as DiagramKind[]) {
    const isSeq = kind === 'sequence'
    const diagram = deep[kind].diagram
    const raw = isSeq ? seqToMermaid(diagram as never) : gridToMermaid(diagram as never)
    const source = withTheme(raw, layer.accent, layer.softBg)

    // 收集该图应出现的全部标签文本
    const labels: string[] = isSeq
      ? (diagram as { messages: { label: string }[] }).messages.map((m) => m.label)
      : (diagram as { edges: { label?: string }[] }).edges
          .map((e) => e.label)
          .filter((l): l is string => typeof l === 'string' && l.length > 0)

    let svg: string
    try {
      const out = await mermaid.render(`verify-${tool.id}-${kind}-${++renderCounter}`, source)
      svg = out.svg
    } catch (err) {
      failures.push(`${tool.id}/${kind}: mermaid.render 抛错 — ${err instanceof Error ? err.message : String(err)}`)
      continue
    }

    const missing = labels.filter((l) => !svg.includes(l))
    if (missing.length > 0) {
      failures.push(`${tool.id}/${kind}: ${missing.length} 个标签未出现在 SVG 产物中 — ${missing.join('、')}`)
    }
    stats.push(`${kind} ${labels.length - missing.length}/${labels.length}`)
  }

  console.log(`[${tool.id}] ${stats.join('  ')}`)
}

const totalDiagrams = TOOLS.length * 4
if (failures.length > 0) {
  console.error(`\n校验失败（${failures.length} 项）：`)
  for (const f of failures) console.error(`  - ${f}`)
  process.exit(1)
}
console.log(`\n全部通过：${TOOLS.length} 工具 × 4 图 = ${totalDiagrams}/${totalDiagrams} 张图标签渲染断言成功`)
