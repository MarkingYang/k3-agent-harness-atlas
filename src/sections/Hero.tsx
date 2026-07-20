import { ArrowRight, Compass, Layers, Route, Wrench } from 'lucide-react'
import { LAYERS, PRIORITY_META, TOOLS } from '@/data/stack'
import { SectionShell } from '@/components/stack/SectionShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/hooks/use-language'
import { UI, localizedLayer } from '@/i18n/ui'
import { useLayerSoftBackground } from '@/lib/layer-surface'

/** 9 层堆叠示意图的错落宽度（百分比） */
const BAR_WIDTHS = [100, 86, 94, 80, 92, 76, 90, 84, 96]


function HeroLayerBar({ layer, width }: { layer: (typeof LAYERS)[number]; width: number }) {
  const { lang } = useLanguage()
  const loc = localizedLayer(layer, lang)
  const soft = useLayerSoftBackground(layer.softBg, layer.accent)
  return (
    <div
      className="flex items-center gap-3 overflow-hidden rounded-lg py-2 pl-1 pr-3 transition-transform duration-300 hover:translate-x-1"
      style={{ backgroundColor: soft, width: `${width}%` }}
      title={`${layer.name} · ${loc.tagline}`}
    >
      <span className="h-6 w-1 shrink-0 rounded-full" style={{ backgroundColor: layer.accent }} />
      <span className="truncate text-xs font-medium text-foreground sm:text-sm">{loc.title}</span>
    </div>
  )
}

/**
 * 首屏 Hero —— 定位陈述 + 关键数据 + 9 层堆叠示意图
 */
export default function Hero() {
  const { lang } = useLanguage()
  const u = UI[lang]
  const stats = [
    { icon: Wrench, value: TOOLS.length, label: u.statProjects },
    { icon: Layers, value: LAYERS.length, label: u.statLayers },
    { icon: Route, value: Object.keys(PRIORITY_META).length, label: u.statPriority },
  ]

  return (
    <SectionShell id="top" className="pt-10 sm:pt-16">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <Badge
            variant="secondary"
            className="rounded-full border border-border bg-paper px-3.5 py-1.5 text-xs font-medium text-ink-soft shadow-warm"
          >
            {u.badge}
          </Badge>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl sm:leading-[1.15]">
            Agent Harness
            <br />
            <span className="text-primary">{u.heroTitle}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            {u.heroBody}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-border/70 bg-paper px-4 py-4 shadow-warm sm:px-5 sm:py-5"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-xl shadow-warm">
              <a href="#map">
                {u.ctaMap}
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl bg-paper">
              <a href="#path">
                <Compass className="mr-1 h-4 w-4" />
                {u.ctaPath}
              </a>
            </Button>
          </div>
        </div>

        <div
          className="rounded-2xl border border-border/70 bg-paper p-5 shadow-warm-lg sm:p-6"
          aria-label={u.layersTitle}
        >
          <div className="mb-4 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-foreground/90">{u.layersTitle}</span>
            <span className="text-xs text-muted-foreground">{u.layersSub}</span>
          </div>
          <div className="flex flex-col gap-2">
            {LAYERS.map((layer, i) => (
              <HeroLayerBar key={layer.id} layer={layer} width={BAR_WIDTHS[i]} />
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
