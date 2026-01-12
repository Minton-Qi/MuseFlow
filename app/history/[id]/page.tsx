"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, FileText, Star, Sparkles } from 'lucide-react'
import { Header } from '@/components/common/Header'
import { categoryEmojis } from '@/lib/topics'

interface WritingSession {
  id: string
  created_at: string
  completed_at: string
  word_count: number
  status: string
  content: string
  topics: {
    title: string
    prompt: string
    category: string
  }
}

interface Feedback {
  scores: {
    creativity: number
    emotion: number
    expression: number
    logic: number
    vocabulary: number
  }
  encouragement: string
  suggestions: string[]
  improved_sentence?: {
    original: string
    improved: string
  }
}

const scoreLabels: Record<string, string> = {
  creativity: "创意",
  emotion: "情感",
  expression: "表达",
  logic: "逻辑",
  vocabulary: "词汇"
}

export default function HistoryDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [session, setSession] = useState<WritingSession | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch(`/api/writing/sessions/${id}`)
        if (response.ok) {
          const { session } = await response.json()
          setSession(session)

          // Load feedback if session is completed
          if (session.status === 'completed') {
            const feedbackResponse = await fetch(`/api/feedback?session_id=${id}`)
            if (feedbackResponse.ok) {
              const { feedback } = await feedbackResponse.json()
              setFeedback(feedback)
            }
          }

          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to load session:', error)
        setLoading(false)
      }
    }

    loadSession()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 dark:from-[#0f0d1a] dark:via-[#1a1625] dark:to-[#0f0d1a] flex items-center justify-center">
        <div className="text-stone-400 dark:text-violet-300/50">加载中...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 dark:from-[#0f0d1a] dark:via-[#1a1625] dark:to-[#0f0d1a] flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-stone-300 dark:text-violet-700/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-stone-600 dark:text-violet-200 mb-2">未找到该写作记录</h3>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-stone-700 to-stone-800 dark:from-violet-600 dark:to-indigo-600 text-white rounded-full hover:shadow-lg dark:hover:shadow-violet-500/20 transition-all"
          >
            返回历史
          </Link>
        </div>
      </div>
    )
  }

  const date = new Date(session.created_at).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 dark:from-[#0f0d1a] dark:via-[#1a1625] dark:to-[#0f0d1a]">
      <Header />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-[#1a1625]/90 backdrop-blur-sm border-b border-stone-200 dark:border-violet-900/30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/history"
            className="flex items-center gap-2 text-stone-500 dark:text-violet-300/70 hover:text-stone-800 dark:hover:text-violet-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">返回历史</span>
          </Link>

          <h1 className="text-lg font-medium text-stone-800 dark:text-violet-100">写作详情</h1>

          <div className="w-24" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Topic Info */}
        <div className="bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-stone-200 dark:border-violet-900/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">
              {categoryEmojis[session.topics.category] || '✨'}
            </span>
            <div>
              <h2 className="text-2xl font-semibold text-stone-800 dark:text-violet-100">
                {session.topics.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {session.status === 'completed' ? (
                  <span className="px-2 py-1 bg-green-100 dark:bg-emerald-900/30 text-green-700 dark:text-emerald-400 text-xs rounded-full">
                    已完成
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-amber-100 dark:bg-violet-900/30 text-amber-700 dark:text-violet-400 text-xs rounded-full">
                    草稿
                  </span>
                )}
                <span className="text-sm text-stone-400 dark:text-violet-300/50">{date}</span>
              </div>
            </div>
          </div>

          <p className="text-stone-500 dark:text-violet-300/70 mt-4 mb-2">题目</p>
          <p className="text-lg text-stone-700 dark:text-violet-100">{session.topics.prompt}</p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-stone-200 dark:border-violet-900/30 p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-800 dark:text-violet-100">写作内容</h3>
            <p className="text-sm text-stone-400 dark:text-violet-300/50">{session.word_count} 字</p>
          </div>

          <div className="prose prose-stone dark:prose-invert max-w-none">
            <p className="text-stone-700 dark:text-violet-100 leading-loose font-serif whitespace-pre-wrap">
              {session.content || '（空白）'}
            </p>
          </div>
        </div>

        {/* Feedback - only show if completed */}
        {session.status === 'completed' && feedback && (
          <>
            {/* AI Guidance Header */}
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-full border border-amber-200 dark:border-violet-700/30">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-violet-400" />
                <span className="text-lg font-semibold text-stone-800 dark:text-violet-100">AI 写作指导</span>
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-violet-400" />
              </div>
            </div>

            {/* Score Summary */}
            <div className="bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-stone-200 dark:border-violet-900/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-amber-500 dark:text-violet-400" />
                <h3 className="text-lg font-semibold text-stone-800 dark:text-violet-100">多维度评分</h3>
              </div>

              <div className="grid grid-cols-5 gap-4">
                {Object.entries(feedback.scores).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="text-2xl font-semibold text-amber-600 dark:text-violet-400">{value}</p>
                    <p className="text-xs text-stone-400 dark:text-violet-300/50 mt-1">{scoreLabels[key]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Encouragement */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-2xl shadow-sm border border-amber-200 dark:border-violet-700/30 p-6">
              <h3 className="text-lg font-semibold text-stone-800 dark:text-violet-100 mb-3">✨ 暖心评价</h3>
              <p className="text-stone-700 dark:text-violet-100 leading-relaxed font-serif text-lg">{feedback.encouragement}</p>
            </div>

            {/* Suggestions */}
            {feedback.suggestions.length > 0 && (
              <div className="bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-stone-200 dark:border-violet-900/30 p-6">
                <h3 className="text-lg font-semibold text-stone-800 dark:text-violet-100 mb-4">💡 改进建议</h3>
                <ul className="space-y-3">
                  {feedback.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-violet-900/50 text-amber-600 dark:text-violet-400 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <p className="text-stone-700 dark:text-violet-200/80 leading-relaxed flex-1">{suggestion}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improved Sentence */}
            {feedback.improved_sentence && (
              <div className="bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-stone-200 dark:border-violet-900/30 p-6">
                <h3 className="text-lg font-semibold text-stone-800 dark:text-violet-100 mb-4">✍️ 佳句润色</h3>

                <div className="space-y-4">
                  <div className="bg-stone-50 dark:bg-[#2d2640] rounded-xl p-5 border-l-4 border-stone-400 dark:border-violet-500/50">
                    <p className="text-xs text-stone-500 dark:text-violet-300/50 mb-2 font-medium">原句</p>
                    <p className="text-stone-700 dark:text-violet-200/80 font-serif leading-relaxed">{feedback.improved_sentence.original}</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-xl p-5 border-l-4 border-amber-500 dark:border-violet-500">
                    <p className="text-xs text-amber-600 dark:text-violet-400 mb-2 font-medium">✨ 润色建议</p>
                    <p className="text-stone-800 dark:text-violet-100 font-serif leading-relaxed font-medium">{feedback.improved_sentence.improved}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-center gap-4 text-sm text-stone-400 dark:text-violet-300/50">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>创建于 {date}</span>
          </div>
          {session.completed_at && (
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>
                完成于{' '}
                {new Date(session.completed_at).toLocaleDateString('zh-CN', {
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
