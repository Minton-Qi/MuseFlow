"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, FileText, Sparkles, Eye } from 'lucide-react'
import { Header } from '@/components/common/Header'
import { HistoryCard } from '@/components/history/HistoryCard'
import { FilterTabs } from '@/components/history/FilterTabs'

interface WritingSession {
  id: string
  created_at: string
  word_count: number
  status: string
  topics: {
    id: string
    title: string
    prompt: string
    category: string
  }
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<WritingSession[]>([])
  const [filter, setFilter] = useState<'all' | 'completed' | 'draft'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  async function loadHistory() {
    setLoading(true)
    try {
      const response = await fetch('/api/writing/sessions')
      if (response.ok) {
        const { sessions } = await response.json()
        setSessions(sessions || [])
      }
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true
    return session.status === filter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 dark:from-[#0f0d1a] dark:via-[#1a1625] dark:to-[#0f0d1a]">
      <Header />

      <header className="pt-8 pb-6 text-center">
        <h1 className="text-3xl font-light text-stone-800 dark:text-violet-100 mb-2">写作历史</h1>
        <p className="text-stone-500 dark:text-violet-300/70">回顾您的创作历程</p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-16">
        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <FilterTabs currentFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-stone-400 dark:text-violet-300/50">加载中...</div>
          </div>
        ) : filteredSessions.length === 0 ? (
          /* Empty State */
          <div className="text-center py-32">
            <FileText className="w-16 h-16 text-stone-300 dark:text-violet-700/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 dark:text-violet-200 mb-2">
              {filter === 'all' ? '还没有写作记录' : `没有${filter === 'completed' ? '已完成' : '草稿'}的作品`}
            </h3>
            <p className="text-stone-400 dark:text-violet-300/50 mb-6">
              {filter === 'all' ? '开始您的第一次写作吧' : '尝试切换其他筛选条件'}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-stone-700 to-stone-800 dark:from-violet-600 dark:to-indigo-600 text-white rounded-full hover:shadow-lg dark:hover:shadow-violet-500/20 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              开始写作
            </Link>
          </div>
        ) : (
          /* Sessions List */
          <div className="grid gap-6">
            {filteredSessions.map((session) => (
              <HistoryCard key={session.id} session={session} />
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {!loading && sessions.length > 0 && (
          <div className="mt-12 p-6 bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-stone-200 dark:border-violet-900/30">
            <div className="flex items-center justify-around text-center">
              <div>
                <p className="text-3xl font-semibold text-stone-800 dark:text-violet-100">{sessions.length}</p>
                <p className="text-sm text-stone-400 dark:text-violet-300/50 mt-1">总篇数</p>
              </div>
              <div className="w-px h-12 bg-stone-200 dark:bg-violet-700/30" />
              <div>
                <p className="text-3xl font-semibold text-stone-800 dark:text-violet-100">
                  {sessions.reduce((sum, s) => sum + s.word_count, 0)}
                </p>
                <p className="text-sm text-stone-400 dark:text-violet-300/50 mt-1">总字数</p>
              </div>
              <div className="w-px h-12 bg-stone-200 dark:bg-violet-700/30" />
              <div>
                <p className="text-3xl font-semibold text-stone-800 dark:text-violet-100">
                  {sessions.filter(s => s.status === 'completed').length}
                </p>
                <p className="text-sm text-stone-400 dark:text-violet-300/50 mt-1">已完成</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
