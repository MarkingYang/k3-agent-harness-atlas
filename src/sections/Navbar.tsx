import { useEffect, useState, type MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Blocks, Github, Languages, Menu } from 'lucide-react'
import { NAV_ITEMS } from '@/data/stack'
import { useLanguage, type Lang } from '@/hooks/use-language'
import { UI, navLabel } from '@/i18n/ui'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: 'zh', label: '中' },
  { value: 'en', label: 'EN' },
]

/** 中 / EN 胶囊分段切换控件 */
function LangSwitch() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="语言切换 / Language">
      <Languages className="h-4 w-4 text-stone-400" />
      <div className="flex items-center rounded-full border border-stone-300 bg-[#FFFDF8] p-0.5">
        {LANG_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            aria-pressed={lang === opt.value}
            onClick={() => setLang(opt.value)}
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
              lang === opt.value
                ? 'bg-primary text-primary-foreground shadow-warm'
                : 'text-stone-500 hover:text-stone-800',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * 吸顶导航 —— 两级层级导航
 * 第一行：品牌区 + 主导航（Github，点击展开/收起子页签条）+ 语言切换 + 移动端抽屉
 * 第二行：Github 子页签条（当前仅「Agent Harness」，为后续扩展其他子页签预留结构）
 * 分区锚点导航已迁移至首页左侧目录（SideNav）与移动端抽屉
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  /** Github 主导航激活态：激活时展开第二行子页签条（默认激活并展开） */
  const [githubActive, setGithubActive] = useState(true)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { lang } = useLanguage()
  const u = UI[lang]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /**
   * 锚点跳转：首页内平滑滚动；其他页面（如工具详情页）先导航回首页，
   * 由 Home 挂载后读取 location.hash 完成滚动（锚点只存在于首页）。
   */
  const goAnchor = (id: string) => (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setOpen(false)
    if (pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${id}`)
    }
  }

  const brand = (
    <a href="#top" className="flex items-center gap-2.5" onClick={goAnchor('top')}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-warm">
        <Blocks className="h-5 w-5" />
      </span>
      <span className="text-base font-semibold tracking-tight text-stone-800">
        {u.siteName}
      </span>
    </a>
  )

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-stone-200/70 bg-background/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      {/* 第一行：品牌 + 主导航 + 语言切换 / 移动端菜单 */}
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        {brand}

        {/* 桌面端主导航 + 语言切换 */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
          <button
            type="button"
            aria-pressed={githubActive}
            aria-label="Github"
            onClick={() => setGithubActive((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors',
              githubActive
                ? 'bg-[#F5EFE3] font-medium text-stone-900'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
            )}
          >
            <Github className="h-4 w-4" />
            Github
          </button>
          <div className="ml-3">
            <LangSwitch />
          </div>
        </nav>

        {/* 移动端抽屉菜单（保留分区锚点导航：小屏无左侧目录栏） */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="打开导航菜单">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-[#FFFDF8]">
              <SheetHeader>
                <SheetTitle className="text-left text-stone-800">{u.navPage}</SheetTitle>
                <SheetDescription className="text-left">
                  {u.navPageDesc}
                </SheetDescription>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1" aria-label={u.navPage}>
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={goAnchor(item.id)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900"
                  >
                    {navLabel(item, lang)}
                  </a>
                ))}
              </nav>
              <div className="mt-6 border-t border-stone-200 pt-4">
                <LangSwitch />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* 第二行：Github 子页签条（激活样式 = 底部主题色指示条） */}
      {githubActive && (
        <div className="border-t border-stone-200/60">
          <nav
            className="mx-auto flex h-11 w-full max-w-6xl items-stretch gap-1 px-5 sm:px-8"
            aria-label="Github 子页签"
          >
            <a
              href="#top"
              aria-current="page"
              onClick={goAnchor('top')}
              className="relative flex items-center px-3 text-sm font-medium text-stone-900 transition-colors hover:text-stone-950"
            >
              Agent Harness
              <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" />
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
