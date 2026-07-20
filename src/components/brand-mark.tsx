import { cn } from '@/lib/utils'

/**
 * 站点品牌标 —— 折叠地图 + 好奇的 Agent 眼睛（与 favicon 同构）
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-9 w-9 shrink-0', className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <path
        d="M7.5 10.2 12.2 8.4l3.8 1.6 4-1.7 4.5 1.9v11.4l-4.5-1.9-4 1.7-3.8-1.6-4.7 1.8V10.2Z"
        className="fill-primary-foreground opacity-90"
      />
      <path
        d="M12.2 8.4v11.4M16 10v11.5M20 8.3v11.5"
        className="stroke-primary"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M7.5 10.2 12.2 8.4l3.8 1.6 4-1.7 4.5 1.9"
        className="stroke-primary"
        strokeWidth="1.15"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <circle cx="16" cy="15.2" r="3.1" className="fill-primary" />
      <circle cx="16" cy="15.2" r="1.35" className="fill-primary-foreground" />
      <path
        d="M16 11.2v-1.1M18.9 12.6l.8-.8M13.1 12.6l-.8-.8"
        className="stroke-primary-foreground"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}
