import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Boxes, Github, RotateCcw, SearchX, Star, Table2 } from 'lucide-react'
import { LAYERS, PRIORITY_META, TOOLS, layerById, type Priority } from '@/data/stack'
import { SectionShell } from '@/components/stack/SectionShell'
import { PriorityStars } from '@/components/stack/PriorityStars'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { layerSoftBackground, useLayerSoftBackground } from '@/lib/layer-surface'
import { useLanguage } from '@/hooks/use-language'
import { useTheme } from '@/hooks/use-theme'
import { UI, localizedLayer, priorityLabel } from '@/i18n/ui'
import { deepDiveById } from '@/data/deep'

type PriorityFilter = 'all' | Priority
type LayerFilter = 'all' | string

function FocusChips({ points, size = 'sm' }: { points: string[]; size?: 'xs' | 'sm' }) {
  return (
    <div className="flex flex-wrap gap-1">
      {points.map((fp) => (
        <span
          key={fp}
          className={cn(
            'rounded border border-border bg-muted/50 font-mono text-muted-foreground',
            size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]',
          )}
        >
          {fp}
        </span>
      ))}
    </div>
  )
}

function LayerBadge({ layerId, chip = false }: { layerId: string; chip?: boolean }) {
  const { lang } = useLanguage()
  const layer = layerById(layerId)
  const title = localizedLayer(layer, lang).title
  const soft = useLayerSoftBackground(layer.softBg, layer.accent)
  if (chip) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
        style={{ backgroundColor: soft, color: layer.accent }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: layer.accent }} />
        {title}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/90">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: layer.accent }} />
      {title}
    </span>
  )
}

export default function ComparisonTable() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const { resolved } = useTheme()
  const dark = resolved === 'dark'
  const u = UI[lang]
  const [priority, setPriority] = useState<PriorityFilter>('all')
  const [layerId, setLayerId] = useState<LayerFilter>('all')

  const filtered = useMemo(
    () =>
      TOOLS.filter(
        (t) =>
          (priority === 'all' || t.priority === priority) &&
          (layerId === 'all' || t.layerId === layerId),
      ),
    [priority, layerId],
  )

  const resetFilters = () => {
    setPriority('all')
    setLayerId('all')
  }

  const roleOf = (toolId: string, fallback: string) => {
    const deep = deepDiveById(toolId)
    return lang === 'en' && deep?.en.tagline ? deep.en.tagline : fallback
  }

  return (
    <SectionShell id="table" tinted>
      <header className="mb-10">
        <p className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <Table2 className="h-3.5 w-3.5" />
          Comparison Table
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {u.tableTitle(TOOLS.length)}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{u.tableBody}</p>
      </header>

      <div className="shadow-warm rounded-2xl border border-border/80 bg-paper p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-14 shrink-0 text-xs font-semibold text-muted-foreground">
            {u.filterPriority}
          </span>
          <div className="flex flex-wrap gap-1.5">
            <Button
              size="sm"
              variant={priority === 'all' ? 'default' : 'outline'}
              aria-pressed={priority === 'all'}
              onClick={() => setPriority('all')}
              className={cn(
                'rounded-full',
                priority !== 'all' &&
                  'border-border bg-card/70 text-ink-soft hover:bg-muted hover:text-foreground',
              )}
            >
              {u.filterAll}
            </Button>
            {([5, 4, 3] as Priority[]).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={priority === p ? 'default' : 'outline'}
                aria-pressed={priority === p}
                onClick={() => setPriority(p)}
                className={cn(
                  'rounded-full',
                  priority !== p &&
                    'border-border bg-card/70 text-ink-soft hover:bg-muted hover:text-foreground',
                )}
              >
                <Star className="fill-teal-400 text-teal-400" />
                {p}★ {priorityLabel(PRIORITY_META[p], lang)}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-start gap-2 border-t border-dashed border-border pt-3">
          <span className="w-14 shrink-0 pt-1.5 text-xs font-semibold text-muted-foreground">
            {u.filterLayer}
          </span>
          <div className="flex flex-1 flex-wrap gap-1.5">
            <button
              type="button"
              aria-pressed={layerId === 'all'}
              onClick={() => setLayerId('all')}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                layerId === 'all'
                  ? 'border-primary bg-primary text-primary-foreground shadow-warm'
                  : 'border-border bg-card/70 text-ink-soft hover:border-border hover:text-foreground',
              )}
            >
              {u.filterAll}
            </button>
            {LAYERS.map((layer) => {
              const active = layerId === layer.id
              const title = localizedLayer(layer, lang).title
              return (
                <button
                  key={layer.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setLayerId(layer.id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    !active &&
                      'border-border bg-card/70 text-ink-soft hover:border-border hover:text-foreground',
                  )}
                  style={
                    active
                      ? {
                          backgroundColor: layerSoftBackground(layer.softBg, layer.accent, dark),
                          borderColor: layer.accent,
                          color: layer.accent,
                        }
                      : undefined
                  }
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: layer.accent }}
                  />
                  {title}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm text-muted-foreground">
        {lang === 'zh' ? (
          <>
            共 <span className="font-semibold text-foreground">{filtered.length}</span> 个项目
          </>
        ) : (
          <>
            <span className="font-semibold text-foreground">{filtered.length}</span> projects
          </>
        )}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-border bg-paper py-16">
          <SearchX className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-4 text-sm font-medium text-muted-foreground">{u.emptyFilter}</p>
          <Button size="sm" variant="outline" onClick={resetFilters} className="mt-4 rounded-full">
            <RotateCcw />
            {u.resetFilters}
          </Button>
        </div>
      ) : (
        <>
          <div className="shadow-warm mt-4 hidden overflow-hidden rounded-2xl border border-border/80 bg-paper md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-paper-2/70 hover:bg-paper-2/70">
                  <TableHead className="text-xs font-semibold text-muted-foreground">
                    {u.colProject}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">
                    {u.colLayer}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">
                    {u.colPriority}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">
                    {u.colRole}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">
                    {u.colModule}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">
                    {u.colFocus}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((tool) => (
                  <TableRow
                    key={tool.id}
                    onClick={() => navigate(`/tool/${tool.id}`)}
                    className="cursor-pointer hover:bg-muted/80"
                    title={u.viewDetail(tool.name)}
                  >
                    <TableCell className="min-w-[160px] whitespace-normal px-3 py-3">
                      <p className="font-semibold text-foreground">{tool.name}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                        <Github className="h-3 w-3" />
                        {tool.repo}
                      </p>
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      <LayerBadge layerId={tool.layerId} />
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      <PriorityStars priority={tool.priority} showLabel={false} />
                    </TableCell>
                    <TableCell className="min-w-[200px] whitespace-normal px-3 py-3 text-xs leading-5 text-ink-soft">
                      {roleOf(tool.id, tool.coreRole)}
                    </TableCell>
                    <TableCell className="min-w-[150px] whitespace-normal px-3 py-3 font-mono text-[11px] leading-5 text-muted-foreground">
                      {tool.harnessModule}
                    </TableCell>
                    <TableCell className="max-w-[260px] whitespace-normal px-3 py-3">
                      <FocusChips points={tool.focusPoints} size="xs" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 space-y-3 md:hidden">
            {filtered.map((tool) => (
              <article
                key={tool.id}
                onClick={() => navigate(`/tool/${tool.id}`)}
                className="shadow-warm cursor-pointer rounded-2xl border border-border/80 bg-paper p-5 transition-shadow hover:shadow-warm-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-foreground">
                      {tool.name}
                    </h3>
                    <p className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                      <Github className="h-3 w-3" />
                      {tool.repo}
                    </p>
                  </div>
                  <PriorityStars priority={tool.priority} showLabel={false} />
                </div>
                <div className="mt-3">
                  <LayerBadge layerId={tool.layerId} chip />
                </div>
                <p className="mt-3 text-xs leading-6 text-ink-soft">
                  {roleOf(tool.id, tool.coreRole)}
                </p>
                <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                  <Boxes className="h-3.5 w-3.5" />
                  {tool.harnessModule}
                </p>
                <div className="mt-3">
                  <FocusChips points={tool.focusPoints} />
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </SectionShell>
  )
}
