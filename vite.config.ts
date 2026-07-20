import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// GitHub Pages 项目站：https://MarkingYang.github.io/k3-agent-harness-atlas/
const pagesBase = '/k3-agent-harness-atlas/'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? pagesBase : '/',
  plugins: [inspectAttr(), react()],
  server: {
    port: 7200,
    host: 'localhost',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
