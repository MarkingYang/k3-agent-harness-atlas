import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Boxes,
  CalendarDays,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  Folder,
  GitFork,
  Github,
  Home,
  Scale,
  SearchX,
  Star,
  TerminalSquare,
  Wrench,
} from 'lucide-react'
import { TOOLS, layerById, toolsByLayer } from '@/data/stack'
import { toolDetailById } from '@/data/tools/index'
import { deepDiveById } from '@/data/deep/index'
import type { FeatureItem } from '@/data/deepDive'
import { DETAIL_LABELS, useLanguage } from '@/hooks/use-language'
import { useTheme } from '@/hooks/use-theme'
import { layerSoftBackground, useLayerSoftBackground } from '@/lib/layer-surface'
import Navbar from '@/sections/Navbar'
import Footer from '@/sections/Footer'
import { PriorityStars } from '@/components/stack/PriorityStars'
import { MermaidDiagram } from '@/components/deep/MermaidDiagram'
import { gridToMermaid, seqToMermaid } from '@/components/deep/mermaidConvert'
import { StarChart } from '@/components/deep/StarChart'
import { DetailToc, DetailTocChips, type TocItem } from '@/components/deep/DetailToc'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

/** 层级 id → 首页分区锚点 */
const LAYER_ANCHOR: Record<string, string> = {
  runtime: 'runtime',
  'multi-agent': 'runtime',
  observability: 'observability',
  memory: 'memory',
  evaluation: 'memory',
  gateway: 'infra',
  protocol: 'infra',
  sandbox: 'infra',
  platform: 'platform',
}

/** 技术难点点缀色（暖酒红，与层级色区分） */
const WINE = '#934F5C'

/** 竞品关系 chip 配色：直接竞品=wine / 相邻替代=amber / 互补共存=olive */
const RELATION_STYLE: Record<string, { bg: string; fg: string }> = {
  直接竞品: { bg: 'rgba(147, 79, 92, 0.12)', fg: WINE },
  相邻替代: { bg: 'rgba(156, 107, 30, 0.12)', fg: '#9C6B1E' },
  互补共存: { bg: 'rgba(79, 114, 71, 0.12)', fg: '#4F7247' },
}
const RELATION_FALLBACK = { bg: 'rgba(87, 83, 78, 0.08)', fg: '#57534E' }

/** 统一小节标题：accent 色小方块 + 标题（对应 DETAIL_LABELS） */
function DeepSectionTitle({ title, accent }: { title: string; accent: string }) {
  return (
    <h2 className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-foreground">
      <span
        aria-hidden
        className="h-3 w-3 shrink-0 rounded-[5px]"
        style={{ backgroundColor: accent }}
      />
      {title}
    </h2>
  )
}

/** 编号特性卡网格（扩展机制 / 技术难点共用，color 区分语义） */
function NumberedFeatureGrid({ items, color }: { items: FeatureItem[]; color: string }) {
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {items.map((f, i) => (
        <div
          key={f.title}
          className="shadow-warm flex gap-4 rounded-2xl border border-border/80 bg-paper p-5"
        >
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {i + 1}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Star 趋势统计行单元（图标 + 标签 + 数值） */
function StatItem({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: LucideIcon
  label: string
  value: string
  accent: string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${accent}1A`, color: accent }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] text-muted-foreground">{label}</span>
        <span className="block truncate font-mono text-sm font-semibold text-foreground/90">{value}</span>
      </span>
    </div>
  )
}

/** 复制按钮：点击复制文本，成功后短暂变为对勾 */
function CopyButton({ text, dark = false }: { text: string; dark?: boolean }) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // 剪贴板不可用时静默忽略
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? '已复制' : '复制'}
      className={
        dark
          ? 'flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card/10 hover:text-foreground'
          : 'flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground/90'
      }
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

/** 深色暖底代码块（含右上角复制按钮） */
function CodeBlock({ code, dark = true }: { code: string; dark?: boolean }) {
  return (
    <div className="relative">
      <div className="absolute right-3 top-3">
        <CopyButton text={code} dark={dark} />
      </div>
      <pre className="overflow-x-auto rounded-xl bg-[#292420] p-4 pr-12 font-mono text-[13px] leading-6 text-[#F3EDE3]">
        <code>{code}</code>
      </pre>
    </div>
  )
}

/**
 * 工具详情页 —— /tool/:toolId
 * 数据来自 stack.ts（基础信息）、data/tools（深度内容）与 data/deep（深度解析图示）
 * lg+ 右侧 sticky 页内目录；移动端 Hero 下方横向锚点 chips
 */
export default function ToolDetail() {
  const { toolId } = useParams<{ toolId: string }>()
  const { lang } = useLanguage()
  const { resolved } = useTheme()
  const dark = resolved === 'dark'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [toolId])

  const tool = toolId ? TOOLS.find((t) => t.id === toolId) : undefined
  const detail = toolId ? toolDetailById(toolId) : undefined
  const deep = toolId ? deepDiveById(toolId) : undefined
  const L = DETAIL_LABELS[lang]
  const layer = tool ? layerById(tool.layerId) : undefined
  const soft = useLayerSoftBackground(layer?.softBg ?? '#EEF2F7', layer?.accent ?? '#0D9488')
  const siblings = tool ? toolsByLayer(tool.layerId).filter((t) => t.id !== tool.id) : []

  /** 页内目录项：problem 起至 related 止，deep 缺失的小节不收录 */
  const tocItems = useMemo<TocItem[]>(() => {
    if (!tool || !detail) return []
    const items: TocItem[] = [
      { id: 'sec-problem', label: L.problem },
      { id: 'sec-how', label: L.howItWorks },
    ]
    if (deep?.mechanism?.length) items.push({ id: 'sec-mechanism', label: L.mechanism })
    if (deep) {
      items.push({ id: 'sec-architecture', label: L.architecture })
      if (deep.sourceLayout?.length) items.push({ id: 'sec-source', label: L.sourceLayout })
      items.push(
        { id: 'sec-dataflow', label: L.dataFlow },
        { id: 'sec-sequence', label: L.sequence },
      )
    }
    items.push(
      { id: 'sec-concepts', label: L.keyConcepts },
      { id: 'sec-quickstart', label: L.quickStart },
    )
    if (deep) {
      items.push(
        { id: 'sec-extension', label: L.extension },
        { id: 'sec-challenges', label: L.challenges },
      )
      if (deep.tradeoffs?.length) items.push({ id: 'sec-tradeoffs', label: L.tradeoffs })
    }
    items.push(
      { id: 'sec-usecases', label: L.useCases },
      { id: 'sec-integrations', label: L.integrations },
    )
    if (deep) {
      items.push(
        { id: 'sec-positioning', label: L.positioning },
        { id: 'sec-landscape', label: L.landscape },
      )
      if (deep.production?.length) items.push({ id: 'sec-production', label: L.production })
      items.push(
        { id: 'sec-competitors', label: L.competitors },
        { id: 'sec-versions', label: L.versionHistory },
        { id: 'sec-stars', label: L.starTrend },
      )
    }
    items.push(
      { id: 'sec-faq', label: L.faq },
      { id: 'sec-resources', label: L.resources },
    )
    if (siblings.length > 0) items.push({ id: 'sec-related', label: L.related })
    return items
  }, [tool, detail, deep, L, siblings.length])

  /* ---- 404：无对应项目或详情数据 ---- */
  if (!tool || !detail || !layer) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-5 py-24 sm:px-8">
          <div className="shadow-warm w-full max-w-md rounded-2xl border border-border/80 bg-paper p-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <SearchX className="h-7 w-7" />
            </span>
            <h1 className="mt-5 text-xl font-bold text-foreground">未找到该项目</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              你访问的项目不存在，或详情内容尚未收录。可以回到首页浏览完整技术栈全景。
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Home className="h-4 w-4" />
              返回首页
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const anchor = LAYER_ANCHOR[layer.id] ?? 'map'
  const index = TOOLS.findIndex((t) => t.id === tool.id)
  const prev = index > 0 ? TOOLS[index - 1] : undefined
  const next = index >= 0 && index < TOOLS.length - 1 ? TOOLS[index + 1] : undefined

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-20 pt-10 sm:px-8">
        {/* 面包屑 */}
        <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <a href="/" className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:text-foreground">
            <Home className="h-3.5 w-3.5" />
            {lang === 'zh' ? '首页' : 'Home'}
          </a>
          <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
          <a href={`/#${anchor}`} className="rounded-md px-1 py-0.5 transition-colors hover:text-foreground">
            {lang === 'zh' ? layer.zhName : layer.name}
          </a>
          <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
          <span className="px-1 py-0.5 font-medium text-foreground/90">{tool.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_224px] lg:gap-10">
          <div className="min-w-0">
            {/* Hero 区 */}
            <section
              className="shadow-warm mt-6 rounded-2xl border border-border/60 p-7 sm:p-9"
              style={{ backgroundColor: soft }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: layer.accent }}>
                    {layer.name} · {layer.zhName}
                  </p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {tool.name}
                  </h1>
                  <p className="mt-2 text-sm text-ink-soft">
                    {lang === 'en' && deep ? deep.en.tagline : detail.tagline}
                  </p>
                </div>
                <PriorityStars priority={tool.priority} />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <a
                  href={`https://github.com/${tool.repo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-card/70 px-3 py-1.5 font-mono text-xs text-ink-soft transition-colors hover:bg-card hover:text-foreground"
                >
                  <Github className="h-3.5 w-3.5" />
                  {tool.repo}
                </a>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white"
                  style={{ backgroundColor: layer.accent }}
                >
                  <Boxes className="h-3.5 w-3.5" />
                  {tool.harnessModule}
                </span>
                <span className="text-xs text-ink-soft">{tool.coreRole}</span>
              </div>
            </section>

            {/* 移动端页内目录（横向滚动 chips） */}
            <div className="mt-5 lg:hidden">
              <DetailTocChips items={tocItems} accent={layer.accent} title={L.toc} />
            </div>

            {/* 英文简述卡（仅英文模式且有深度数据时显示） */}
            {lang === 'en' && deep && (
              <section
                className="shadow-warm mt-6 rounded-2xl border border-border/80 bg-paper p-6 sm:p-7"
                style={{ borderLeftColor: layer.accent, borderLeftWidth: 3 }}
              >
                <p className="text-sm leading-7 text-ink-soft sm:text-[15px] sm:leading-8">
                  {deep.en.summary}
                </p>
              </section>
            )}

            {/* 它解决什么问题 */}
            <section id="sec-problem" className="mt-14 scroll-mt-24">
              <DeepSectionTitle title={L.problem} accent={layer.accent} />
              <p className="mt-4 text-sm leading-7 text-ink-soft sm:text-[15px] sm:leading-8">
                {detail.problem}
              </p>
            </section>

            {/* 工作原理 */}
            <section id="sec-how" className="mt-14 scroll-mt-24">
              <DeepSectionTitle title={L.howItWorks} accent={layer.accent} />
              <ol className="mt-5 space-y-3">
                {detail.architecture.map((item, i) => (
                  <li
                    key={item.title}
                    className="shadow-warm flex gap-4 rounded-2xl border border-border/80 bg-paper p-5"
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: layer.accent }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* 核心机制深潜（深度数据，大号编号卡单列） */}
            {deep?.mechanism && deep.mechanism.length > 0 && (
              <section id="sec-mechanism" className="mt-14 scroll-mt-24">
                <DeepSectionTitle title={L.mechanism} accent={layer.accent} />
                <ol className="mt-6 space-y-4">
                  {deep.mechanism.map((m, i) => (
                    <li
                      key={m.title}
                      className="shadow-warm flex gap-5 rounded-2xl border border-border/80 bg-paper p-6 sm:p-7"
                    >
                      <span
                        aria-hidden
                        className="shrink-0 font-mono text-3xl font-bold leading-none tracking-tight"
                        style={{ color: layer.accent }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-bold text-foreground">{m.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-ink-soft">{m.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* 架构图（深度数据） */}
            {deep && (
              <section id="sec-architecture" className="mt-14 scroll-mt-24">
                <DeepSectionTitle title={L.architecture} accent={layer.accent} />
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{deep.architecture.intro}</p>
                <div className="shadow-warm mt-5 rounded-2xl border border-border/80 bg-paper p-5 sm:p-6">
                  <MermaidDiagram storageKey={`${toolId ?? 'unknown'}-architecture`} source={gridToMermaid(deep.architecture.diagram)} accent={layer.accent} softBg={layer.softBg} note={deep.architecture.diagram.note} />
                </div>
              </section>
            )}

            {/* 源码结构（深度数据，仿文件树列表卡） */}
            {deep?.sourceLayout && deep.sourceLayout.length > 0 && (
              <section id="sec-source" className="mt-14 scroll-mt-24">
                <DeepSectionTitle title={L.sourceLayout} accent={layer.accent} />
                <div className="shadow-warm mt-6 divide-y divide-border rounded-2xl border border-border/80 bg-paper">
                  {deep.sourceLayout.map((d) => (
                    <div key={d.path} className="flex items-baseline gap-3 px-5 py-3.5 sm:px-6">
                      <Folder
                        className="h-4 w-4 shrink-0 translate-y-[3px]"
                        style={{ color: layer.accent }}
                      />
                      <code
                        className="shrink-0 font-mono text-[13px] font-semibold"
                        style={{ color: layer.accent }}
                      >
                        {d.path}
                      </code>
                      <span className="min-w-0 text-xs leading-5 text-muted-foreground">{d.role}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 数据流设计（深度数据） */}
            {deep && (
              <section id="sec-dataflow" className="mt-14 scroll-mt-24">
                <DeepSectionTitle title={L.dataFlow} accent={layer.accent} />
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{deep.dataFlow.intro}</p>
                <div className="shadow-warm mt-5 rounded-2xl border border-border/80 bg-paper p-5 sm:p-6">
                  <MermaidDiagram storageKey={`${toolId ?? 'unknown'}-dataFlow`} source={gridToMermaid(deep.dataFlow.diagram)} accent={layer.accent} softBg={layer.softBg} note={deep.dataFlow.diagram.note} />
                </div>
              </section>
            )}

            {/* 时序图（深度数据） */}
            {deep && (
              <section id="sec-sequence" className="mt-14 scroll-mt-24">
                <DeepSectionTitle title={L.sequence} accent={layer.accent} />
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{deep.sequence.intro}</p>
                <div className="shadow-warm mt-5 rounded-2xl border border-border/80 bg-paper p-5 sm:p-6">
                  <MermaidDiagram storageKey={`${toolId ?? 'unknown'}-sequence`} source={seqToMermaid(deep.sequence.diagram)} accent={layer.accent} softBg={layer.softBg} note={deep.sequence.diagram.note} />
                </div>
              </section>
            )}

            {/* 关键概念（复用 stack.ts 的 concepts） */}
            <section id="sec-concepts" className="mt-14 scroll-mt-24">
              <DeepSectionTitle title={L.keyConcepts} accent={layer.accent} />
              <dl className="shadow-warm mt-5 space-y-3 rounded-2xl border border-border/80 bg-paper p-6">
                {tool.concepts.map((c) => (
                  <div key={c.term} className="grid gap-1 sm:grid-cols-[200px_1fr] sm:gap-4">
                    <dt className="text-sm font-semibold" style={{ color: layer.accent }}>
                      {c.term}
                    </dt>
                    <dd className="text-sm leading-6 text-muted-foreground">{c.desc}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* 快速上手 */}
            <section id="sec-quickstart" className="mt-14 scroll-mt-24">
              <DeepSectionTitle title={L.quickStart} accent={layer.accent} />
              <div className="mt-5 space-y-4">
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <TerminalSquare className="h-3.5 w-3.5" />
                    安装
                  </p>
                  <CodeBlock code={detail.quickStart.install} />
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">
                    最小示例（{detail.quickStart.lang}）
                  </p>
                  <CodeBlock code={detail.quickStart.code} />
                </div>
                {detail.quickStart.note && (
                  <p className="text-xs leading-5 text-muted-foreground">{detail.quickStart.note}</p>
                )}
              </div>
            </section>

            {/* 扩展机制（深度数据） */}
            {deep && (
              <section id="sec-extension" className="mt-14 scroll-mt-24">
                <DeepSectionTitle title={L.extension} accent={layer.accent} />
                <NumberedFeatureGrid items={deep.extension} color={layer.accent} />
              </section>
            )}

            {/* 技术难点（深度数据，wine 色点缀区分） */}
            {deep && (
              <section id="sec-challenges" className="mt-14 scroll-mt-24">
                <DeepSectionTitle title={L.challenges} accent={layer.accent} />
                <NumberedFeatureGrid items={deep.challenges} color={WINE} />
              </section>
            )}

            {/* 关键设计取舍（深度数据，accent 系 chip 与 wine 区分） */}
            {deep?.tradeoffs && deep.tradeoffs.length > 0 && (
              <section id="sec-tradeoffs" className="mt-14 scroll-mt-24">
                <DeepSectionTitle title={L.tradeoffs} accent={layer.accent} />
                <div className="mt-6 grid gap-4">
                  {deep.tradeoffs.map((t) => (
                    <div
                      key={t.title}
                      className="shadow-warm rounded-2xl border border-border/80 bg-paper p-6"
                    >
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <h3 className="text-sm font-bold text-foreground">{t.title}</h3>
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-medium"
                          style={{ backgroundColor: `${layer.accent}1A`, color: layer.accent }}
                        >
                          {t.choice}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{t.reason}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 典型应用场景 */}
            <section id="sec-usecases" className="mt-14 scroll-mt-24">
              <DeepSectionTitle title={L.useCases} accent={layer.accent} />
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {detail.useCases.map((uc) => (
                  <div
                    key={uc.title}
                    className="shadow-warm rounded-2xl border border-border/80 bg-paper p-5"
                  >
                    <h3 className="text-sm font-semibold text-foreground">{uc.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">{uc.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 生态与集成 */}
            <section id="sec-integrations" className="mt-14 scroll-mt-24">
              <DeepSectionTitle title={L.integrations} accent={layer.accent} />
              <div className="mt-5 flex flex-wrap gap-2">
                {detail.ecosystem.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-lg border border-border bg-paper px-3 py-1.5 text-xs font-medium text-ink-soft"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </section>

            {/* 生态定位（深度数据，引言卡） */}
            {deep && (
              <section id="sec-positioning" className="mt-14 scroll-mt-24">
                <DeepSectionTitle title={L.positioning} accent={layer.accent} />
                <div
                  className="shadow-warm mt-5 rounded-2xl border border-border/80 bg-paper p-6 sm:p-7"
                  style={{ borderLeftColor: layer.accent, borderLeftWidth: 3 }}
                >
                  <p className="text-sm leading-8 text-ink-soft">{deep.positioning}</p>
                </div>
              </section>
            )}

            {/* 技术版图（深度数据） */}
            {deep && (
              <section id="sec-landscape" className="mt-14 scroll-mt-24">
                <DeepSectionTitle title={L.landscape} accent={layer.accent} />
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{deep.landscape.intro}</p>
                <div className="shadow-warm mt-5 rounded-2xl border border-border/80 bg-paper p-5 sm:p-6">
                  <MermaidDiagram storageKey={`${toolId ?? 'unknown'}-landscape`} source={gridToMermaid(deep.landscape.diagram)} accent={layer.accent} softBg={layer.softBg} note={deep.landscape.diagram.note} />
                </div>
              </section>
            )}

            {/* 生产实践要点（深度数据，2 列网格卡） */}
            {deep?.production && deep.production.length > 0 && (
              <section id="sec-production" className="mt-14 scroll-mt-24">
                <DeepSectionTitle title={L.production} accent={layer.accent} />
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {deep.production.map((p) => (
                    <div
                      key={p.title}
                      className="shadow-warm flex gap-4 rounded-2xl border border-border/80 bg-paper p-5"
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${layer.accent}1A`, color: layer.accent }}
                      >
                        <Wrench className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 竞品分析（深度数据，关系 chip 着色） */}
            {deep && (
              <section id="sec-competitors" className="mt-14 scroll-mt-24">
                <DeepSectionTitle title={L.competitors} accent={layer.accent} />
                <div className="shadow-warm mt-5 overflow-hidden rounded-2xl border border-border/80 bg-paper">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/80 hover:bg-transparent">
                        <TableHead className="px-5 py-3.5 text-xs font-semibold text-muted-foreground">
                          {lang === 'zh' ? '项目' : 'Project'}
                        </TableHead>
                        <TableHead className="px-5 py-3.5 text-xs font-semibold text-muted-foreground">
                          {lang === 'zh' ? '关系' : 'Relation'}
                        </TableHead>
                        <TableHead className="px-5 py-3.5 text-xs font-semibold text-muted-foreground">
                          {lang === 'zh' ? '关键差异' : 'Key Difference'}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deep.competitors.map((c) => {
                        const st = RELATION_STYLE[c.relation] ?? RELATION_FALLBACK
                        return (
                          <TableRow key={c.name} className="border-border/60 hover:bg-muted/60">
                            <TableCell className="px-5 py-4 text-sm font-semibold text-foreground">
                              {c.name}
                            </TableCell>
                            <TableCell className="px-5 py-4">
                              <span
                                className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                                style={{ backgroundColor: st.bg, color: st.fg }}
                              >
                                {c.relation}
                              </span>
                            </TableCell>
                            <TableCell className="whitespace-normal px-5 py-4 text-sm leading-6 text-muted-foreground">
                              {c.diff}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </section>
            )}

            {/* 版本历史（深度数据，竖向时间线） */}
            {deep && (
              <section id="sec-versions" className="mt-14 scroll-mt-24">
                <DeepSectionTitle title={L.versionHistory} accent={layer.accent} />
                <div className="shadow-warm mt-5 rounded-2xl border border-border/80 bg-paper p-6 sm:p-7">
                  <ol className="relative ml-1.5 space-y-6 border-l border-border pl-6">
                    {deep.versions.map((v) => (
                      <li key={v.version} className="relative">
                        <span
                          aria-hidden
                          className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-paper"
                          style={{ backgroundColor: layer.accent }}
                        />
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="font-mono text-sm font-bold text-foreground">{v.version}</span>
                          <span className="text-xs text-muted-foreground">{v.date}</span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{v.highlight}</p>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-6 border-t border-dashed border-border pt-4 text-xs text-muted-foreground">
                    {L.sourceGh}
                  </p>
                </div>
              </section>
            )}

            {/* Star 趋势（深度数据，面积图 + 统计行） */}
            {deep && (
              <section id="sec-stars" className="mt-14 scroll-mt-24">
                <DeepSectionTitle title={L.starTrend} accent={layer.accent} />
                <div className="shadow-warm mt-5 rounded-2xl border border-border/80 bg-paper p-6 sm:p-7">
                  <StarChart data={deep.starHistory} accent={layer.accent} />
                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-dashed border-border pt-5 sm:grid-cols-4">
                    <StatItem icon={Star} label="Stars" value={deep.stats.stars.toLocaleString()} accent={layer.accent} />
                    <StatItem icon={GitFork} label="Forks" value={deep.stats.forks.toLocaleString()} accent={layer.accent} />
                    <StatItem icon={Scale} label="License" value={deep.stats.license ?? '—'} accent={layer.accent} />
                    <StatItem icon={CalendarDays} label={L.asOf} value={deep.stats.checkedAt} accent={layer.accent} />
                  </div>
                  <p className="mt-5 text-xs text-muted-foreground">{L.sourceOss}</p>
                </div>
              </section>
            )}

            {/* 常见问题 */}
            <section id="sec-faq" className="mt-14 scroll-mt-24">
              <DeepSectionTitle title={L.faq} accent={layer.accent} />
              <div className="shadow-warm mt-5 rounded-2xl border border-border/80 bg-paper px-6">
                <Accordion type="single" collapsible>
                  {detail.faq.map((item, i) => (
                    <AccordionItem key={item.q} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left text-sm font-semibold text-foreground">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-7 text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            {/* 学习资源：官方资源 + 延伸阅读 */}
            <section id="sec-resources" className="mt-14 scroll-mt-24">
              <DeepSectionTitle title={L.resources} accent={layer.accent} />

              {/* 官方资源 */}
              <h3 className="mt-6 flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground/90">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 shrink-0 rounded-[4px]"
                  style={{ backgroundColor: layer.accent }}
                />
                {L.officialResources}
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {detail.resources.map((res) => (
                  <a
                    key={res.url}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shadow-warm group flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-paper px-5 py-4 transition-shadow hover:shadow-warm-lg"
                  >
                    <span className="text-sm font-medium text-foreground/90 transition-colors group-hover:text-foreground">
                      {res.label}
                    </span>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-muted-foreground" />
                  </a>
                ))}
              </div>

              {/* 延伸阅读（仅收录了推荐文章时渲染） */}
              {detail.articles && detail.articles.length > 0 && (
                <>
                  <h3 className="mt-9 flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground/90">
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 shrink-0 rounded-[4px]"
                      style={{ backgroundColor: layer.accent }}
                    />
                    {L.reading}
                  </h3>
                  <div className="mt-4 space-y-3">
                    {detail.articles.map((a) => (
                      <div
                        key={a.url}
                        className="shadow-warm flex gap-4 rounded-xl border border-border/80 bg-paper px-5 py-4 transition-shadow hover:shadow-warm-lg"
                        style={{ '--accent': layer.accent } as CSSProperties}
                      >
                        <span
                          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${layer.accent}1A`, color: layer.accent }}
                        >
                          <BookOpen className="h-4 w-4" />
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                          <div className="min-w-0 flex-1">
                            <a
                              href={a.url}
                              target="_blank"
                              rel="noreferrer"
                              className="group inline-flex items-baseline gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-[var(--accent)]"
                            >
                              <span className="break-words">{a.title}</span>
                              <ExternalLink className="h-3.5 w-3.5 shrink-0 translate-y-0.5 text-muted-foreground/50 transition-colors group-hover:text-[var(--accent)]" />
                            </a>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">{a.note}</p>
                          </div>
                          <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                            {a.author} · {a.source}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>

            {/* 同层相关项目 */}
            {siblings.length > 0 && (
              <section id="sec-related" className="mt-14 scroll-mt-24">
                <DeepSectionTitle title={`${L.related} · ${lang === 'zh' ? layer.zhName : layer.name}`} accent={layer.accent} />
                <div className="mt-5 flex flex-wrap gap-2">
                  {siblings.map((s) => (
                    <Link
                      key={s.id}
                      to={`/tool/${s.id}`}
                      className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-card"
                      style={{
                        borderColor: `${layer.accent}55`,
                        backgroundColor: layerSoftBackground(layer.softBg, layer.accent, dark),
                        color: layer.accent,
                      }}
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* 桌面端页内目录（sticky 侧栏） */}
          <aside className="mt-14 hidden lg:block">
            <DetailToc items={tocItems} accent={layer.accent} title={L.toc} />
          </aside>
        </div>

        {/* 上一项目 / 下一项目 */}
        <nav
          aria-label="项目间导航"
          className="mt-14 grid gap-3 border-t border-dashed border-border pt-8 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              to={`/tool/${prev.id}`}
              className="shadow-warm group flex items-center gap-3 rounded-2xl border border-border/80 bg-paper px-5 py-4 transition-shadow hover:shadow-warm-lg"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
              <span>
                <span className="block text-[11px] text-muted-foreground">{L.prev}</span>
                <span className="block text-sm font-semibold text-foreground/90">{prev.name}</span>
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <Link
              to={`/tool/${next.id}`}
              className="shadow-warm group flex items-center justify-end gap-3 rounded-2xl border border-border/80 bg-paper px-5 py-4 text-right transition-shadow hover:shadow-warm-lg"
            >
              <span>
                <span className="block text-[11px] text-muted-foreground">{L.next}</span>
                <span className="block text-sm font-semibold text-foreground/90">{next.name}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </nav>
      </main>

      <Footer />
    </div>
  )
}
