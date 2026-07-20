import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'zh' | 'en'

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
}

const LangContext = createContext<LangContextValue>({
  lang: 'zh',
  setLang: () => {},
  toggle: () => {},
})

const STORAGE_KEY = 'ahl-lang'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'zh',
  )
  const setLang = (l: Lang) => {
    setLangState(l)
    window.localStorage.setItem(STORAGE_KEY, l)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en'
    }
  }
  const toggle = () => setLang(lang === 'zh' ? 'en' : 'zh')

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [lang])

  return <LangContext.Provider value={{ lang, setLang, toggle }}>{children}</LangContext.Provider>
}

export function useLanguage(): LangContextValue {
  return useContext(LangContext)
}

/** 详情页 UI 标签双语对照 */
export const DETAIL_LABELS: Record<Lang, Record<string, string>> = {
  zh: {
    problem: '它解决什么问题',
    howItWorks: '工作原理',
    architecture: '架构图',
    sequence: '时序图',
    dataFlow: '数据流设计',
    extension: '扩展机制',
    challenges: '技术难点',
    positioning: '生态定位',
    landscape: '技术版图',
    competitors: '竞品分析',
    versionHistory: '版本历史',
    starTrend: 'Star 趋势',
    quickStart: '快速上手',
    keyConcepts: '关键概念',
    useCases: '典型应用场景',
    integrations: '生态与集成',
    faq: '常见问题',
    resources: '学习资源',
    officialResources: '官方资源',
    reading: '延伸阅读',
    mechanism: '核心机制深潜',
    sourceLayout: '源码结构',
    tradeoffs: '关键设计取舍',
    production: '生产实践要点',
    toc: '本页目录',
    related: '同层相关项目',
    prev: '上一项目',
    next: '下一项目',
    asOf: '数据截至',
    sourceOss: '数据来源：OSS Insight（月度）',
    sourceGh: '数据来源：GitHub Releases',
  },
  en: {
    problem: 'The Problem It Solves',
    howItWorks: 'How It Works',
    architecture: 'Architecture',
    sequence: 'Sequence Diagram',
    dataFlow: 'Data Flow',
    extension: 'Extension Points',
    challenges: 'Technical Challenges',
    positioning: 'Ecosystem Position',
    landscape: 'Technology Landscape',
    competitors: 'Competitive Analysis',
    versionHistory: 'Version History',
    starTrend: 'Star Trend',
    quickStart: 'Quick Start',
    keyConcepts: 'Key Concepts',
    useCases: 'Use Cases',
    integrations: 'Ecosystem & Integrations',
    faq: 'FAQ',
    resources: 'Resources',
    officialResources: 'Official Resources',
    reading: 'Further Reading',
    mechanism: 'Core Mechanisms in Depth',
    sourceLayout: 'Source Code Layout',
    tradeoffs: 'Key Design Trade-offs',
    production: 'Production Notes',
    toc: 'On This Page',
    related: 'Related Projects',
    prev: 'Previous',
    next: 'Next',
    asOf: 'Data as of',
    sourceOss: 'Source: OSS Insight (monthly)',
    sourceGh: 'Source: GitHub Releases',
  },
}
