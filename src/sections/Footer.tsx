import { ArrowUpRight, Github, Network } from 'lucide-react'
import { NAV_ITEMS } from '@/data/stack'
import { useLanguage } from '@/hooks/use-language'

const SITE_REPO = 'https://github.com/MarkingYang/k3-agent-harness-atlas'
const SITE_URL = 'https://www.ainoteatlas.com'

const copy = {
  zh: {
    brand: 'Agent Harness',
    brandSub: '全景指南',
    tagline:
      '模型是大脑，Harness 是骨架与神经系统。本站把现代 Agent 基础设施拆成九层地图，带你建立清晰的学习路径与选型视角。',
    explore: '探索',
    source: '开源',
    sourceDesc: '代码与内容开源，欢迎 Star、提 Issue 与贡献。',
    viewGithub: '查看 GitHub',
    copyright: '内容整理自各开源项目公开资料，仅供学习参考。',
  },
  en: {
    brand: 'Agent Harness',
    brandSub: 'Stack Guide',
    tagline:
      'The model is the brain; the Harness is the skeleton and nervous system. Explore nine infrastructure layers and a clear learning path for modern Agent systems.',
    explore: 'Explore',
    source: 'Open Source',
    sourceDesc: 'Code and content are open source. Star, file issues, or contribute.',
    viewGithub: 'View on GitHub',
    copyright: 'Compiled from public open-source materials for learning only.',
  },
} as const

/**
 * 站点页脚 —— 品牌区 + 导航 + GitHub 入口
 */
export default function Footer() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-stone-800 bg-stone-950 text-stone-400">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_0.8fr_1fr] md:gap-10">
          {/* 品牌 */}
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600 shadow-lg shadow-amber-900/30">
                <Network className="h-5 w-5 text-white" />
              </span>
              <div>
                <p className="text-lg font-semibold tracking-tight text-stone-50">
                  {t.brand}
                </p>
                <p className="text-sm font-medium text-amber-500/90">{t.brandSub}</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-stone-400">
              {t.tagline}
            </p>
            <a
              href={SITE_URL}
              className="mt-4 inline-block text-xs font-medium tracking-wide text-stone-500 transition-colors hover:text-amber-400"
            >
              www.ainoteatlas.com
            </a>
          </div>

          {/* 导航 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
              {t.explore}
            </p>
            <nav
              aria-label="页脚导航"
              className="mt-4 flex flex-col gap-2.5 text-sm"
            >
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="w-fit text-stone-300 transition-colors hover:text-amber-300"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* GitHub */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
              {t.source}
            </p>
            <p className="mt-4 text-sm leading-6 text-stone-400">{t.sourceDesc}</p>
            <a
              href={SITE_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-white"
            >
              <Github className="h-4 w-4" />
              {t.viewGithub}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
            </a>
            <p className="mt-3 break-all text-xs text-stone-600">
              github.com/MarkingYang/k3-agent-harness-atlas
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-stone-800/80 pt-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Agent Harness · {t.brandSub}
          </p>
          <p className="sm:text-right">{t.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
