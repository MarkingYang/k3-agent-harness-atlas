import type { ReactNode } from 'react'
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpDown,
  Bot,
  Container,
  Database,
  FlaskConical,
  FolderOpen,
  Globe,
  Package,
  Play,
  PlugZap,
  RefreshCw,
  Terminal,
  Waypoints,
} from 'lucide-react'
import { layerById, toolsByLayer } from '@/data/stack'
import { LayerHeader } from '@/components/stack/LayerHeader'
import { SectionShell } from '@/components/stack/SectionShell'
import { ToolCard } from '@/components/stack/ToolCard'

/** 示意条外壳 —— 居中标题 + 可选底部小字注解 */
function DiagramStrip({
  title,
  caption,
  accent,
  children,
}: {
  title: string
  caption?: string
  accent: string
  children: ReactNode
}) {
  return (
    <figure className="shadow-warm rounded-2xl border border-stone-200/80 bg-[#FFFDF8] px-5 py-6 sm:px-8 sm:py-8">
      <figcaption className="mb-7 flex items-center justify-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
        <span className="font-mono text-xs font-medium tracking-widest text-stone-500">
          {title}
        </span>
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
      </figcaption>
      {children}
      {caption && (
        <p className="mt-7 text-center text-xs tracking-wide text-stone-500">{caption}</p>
      )}
    </figure>
  )
}

/** 单向箭头 —— 桌面横向、移动端竖向 */
function FlowArrow() {
  return (
    <>
      <ArrowDown className="h-5 w-5 shrink-0 text-stone-400 md:hidden" aria-hidden />
      <ArrowRight className="hidden h-5 w-5 shrink-0 text-stone-400 md:block" aria-hidden />
    </>
  )
}

/** 双向箭头 —— 桌面横向、移动端竖向 */
function BiArrow() {
  return (
    <>
      <ArrowUpDown className="h-5 w-5 shrink-0 text-stone-400 md:hidden" aria-hidden />
      <ArrowLeftRight className="hidden h-5 w-5 shrink-0 text-stone-400 md:block" aria-hidden />
    </>
  )
}

/** 示意条中的角色方块（Agent / 结果等） */
function NodeBox({
  icon: Icon,
  title,
  sub,
  accent,
  softBg,
}: {
  icon: typeof Bot
  title: string
  sub: string
  accent: string
  softBg: string
}) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-2xl border px-5 py-4"
      style={{ backgroundColor: softBg, borderColor: `${accent}33` }}
    >
      <Icon className="h-6 w-6 shrink-0" style={{ color: accent }} />
      <div>
        <p className="text-sm font-bold text-stone-800">{title}</p>
        <p className="mt-0.5 text-[11px] text-stone-500">{sub}</p>
      </div>
    </div>
  )
}

/** 基础设施分区：模型网关 / 工具协议 / 沙箱执行 */
export default function InfraSection() {
  const gateway = layerById('gateway')
  const protocol = layerById('protocol')
  const sandbox = layerById('sandbox')

  return (
    <SectionShell id="infra" tinted>
      {/* ① 模型网关 */}
      <div>
        <LayerHeader layer={gateway} index={6} />
        <DiagramStrip title="统一模型路由" accent={gateway.accent}>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-5">
            {/* 左：模型列表 */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:flex-col md:items-stretch">
              {['GPT', 'Claude', 'Gemini', 'DeepSeek'].map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-stone-300 bg-white px-3 py-1 text-center font-mono text-xs font-medium text-stone-600"
                >
                  {m}
                </span>
              ))}
            </div>
            <FlowArrow />
            {/* 中：网关 */}
            <div
              className="flex flex-col items-center rounded-2xl px-7 py-5 text-center"
              style={{ backgroundColor: gateway.accent }}
            >
              <Waypoints className="h-5 w-5 text-white/80" />
              <p className="mt-1.5 text-sm font-bold text-white">LiteLLM 网关</p>
              <p className="mt-1 text-[11px] text-white/80">路由 · 重试 · 降级 · 计费</p>
            </div>
            <FlowArrow />
            {/* 右：Agent */}
            <NodeBox
              icon={Bot}
              title="Agent"
              sub="一套代码，任意模型"
              accent={gateway.accent}
              softBg={gateway.softBg}
            />
          </div>
        </DiagramStrip>
        <div className="mx-auto mt-8 max-w-3xl">
          {toolsByLayer('gateway').map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {/* ② 工具协议 */}
      <div className="mt-16">
        <LayerHeader layer={protocol} index={7} />
        <DiagramStrip title="MCP 连接拓扑" caption="一次实现、处处接入" accent={protocol.accent}>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-5">
            {/* Agent / Host */}
            <NodeBox
              icon={Bot}
              title="Agent / Host"
              sub="发起工具调用"
              accent={protocol.accent}
              softBg={protocol.softBg}
            />
            <BiArrow />
            {/* MCP Client */}
            <div
              className="flex flex-col items-center rounded-2xl px-6 py-4 text-center"
              style={{ backgroundColor: protocol.accent }}
            >
              <PlugZap className="h-5 w-5 text-white/80" />
              <p className="mt-1.5 text-sm font-bold text-white">MCP Client</p>
              <p className="mt-0.5 text-[11px] text-white/80">协议翻译与调度</p>
            </div>
            <BiArrow />
            {/* MCP Servers */}
            <div className="flex flex-row flex-wrap items-center justify-center gap-2 md:flex-col md:items-stretch">
              {[
                { icon: FolderOpen, label: '文件系统' },
                { icon: Database, label: '数据库' },
                { icon: Globe, label: '外部 API' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-xl border border-stone-200 bg-[#FFFDF8] px-3.5 py-2"
                >
                  <Icon className="h-4 w-4 shrink-0" style={{ color: protocol.accent }} />
                  <div>
                    <p className="font-mono text-[10px] uppercase leading-tight text-stone-400">
                      MCP Server
                    </p>
                    <p className="text-xs font-medium leading-tight text-stone-700">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DiagramStrip>
        <div className="mx-auto mt-8 max-w-3xl">
          {toolsByLayer('protocol').map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {/* ③ 沙箱执行 */}
      <div className="mt-16">
        <LayerHeader layer={sandbox} index={8} />
        <DiagramStrip title="隔离执行闭环" caption="用完即毁、互不污染" accent={sandbox.accent}>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-5">
            {/* Agent 生成代码 */}
            <NodeBox
              icon={Bot}
              title="Agent"
              sub="生成代码"
              accent={sandbox.accent}
              softBg={sandbox.softBg}
            />
            <FlowArrow />
            {/* 沙箱容器 */}
            <div
              className="rounded-2xl border-2 border-dashed px-5 py-4"
              style={{ borderColor: `${sandbox.accent}66` }}
            >
              <p
                className="mb-3 flex items-center justify-center gap-1.5 text-xs font-semibold"
                style={{ color: sandbox.accent }}
              >
                <Container className="h-3.5 w-3.5" />
                沙箱容器
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { icon: Play, label: '运行代码' },
                  { icon: Package, label: '安装依赖' },
                  { icon: FlaskConical, label: '执行测试' },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600"
                  >
                    <Icon className="h-3 w-3" style={{ color: sandbox.accent }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <FlowArrow />
            {/* 执行结果 */}
            <div className="flex items-center gap-2.5 rounded-2xl border border-stone-200 bg-[#FFFDF8] px-5 py-4">
              <Terminal className="h-6 w-6 shrink-0" style={{ color: sandbox.accent }} />
              <div>
                <p className="text-sm font-bold text-stone-800">执行结果</p>
                <p className="mt-0.5 text-[11px] text-stone-500">日志 · 输出 · 测试报告</p>
              </div>
            </div>
          </div>
          {/* 循环回传 */}
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-stone-500">
            <RefreshCw className="h-3.5 w-3.5" style={{ color: sandbox.accent }} />
            结果回传 Agent，驱动自我修正闭环
          </p>
        </DiagramStrip>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {toolsByLayer('sandbox').map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
