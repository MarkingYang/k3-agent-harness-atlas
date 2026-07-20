import { ArrowUpRight, Github } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

const SITE_REPO = 'https://github.com/MarkingYang/k3-agent-harness-atlas'

const copy = {
  zh: {
    source: '开源',
    sourceDesc: '代码与内容开源，欢迎 Star、提 Issue 与贡献。',
    viewGithub: '查看 GitHub',
    copyright: '内容整理自各开源项目公开资料，仅供学习参考。',
  },
  en: {
    source: 'Open Source',
    sourceDesc: 'Code and content are open source. Star, file issues, or contribute.',
    viewGithub: 'View on GitHub',
    copyright: 'Compiled from public open-source materials for learning only.',
  },
} as const

/**
 * 站点页脚 —— GitHub 入口 + 版权行
 */
export default function Footer() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-stone-800 bg-stone-950 text-stone-400">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
              {t.source}
            </p>
            <p className="mt-3 text-sm leading-6 text-stone-400">{t.sourceDesc}</p>
            <p className="mt-2 break-all text-xs text-stone-600">
              github.com/MarkingYang/k3-agent-harness-atlas
            </p>
          </div>

          <a
            href={SITE_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-stone-100 px-4 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-white"
          >
            <Github className="h-4 w-4" />
            {t.viewGithub}
            <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
          </a>
        </div>

        <div className="mt-12 border-t border-stone-800/80 pt-6 text-xs text-stone-500">
          <p>
            © {year} Agent Harness · {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
