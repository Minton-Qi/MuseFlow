"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Clock, FileText, Trash2 } from 'lucide-react'

const categoryEmojis: Record<string, string> = {
  imagination: "🌙",
  emotion: "💫",
  reflection: "🪞",
  creative: "✨",
  philosophical: "🌊"
}

interface HistoryCardProps {
  session: {
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
}

export function HistoryCard({ session }: HistoryCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const date = new Date(session.created_at).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    e.preventDefault() // Prevent link navigation

    if (!confirm('确定要删除这篇写作吗？此操作不可恢复。')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/writing/sessions/${session.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('删除失败，请重试')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('删除失败，请重试')
    } finally {
      setIsDeleting(false)
    }
  }

  // Determine the link href based on session status
  const cardHref = session.status === 'draft'
    ? `/?session=${session.id}`
    : `/history/${session.id}`

  return (
    <Link
      href={cardHref}
      className="block bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-stone-200 dark:border-violet-900/30 p-6 hover:shadow-md dark:hover:shadow-violet-900/10 hover:-translate-y-0.5 transition-all cursor-pointer relative"
    >
      <div className="flex items-start justify-between">
        {/* Left: Topic Info */}
        <div className="flex-1 pr-20">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">
              {categoryEmojis[session.topics.category] || '✨'}
            </span>
            <h3 className="text-lg font-semibold text-stone-800 dark:text-violet-100">
              {session.topics.title}
            </h3>
            {session.status === 'completed' ? (
              <span className="px-2 py-1 bg-green-100 dark:bg-emerald-900/30 text-green-700 dark:text-emerald-400 text-xs rounded-full">
                已完成
              </span>
            ) : (
              <span className="px-2 py-1 bg-amber-100 dark:bg-violet-900/30 text-amber-700 dark:text-violet-400 text-xs rounded-full">
                草稿
              </span>
            )}
          </div>

          <p className="text-stone-500 dark:text-violet-200/70 text-sm mb-4 line-clamp-2">
            {session.topics.prompt}
          </p>

          <div className="flex items-center gap-4 text-sm text-stone-400 dark:text-violet-300/50">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{session.word_count} 字</span>
            </div>
          </div>
        </div>

        {/* Delete Button (absolute positioned to not affect layout) */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50"
          title={session.status === 'draft' ? '删除草稿' : '删除记录'}
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent animate-spin rounded-full" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Preview */}
      {session.word_count > 0 && (
        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-violet-900/20">
          <p className="text-stone-400 dark:text-violet-300/40 text-sm line-clamp-2 font-serif">
            {session.status === 'draft' ? '点击继续编辑...' : '点击查看详情...'}
          </p>
        </div>
      )}
    </Link>
  )
}
