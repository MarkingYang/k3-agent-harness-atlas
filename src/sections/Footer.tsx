import { ArrowUpRight, Github } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { BrandMark } from '@/components/brand-mark'

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
 * 站点页脚 —— 品牌深色条（冷青黑底，浅/深主题下保持对比）
 */
export default function Footer() {
  const { lang } = useLanguage()
  const t = copy[lang]
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[hsl(220_14%_18%)] bg-[hsl(222_22%_8%)] text-[hsl(210_16%_72%)]">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-lg">
            <p className="flex items-center gap-2.5">
              <BrandMark className="h-8 w-8" />
              <span className="text-lg font-bold tracking-tight text-[hsl(210_30%_96%)]">
                {t.title}
              </span>
            </p>
            <p className="mt-4 text-sm leading-7 text-[hsl(210_16%_72%)]">{t.tagline}</p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <a
              href={SITE_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[hsl(220_14%_16%)] px-4 py-2.5 text-sm font-semibold text-[hsl(210_30%_96%)] transition hover:bg-teal-700"
            >
              <Github className="h-4 w-4" />
              {t.viewGithub}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
            </a>
            <p className="break-all text-xs text-[hsl(210_12%_58%)]">
              github.com/MarkingYang/k3-agent-harness-atlas
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-[hsl(220_12%_16%)] pt-6 text-xs text-[hsl(210_12%_58%)]">
          <p>
            © {year} · {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
