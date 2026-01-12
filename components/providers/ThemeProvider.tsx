"use client"

import { useEffect, useLayoutEffect } from 'react'
import { useThemeStore } from '@/lib/store/themeStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('museflow-theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [setTheme])

  // Apply theme class to document - use useLayoutEffect for immediate DOM update
  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return <>{children}</>
}
