import { Link } from 'react-router'
import type { StackTool } from '@/data/stack'
import { layerById } from '@/data/stack'
import { PriorityStars } from './PriorityStars'
import { ArrowRight, Github, Boxes } from 'lucide-react'

/**
 * 工具讲解卡片 —— 各层级分区的标准展示单元
 * 使用层级强调色作为左侧边条与小标题点缀
 */
export function ToolCard({ tool }: { tool: StackTool }) {
  const layer = layerById(tool.layerId)
  return (
    <article
      id={`tool-${tool.id}`}
      className="shadow-warm relative overflow-hidden rounded-2xl border border-stone-200/80 bg-[#FFFDF8] transition-shadow hover:shadow-warm-lg"
    >
      <div className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: layer.accent }} />
      <div className="p-6 pl-7 sm:p-7 sm:pl-8">
        {/* 头部：名称 + Repo + 优先级 */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="text-xl font-bold tracking-tight text-stone-800">{tool.name}</h4>
            <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-xs text-stone-500">
              <Github className="h-3.5 w-3.5" />
              {tool.repo}
            </p>
          </div>
          <PriorityStars priority={tool.priority} />
        </div>

        {/* 核心作用 + Harness 模块 */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium"
            style={{ backgroundColor: layer.softBg, color: layer.accent }}
          >
            <Boxes className="h-3.5 w-3.5" />
            {tool.harnessModule}
          </span>
          <span className="text-stone-500">{tool.coreRole}</span>
        </div>

        {/* 通俗讲解 */}
        <p className="mt-4 text-sm leading-7 text-stone-600">{tool.summary}</p>

        {/* 关注重点 chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tool.focusPoints.map((fp) => (
            <span
              key={fp}
              className="rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 font-mono text-[11px] text-stone-600"
            >
              {fp}
            </span>
          ))}
        </div>

        {/* 关键概念 */}
        <dl className="mt-5 space-y-2.5 border-t border-dashed border-stone-200 pt-4">
          {tool.concepts.map((c) => (
            <div key={c.term} className="grid gap-0.5 sm:grid-cols-[180px_1fr] sm:gap-3">
              <dt className="text-xs font-semibold" style={{ color: layer.accent }}>
                {c.term}
              </dt>
              <dd className="text-xs leading-6 text-stone-500">{c.desc}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* 详情页入口：通栏链接 */}
      <Link
        to={`/tool/${tool.id}`}
        className="group flex items-center justify-between gap-2 border-t border-dashed border-stone-200 px-6 py-4 pl-7 text-sm font-semibold transition-colors sm:px-7 sm:pl-8"
        style={{ color: layer.accent }}
      >
        <span>查看 {tool.name} 详细介绍</span>
        <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </article>
  )
}
