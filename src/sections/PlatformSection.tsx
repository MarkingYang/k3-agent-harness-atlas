import { Lightbulb } from 'lucide-react'
import { layerById, toolsByLayer } from '@/data/stack'
import { LayerHeader } from '@/components/stack/LayerHeader'
import { SectionShell } from '@/components/stack/SectionShell'
import { ToolCard } from '@/components/stack/ToolCard'
import { useLayerSoftBackground } from '@/lib/layer-surface'

/**
 * 平台层分区 —— AI Application Platform
 * Dify / CrewAI：产品形态与协作范式的两个参考实现
 */
export default function PlatformSection() {
  const layer = layerById('platform')
  const tools = toolsByLayer('platform')
  const soft = useLayerSoftBackground(layer.softBg, layer.accent)

  return (
    <SectionShell id="platform">
      <LayerHeader layer={layer} index={9} />

      <p
        className="-mt-4 mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium"
        style={{ backgroundColor: soft, color: layer.accent }}
      >
        <Lightbulb className="h-3.5 w-3.5" />
        这一层的两个项目作为产品形态与协作范式的参考实现，优先级为 3 星
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </SectionShell>
  )
}
