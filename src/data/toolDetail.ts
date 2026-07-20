/**
 * 工具详情页数据契约
 * 每个工具的详细介绍存放在 src/data/tools/{toolId}.ts，
 * 统一导出 ToolDetail 结构，由 src/pages/ToolDetail.tsx 渲染。
 */

export interface HowItWorksItem {
  /** 要点标题（≤12 字） */
  title: string
  /** 要点讲解（40-90 字） */
  desc: string
}

export interface QuickStart {
  /** 安装命令（来自官方文档，单行或简短多行） */
  install: string
  /** 最小可运行示例代码（5-20 行，基于官方 Quickstart 简化） */
  code: string
  /** 代码语言标识，如 python / bash / typescript */
  lang: string
  /** 可选备注（如"示例已简化，完整版见官方文档"） */
  note?: string
}

export interface UseCase {
  title: string
  desc: string
}

export interface ResourceLink {
  label: string
  url: string
}

/** 推荐延伸阅读（高质量第三方文章） */
export interface RecommendedArticle {
  /** 文章标题（保留原文语言） */
  title: string
  /** 作者或机构名 */
  author: string
  /** 来源平台，如 官方工程博客 / Substack / Medium / X(Twitter) */
  source: string
  url: string
  /** 一句话推荐理由（≤40 字） */
  note: string
}

export interface FaqItem {
  q: string
  a: string
}

export interface ToolDetail {
  /** 必须与 src/data/stack.ts 中 TOOLS 的 id 完全一致 */
  toolId: string
  /** 一句话定位（≤30 字，用于详情页副标题） */
  tagline: string
  /** 它解决什么问题（100-180 字段落） */
  problem: string
  /** 工作原理 / 架构要点（3-5 条） */
  architecture: HowItWorksItem[]
  /** 快速上手（安装 + 最小示例，命令需与官方文档一致） */
  quickStart: QuickStart
  /** 典型应用场景（3 条，每条 desc 40-80 字） */
  useCases: UseCase[]
  /** 生态与集成（4-8 个关键词 chips） */
  ecosystem: string[]
  /** 学习资源链接（3-5 个：GitHub、官方文档、教程等，URL 需真实有效） */
  resources: ResourceLink[]
  /** 推荐延伸阅读（3-4 篇高质量第三方文章，URL 必须经 FetchURL 验证可访问） */
  articles?: RecommendedArticle[]
  /** 常见问题（2-3 条，面向想采用该工具的工程师） */
  faq: FaqItem[]
}
