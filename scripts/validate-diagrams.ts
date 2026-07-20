/**
 * 全量图例校验：对 16 个工具的 architecture / dataFlow / landscape / sequence
 * 生成 Mermaid 源码并调用 mermaid.parse 校验语法（Node + jsdom 环境）。
 * 用法：npx tsx scripts/validate-diagrams.ts
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
// Node 24 的 globalThis.navigator 只有 getter，需要 defineProperty 覆盖
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
  writable: true,
})

const { validateAllDiagrams } = await import('../src/components/deep/mermaidConvert')

const res = await validateAllDiagrams()

if (res.ok) {
  console.log('✅ 全部 64 张图（16 工具 × 4 图）Mermaid 语法校验通过')
  process.exit(0)
} else {
  console.error(`❌ ${res.errors.length} 张图校验失败：`)
  for (const e of res.errors) {
    console.error(`- [${e.toolId} / ${e.section}] ${e.message}`)
  }
  process.exit(1)
}
