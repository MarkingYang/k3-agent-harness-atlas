import { ArrowRight, Compass, Layers, Route, Wrench } from 'lucide-react'
import { LAYERS, PRIORITY_META, TOOLS } from '@/data/stack'
import { SectionShell } from '@/components/stack/SectionShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

/** 9 层堆叠示意图的错落宽度（百分比） */
const BAR_WIDTHS = [100, 86, 94, 80, 92, 76, 90, 84, 96]

/**
 * 首屏 Hero —— 定位陈述 + 关键数据 + 9 层堆叠示意图
 */
export default function Hero() {
  const stats = [
    { icon: Wrench, value: TOOLS.length, label: '精选开源项目' },
    { icon: Layers, value: LAYERS.length, label: '大能力层' },
    { icon: Route, value: Object.keys(PRIORITY_META).length, label: '级优先级路线' },
  ]

  return (
    <SectionShell id="top" className="pt-10 sm:pt-16">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* 左侧：文案与行动 */}
        <div>
          <Badge
            variant="secondary"
            className="rounded-full border border-stone-200 bg-[#FFFDF8] px-3.5 py-1.5 text-xs font-medium text-stone-600 shadow-warm"
          >
            Agent 基础设施完全指南
          </Badge>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-stone-800 sm:text-5xl sm:leading-[1.15]">
            Agent Harness
            <br />
            <span className="text-primary">技术栈全景</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
            模型是大脑，Harness 是骨架与神经系统。把一个 LLM
            变成可靠的 Agent，需要一整套基础设施：运行时负责把任务做完，记忆系统沉淀经验，
            工具协议连接外部世界，可观测与评估守住质量底线，沙箱与网关保障安全与成本。
            本指南精选社区最具代表性的开源项目，按能力分层拆解，并给出一条循序渐进的优先级路线。
          </p>

          {/* 三个统计卡 */}
          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-stone-200/70 bg-[#FFFDF8] px-4 py-4 shadow-warm sm:px-5 sm:py-5"
              >
                <Icon className="h-4 w-4 text-stone-400" />
                <div className="mt-2 text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
                  {value}
                </div>
                <div className="mt-1 text-xs text-stone-500 sm:text-sm">{label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-xl shadow-warm">
              <a href="#map">
                开始探索架构地图
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl bg-[#FFFDF8]">
              <a href="#path">
                <Compass className="mr-1 h-4 w-4" />
                查看学习路径
              </a>
            </Button>
          </div>
        </div>

        {/* 右侧：9 层堆叠示意图 */}
        <div
          className="rounded-2xl border border-stone-200/70 bg-[#FFFDF8] p-5 shadow-warm-lg sm:p-6"
          aria-label="九大能力层堆叠示意图"
        >
          <div className="mb-4 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-stone-700">九大能力层</span>
            <span className="text-xs text-stone-400">自运行时 · 至应用平台</span>
          </div>
          <div className="flex flex-col gap-2">
            {LAYERS.map((layer, i) => (
              <div
                key={layer.id}
                className="flex items-center gap-3 overflow-hidden rounded-lg py-2 pl-1 pr-3 transition-transform duration-300 hover:translate-x-1"
                style={{ backgroundColor: layer.softBg, width: `${BAR_WIDTHS[i]}%` }}
                title={`${layer.name} · ${layer.tagline}`}
              >
                <span
                  className="h-6 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: layer.accent }}
                />
                <span className="truncate text-xs font-medium text-stone-700 sm:text-sm">
                  {layer.zhName}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-stone-500">
            自底向上：运行时让 Agent 动起来，平台层让能力变成产品 —— 每一层都有对应的开源参照实现。
          </p>
        </div>
      </div>
    </SectionShell>
  )
}
