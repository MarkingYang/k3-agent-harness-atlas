import { useEffect, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { StarPoint } from '@/data/deepDive'
import { useTheme } from '@/hooks/use-theme'

const fmt = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))

interface DotProps {
  cx?: number
  cy?: number
  index?: number
}

function useCssColor(varName: string, fallback: string) {
  const { resolved } = useTheme()
  const [color, setColor] = useState(fallback)
  useEffect(() => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
    setColor(raw ? `hsl(${raw})` : fallback)
  }, [resolved, varName, fallback])
  return color
}

/**
 * Star 趋势图 —— 月度 star 序列面积图（暖色系，末端最新值标注）
 */
export function StarChart({ data, accent }: { data: StarPoint[]; accent: string }) {
  const chartData = data.map((p) => ({ ...p, label: p.date.slice(2) }))
  const lastIdx = chartData.length - 1
  const lastVal = lastIdx >= 0 ? chartData[lastIdx].stars : 0
  const paper = useCssColor('--paper', '#FFFDF8')
  const border = useCssColor('--border', '#E7E0D4')
  const muted = useCssColor('--muted-foreground', '#A8A29E')

  /** 只在最后一个数据点渲染圆点 + 数值 */
  const endDot = (props: DotProps) => {
    const { cx, cy, index } = props
    if (index !== lastIdx || cx === undefined || cy === undefined) return <g key="dot-none" />
    return (
      <g key="dot-end">
        <circle cx={cx} cy={cy} r={8} fill={accent} opacity={0.18} />
        <circle cx={cx} cy={cy} r={4} fill={accent} stroke={paper} strokeWidth={1.5} />
        <text
          x={cx - 6}
          y={cy - 12}
          textAnchor="end"
          fontSize={12}
          fontWeight={700}
          fill={accent}
        >
          {fmt(lastVal)}
        </text>
      </g>
    )
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="starFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity={0.28} />
              <stop offset="100%" stopColor={accent} stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: muted }}
            tickLine={false}
            axisLine={{ stroke: border }}
            minTickGap={40}
          />
          <YAxis
            tick={{ fontSize: 11, fill: muted }}
            tickLine={false}
            axisLine={false}
            tickFormatter={fmt}
            width={44}
          />
          <Tooltip
            formatter={(value: number) => [value.toLocaleString(), 'Stars']}
            labelFormatter={(l) => `20${l}`}
            contentStyle={{
              background: paper,
              border: `1px solid ${border}`,
              borderRadius: 10,
              fontSize: 12,
              color: muted,
            }}
          />
          <Area
            type="monotone"
            dataKey="stars"
            stroke={accent}
            strokeWidth={2}
            fill="url(#starFill)"
            dot={endDot}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/** 格式化大数字（供外部统计行复用） */
export const formatStars = fmt
