import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * 分区外壳 —— 统一锚点、宽度与节奏
 */
export function SectionShell({
  id,
  children,
  className,
  tinted = false,
}: {
  id: string
  children: ReactNode
  className?: string
  /** 使用浅暖灰底色与白色分区交替 */
  tinted?: boolean
}) {
  return (
    <section id={id} className={cn('scroll-mt-28', tinted && 'bg-tint')}>
      <div className={cn('mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20', className)}>
        {children}
      </div>
    </section>
  )
}
