import type { StackLayer } from '@/data/stack'

/**
 * 层级分区头部 —— 序号、层名、定位类比与讲解段落
 */
export function LayerHeader({ layer, index }: { layer: StackLayer; index: number }) {
  return (
    <header className="mb-10">
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl font-mono text-sm font-bold text-white"
          style={{ backgroundColor: layer.accent }}
        >
          {String(index).padStart(2, '0')}
        </span>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-stone-400">{layer.name}</p>
          <h3 className="text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
            {layer.zhName}
          </h3>
        </div>
        <span
          className="ml-2 hidden rounded-full px-3 py-1 text-xs font-medium sm:inline-block"
          style={{ backgroundColor: layer.softBg, color: layer.accent }}
        >
          {layer.tagline}
        </span>
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-500">{layer.description}</p>
    </header>
  )
}
