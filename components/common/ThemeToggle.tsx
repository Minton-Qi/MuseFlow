"use client"

import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/lib/store/themeStore'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 dark:bg-violet-900/40 hover:bg-stone-200 dark:hover:bg-violet-800/50 rounded-lg transition-colors border border-transparent dark:border-violet-700/30"
      title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-stone-600" />
      ) : (
        <Sun className="w-4 h-4 text-amber-400" />
      )}
      <span className="text-sm text-stone-600 dark:text-violet-200">
        {theme === 'light' ? '深色' : '浅色'}
      </span>
    </button>
  )
}
