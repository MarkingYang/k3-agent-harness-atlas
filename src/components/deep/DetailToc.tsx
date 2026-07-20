import { useEffect, useState } from 'react'

export interface TocItem {
  /** 小节锚点 id（与 section 的 id 一致） */
  id: string
  label: string
}

interface DetailTocProps {
  items: TocItem[]
  accent: string
  /** 目录标题（DETAIL_LABELS.toc） */
  title: string
}

/** 滚动监听：返回当前处于视口焦点区的小节 id（IntersectionObserver） */
function useActiveSection(items: TocItem[]): string {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')
  const idsKey = items.map((it) => it.id).join('|')

  useEffect(() => {
    const sections = idsKey
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        // 多个小节同时可见时，取页面顺序最靠前的一个
        const current = sections.find((s) => visible.has(s.id))
        if (current) setActiveId(current.id)
      },
      // 焦点区：顶部 sticky 导航之下至视口约 40% 处
      { rootMargin: '-96px 0px -60% 0px', threshold: 0 },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [idsKey])

  return activeId
}

/** 桌面端页内目录：sticky 竖排锚点链接 + accent 色指示条（lg+ 显示） */
export function DetailToc({ items, accent, title }: DetailTocProps) {
  const activeId = useActiveSection(items)
  if (items.length === 0) return null

  return (
    <nav aria-label={title} className="sticky top-24 w-56">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <span aria-hidden className="h-2 w-2 rounded-[3px]" style={{ backgroundColor: accent }} />
        {title}
      </p>
      <ul className="mt-4 border-l border-border">
        {items.map((it) => {
          const active = it.id === activeId
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={active ? 'location' : undefined}
                className={`-ml-px block border-l-2 px-3 py-1.5 text-[13px] leading-5 transition-colors ${
                  active ? 'font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
                style={
                  active
                    ? { borderColor: accent, color: accent }
                    : { borderColor: 'transparent' }
                }
              >
                {it.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** 移动端页内目录：可横向滚动的锚点 chips（Hero 下方，lg 以下显示） */
export function DetailTocChips({ items, accent, title }: DetailTocProps) {
  const activeId = useActiveSection(items)
  if (items.length === 0) return null

  return (
    <nav aria-label={title}>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8">
        {items.map((it) => {
          const active = it.id === activeId
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              aria-current={active ? 'location' : undefined}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'border-transparent text-white'
                  : 'border-border bg-paper text-muted-foreground hover:text-foreground'
              }`}
              style={active ? { backgroundColor: accent } : undefined}
            >
              {it.label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
