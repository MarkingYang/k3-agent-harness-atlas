import { Link } from 'react-router'
import { ArrowDown, MousePointerClick } from 'lucide-react'
import { LAYERS, toolsByLayer, layerById, type StackLayer } from '@/data/stack'
import { SectionShell } from '@/components/stack/SectionShell'
import { useLanguage } from '@/hooks/use-language'
import { UI, localizedLayer } from '@/i18n/ui'

interface MapGroup {
  labelKey: 'groupProduct' | 'groupOrchestration' | 'groupCapability' | 'groupFoundation'
  hintKey:
    | 'groupProductHint'
    | 'groupOrchestrationHint'
    | 'groupCapabilityHint'
    | 'groupFoundationHint'
  layerIds: string[]
}

const GROUPS: MapGroup[] = [
  { labelKey: 'groupProduct', hintKey: 'groupProductHint', layerIds: ['platform'] },
  {
    labelKey: 'groupOrchestration',
    hintKey: 'groupOrchestrationHint',
    layerIds: ['multi-agent', 'runtime'],
  },
  {
    labelKey: 'groupCapability',
    hintKey: 'groupCapabilityHint',
    layerIds: ['memory', 'evaluation', 'observability'],
  },
  {
    labelKey: 'groupFoundation',
    hintKey: 'groupFoundationHint',
    layerIds: ['gateway', 'protocol', 'sandbox'],
  },
]

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

function LayerBlock({ layer, index }: { layer: StackLayer; index: number }) {
  const { lang } = useLanguage()
  const u = UI[lang]
  const loc = localizedLayer(layer, lang)
  const tools = toolsByLayer(layer.id)
  const href = ANCHOR_BY_LAYER[layer.id] ?? '#map'
  return (
    <a
      href={href}
      className="group relative block overflow-hidden rounded-2xl border border-transparent shadow-warm transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-warm-lg"
      style={{ backgroundColor: layer.softBg }}
      aria-label={`${loc.title}, ${u.mapClick}`}
    >
      <div className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: layer.accent }} />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl border-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ borderColor: layer.accent }}
      />
      <div className="flex flex-col gap-4 p-5 pl-7 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6 sm:pl-8">
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
                {loc.title}
              </h3>
              <span className="font-mono text-xs text-stone-500">{loc.subtitle}</span>
            </div>
            <span
              className="mt-1.5 inline-block rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-medium"
              style={{ color: layer.accent }}
            >
              {loc.tagline}
            </span>
          </div>
        </div>

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
            {u.mapClick}
          </span>
        </div>
      </div>
    </a>
  )
}

export default function StackMap() {
  const { lang } = useLanguage()
  const u = UI[lang]

  return (
    <SectionShell id="map" tinted>
      <header className="mb-12 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-stone-400">Stack Map</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-800 sm:text-4xl">
          {u.mapTitle}
        </h2>
        <p className="mt-4 text-sm leading-7 text-stone-500 sm:text-base sm:leading-8">
          {u.mapBody}
        </p>
      </header>

      <div className="flex flex-col">
        {GROUPS.map((group, gi) => (
          <div key={group.labelKey}>
            {gi > 0 && (
              <div className="flex justify-center py-3" aria-hidden>
                <ArrowDown className="h-5 w-5 text-stone-300" />
              </div>
            )}
            <div className="flex gap-4 sm:gap-6">
              <div className="flex w-9 shrink-0 flex-col items-center gap-2 pt-1 sm:w-12">
                <span className="text-xs font-semibold tracking-widest text-stone-400 [writing-mode:vertical-rl] sm:text-sm">
                  {u[group.labelKey]}
                </span>
                <span className="hidden text-[10px] leading-4 text-stone-400/80 [writing-mode:vertical-rl] lg:inline">
                  {u[group.hintKey]}
                </span>
              </div>
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

      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-dashed border-stone-200 bg-[#FFFDF8] px-5 py-3.5 text-xs text-stone-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="font-mono font-semibold text-amber-600">★</span>
          {u.mapLegendStars}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MousePointerClick className="h-3.5 w-3.5" />
          {u.mapLegendClick}
        </span>
      </div>
    </SectionShell>
  )
}
