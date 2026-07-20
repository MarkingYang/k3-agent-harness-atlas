import { useEffect, useState, type MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { NAV_ITEMS } from '@/data/stack'
import { cn } from '@/lib/utils'

/**
 * 两行顶栏总高：第一行 h-16（64px）+ 第二行子页签条 h-11（44px）= 108px
 * sticky 偏移取 112px（top-28），留 4px 呼吸间距；滚动高亮的 rootMargin 同步扣除
 */
const HEADER_HEIGHT = 112

/**
 * 首页左侧目录导航（桌面 lg+ 显示，移动端由 Navbar 抽屉承担分区导航）
 * 竖向列出 NAV_ITEMS 全部分区（含「首页」，目录语义完整）；
 * IntersectionObserver 滚动跟随高亮，当前分区 = 左侧主题色竖条 + 暖色底 pill
 */
export default function SideNav() {
  const [activeId, setActiveId] = useState<string>('top')
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // 滚动跟随：观察各分区根节点，高亮落在顶栏下方阅读带内的最靠后分区
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (sections.length === 0) return

    /** 当前落在阅读带内的分区 id 集合 */
    const inBand = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id)
          else inBand.delete(entry.target.id)
        }
        // 多个分区同时压带时，取文档序最靠后的一个（正在进入的分区优先）
        for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
          if (inBand.has(NAV_ITEMS[i].id)) {
            setActiveId(NAV_ITEMS[i].id)
            break
          }
        }
      },
      { rootMargin: `-${HEADER_HEIGHT}px 0px -55% 0px`, threshold: 0 },
    )
    sections.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  /** 与 Navbar 一致的锚点跳转语义（SideNav 仅挂首页，保留跨页兜底） */
  const goAnchor = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${id}`)
    }
  }

  return (
    <aside className="hidden w-56 shrink-0 self-stretch lg:block" aria-label="页面目录">
      <div className="sticky top-28 max-h-[calc(100vh-8.5rem)] overflow-y-auto pb-4 pl-5 sm:pl-8">
        <p className="px-3 pb-2 text-xs font-medium tracking-wider text-stone-400">目录</p>
        <nav className="flex flex-col gap-0.5" aria-label="分区目录">
          {NAV_ITEMS.map((item) => {
            const active = item.id === activeId
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active ? 'true' : undefined}
                onClick={goAnchor(item.id)}
                className={cn(
                  'relative flex items-center rounded-lg py-2 pl-4 pr-3 text-sm transition-colors',
                  active
                    ? 'bg-[#F5EFE3] font-medium text-stone-900'
                    : 'text-stone-600 hover:bg-[#F8F3E9] hover:text-stone-900',
                )}
              >
                {active && (
                  <span className="absolute left-1 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary" />
                )}
                {item.label}
              </a>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
