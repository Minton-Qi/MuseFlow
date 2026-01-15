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
    console.log('signIn called', { email })
    const supabase = createClient()
    set({ loading: true })

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      set({ loading: false })

      if (error) {
        console.error('SignIn error:', error)
        return { error: error.message }
      }

      console.log('SignIn success:', data.user)
      set({ user: data.user })
      return { error: null }
    } catch (err) {
      console.error('SignIn exception:', err)
      set({ loading: false })
      return { error: err instanceof Error ? err.message : 'Unknown error' }
    }
  },

  signUp: async (email: string, password: string, fullName?: string) => {
    console.log('signUp called', { email, fullName })
    const supabase = createClient()
    set({ loading: true })

    try {
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
        console.error('SignUp error:', error)
        return { error: error.message }
      }

      console.log('SignUp success:', data.user)
      set({ user: data.user })
      return { error: null }
    } catch (err) {
      console.error('SignUp exception:', err)
      set({ loading: false })
      return { error: err instanceof Error ? err.message : 'Unknown error' }
    }
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
