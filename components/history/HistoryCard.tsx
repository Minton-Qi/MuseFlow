"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Clock, FileText, Eye, Trash2, Edit } from 'lucide-react'

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

  const handleDelete = async () => {
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

  const handleEdit = () => {
    // Navigate to writing page with session ID to load existing content
    router.push(`/?session=${session.id}`)
  }

  return (
    <div className="bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-stone-200 dark:border-violet-900/30 p-6 hover:shadow-md dark:hover:shadow-violet-900/10 transition-shadow">
      <div className="flex items-start justify-between">
        {/* Left: Topic Info */}
        <div className="flex-1">
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

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {session.status === 'draft' && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-3 py-2 bg-amber-100 dark:bg-violet-900/40 hover:bg-amber-200 dark:hover:bg-violet-800/50 text-amber-700 dark:text-violet-300 rounded-lg transition-colors"
              title="编辑草稿"
            >
              <Edit className="w-4 h-4" />
              <span>编辑</span>
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? '删除中...' : '删除'}</span>
          </button>

          <Link
            href={`/history/${session.id}`}
            className="flex items-center gap-2 px-3 py-2 bg-stone-100 dark:bg-[#2d2640] hover:bg-stone-200 dark:hover:bg-[#3d3654] text-stone-700 dark:text-violet-200 rounded-lg transition-colors"
            title="查看详情"
          >
            <Eye className="w-4 h-4" />
            <span>查看</span>
          </Link>
        </div>
      </div>

      {/* Preview */}
      {session.word_count > 0 && (
        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-violet-900/20">
          <p className="text-stone-400 dark:text-violet-300/40 text-sm line-clamp-2 font-serif">
            点击查看完整内容...
          </p>
        </div>
      )}
    </div>
  )
}
