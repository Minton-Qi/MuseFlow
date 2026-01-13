import { create } from 'zustand'
import type { Topic } from '@/lib/types'

/**
 * Writing session state management using Zustand.
 * Manages the current writing session with auto-save functionality.
 */

export interface WritingSession {
  id?: string
  topicId: string
  content: string
  wordCount: number
  status: 'draft' | 'completed'
  startedAt?: Date
}

interface WritingState {
  currentSession: WritingSession | null
  isSaving: boolean
  lastSavedAt: Date | null
  saveError: string | null

  // Session management
  startSession: (topic: Topic, existingSessionId?: string | null, initialContent?: string) => void
  updateContent: (content: string) => void
  clearSession: () => void
  completeSession: () => void

  // Auto-save
  autoSave: () => Promise<void>
  saveSession: () => Promise<void>

  // Error handling
  setSaveError: (error: string | null) => void
}

export const useWritingStore = create<WritingState>((set, get) => ({
  currentSession: null,
  isSaving: false,
  lastSavedAt: null,
  saveError: null,

  startSession: (topic: Topic, existingSessionId?: string | null, initialContent?: string) => {
    set({
      currentSession: {
        id: existingSessionId || undefined,
        topicId: topic.id,
        content: initialContent || '',
        wordCount: (initialContent || '').replace(/\s/g, '').length,
        status: 'draft',
        startedAt: new Date(),
      },
      lastSavedAt: null,
      saveError: null,
    })
  },

  updateContent: (content: string) => {
    const current = get().currentSession
    if (!current) return

    set({
      currentSession: {
        ...current,
        content,
        wordCount: content.replace(/\s/g, '').length,
      },
    })
  },

  clearSession: () => {
    set({
      currentSession: null,
      isSaving: false,
      lastSavedAt: null,
      saveError: null,
    })
  },

  completeSession: () => {
    const current = get().currentSession
    if (!current) return

    set({
      currentSession: {
        ...current,
        status: 'completed',
      },
    })
  },

  autoSave: async () => {
    const current = get().currentSession
    if (!current || current.content.length < 5) return

    // Debounce: only save if content has changed significantly
    // or at least 30 seconds have passed since last save
    const lastSaved = get().lastSavedAt
    if (lastSaved && Date.now() - lastSaved.getTime() < 30000) {
      return
    }

    await get().saveSession()
  },

  saveSession: async () => {
    const current = get().currentSession
    if (!current) return

    set({ isSaving: true, saveError: null })

    try {
      // If editing existing session, use PUT to specific endpoint
      const url = current.id
        ? `/api/writing/sessions/${current.id}`
        : '/api/writing/sessions'

      const response = await fetch(url, {
        method: current.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: current.topicId,
          content: current.content,
          word_count: current.wordCount,
          status: current.status,
        }),
      })

      if (!response.ok) {
        // Try to get the actual error message from the response
        let errorMessage = 'Failed to save session'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // If we can't parse the error, use status text
          errorMessage = `保存失败 (${response.status})`
        }

        // Add specific message for unauthorized
        if (response.status === 401) {
          errorMessage = '请先登录以保存您的写作'
        }

        throw new Error(errorMessage)
      }

      const { session } = await response.json()

      set({
        currentSession: {
          ...current,
          id: session.id,
        },
        isSaving: false,
        lastSavedAt: new Date(),
        saveError: null,
      })
    } catch (error) {
      set({
        isSaving: false,
        saveError: error instanceof Error ? error.message : 'Failed to save',
      })
    }
  },

  setSaveError: (error: string | null) => {
    set({ saveError: error })
  },
}))
