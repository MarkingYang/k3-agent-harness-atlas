import { Star } from 'lucide-react'
import { PRIORITY_META, type Priority } from '@/data/stack'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/hooks/use-language'
import { priorityDesc, priorityLabel } from '@/i18n/ui'

/** 优先级星级 + 标签 */
export function PriorityStars({
  priority,
  showLabel = true,
  className,
}: {
  priority: Priority
  showLabel?: boolean
  className?: string
}) {
  const { lang } = useLanguage()
  const meta = PRIORITY_META[priority]
  const label = priorityLabel(meta, lang)
  const desc = priorityDesc(meta, lang)
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)} title={desc}>
      <span
        className="inline-flex items-center gap-0.5"
        aria-label={lang === 'zh' ? `优先级 ${priority} 星` : `Priority ${priority}`}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              'h-3.5 w-3.5',
              i <= priority ? 'fill-teal-500 text-teal-500' : 'fill-muted text-muted',
            )}
          />
        ))}
      </span>
      {showLabel && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
    </span>
  )
}
