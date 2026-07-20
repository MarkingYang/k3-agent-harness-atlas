import { Fragment, type ReactNode } from 'react'
import {
  MessagesSquare,
  Brain,
  Database,
  Syringe,
  GitPullRequestArrow,
  RefreshCcw,
  ListChecks,
  CircleCheckBig,
  CircleX,
  MoveRight,
  Workflow,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { layerById, toolsByLayer } from '@/data/stack'
import { SectionShell } from '@/components/stack/SectionShell'
import { LayerHeader } from '@/components/stack/LayerHeader'
import { ToolCard } from '@/components/stack/ToolCard'

/* ------------------------------------------------------------------ */
/* 流程图示通用零件（本分区内部使用）                                    */
/* ------------------------------------------------------------------ */

interface FlowStep {
  icon: LucideIcon
  name: string
  desc: string
}

/** 流程步骤节点：图标 + 步骤名 + 一行说明 */
function StepNode({
  step,
  index,
  accent,
  softBg,
}: {
  step: FlowStep
  index: number
  accent: string
  softBg: string
}) {
  const Icon = step.icon
  return (
    <div className="w-full rounded-xl border border-stone-200/70 bg-white/80 px-4 py-4 text-center sm:w-44">
      <span
        className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: softBg, color: accent }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-2.5 font-mono text-[10px] uppercase tracking-widest text-stone-400">
        Step {index}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-stone-800">{step.name}</p>
      <p className="mt-1 text-xs leading-5 text-stone-500">{step.desc}</p>
    </div>
  )
}

/** 步骤间连接箭头：移动端纵向堆叠时旋转为向下，桌面端横向向右 */
function FlowArrow() {
  return (
    <div className="flex w-full justify-center sm:w-auto" aria-hidden="true">
      <MoveRight className="h-5 w-5 rotate-90 text-stone-300 sm:rotate-0" />
    </div>
  )
}

/** 流程图卡片外壳：暖白卡片 + 标题 + 引言 */
function FlowCard({
  icon: Icon,
  title,
  caption,
  accent,
  children,
}: {
  icon: LucideIcon
  title: string
  caption: string
  accent: string
  children: ReactNode
}) {
  return (
    <figure className="shadow-warm rounded-2xl border border-stone-200/80 bg-[#FFFDF8] p-6 sm:p-8">
      <figcaption>
        <p className="flex items-center gap-2 text-base font-bold text-stone-800">
          <Icon className="h-5 w-5" style={{ color: accent }} />
          {title}
        </p>
        <p className="mt-1.5 max-w-3xl text-xs leading-6 text-stone-500">{caption}</p>
      </figcaption>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{children}</div>
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/* 记忆子区块：长期记忆工作流程                                          */
/* ------------------------------------------------------------------ */

const MEMORY_STEPS: FlowStep[] = [
  { icon: MessagesSquare, name: '多轮对话', desc: 'Agent 与用户持续交互，沉淀原始对话素材' },
  { icon: Brain, name: '事实抽取', desc: 'LLM 从对话中提取关键事实与偏好' },
  { icon: Database, name: '向量存储', desc: '记忆条目去重、更新后向量化入库' },
  { icon: Syringe, name: '检索注入', desc: '按需召回相关记忆，注入当前 prompt' },
]

/* ------------------------------------------------------------------ */
/* 评估子区块：质量门禁流水线                                            */
/* ------------------------------------------------------------------ */

const EVAL_STEPS: FlowStep[] = [
  {
    icon: GitPullRequestArrow,
    name: 'Prompt / 模型变更',
    desc: '每次 prompt 调整或模型升级都视为一次变更',
  },
  { icon: RefreshCcw, name: '评测集重跑', desc: '在固定评测数据集上完整重跑 Agent' },
  { icon: ListChecks, name: '指标断言', desc: '校验 Faithfulness 等指标是否达标' },
]

/** 门禁分支配色：通过 olive 绿 / 阻断 wine 红（低饱和暖色系） */
const GATE_COLORS = {
  pass: { accent: '#55703F', softBg: '#EDF1E4' },
  block: { accent: '#8F4553', softBg: '#F6E9EA' },
} as const

/** 第 4 步：发布决策分支节点（通过 / 阻断 两色分支） */
function GateBranchNode() {
  return (
    <div className="w-full rounded-xl border border-stone-200/70 bg-white/80 px-4 py-4 sm:w-60">
      <p className="text-center font-mono text-[10px] uppercase tracking-widest text-stone-400">
        Step 4 · 发布决策
      </p>
      <div className="mt-2.5 space-y-2">
        <div
          className="flex items-center gap-2.5 rounded-lg px-3 py-2"
          style={{ backgroundColor: GATE_COLORS.pass.softBg }}
        >
          <CircleCheckBig
            className="h-5 w-5 shrink-0"
            style={{ color: GATE_COLORS.pass.accent }}
          />
          <div>
            <p className="text-xs font-semibold" style={{ color: GATE_COLORS.pass.accent }}>
              全部达标 → 发布
            </p>
            <p className="text-[11px] leading-4 text-stone-500">变更合入，新版本上线</p>
          </div>
        </div>
        <div
          className="flex items-center gap-2.5 rounded-lg px-3 py-2"
          style={{ backgroundColor: GATE_COLORS.block.softBg }}
        >
          <CircleX className="h-5 w-5 shrink-0" style={{ color: GATE_COLORS.block.accent }} />
          <div>
            <p className="text-xs font-semibold" style={{ color: GATE_COLORS.block.accent }}>
              指标回退 → 阻断
            </p>
            <p className="text-[11px] leading-4 text-stone-500">拦截发布，修复后重新评测</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 分区装配                                                            */
/* ------------------------------------------------------------------ */

export default function MemoryEvalSection() {
  const memoryLayer = layerById('memory')
  const evalLayer = layerById('evaluation')
  const memoryTools = toolsByLayer('memory')
  const evalTools = toolsByLayer('evaluation')

  return (
    <SectionShell id="memory">
      {/* —— 子区块一：记忆与知识 —— */}
      <LayerHeader layer={memoryLayer} index={4} />

      <FlowCard
        icon={Workflow}
        title="长期记忆工作流程"
        caption="以 Mem0 为代表的长期记忆层，把一次性对话转化为可跨会话复用的经验：对话产生事实，事实入库，下一次对话按需召回。"
        accent={memoryLayer.accent}
      >
        {MEMORY_STEPS.map((step, i) => (
          <Fragment key={step.name}>
            {i > 0 && <FlowArrow />}
            <StepNode
              step={step}
              index={i + 1}
              accent={memoryLayer.accent}
              softBg={memoryLayer.softBg}
            />
          </Fragment>
        ))}
      </FlowCard>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {memoryTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {/* —— 子区块二：评估与测试 —— */}
      <div className="mt-16">
        <LayerHeader layer={evalLayer} index={5} />

        <FlowCard
          icon={ShieldCheck}
          title="质量门禁流水线"
          caption="把 Agent 的每次变更当作一次代码提交：重跑评测集、断言质量指标，用工程化门禁替代「感觉不错」的直觉判断。"
          accent={evalLayer.accent}
        >
          {EVAL_STEPS.map((step, i) => (
            <Fragment key={step.name}>
              {i > 0 && <FlowArrow />}
              <StepNode
                step={step}
                index={i + 1}
                accent={evalLayer.accent}
                softBg={evalLayer.softBg}
              />
            </Fragment>
          ))}
          <FlowArrow />
          <GateBranchNode />
        </FlowCard>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {evalTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
