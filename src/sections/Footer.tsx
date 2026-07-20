import { Network } from 'lucide-react'
import { NAV_ITEMS } from '@/data/stack'

/**
 * 站点页脚 —— 深色暖底：站点名 + 总结语 + 锚点导航 + 版权行
 */
export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* 站点名 + 一句总结 */}
          <div className="max-w-md">
            <p className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-600">
                <Network className="h-4 w-4 text-white" />
              </span>
              <span className="text-lg font-bold tracking-tight text-stone-100">
                Agent Harness 技术栈全景指南
              </span>
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-400">
              模型是大脑，Harness 是骨架与神经系统。
            </p>
          </div>

          {/* 横排锚点导航 */}
          <nav
            aria-label="页脚导航"
            className="flex flex-wrap gap-x-5 gap-y-2.5 text-sm md:max-w-xs md:justify-end"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="transition-colors hover:text-amber-300"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* 分隔线 */}
        <div className="my-8 border-t border-stone-800" />

        {/* 底行 */}
        <p className="text-xs leading-6 text-stone-500">
          Agent Harness 技术栈全景指南 · 2026 · 内容整理自各开源项目公开资料
        </p>
      </div>
    </footer>
  )
}
