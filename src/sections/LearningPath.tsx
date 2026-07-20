import { Fragment } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Milestone, Route, Star } from 'lucide-react'
import {
  PRIORITY_META,
  layerById,
  toolsByPriority,
  type Priority,
  type StackTool,
} from '@/data/stack'
import { SectionShell } from '@/components/stack/SectionShell'

/** 路径带渲染顺序：5 星 → 4 星 → 3 星 */
const PRIORITY_ORDER: Priority[] = [5, 4, 3]

/** 建议推进顺序（label 对应各分区锚点） */
const PATH_STEPS = [
  { id: 'runtime', label: '运行时' },
  { id: 'observability', label: '可观测' },
  { id: 'memory', label: '记忆与评估' },
  { id: 'infra', label: '基础设施' },
  { id: 'platform', label: '平台层' },
]

/** 路径带中的项目小卡片 —— 整卡可点击跳转对应工具详情页 */
function PathToolCard({ tool }: { tool: StackTool }) {
  const layer = layerById(tool.layerId)
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
        {layer.zhName}
      </p>
    </Link>
  )
}

/** 单条优先级路径带：左侧星级视觉，右侧项目网格 */
function PathBand({ priority, step }: { priority: Priority; step: number }) {
  const meta = PRIORITY_META[priority]
  const tools = toolsByPriority(priority)

  return (
    <article className="shadow-warm rounded-2xl border border-stone-200/80 bg-[#FFFDF8] p-6 sm:p-8">
      <div className="flex flex-col gap-7 lg:flex-row lg:gap-10">
        {/* 左侧：大星级视觉 + 标签 + 说明 */}
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
          <p className="mt-2.5 text-base font-bold text-stone-800">{meta.label}</p>
          <p className="mt-1.5 text-xs leading-6 text-stone-500">{meta.desc}</p>
        </div>

        {/* 右侧：该优先级全部项目 */}
        <div className="grid flex-1 grid-cols-2 gap-3 self-start sm:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <PathToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </article>
  )
}

/**
 * 三级学习路径分区 —— 按优先级而非按层推进
 */
export default function LearningPath() {
  return (
    <SectionShell id="path" tinted>
      {/* 分区头部 */}
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
              三级学习路径
            </h3>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-500">
          无需按九层顺序逐层攻克——推荐按优先级推进：先用 5 星项目建立对 Agent
          主干（运行时与可观测性）的认知骨架，再以 4 星项目补齐记忆、评估、网关、协议与沙箱等关键能力件，最后通过
          3 星平台项目理解 Agent 技术的产品化形态。
        </p>
      </header>

      {/* 三条路径带 */}
      <div className="space-y-6">
        {PRIORITY_ORDER.map((p, i) => (
          <PathBand key={p} priority={p} step={i + 1} />
        ))}
      </div>

      {/* 建议推进顺序 */}
      <div className="mt-10 rounded-2xl border border-dashed border-stone-300/90 bg-[#FFFDF8]/80 p-6 sm:px-8">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
          <span className="mr-1 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-800">
            <Milestone className="h-4 w-4 text-amber-600" />
            建议推进顺序
          </span>
          {PATH_STEPS.map((s, i) => (
            <Fragment key={s.id}>
              {i > 0 && <ArrowRight className="h-3.5 w-3.5 shrink-0 text-stone-400" />}
              <a
                href={`#${s.id}`}
                className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-800"
              >
                {s.label}
              </a>
            </Fragment>
          ))}
        </div>
        <p className="mt-4 text-xs leading-6 text-stone-500">
          核心层建议配合官方文档与源码，预计 4-6 周可建立完整认知框架。
        </p>
      </div>
    </SectionShell>
  )
}
