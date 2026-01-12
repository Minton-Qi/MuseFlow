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
      await refreshSession()
      setIsInitialized(true)
    }

    init()
  }, [refreshSession])

  // Prevent flash of unauthenticated content
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 flex items-center justify-center">
        <div className="text-stone-400">加载中...</div>
      </div>
    )
  }

  return <>{children}</>
}
