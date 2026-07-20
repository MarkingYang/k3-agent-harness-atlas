import { Fragment } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Milestone, Route, Star } from 'lucide-react'
import {
  NAV_ITEMS,
  PRIORITY_META,
  layerById,
  toolsByPriority,
  type Priority,
  type StackTool,
} from '@/data/stack'
import { SectionShell } from '@/components/stack/SectionShell'
import { useLanguage } from '@/hooks/use-language'
import { UI, localizedLayer, navLabel, priorityDesc, priorityLabel } from '@/i18n/ui'

const PRIORITY_ORDER: Priority[] = [5, 4, 3]

const PATH_STEP_IDS = ['runtime', 'observability', 'memory', 'infra', 'platform'] as const

function PathToolCard({ tool }: { tool: StackTool }) {
  const { lang } = useLanguage()
  const layer = layerById(tool.layerId)
  const loc = localizedLayer(layer, lang)
  return (
    <Link
      to={`/tool/${tool.id}`}
      className="group rounded-xl border border-stone-200/80 bg-white/70 px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-warm"
    >
      <p className="text-sm font-semibold text-stone-800">{tool.name}</p>
      <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-stone-500">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: layer.accent }}
        />
        {loc.title}
      </p>
    </Link>
  )
}

function PathBand({ priority, step }: { priority: Priority; step: number }) {
  const { lang } = useLanguage()
  const meta = PRIORITY_META[priority]
  const tools = toolsByPriority(priority)

  return (
    <article className="shadow-warm rounded-2xl border border-stone-200/80 bg-[#FFFDF8] p-6 sm:p-8">
      <div className="flex flex-col gap-7 lg:flex-row lg:gap-10">
        <div className="shrink-0 lg:w-52">
          <p className="font-mono text-[11px] uppercase tracking-widest text-stone-400">
            Step {String(step).padStart(2, '0')}
          </p>
          <div className="mt-2.5 flex items-end gap-1.5">
            <span className="text-5xl font-black leading-none tracking-tight text-stone-800">
              {priority}
            </span>
            <Star className="h-8 w-8 -translate-y-0.5 fill-amber-500 text-amber-500" />
          </div>
          <p className="mt-2.5 text-base font-bold text-stone-800">
            {priorityLabel(meta, lang)}
          </p>
          <p className="mt-1.5 text-xs leading-6 text-stone-500">
            {priorityDesc(meta, lang)}
          </p>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-3 self-start sm:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <PathToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </article>
  )
}

export default function LearningPath() {
  const { lang } = useLanguage()
  const u = UI[lang]

  return (
    <SectionShell id="path" tinted>
      <header className="mb-10">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: '#B45309' }}
          >
            <Route className="h-5 w-5" />
          </span>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-stone-400">
              Learning Path
            </p>
            <h3 className="text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
              {u.pathTitle}
            </h3>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-500">{u.pathBody}</p>
      </header>

      <div className="space-y-6">
        {PRIORITY_ORDER.map((p, i) => (
          <PathBand key={p} priority={p} step={i + 1} />
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-stone-300/90 bg-[#FFFDF8]/80 p-6 sm:px-8">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
          <span className="mr-1 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-800">
            <Milestone className="h-4 w-4 text-amber-600" />
            {u.pathSuggested}
          </span>
          {PATH_STEP_IDS.map((id, i) => {
            const item = NAV_ITEMS.find((n) => n.id === id)
            return (
              <Fragment key={id}>
                {i > 0 && <ArrowRight className="h-3.5 w-3.5 shrink-0 text-stone-400" />}
                <a
                  href={`#${id}`}
                  className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-800"
                >
                  {item ? navLabel(item, lang) : id}
                </a>
              </Fragment>
            )
          })}
        </div>
      </div>
    </SectionShell>
  )
}
