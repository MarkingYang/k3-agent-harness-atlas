import { Monitor, Moon, Settings2, Sun } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { useTheme, type Appearance } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const APPEARANCE_OPTIONS: {
  value: Appearance
  icon: typeof Sun
  zh: string
  en: string
}[] = [
  { value: 'light', icon: Sun, zh: '浅色', en: 'Light' },
  { value: 'dark', icon: Moon, zh: '深色', en: 'Dark' },
  { value: 'system', icon: Monitor, zh: '系统', en: 'System' },
]

/** 设置菜单内嵌的浅/深样式演示卡（与站点 token 同步） */
function ThemePreviewCard({
  mode,
  label,
}: {
  mode: 'light' | 'dark'
  label: string
}) {
  const dark = mode === 'dark'
  return (
    <div
      className="overflow-hidden rounded-lg border text-left"
      style={{
        borderColor: dark ? 'hsl(220 12% 26%)' : 'hsl(214 18% 86%)',
        background: dark ? 'hsl(222 22% 7%)' : 'hsl(210 24% 97%)',
        color: dark ? 'hsl(210 30% 96%)' : 'hsl(222 28% 12%)',
      }}
    >
      <div
        className="flex items-center justify-between border-b px-2.5 py-1.5"
        style={{
          borderColor: dark ? 'hsl(220 12% 22%)' : 'hsl(214 18% 88%)',
          background: dark ? 'hsl(222 18% 11%)' : 'hsl(210 28% 99%)',
        }}
      >
        <span className="text-[10px] font-semibold tracking-wide">{label}</span>
        <span
          className="rounded-full px-1.5 py-0.5 text-[9px] font-medium"
          style={{
            background: dark ? 'hsl(168 70% 48%)' : 'hsl(173 58% 32%)',
            color: dark ? 'hsl(222 30% 8%)' : 'hsl(166 40% 98%)',
          }}
        >
          CTA
        </span>
      </div>
      <div className="space-y-1.5 p-2.5">
        <p className="text-[11px] font-semibold leading-snug">Agent Harness</p>
        <p
          className="text-[10px] leading-relaxed"
          style={{ color: dark ? 'hsl(210 18% 80%)' : 'hsl(215 14% 36%)' }}
        >
          {dark ? '高对比辅文 · 青绿强调' : '冷灰纸面 · 青绿主色'}
        </p>
        <div className="flex gap-1 pt-0.5">
          {['#0D9488', '#3B82F6', '#A855F7'].map((c) => (
            <span
              key={c}
              className="h-1.5 flex-1 rounded-full"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * 外观设置：浅色 / 深色 / 跟随系统 + 样式演示
 */
export function AppearanceSettings() {
  const { lang } = useLanguage()
  const { appearance, setAppearance, resolved } = useTheme()
  const ActiveIcon = resolved === 'dark' ? Moon : Sun

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-border bg-paper shadow-none"
          aria-label={lang === 'zh' ? '外观设置' : 'Appearance'}
        >
          <Settings2 className="h-4 w-4 text-ink-soft" />
          <span className="sr-only">{lang === 'zh' ? '设置' : 'Settings'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-popover p-2">
        <DropdownMenuLabel className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <ActiveIcon className="h-3.5 w-3.5" />
          {lang === 'zh' ? '外观' : 'Appearance'}
        </DropdownMenuLabel>

        <div className="mb-2 mt-1 grid grid-cols-2 gap-1.5 px-1">
          <ThemePreviewCard mode="light" label={lang === 'zh' ? '浅色' : 'Light'} />
          <ThemePreviewCard mode="dark" label={lang === 'zh' ? '深色' : 'Dark'} />
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={appearance}
          onValueChange={(v) => setAppearance(v as Appearance)}
        >
          {APPEARANCE_OPTIONS.map((opt) => {
            const Icon = opt.icon
            return (
              <DropdownMenuRadioItem
                key={opt.value}
                value={opt.value}
                className={cn('cursor-pointer gap-2')}
              >
                <Icon className="h-4 w-4 text-primary" />
                {lang === 'zh' ? opt.zh : opt.en}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
