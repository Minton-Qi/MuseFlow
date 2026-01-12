import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

/**
 * Authentication state management using Zustand.
 * Provides global auth state and actions for sign in, sign out, and session management.
 */

interface AuthState {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),

  setLoading: (loading) => set({ loading }),

  signIn: async (email: string, password: string) => {
    const supabase = createClient()
    set({ loading: true })

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    set({ loading: false })

    if (error) {
      return { error: error.message }
    }

    set({ user: data.user })
    return { error: null }
  },

  signUp: async (email: string, password: string, fullName?: string) => {
    const supabase = createClient()
    set({ loading: true })

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    })

    set({ loading: false })

    if (error) {
      return { error: error.message }
    }

    set({ user: data.user })
    return { error: null }
  },

  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ user: null })
  },

  refreshSession: async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    set({ user: session?.user ?? null, loading: false })
  },
}))
