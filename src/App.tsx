import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router'
import Home from './pages/Home'

const ToolDetail = lazy(() => import('./pages/ToolDetail'))

function DetailFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-stone-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-primary" />
        <p className="text-sm">加载项目详情…</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/tool/:toolId"
        element={
          <Suspense fallback={<DetailFallback />}>
            <ToolDetail />
          </Suspense>
        }
      />
    </Routes>
  )
}
