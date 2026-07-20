import {
  ArrowLeftRight,
  ArrowRight,
  Brain,
  Flag,
  History,
  Play,
  UserCheck,
  Workflow,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { layerById, toolsByLayer } from '@/data/stack'
import { LayerHeader } from '@/components/stack/LayerHeader'
import { SectionShell } from '@/components/stack/SectionShell'
import { ToolCard } from '@/components/stack/ToolCard'
import { cn } from '@/lib/utils'
import { useLayerSoftBackground } from '@/lib/layer-surface'

/** 状态机流程图节点 —— accent 描边的圆角小框 */
function FlowNode({
  icon: Icon,
  label,
  sub,
  dashed = false,
  accent,
  softBg,
}: {
  icon: LucideIcon
  label: string
  /** 副标注（如 Human-in-the-loop） */
  sub?: string
  /** 虚线框：表示可选的人工介入节点 */
  dashed?: boolean
  accent: string
  softBg: string
}) {
  const soft = useLayerSoftBackground(softBg, accent)
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold text-foreground sm:text-sm',
        dashed && 'border-dashed',
      )}
      style={{
        borderColor: accent,
        backgroundColor: dashed ? 'hsl(var(--paper))' : soft,
      }}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
      <span>{label}</span>
      {sub && (
        <span className="font-mono text-[10px] font-normal" style={{ color: accent }}>
          {sub}
        </span>
      )}
    </div>
  )
}

/** 节点间的单向箭头 */
function FlowArrow() {
  return <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/50" aria-hidden />
}

/**
 * 分区：智能体运行时 + 多智能体协作
 * 锚点 id="runtime"，与 NAV_ITEMS 契约一致
 */
export default function RuntimeSection() {
  const runtimeLayer = layerById('runtime')
  const multiAgentLayer = layerById('multi-agent')
  const runtimeTools = toolsByLayer('runtime')
  const multiAgentTools = toolsByLayer('multi-agent')

  return (
    <SectionShell id="runtime">
      {/* ① 运行时层头部 */}
      <LayerHeader layer={runtimeLayer} index={1} />

      {/* ② 运行时工具卡片 */}
      <div className="grid gap-6 md:grid-cols-2">
        {runtimeTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {/* ③ 运行时核心机制：状态机流程讲解条 */}
      <div className="shadow-warm mt-10 rounded-2xl border border-border/80 bg-paper p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <Workflow className="h-5 w-5" style={{ color: runtimeLayer.accent }} />
          <h4 className="text-lg font-bold tracking-tight text-foreground">运行时核心机制</h4>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
          一次 Agent 执行的本质，是在一张状态图上流转：模型推理决定下一步动作，工具调用改变外部世界，必要时暂停等待人的裁决。
        </p>

        {/* 状态机流程：开始 → LLM 推理 ⇄ 工具调用 → 人工审批 → 结束 */}
        <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-3">
          <FlowNode
            icon={Play}
            label="开始"
            accent={runtimeLayer.accent}
            softBg={runtimeLayer.softBg}
          />
          <FlowArrow />
          <FlowNode
            icon={Brain}
            label="LLM 推理"
            accent={runtimeLayer.accent}
            softBg={runtimeLayer.softBg}
          />
          <span className="flex flex-col items-center px-1">
            <ArrowLeftRight
              className="h-4 w-4"
              style={{ color: runtimeLayer.accent }}
              aria-label="推理与工具调用双向循环"
            />
            <span className="mt-0.5 text-[10px] text-muted-foreground">多轮循环</span>
          </span>
          <FlowNode
            icon={Wrench}
            label="工具调用"
            accent={runtimeLayer.accent}
            softBg={runtimeLayer.softBg}
          />
          <FlowArrow />
          <FlowNode
            icon={UserCheck}
            label="人工审批"
            sub="Human-in-the-loop"
            dashed
            accent={runtimeLayer.accent}
            softBg={runtimeLayer.softBg}
          />
          <FlowArrow />
          <FlowNode
            icon={Flag}
            label="结束"
            accent={runtimeLayer.accent}
            softBg={runtimeLayer.softBg}
          />
        </div>

        <p className="mt-6 flex items-start gap-2 border-t border-dashed border-border pt-4 text-xs leading-6 text-muted-foreground">
          <History
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
            style={{ color: runtimeLayer.accent }}
          />
          Checkpoint 让每个节点执行后自动快照，崩溃可恢复。
        </p>
      </div>

      {/* ④ 多智能体协作层头部 */}
      <div className="mt-20">
        <LayerHeader layer={multiAgentLayer} index={2} />
      </div>

      {/* ⑤ 过渡文案 + AutoGen 卡片 */}
      <p className="mx-auto mb-8 max-w-3xl text-sm leading-7 text-muted-foreground">
        当任务超出单个 Agent 的能力边界，一种自然的思路是让多个具备不同角色与工具的
        Agent 通过对话协作：相互提问、复核与分工。此时「谁发言、谁决策、何时终止」都成为需要显式设计的工程问题。
        AutoGen 正是这一「对话驱动协作」范式的代表实现。
      </p>
      <div className="mx-auto max-w-3xl">
        {multiAgentTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </SectionShell>
  )
}
