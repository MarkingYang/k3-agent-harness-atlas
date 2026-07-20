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

type PriorityFilter = 'all' | Priority
type LayerFilter = 'all' | string

/** 关注重点小 chips（表格与卡片共用样式） */
function FocusChips({ points, size = 'sm' }: { points: string[]; size?: 'xs' | 'sm' }) {
  return (
    <div className="flex flex-wrap gap-1">
      {points.map((fp) => (
        <span
          key={fp}
          className={cn(
            'rounded border border-stone-200 bg-stone-50 font-mono text-stone-500',
            size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]',
          )}
        >
          {fp}
        </span>
      ))}
    </div>
  )
}

/** 层级归属：accent 色点 + 中文层名 */
function LayerBadge({ layerId, chip = false }: { layerId: string; chip?: boolean }) {
  const layer = layerById(layerId)
  if (chip) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
        style={{ backgroundColor: layer.softBg, color: layer.accent }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: layer.accent }} />
        {layer.zhName}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: layer.accent }} />
      {layer.zhName}
    </span>
  )
}

/**
 * 全景对照表 —— 可筛选、可跳转的 16 项目活表格
 * 桌面端为 shadcn Table，移动端为卡片列表
 */
export default function ComparisonTable() {
  const navigate = useNavigate()
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

  return (
    <SectionShell id="table" tinted>
      {/* 分区头部 */}
      <header className="mb-10">
        <p className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-stone-400">
          <Table2 className="h-3.5 w-3.5" />
          Comparison Table
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-800 sm:text-4xl">
          {TOOLS.length} 个项目全景对照表
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-500">
          开篇那张静态优先级表，在这里变成一张可筛选、可跳转的活表格：按优先级或能力层过滤，
          点击任意一行（或一张卡片）即可直达对应项目的详情页。
        </p>
      </header>

      {/* 筛选面板 */}
      <div className="shadow-warm rounded-2xl border border-stone-200/80 bg-[#FFFDF8] p-4 sm:p-5">
        {/* 优先级筛选 */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-14 shrink-0 text-xs font-semibold text-stone-500">优先级</span>
          <div className="flex flex-wrap gap-1.5">
            <Button
              size="sm"
              variant={priority === 'all' ? 'default' : 'outline'}
              aria-pressed={priority === 'all'}
              onClick={() => setPriority('all')}
              className={cn(
                'rounded-full',
                priority !== 'all' &&
                  'border-stone-200 bg-white/70 text-stone-600 hover:bg-stone-100 hover:text-stone-800',
              )}
            >
              全部
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
                    'border-stone-200 bg-white/70 text-stone-600 hover:bg-stone-100 hover:text-stone-800',
                )}
              >
                <Star className="fill-amber-400 text-amber-400" />
                {p}★ {PRIORITY_META[p].label}
              </Button>
            ))}
          </div>
        </div>

        {/* 能力层筛选 chips */}
        <div className="mt-3 flex flex-wrap items-start gap-2 border-t border-dashed border-stone-200 pt-3">
          <span className="w-14 shrink-0 pt-1.5 text-xs font-semibold text-stone-500">能力层</span>
          <div className="flex flex-1 flex-wrap gap-1.5">
            <button
              type="button"
              aria-pressed={layerId === 'all'}
              onClick={() => setLayerId('all')}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                layerId === 'all'
                  ? 'border-stone-800 bg-stone-800 text-stone-50'
                  : 'border-stone-200 bg-white/70 text-stone-600 hover:border-stone-300 hover:text-stone-800',
              )}
            >
              全部
            </button>
            {LAYERS.map((layer) => {
              const active = layerId === layer.id
              return (
                <button
                  key={layer.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setLayerId(layer.id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    !active &&
                      'border-stone-200 bg-white/70 text-stone-600 hover:border-stone-300 hover:text-stone-800',
                  )}
                  style={
                    active
                      ? {
                          backgroundColor: layer.softBg,
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
                  {layer.zhName}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 计数行 */}
      <p className="mt-5 text-sm text-stone-500">
        共 <span className="font-semibold text-stone-800">{filtered.length}</span> 个项目
        {filtered.length > 0 && <span className="ml-2 text-xs text-stone-400">点击可查看对应项目详情页</span>}
      </p>

      {filtered.length === 0 ? (
        /* 空态 */
        <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-stone-300 bg-[#FFFDF8] py-16">
          <SearchX className="h-10 w-10 text-stone-300" />
          <p className="mt-4 text-sm font-medium text-stone-500">没有匹配的项目</p>
          <p className="mt-1 text-xs text-stone-400">试试放宽优先级或能力层的筛选条件</p>
          <Button size="sm" variant="outline" onClick={resetFilters} className="mt-4 rounded-full">
            <RotateCcw />
            重置筛选
          </Button>
        </div>
      ) : (
        <>
          {/* 桌面端：表格（md 及以上） */}
          <div className="shadow-warm mt-4 hidden overflow-hidden rounded-2xl border border-stone-200/80 bg-[#FFFDF8] md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F5EFE2]/70 hover:bg-[#F5EFE2]/70">
                  <TableHead className="text-xs font-semibold text-stone-500">项目</TableHead>
                  <TableHead className="text-xs font-semibold text-stone-500">能力层</TableHead>
                  <TableHead className="text-xs font-semibold text-stone-500">优先级</TableHead>
                  <TableHead className="text-xs font-semibold text-stone-500">核心作用</TableHead>
                  <TableHead className="text-xs font-semibold text-stone-500">Harness 模块</TableHead>
                  <TableHead className="text-xs font-semibold text-stone-500">推荐关注重点</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((tool) => (
                  <TableRow
                    key={tool.id}
                    onClick={() => navigate(`/tool/${tool.id}`)}
                    className="cursor-pointer hover:bg-[#F7F1E4]/80"
                    title={`查看 ${tool.name} 详细介绍`}
                  >
                    <TableCell className="min-w-[160px] whitespace-normal px-3 py-3">
                      <p className="font-semibold text-stone-800">{tool.name}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] text-stone-400">
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
                    <TableCell className="min-w-[200px] whitespace-normal px-3 py-3 text-xs leading-5 text-stone-600">
                      {tool.coreRole}
                    </TableCell>
                    <TableCell className="min-w-[150px] whitespace-normal px-3 py-3 font-mono text-[11px] leading-5 text-stone-500">
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

          {/* 移动端：卡片列表（md 以下） */}
          <div className="mt-4 space-y-3 md:hidden">
            {filtered.map((tool) => (
              <article
                key={tool.id}
                onClick={() => navigate(`/tool/${tool.id}`)}
                className="shadow-warm cursor-pointer rounded-2xl border border-stone-200/80 bg-[#FFFDF8] p-5 transition-shadow hover:shadow-warm-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-stone-800">
                      {tool.name}
                    </h3>
                    <p className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] text-stone-400">
                      <Github className="h-3 w-3" />
                      {tool.repo}
                    </p>
                  </div>
                  <PriorityStars priority={tool.priority} showLabel={false} />
                </div>
                <div className="mt-3">
                  <LayerBadge layerId={tool.layerId} chip />
                </div>
                <p className="mt-3 text-xs leading-6 text-stone-600">{tool.coreRole}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-stone-500">
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
