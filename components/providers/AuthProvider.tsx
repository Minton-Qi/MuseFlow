"use client"

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'

/**
 * AuthProvider - Initializes authentication state on app mount
 * Must wrap the root layout to enable auth throughout the app
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { refreshSession, setLoading } = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize auth state on mount
    async function init() {
      try {
        await refreshSession()
      } catch (error) {
        console.error('Auth initialization failed:', error)
        // Even if auth fails, continue to load the app
        setLoading(false)
      } finally {
        setIsInitialized(true)
      }
    }

    init()
  }, [refreshSession, setLoading])

  // Prevent flash of unauthenticated content
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 dark:from-[#0f0d1a] dark:via-[#1a1625] dark:to-[#0f0d1a] flex items-center justify-center">
        <div className="text-stone-400 dark:text-violet-300/60">加载中...</div>
      </div>
    )
  }

  return <>{children}</>
}
