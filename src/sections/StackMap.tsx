import { Link } from 'react-router'
import { ArrowDown, MousePointerClick } from 'lucide-react'
import { LAYERS, toolsByLayer, layerById, type StackLayer } from '@/data/stack'
import { SectionShell } from '@/components/stack/SectionShell'

/**
 * 九层架构地图 —— 交互式垂直分层图
 * 按价值流向分四组，自上而下：产品 → 编排 → 能力 → 基础
 */

interface MapGroup {
  /** 组名 */
  label: string
  /** 组内层 id（自上而下） */
  layerIds: string[]
  /** 组一句话说明 */
  hint: string
}

const GROUPS: MapGroup[] = [
  { label: '产品层', layerIds: ['platform'], hint: '能力最终落地为可使用的产品' },
  { label: '编排层', layerIds: ['multi-agent', 'runtime'], hint: '定义 Agent 如何思考、行动与协作' },
  { label: '能力层', layerIds: ['memory', 'evaluation', 'observability'], hint: '让 Agent 可记忆、可度量、可调试' },
  { label: '基础层', layerIds: ['gateway', 'protocol', 'sandbox'], hint: '贴近标准与资源的最底层设施' },
]

/** 层 id → 站点锚点 */
const ANCHOR_BY_LAYER: Record<string, string> = {
  platform: '#platform',
  'multi-agent': '#runtime',
  runtime: '#runtime',
  observability: '#observability',
  memory: '#memory',
  evaluation: '#memory',
  gateway: '#infra',
  protocol: '#infra',
  sandbox: '#infra',
}

/** 单个层块：左侧层信息 + 右侧工具 chips，整块可点击跳转 */
function LayerBlock({ layer, index }: { layer: StackLayer; index: number }) {
  const tools = toolsByLayer(layer.id)
  const href = ANCHOR_BY_LAYER[layer.id] ?? '#map'
  return (
    <a
      href={href}
      className="group relative block overflow-hidden rounded-2xl border border-transparent shadow-warm transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-warm-lg"
      style={{ backgroundColor: layer.softBg }}
      aria-label={`${layer.zhName}，点击查看详解`}
    >
      {/* 左侧强调色边条 */}
      <div className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: layer.accent }} />
      {/* hover 边框色 */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl border-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ borderColor: layer.accent }}
      />
      <div className="flex flex-col gap-4 p-5 pl-7 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6 sm:pl-8">
        {/* 左：序号 + 层名 + tagline */}
        <div className="flex min-w-0 items-center gap-3.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold text-white"
            style={{ backgroundColor: layer.accent }}
          >
            {String(index).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2.5">
              <h3 className="text-lg font-bold tracking-tight text-stone-800 sm:text-xl">
                {layer.zhName}
              </h3>
              <span className="font-mono text-xs text-stone-500">{layer.name}</span>
            </div>
            <span
              className="mt-1.5 inline-block rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-medium"
              style={{ color: layer.accent }}
            >
              {layer.tagline}
            </span>
          </div>
        </div>

        {/* 右：工具 chips + hover 提示 */}
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="flex flex-wrap gap-1.5 sm:justify-end">
            {tools.map((t) => (
              <Link
                key={t.id}
                to={`/tool/${t.id}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 rounded-md border border-stone-200/80 bg-[#FFFDF8] px-2.5 py-1 text-xs font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-white"
              >
                {t.name}
                <span className="font-mono text-[10px] font-semibold text-amber-600">
                  ★{t.priority}
                </span>
              </Link>
            ))}
          </div>
          <span
            className="inline-flex items-center gap-1 text-[11px] font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{ color: layer.accent }}
          >
            <MousePointerClick className="h-3 w-3" />
            点击查看详解 →
          </span>
        </div>
      </div>
    </a>
  )
}

export default function StackMap() {
  return (
    <SectionShell id="map" tinted>
      {/* 标题区 */}
      <header className="mb-12 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-stone-400">Stack Map</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-800 sm:text-4xl">
          九层架构地图
        </h2>
        <p className="mt-4 text-sm leading-7 text-stone-500 sm:text-base sm:leading-8">
          Agent Harness 不是单一框架，而是一套分层协作的基础设施。这张图把 9 大能力层按价值流向
          排成一条垂直通道：自下而上，越靠下越接近标准与资源（模型接入、工具协议、沙箱执行），
          越靠上越接近产品与协作（运行时编排、记忆评估观测、应用平台）。
          点击任意一层，即可跳转到对应的详解分区。
        </p>
      </header>

      {/* 分层图 */}
      <div className="flex flex-col">
        {GROUPS.map((group, gi) => (
          <div key={group.label}>
            {/* 组间向下箭头 */}
            {gi > 0 && (
              <div className="flex justify-center py-3" aria-hidden>
                <ArrowDown className="h-5 w-5 text-stone-300" />
              </div>
            )}
            <div className="flex gap-4 sm:gap-6">
              {/* 组名角标（竖排） */}
              <div className="flex w-9 shrink-0 flex-col items-center gap-2 pt-1 sm:w-12">
                <span className="text-xs font-semibold tracking-widest text-stone-400 [writing-mode:vertical-rl] sm:text-sm">
                  {group.label}
                </span>
                <span className="hidden text-[10px] leading-4 text-stone-400/80 [writing-mode:vertical-rl] lg:inline">
                  {group.hint}
                </span>
              </div>
              {/* 组内层块 */}
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                {group.layerIds.map((layerId) => {
                  const layer = layerById(layerId)
                  const index = LAYERS.findIndex((l) => l.id === layerId) + 1
                  return <LayerBlock key={layerId} layer={layer} index={index} />
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 图例 */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-dashed border-stone-200 bg-[#FFFDF8] px-5 py-3.5 text-xs text-stone-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="font-mono font-semibold text-amber-600">★</span>
          星级 = 推荐学习优先级（5 星核心必读 · 4 星重点掌握 · 3 星了解参考）
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MousePointerClick className="h-3.5 w-3.5" />
          点击任意层可跳转到对应详解分区
        </span>
      </div>
    </SectionShell>
  )
}
