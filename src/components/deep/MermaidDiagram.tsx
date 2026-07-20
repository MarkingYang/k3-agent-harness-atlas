import { useCallback, useEffect, useId, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { AlertTriangle, Check, Pencil, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'base',
})

/** 全局计数器，保证 mermaid.render 的 id 每次唯一（重复 id 会导致渲染冲突） */
let renderCounter = 0

const FONT_FAMILY =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'

/** 缩放倍率上下限 */
const MIN_SCALE = 0.1
const MAX_SCALE = 4
/** 初始自适应时的留白系数 */
const FIT_PADDING = 0.94
/** 缩放分档（下拉档位；推荐比例吸附到最近档位；按钮步进到相邻档位） */
const SCALE_TIERS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const
/** 判定「当前比例落在某档位」的容差 */
const TIER_EPSILON = 0.005
/** 拖拽进入平移的位移阈值（px），避免点击/轻微触碰被误判为拖动 */
const PAN_THRESHOLD = 4

type DiagramMode = 'light' | 'dark'

/** 每次渲染前拼接的 %%init%% 暖色主题指令（导出供 scripts/verify-label-render.ts 复用，避免漂移） */
export function withTheme(
  source: string,
  accent: string,
  softBg: string,
  mode: DiagramMode = 'light',
): string {
  const dark = mode === 'dark'
  const ink = dark ? '#E8E0D4' : '#44403C'
  const inkSoft = dark ? '#C4B8A8' : '#57534E'
  const init = {
    theme: 'base',
    themeVariables: {
      // core 节点：accent 实底白字
      primaryColor: accent,
      primaryBorderColor: accent,
      primaryTextColor: '#FFFFFF',
      // 连线与主文本
      lineColor: dark ? '#9C8F80' : '#78716C',
      textColor: ink,
      // 分组框：浅色暖纸 / 深色暖褐
      clusterBkg: dark ? '#2A221C' : '#F5F1E9',
      clusterBorder: dark ? '#4A3F36' : '#D8CFC2',
      // 边标签底
      edgeLabelBackground: dark ? '#1F1814' : '#FFFDF8',
      fontFamily: FONT_FAMILY,
      // 时序图变量（与整体暖色一致）
      actorBkg: accent,
      actorBorder: accent,
      actorBorders: accent,
      actorTextColor: '#FFFFFF',
      actorLineColor: dark ? '#8A7D6E' : '#A8A29E',
      signalColor: inkSoft,
      signalTextColor: ink,
      labelBoxBkgColor: softBg,
      labelBoxBorderColor: accent,
      labelTextColor: ink,
      loopTextColor: ink,
      noteBkgColor: dark ? '#3A2E18' : '#FDF8EC',
      noteBorderColor: dark ? '#E0A03A' : '#9C6B1E',
      noteTextColor: ink,
      activationBkgColor: softBg,
      activationBorderColor: accent,
    },
    flowchart: { curve: 'basis', nodeSpacing: 50, rankSpacing: 60 },
  }
  return `%%{init: ${JSON.stringify(init)}}%%\n${source}`
}

/** 渲染成功后注入 svg 的静态样式；默认 light，供校验脚本断言边标签覆盖 */
export function svgStaticStyle(mode: DiagramMode = 'light'): string {
  const ink = mode === 'dark' ? '#E8E0D4' : '#44403C'
  const cluster = mode === 'dark' ? '#D6CABB' : '#57534E'
  return [
    '.nodeLabel{font-weight:600}',
    '.edgePath .path{stroke-width:2px}',
    '.cluster rect{rx:12px}',
    '.edgeLabel{border-radius:6px}',
    '.messageLine0,.messageLine1{stroke-width:1.5px}',
    '.note{rx:8px}',
    // 边标签文字颜色覆盖：mermaid 的 #id .label{color} 规则派生自 primaryTextColor(#FFFFFF)，
    // 白字压白底（edgeLabelBackground）导致边标签隐形；mermaid 规则带 #id 前缀，必须 !important
    `.edgeLabel,.edgeLabel p,.edgeLabel span{color:${ink}!important}`,
    `.edgeLabel text,.edgeLabel tspan{fill:${ink}!important}`,
    // cluster 标题色：保证浅/深底上的可读性
    `.cluster-label span{color:${cluster}!important}`,
    `.cluster-label text{fill:${cluster}!important}`,
  ].join('')
}

/** @deprecated 校验脚本兼容：固定为浅色覆盖片段 */
export const SVG_STATIC_STYLE = svgStaticStyle('light')

type Status = 'loading' | 'done' | 'error'
type Mode = 'preview' | 'edit'

interface MermaidDiagramProps {
  source: string
  accent: string
  softBg: string
  note?: string
  className?: string
  /** 视图持久化键：视图存于 localStorage 的 `mmd-view:{storageKey}` */
  storageKey: string
}

interface ViewState {
  /** 缩放倍率（相对 svg 自然尺寸 viewBox） */
  k: number
  /** 平移偏移（容器坐标系，px） */
  x: number
  y: number
  /** 图形自然宽度（viewBox 宽） */
  gw: number
  /** 图形自然高度（viewBox 高） */
  gh: number
}

interface StoredView {
  k: number
  x: number
  y: number
}

/** 从渲染出的 svg 解析自然宽高（优先 viewBox，退化到 width/height 属性） */
function parseSvgNaturalSize(el: SVGSVGElement): { w: number; h: number } {
  const vb = el.getAttribute('viewBox')
  if (vb) {
    const parts = vb.trim().split(/[\s,]+/).map(Number)
    if (parts.length === 4 && parts.every((n) => Number.isFinite(n)) && parts[2] > 0 && parts[3] > 0) {
      return { w: parts[2], h: parts[3] }
    }
  }
  const w = Number(el.getAttribute('width'))
  const h = Number(el.getAttribute('height'))
  if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) return { w, h }
  return { w: 800, h: 600 }
}

/** 距目标比例最近的分档值 */
function nearestTier(k: number): number {
  let best: number = SCALE_TIERS[0]
  let bestDist = Math.abs(k - best)
  for (const t of SCALE_TIERS) {
    const d = Math.abs(k - t)
    if (d < bestDist) {
      best = t
      bestDist = d
    }
  }
  return best
}

/** 读取持久化视图（容错：任何异常都视为无存储） */
function readStoredView(storageKey: string): StoredView | null {
  try {
    const raw = window.localStorage.getItem(`mmd-view:${storageKey}`)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredView>
    if (
      typeof parsed.k === 'number' &&
      typeof parsed.x === 'number' &&
      typeof parsed.y === 'number' &&
      Number.isFinite(parsed.k) &&
      Number.isFinite(parsed.x) &&
      Number.isFinite(parsed.y)
    ) {
      return {
        k: Math.min(MAX_SCALE, Math.max(MIN_SCALE, parsed.k)),
        x: parsed.x,
        y: parsed.y,
      }
    }
  } catch {
    // localStorage 不可用或数据损坏：按无存储处理
  }
  return null
}

/** 写入持久化视图（容错：隐私模式等场景下静默失败） */
function writeStoredView(storageKey: string, view: StoredView): void {
  try {
    window.localStorage.setItem(`mmd-view:${storageKey}`, JSON.stringify(view))
  } catch {
    // 忽略写入失败
  }
}

/**
 * Mermaid 渲染器 —— 架构图 / 数据流图 / 技术版图 / 时序图通用
 * 双模式交互：
 * - 预览模式（默认）：仅拖拽平移（≥4px 阈值），禁止一切缩放，页面滚动不被拦截
 * - 编辑模式：滚轮 / 按钮 / 分档下拉调整比例 + 拖拽平移，「保存」写入 localStorage，「取消」还原
 * 无存储视图时以「推荐比例」（auto-fit 吸附最近分档）居中展示；有存储则保持用户喜好
 */
export function MermaidDiagram({ source, accent, softBg, note, className, storageKey }: MermaidDiagramProps) {
  const { resolved: themeMode } = useTheme()
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '')
  const viewportRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const svgHostRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<ViewState>({ k: 1, x: 0, y: 0, gw: 0, gh: 0 })
  /** 是否存在用户已保存的视图（决定 ResizeObserver 是否重新自适应） */
  const hasStoredViewRef = useRef(false)
  /** 进入编辑模式时的视图快照（取消时还原） */
  const editBackupRef = useRef<StoredView | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string>('')
  const [mode, setMode] = useState<Mode>('preview')
  /** 当前比例（仅 k 变化时触发重渲染，拖拽平移不触发） */
  const [displayK, setDisplayK] = useState(1)
  const displayKRef = useRef(1)
  /** 推荐比例（auto-fit 吸附到最近分档） */
  const [recommendedTier, setRecommendedTier] = useState<number | null>(null)

  /** 把 viewRef 中的 k/x/y 直接写入 DOM（高频操作，不走 setState；k 变化时同步 displayK） */
  const applyView = useCallback(() => {
    const { k, x, y } = viewRef.current
    if (stageRef.current) {
      stageRef.current.style.transform = `translate(${x}px, ${y}px) scale(${k})`
    }
    if (Math.abs(k - displayKRef.current) > 0.0005) {
      displayKRef.current = k
      setDisplayK(k)
    }
  }, [])

  /** 计算 auto-fit 比例并吸附到最近分档，作为「推荐比例」 */
  const computeRecommended = useCallback((): number | null => {
    const vp = viewportRef.current
    const view = viewRef.current
    if (!vp || view.gw <= 0 || view.gh <= 0) return null
    const cw = vp.clientWidth
    const ch = vp.clientHeight
    if (cw <= 0 || ch <= 0) return null
    const fitK = Math.min(cw / view.gw, ch / view.gh) * FIT_PADDING
    const tier = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nearestTier(fitK)))
    setRecommendedTier(tier)
    return tier
  }, [])

  /** 以推荐比例居中展示（无存储视图时的初始/重排布局） */
  const fitToRecommended = useCallback(() => {
    const vp = viewportRef.current
    const view = viewRef.current
    if (!vp || view.gw <= 0 || view.gh <= 0) return
    const tier = computeRecommended()
    if (tier === null) return
    view.k = tier
    view.x = (vp.clientWidth - view.gw * tier) / 2
    view.y = (vp.clientHeight - view.gh * tier) / 2
    applyView()
  }, [applyView, computeRecommended])

  /** 以容器内某点为锚点缩放（锚点在图形坐标系中的位置保持不动） */
  const zoomAt = useCallback(
    (anchorX: number, anchorY: number, factor: number) => {
      const view = viewRef.current
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, view.k * factor))
      if (next === view.k) return
      const ratio = next / view.k
      view.x = anchorX - (anchorX - view.x) * ratio
      view.y = anchorY - (anchorY - view.y) * ratio
      view.k = next
      applyView()
    },
    [applyView],
  )

  /** 以画布中心为锚点切到指定比例 */
  const zoomToScaleAtCenter = useCallback(
    (target: number) => {
      const vp = viewportRef.current
      if (!vp) return
      const view = viewRef.current
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, target))
      if (next === view.k) return
      zoomAt(vp.clientWidth / 2, vp.clientHeight / 2, next / view.k)
    },
    [zoomAt],
  )

  /** 步进到相邻分档（direction > 0 放大，< 0 缩小；已到端点则无操作） */
  const stepTier = useCallback(
    (direction: 1 | -1) => {
      const k = viewRef.current.k
      const target =
        direction > 0
          ? SCALE_TIERS.find((t) => t > k + TIER_EPSILON)
          : [...SCALE_TIERS].reverse().find((t) => t < k - TIER_EPSILON)
      if (target === undefined) return
      zoomToScaleAtCenter(target)
    },
    [zoomToScaleAtCenter],
  )

  // mermaid 渲染：source / 主题 / 存储键变化时重渲染，成功后解析自然尺寸并恢复视图
  useEffect(() => {
    let cancelled = false
    const renderId = `mmd-${rawId}-${++renderCounter}`

    setStatus('loading')
    setError('')

    mermaid
      .render(renderId, withTheme(source, accent, softBg, themeMode))
      .then(({ svg }) => {
        if (cancelled || !svgHostRef.current) return
        svgHostRef.current.innerHTML = svg
        const el = svgHostRef.current.querySelector('svg')
        if (el) {
          const { w, h } = parseSvgNaturalSize(el)
          // 显式固定自然尺寸，交给外层 stage 统一缩放
          el.setAttribute('width', String(w))
          el.setAttribute('height', String(h))
          el.style.maxWidth = 'none'
          el.style.width = `${w}px`
          el.style.height = `${h}px`
          el.style.display = 'block'
          // 注入纯静态样式（字重 / 边线宽 / 分组框圆角等）
          const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style')
          styleEl.textContent = svgStaticStyle(themeMode)
          el.insertBefore(styleEl, el.firstChild)
          viewRef.current.gw = w
          viewRef.current.gh = h
        }
        if (stageRef.current) stageRef.current.style.visibility = 'visible'
        setStatus('done')
        // 视图恢复：优先用户存储视图；无存储则用推荐比例居中
        const stored = readStoredView(storageKey)
        hasStoredViewRef.current = stored !== null
        if (stored) {
          viewRef.current.k = stored.k
          viewRef.current.x = stored.x
          viewRef.current.y = stored.y
          computeRecommended()
          applyView()
        } else {
          fitToRecommended()
        }
      })
      .catch((err: unknown) => {
        // mermaid 失败时可能往 body 注入错误元素，顺手清理
        document.getElementById(`d${renderId}`)?.remove()
        document.getElementById(renderId)?.remove()
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
        setStatus('error')
      })

    return () => {
      cancelled = true
      if (stageRef.current) stageRef.current.style.visibility = 'hidden'
    }
  }, [source, accent, softBg, themeMode, rawId, storageKey, applyView, computeRecommended, fitToRecommended])

  // 容器尺寸变化：仅在「无存储视图」时重新自适应，有存储视图则保持用户喜好
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    const ro = new ResizeObserver(() => {
      if (viewRef.current.gw > 0 && !hasStoredViewRef.current) fitToRecommended()
    })
    ro.observe(vp)
    return () => ro.disconnect()
  }, [fitToRecommended])

  // 滚轮缩放：仅编辑模式挂载；原生监听 + preventDefault（React onWheel 为 passive，拦不住页面滚动）
  // 因子 Math.exp(-deltaY * 0.0012) 平滑，requestAnimationFrame 节流合并高频事件
  useEffect(() => {
    if (mode !== 'edit') return
    const vp = viewportRef.current
    if (!vp) return
    let pendingDelta = 0
    let anchorX = 0
    let anchorY = 0
    let rafId = 0

    const handler = (e: WheelEvent) => {
      if (viewRef.current.gw <= 0) return
      e.preventDefault()
      const rect = vp.getBoundingClientRect()
      anchorX = e.clientX - rect.left
      anchorY = e.clientY - rect.top
      pendingDelta += e.deltaY
      if (rafId !== 0) return
      rafId = window.requestAnimationFrame(() => {
        rafId = 0
        const factor = Math.exp(-pendingDelta * 0.0012)
        pendingDelta = 0
        zoomAt(anchorX, anchorY, factor)
      })
    }
    vp.addEventListener('wheel', handler, { passive: false })
    return () => {
      vp.removeEventListener('wheel', handler)
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId)
        rafId = 0
      }
      pendingDelta = 0
    }
  }, [mode, zoomAt])

  // 拖拽平移（预览与编辑模式均可用）：Pointer Events 统一鼠标与单指触摸，
  // ≥4px 位移阈值再进入平移，避免点击/轻微触碰被误判为拖动
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    let active = false
    let panning = false
    let startX = 0
    let startY = 0
    let lastX = 0
    let lastY = 0

    const onDown = (e: PointerEvent) => {
      if (viewRef.current.gw <= 0) return
      if (e.pointerType === 'mouse' && e.button !== 0) return
      active = true
      panning = false
      startX = e.clientX
      startY = e.clientY
      lastX = e.clientX
      lastY = e.clientY
      vp.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!active) return
      if (!panning) {
        if (Math.hypot(e.clientX - startX, e.clientY - startY) < PAN_THRESHOLD) return
        panning = true
        vp.style.cursor = 'grabbing'
      }
      const view = viewRef.current
      view.x += e.clientX - lastX
      view.y += e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      applyView()
    }
    const onUp = (e: PointerEvent) => {
      if (!active) return
      active = false
      panning = false
      if (vp.hasPointerCapture(e.pointerId)) vp.releasePointerCapture(e.pointerId)
      vp.style.cursor = 'grab'
    }

    vp.addEventListener('pointerdown', onDown)
    vp.addEventListener('pointermove', onMove)
    vp.addEventListener('pointerup', onUp)
    vp.addEventListener('pointercancel', onUp)
    return () => {
      vp.removeEventListener('pointerdown', onDown)
      vp.removeEventListener('pointermove', onMove)
      vp.removeEventListener('pointerup', onUp)
      vp.removeEventListener('pointercancel', onUp)
    }
  }, [applyView])

  /** 进入编辑模式：快照当前视图，供「取消」还原 */
  const enterEdit = useCallback(() => {
    const { k, x, y } = viewRef.current
    editBackupRef.current = { k, x, y }
    setMode('edit')
  }, [])

  /** 保存：把当前视图写入 localStorage 并切回预览模式 */
  const saveEdit = useCallback(() => {
    const { k, x, y } = viewRef.current
    writeStoredView(storageKey, { k, x, y })
    hasStoredViewRef.current = true
    editBackupRef.current = null
    setMode('preview')
  }, [storageKey])

  /** 取消：放弃修改，还原到进入编辑时的视图并切回预览模式 */
  const cancelEdit = useCallback(() => {
    const backup = editBackupRef.current
    if (backup) {
      viewRef.current.k = backup.k
      viewRef.current.x = backup.x
      viewRef.current.y = backup.y
      applyView()
    }
    editBackupRef.current = null
    setMode('preview')
  }, [applyView])

  const toolButtonClass =
    'flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-paper/95 text-ink-soft shadow-sm transition-colors hover:bg-paper-2 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40'

  const toolTextButtonClass =
    'flex h-7 items-center gap-1 rounded-lg border border-border bg-paper/95 px-2 text-xs text-ink-soft shadow-sm transition-colors hover:bg-paper-2 hover:text-foreground'

  const percent = Math.round(displayK * 100)
  const currentTier = SCALE_TIERS.find((t) => Math.abs(t - displayK) <= TIER_EPSILON) ?? null
  const hasHigherTier = SCALE_TIERS.some((t) => t > displayK + TIER_EPSILON)
  const hasLowerTier = SCALE_TIERS.some((t) => t < displayK - TIER_EPSILON)

  return (
    <div className={className}>
      <div className="relative">
        <div
          ref={viewportRef}
          className="relative h-[400px] touch-none overflow-hidden rounded-xl border border-border bg-paper sm:h-[480px]"
          style={{
            cursor: 'grab',
            backgroundImage: 'radial-gradient(circle, rgba(203, 191, 172, 0.28) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
            userSelect: 'none',
          }}
        >
          {/* 缩放平移舞台：transform-origin 0 0，内容由 applyView 直接写 transform */}
          <div
            ref={stageRef}
            className="absolute left-0 top-0"
            style={{ transformOrigin: '0 0', visibility: 'hidden', willChange: 'transform' }}
          >
            <div ref={svgHostRef} aria-hidden={status === 'error'} />
          </div>

          {/* 顶部加载进度条 */}
          {status === 'loading' && (
            <div
              className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden rounded-full bg-muted"
              aria-hidden
            >
              <div
                className="h-full w-1/3 animate-pulse rounded-full"
                style={{ backgroundColor: accent }}
              />
            </div>
          )}

          {/* 渲染失败兜底：同一固定高度容器内展示 */}
          {status === 'error' && (
            <div className="absolute inset-0 z-10 overflow-auto p-4">
              <div className="rounded-xl border border-dashed border-[#934F5C]/40 bg-[#FBF1F2] p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#7E4350]">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  图表渲染失败
                </p>
                <p className="mt-1.5 break-all font-mono text-xs leading-5 text-[#934F5C]/80">
                  {error}
                </p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-muted-foreground hover:text-ink-soft">
                    查看 Mermaid 源码
                  </summary>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-[#292420] p-3 font-mono text-[11px] leading-5 text-[#F3EDE3]">
                    <code>{source}</code>
                  </pre>
                </details>
              </div>
            </div>
          )}
        </div>

        {/* 悬浮工具条：右上角，暖色统一 */}
        {status === 'done' && mode === 'preview' && (
          <div className="absolute right-2 top-2 z-20 flex items-center gap-1 rounded-lg border border-border bg-paper/95 p-1 shadow-sm">
            <button
              type="button"
              aria-label="编辑"
              title="编辑"
              className={toolTextButtonClass}
              onClick={enterEdit}
            >
              <Pencil className="h-3.5 w-3.5" />
              编辑
            </button>
            <span
              aria-label="预览"
              title="预览"
              className="min-w-[3rem] px-1 text-center text-xs tabular-nums text-muted-foreground"
            >
              {percent}%
            </span>
          </div>
        )}

        {status === 'done' && mode === 'edit' && (
          <div className="absolute right-2 top-2 z-20 flex items-center gap-1 rounded-lg border border-border bg-paper/95 p-1 shadow-sm">
            <button
              type="button"
              aria-label="缩小"
              title="缩小"
              className={toolButtonClass}
              disabled={!hasLowerTier}
              onClick={() => stepTier(-1)}
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="放大"
              title="放大"
              className={toolButtonClass}
              disabled={!hasHigherTier}
              onClick={() => stepTier(1)}
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <select
              aria-label="缩放比例"
              title="缩放比例"
              className="h-7 cursor-pointer rounded-lg border border-border bg-paper px-1 text-xs tabular-nums text-ink-soft shadow-sm transition-colors hover:bg-paper-2"
              value={currentTier !== null ? String(currentTier) : 'current'}
              onChange={(e) => {
                const target = Number(e.target.value)
                if (Number.isFinite(target)) zoomToScaleAtCenter(target)
              }}
            >
              {currentTier === null && (
                <option value="current">当前 {percent}%</option>
              )}
              {SCALE_TIERS.map((t) => (
                <option key={t} value={String(t)}>
                  {Math.round(t * 100)}%{recommendedTier === t ? ' · 推荐' : ''}
                </option>
              ))}
            </select>
            <button
              type="button"
              aria-label="适应推荐"
              title="适应推荐"
              className={toolButtonClass}
              onClick={fitToRecommended}
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="保存"
              title="保存"
              className={toolTextButtonClass}
              onClick={saveEdit}
            >
              <Check className="h-3.5 w-3.5" />
              保存
            </button>
            <button
              type="button"
              aria-label="取消"
              title="取消"
              className={toolTextButtonClass}
              onClick={cancelEdit}
            >
              <X className="h-3.5 w-3.5" />
              取消
            </button>
          </div>
        )}
      </div>
      {note && <p className="mt-3 text-center text-xs text-muted-foreground">{note}</p>}
    </div>
  )
}
