import {
  Bug,
  LineChart,
  Network,
  ListTree,
  CornerDownRight,
  CircleCheck,
} from 'lucide-react'
import { layerById, toolsByLayer } from '@/data/stack'
import { SectionShell } from '@/components/stack/SectionShell'
import { LayerHeader } from '@/components/stack/LayerHeader'
import { ToolCard } from '@/components/stack/ToolCard'
import { cn } from '@/lib/utils'
import { useLayerSoftBackground } from '@/lib/layer-surface'
import type { ReactNode } from 'react'

const layer = layerById('observability')
const tools = toolsByLayer('observability')

function SoftAccentIcon({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const soft = useLayerSoftBackground(layer.softBg, layer.accent)
  return (
    <span
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
        className,
      )}
      style={{ backgroundColor: soft, color: layer.accent }}
    >
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Trace 瀑布示例数据：一次 Agent 调用的 Span 树                        */
/* ------------------------------------------------------------------ */

const TRACE_TOTAL_MS = 4200

interface TraceRow {
  name: string
  /** 树深度：0 = 根 Span，1 = 子 Span */
  depth: 0 | 1
  /** 耗时；终态节点（Final Answer）无耗时 */
  ms?: number
  /** 在瀑布上的起始偏移（ms） */
  startMs?: number
}

const TRACE_ROWS: TraceRow[] = [
  { name: 'Agent Run', depth: 0, ms: 4200, startMs: 0 },
  { name: 'LLM Call #1', depth: 1, ms: 800, startMs: 0 },
  { name: 'Retrieval 检索', depth: 1, ms: 350, startMs: 800 },
  { name: 'Tool Call · 天气查询', depth: 1, ms: 1200, startMs: 1150 },
  { name: 'LLM Call #2', depth: 1, ms: 1500, startMs: 2350 },
  { name: 'Final Answer', depth: 1 },
]

/** 按深度用不同透明度的层级强调色填充横条 */
const DEPTH_ALPHA: Record<TraceRow['depth'], string> = {
  0: 'F2', // 95%
  1: '9E', // 62%
}

/* ------------------------------------------------------------------ */
/* 三者分工对比条数据                                                  */
/* ------------------------------------------------------------------ */

const DIVISION = [
  {
    icon: Bug,
    name: 'Phoenix',
    role: '开源自托管的调试平台',
    desc: '本地即可运行的 Trace 查看与评估，数据不出内网，适合开发与调试阶段。',
  },
  {
    icon: LineChart,
    name: 'LangSmith',
    role: '商业托管的运维平台',
    desc: 'Prompt 版本管理加线上质量监控，覆盖从开发到生产的完整生命周期。',
  },
  {
    icon: Network,
    name: 'OpenTelemetry',
    role: '底层数据标准',
    desc: '厂商中立的 Trace / Metrics 规范，Phoenix 与 LangSmith 都兼容它。',
  },
]

/** 小标题：强调色小方块 + 文字 */
function SubHeading({ children }: { children: string }) {
  return (
    <h4 className="flex items-center gap-2 text-sm font-bold tracking-wide text-foreground/90">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: layer.accent }} />
      {children}
    </h4>
  )
}

/** 单行 Trace：左侧 Span 名（按深度缩进），右侧瀑布横条 */
function TraceBar({ row }: { row: TraceRow }) {
  const widthPct = row.ms !== undefined ? (row.ms / TRACE_TOTAL_MS) * 100 : 0
  const leftPct = row.startMs !== undefined ? (row.startMs / TRACE_TOTAL_MS) * 100 : 0
  const isRoot = row.depth === 0

  return (
    <div className="flex items-center gap-3">
      {/* Span 名 */}
      <div
        className={cn(
          'flex w-32 shrink-0 items-center gap-1.5 sm:w-48',
          row.depth === 1 && 'pl-3 sm:pl-5',
        )}
      >
        {row.depth === 1 && (
          <CornerDownRight className="h-3 w-3 shrink-0 text-muted-foreground/50" aria-hidden />
        )}
        <span
          className={cn(
            'truncate font-mono text-xs',
            isRoot ? 'font-bold text-foreground' : 'text-ink-soft',
          )}
          title={row.name}
        >
          {row.name}
        </span>
      </div>

      {/* 瀑布轨道 + 横条 */}
      <div className="relative h-5 min-w-0 flex-1 rounded-full bg-muted/90">
        {row.ms !== undefined ? (
          <>
            <div
              className="absolute inset-y-0 flex items-center justify-end rounded-full"
              style={{
                left: `${leftPct}%`,
                width: `${widthPct}%`,
                backgroundColor: `${layer.accent}${DEPTH_ALPHA[row.depth]}`,
              }}
            >
              {isRoot && (
                <span className="pr-2.5 font-mono text-[11px] font-semibold text-white">
                  {row.ms} ms
                </span>
              )}
            </div>
            {!isRoot && (
              <span
                className="absolute top-1/2 -translate-y-1/2 pl-2 font-mono text-[11px] text-muted-foreground"
                style={{ left: `${leftPct + widthPct}%` }}
              >
                {row.ms} ms
              </span>
            )}
          </>
        ) : (
          <span className="absolute inset-y-0 left-0 flex items-center gap-1.5 pl-1 text-[11px] text-muted-foreground">
            <CircleCheck className="h-3.5 w-3.5" style={{ color: layer.accent }} aria-hidden />
            生成最终回答，Trace 结束
          </span>
        )}
      </div>
    </div>
  )
}

export default function ObservabilitySection() {
  return (
    <SectionShell id="observability" tinted>
      {/* ① 层级头部 */}
      <LayerHeader layer={layer} index={3} />

      {/* ② Trace 瀑布迷你可视化 */}
      <div className="shadow-warm rounded-2xl border border-border/80 bg-paper p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <SoftAccentIcon>
            <ListTree className="h-4 w-4" />
          </SoftAccentIcon>
          <div>
            <h4 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              一次 Agent 调用的 Trace 瀑布
            </h4>
            <p className="mt-0.5 text-xs text-muted-foreground">
              这就是 Phoenix / LangSmith 中看到的 Trace 视图。
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {TRACE_ROWS.map((row) => (
            <TraceBar key={row.name} row={row} />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-dashed border-border pt-4 text-[11px] text-muted-foreground">
          <span>
            总耗时 <span className="font-mono font-semibold text-foreground/90">4200 ms</span>
          </span>
          <span>
            共 <span className="font-mono font-semibold text-foreground/90">5</span> 个 Span
          </span>
          <span>
            子步骤合计 3850 ms，其余{' '}
            <span className="font-mono font-semibold text-foreground/90">350 ms</span> 为编排开销
          </span>
        </div>
      </div>

      {/* ③ 本层代表项目 */}
      <div className="mt-12">
        <SubHeading>本层代表项目</SubHeading>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          {tools.map((tool, i) =>
            i === tools.length - 1 ? (
              <div key={tool.id} className="md:col-span-2">
                <ToolCard tool={tool} />
              </div>
            ) : (
              <ToolCard key={tool.id} tool={tool} />
            ),
          )}
        </div>
      </div>

      {/* ④ 三者如何分工 */}
      <div className="mt-12">
        <SubHeading>三者如何分工？</SubHeading>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {DIVISION.map((item) => (
            <div
              key={item.name}
              className="shadow-warm rounded-2xl border border-border/80 bg-paper p-5"
            >
              <div className="flex items-center gap-2.5">
                <SoftAccentIcon>
                  <item.icon className="h-4 w-4" />
                </SoftAccentIcon>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">{item.name}</p>
                  <p className="text-xs font-semibold" style={{ color: layer.accent }}>
                    {item.role}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-6 text-muted-foreground">
          一句话分工：OpenTelemetry 负责「怎么记录」，Phoenix 负责「本地怎么调」，LangSmith
          负责「线上怎么管」。
        </p>
      </div>
    </SectionShell>
  )
}
