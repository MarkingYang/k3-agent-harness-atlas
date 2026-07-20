import { Star } from 'lucide-react'
import { PRIORITY_META, type Priority } from '@/data/stack'
import { cn } from '@/lib/utils'

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
  const meta = PRIORITY_META[priority]
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)} title={meta.desc}>
      <span className="inline-flex items-center gap-0.5" aria-label={`优先级 ${priority} 星`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              'h-3.5 w-3.5',
              i <= priority ? 'fill-amber-500 text-amber-500' : 'fill-stone-200 text-stone-200',
            )}
          />
        ))}
      </span>
      {showLabel && (
        <span className="text-xs font-medium text-stone-500">{meta.label}</span>
      )}
    </span>
  )
}
