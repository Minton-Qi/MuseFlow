import { create } from 'zustand'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  setTheme: (theme) => {
    set({ theme })
    // Save to localStorage manually
    if (typeof window !== 'undefined') {
      localStorage.setItem('museflow-theme', theme)
    }
  },
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light'
    set({ theme: newTheme })
    if (typeof window !== 'undefined') {
      localStorage.setItem('museflow-theme', newTheme)
    }
  },
}))
