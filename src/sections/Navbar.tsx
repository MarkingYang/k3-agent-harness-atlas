import { useEffect, useState, type MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Github, Languages, Menu } from 'lucide-react'
import { NAV_ITEMS } from '@/data/stack'
import { useLanguage, type Lang } from '@/hooks/use-language'
import { UI, navLabel } from '@/i18n/ui'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { BrandMark } from '@/components/brand-mark'
import { AppearanceSettings } from '@/components/appearance-settings'
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

function LangSwitch() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="语言切换 / Language">
      <Languages className="h-4 w-4 text-muted-foreground" />
      <div className="flex items-center rounded-full border border-border bg-paper p-0.5">
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
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
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
      <BrandMark className="shadow-warm" />
      <span className="text-base font-semibold tracking-tight text-foreground">{u.siteName}</span>
    </a>
  )

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-border/70 bg-background/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        {brand}

        <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
          <button
            type="button"
            aria-pressed={githubActive}
            aria-label="Github"
            onClick={() => setGithubActive((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors',
              githubActive
                ? 'bg-paper-2 font-medium text-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Github className="h-4 w-4" />
            Github
          </button>
          <div className="ml-3 flex items-center gap-2">
            <LangSwitch />
            <AppearanceSettings />
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <AppearanceSettings />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="打开导航菜单">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-paper">
              <SheetHeader>
                <SheetTitle className="text-left text-foreground">{u.navPage}</SheetTitle>
                <SheetDescription className="text-left">{u.navPageDesc}</SheetDescription>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1" aria-label={u.navPage}>
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={goAnchor(item.id)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {navLabel(item, lang)}
                  </a>
                ))}
              </nav>
              <div className="mt-6 border-t border-border pt-4">
                <LangSwitch />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {githubActive && (
        <div className="border-t border-border/60">
          <nav
            className="mx-auto flex h-11 w-full max-w-6xl items-stretch gap-1 px-5 sm:px-8"
            aria-label="Github 子页签"
          >
            <a
              href="#top"
              aria-current="page"
              onClick={goAnchor('top')}
              className="relative flex items-center px-3 text-sm font-medium text-foreground transition-colors hover:text-primary"
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
