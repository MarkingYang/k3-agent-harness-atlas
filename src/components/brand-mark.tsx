import { cn } from '@/lib/utils'

/**
 * 站点品牌标 —— Harness 图标
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="Agent Harness"
      className={cn('h-9 w-9 shrink-0 rounded-xl object-cover', className)}
      aria-hidden
    />
  )
}
