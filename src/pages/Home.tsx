import { useEffect } from 'react'
import Navbar from '@/sections/Navbar'
import SideNav from '@/sections/SideNav'
import Hero from '@/sections/Hero'
import StackMap from '@/sections/StackMap'
import RuntimeSection from '@/sections/RuntimeSection'
import ObservabilitySection from '@/sections/ObservabilitySection'
import MemoryEvalSection from '@/sections/MemoryEvalSection'
import InfraSection from '@/sections/InfraSection'
import PlatformSection from '@/sections/PlatformSection'
import LearningPath from '@/sections/LearningPath'
import ComparisonTable from '@/sections/ComparisonTable'
import Footer from '@/sections/Footer'

export default function Home() {
  // 从其他页面（如工具详情页）带 hash 导航回首页时，挂载后滚动到目标分区
  useEffect(() => {
    const hash = window.location.hash
    if (hash.length > 1) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        const timer = setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 80)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Navbar />
      {/* 左侧目录 + 主内容列：88rem 总宽 = 目录 14rem + 间距 + 主列（各 section 仍按 max-w-6xl 居中，阅读节奏不变） */}
      <div className="mx-auto flex w-full max-w-[88rem] items-start gap-6">
        <SideNav />
        <main className="min-w-0 flex-1">
          <Hero />
          <StackMap />
          <RuntimeSection />
          <ObservabilitySection />
          <MemoryEvalSection />
          <InfraSection />
          <PlatformSection />
          <LearningPath />
          <ComparisonTable />
        </main>
      </div>
      <Footer />
    </div>
  )
}
