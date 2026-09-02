import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Appearance = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  appearance: Appearance
  setAppearance: (a: Appearance) => void
  /** Resolved theme actually applied to <html> */
  resolved: 'light' | 'dark'
}

const STORAGE_KEY = 'ahl-appearance'

const ThemeContext = createContext<ThemeContextValue>({
  appearance: 'system',
  setAppearance: () => {},
  resolved: 'light',
})

function getSystemDark() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
}

function resolveAppearance(appearance: Appearance): 'light' | 'dark' {
  if (appearance === 'system') return getSystemDark() ? 'dark' : 'light'
  return appearance
}

function applyDomTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
}
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved

  // favicon 跟随站点外观（不仅跟随系统 prefers-color-scheme）
  const href = resolved === 'dark' ? '/favicon-dark.svg' : '/favicon.svg'
  const bust = `${href}?v=atlas-eye`
  for (const rel of ['icon', 'apple-touch-icon'] as const) {
    let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
    if (!link) {
      link = document.createElement('link')
      link.rel = rel
      document.head.appendChild(link)
    }
    if (rel === 'icon') link.type = 'image/svg+xml'
    if (link.getAttribute('href') !== bust) link.setAttribute('href', bust)
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearanceState] = useState<Appearance>(() => {
    if (typeof window === 'undefined') return 'system'
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system'
  })
  const [resolved, setResolved] = useState<'light' | 'dark'>(() =>
    resolveAppearance(
      typeof window !== 'undefined' &&
        (window.localStorage.getItem(STORAGE_KEY) === 'light' ||
          window.localStorage.getItem(STORAGE_KEY) === 'dark' ||
          window.localStorage.getItem(STORAGE_KEY) === 'system')
        ? (window.localStorage.getItem(STORAGE_KEY) as Appearance)
        : 'system',
    ),
  )

  const setAppearance = useCallback((a: Appearance) => {
    setAppearanceState(a)
    window.localStorage.setItem(STORAGE_KEY, a)
    const next = resolveAppearance(a)
    setResolved(next)
    applyDomTheme(next)
  }, [])

  useEffect(() => {
    const next = resolveAppearance(appearance)
    setResolved(next)
    applyDomTheme(next)
  }, [appearance])

  useEffect(() => {
    if (appearance !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const next = mq.matches ? 'dark' : 'light'
      setResolved(next)
      applyDomTheme(next)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [appearance])

  const value = useMemo(
    () => ({ appearance, setAppearance, resolved }),
    [appearance, setAppearance, resolved],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
