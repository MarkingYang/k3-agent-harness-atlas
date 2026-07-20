import { useTheme } from '@/hooks/use-theme'

/**
 * 层级浅底色：浅色模式用设计稿 softBg；
 * 深色模式把 accent 混入 paper，避免「近白字压浅色底」看不清。
 */
export function layerSoftBackground(softBg: string, accent: string, dark: boolean): string {
  if (!dark) return softBg
  return `color-mix(in srgb, ${accent} 34%, hsl(var(--paper)))`
}

/** 当前主题下的层级浅底色 */
export function useLayerSoftBackground(softBg: string, accent: string): string {
  const { resolved } = useTheme()
  return layerSoftBackground(softBg, accent, resolved === 'dark')
}
