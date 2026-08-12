import { useEffect, useState } from 'react'

function getInitialTheme() {
  if (typeof window === 'undefined') return false

  const saved = localStorage.getItem('theme')
  if (saved === 'dark') return true
  if (saved === 'light') return false

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useTheme() {
  const [isDark, setIsDark] = useState(getInitialTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const initialTheme = getInitialTheme()
    if (initialTheme !== isDark) {
      setIsDark(initialTheme)
    }

    if (initialTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggle = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return { isDark, toggle, mounted }
}
