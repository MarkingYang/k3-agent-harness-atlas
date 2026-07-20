import { ArrowUpRight, Github, Network } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

const SITE_REPO = 'https://github.com/MarkingYang/k3-agent-harness-atlas'

const copy = {
  zh: {
    title: 'Agent Harness 技术栈全景指南',
    tagline: '模型是大脑，Harness 是骨架与神经系统。',
    viewGithub: '查看 GitHub',
    copyright: '内容整理自各开源项目公开资料，仅供学习参考。',
  },
  en: {
    title: 'Agent Harness Stack Guide',
    tagline: 'The model is the brain; the Harness is the skeleton and nervous system.',
    viewGithub: 'View on GitHub',
    copyright: 'Compiled from public open-source materials for learning only.',
  },
} as const

/**
 * 站点页脚 —— 品牌标语 + GitHub
 */
export default function Footer() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-stone-800 bg-stone-950 text-stone-400">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-lg">
            <p className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-600">
                <Network className="h-4 w-4 text-white" />
              </span>
              <span className="text-lg font-bold tracking-tight text-stone-100">
                {t.title}
              </span>
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-400">{t.tagline}</p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
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
            <p className="break-all text-xs text-stone-600">
              github.com/MarkingYang/k3-agent-harness-atlas
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-800/80 pt-6 text-xs text-stone-500">
          <p>
            © {year} · {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
