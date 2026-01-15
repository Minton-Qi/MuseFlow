"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, Mail, Calendar, Target, Trophy, Flame, LogOut } from 'lucide-react'
import { Header } from '@/components/common/Header'
import { useAuthStore } from '@/lib/store/authStore'
import { StatCard } from '@/components/profile/StatCard'

interface UserStats {
  total_sessions: number
  total_words: number
  average_creativity_score: number | null
  average_emotion_score: number | null
  average_expression_score: number | null
  average_logic_score: number | null
  average_vocabulary_score: number | null
  last_activity_at: string | null
  current_streak: number
}

interface ChartData {
  created_at: string
  word_count: number
}

export default function ProfilePage() {
  const { user, signOut } = useAuthStore()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }
  const [stats, setStats] = useState<UserStats | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch('/api/statistics/user')
        if (response.ok) {
          const data = await response.json()
          setStats(data.statistics)
          setChartData(data.chartData || [])
        }
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const avgScore =
    stats && stats.average_creativity_score
      ? Math.round(
          ((stats.average_creativity_score || 0) +
            (stats.average_emotion_score || 0) +
            (stats.average_expression_score || 0) +
            (stats.average_logic_score || 0) +
            (stats.average_vocabulary_score || 0)) / 5
        )
      : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 dark:from-[#0f0d1a] dark:via-[#1a1625] dark:to-[#0f0d1a]">
      <Header />

      <header className="pt-8 pb-6 text-center">
        <h1 className="text-3xl font-light text-stone-800 dark:text-violet-100 mb-2">个人中心</h1>
        <p className="text-stone-500 dark:text-violet-300/70">查看您的写作统计</p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-16 space-y-8">
        {/* User Info Card */}
        <div className="bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-stone-200 dark:border-violet-900/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 dark:from-violet-700 dark:to-indigo-700 flex items-center justify-center">
                <User className="w-8 h-8 text-stone-500 dark:text-violet-200" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-stone-800 dark:text-violet-100 truncate">
                  {user?.email || '用户'}
                </h2>
                <div className="flex items-center gap-4 text-sm text-stone-400 dark:text-violet-300/50 mt-1">
                  <div className="flex items-center gap-1 truncate">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  {stats?.last_activity_at && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Calendar className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        上次活动:{' '}
                        {new Date(stats.last_activity_at).toLocaleDateString('zh-CN')}
                      </span>
                      <span className="sm:hidden">
                        {new Date(stats.last_activity_at).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="ml-4 flex items-center gap-2 px-4 py-2 text-stone-600 dark:text-violet-200/80 hover:text-stone-800 dark:hover:text-violet-100 hover:bg-stone-100 dark:hover:bg-[#2d2640] rounded-lg transition-colors text-sm flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">退出登录</span>
              <span className="sm:hidden">退出</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-stone-400 dark:text-violet-300/50">加载中...</div>
          </div>
        ) : stats && stats.total_sessions > 0 ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<Trophy className="w-6 h-6" />}
                label="总篇数"
                value={stats.total_sessions}
                color="amber"
              />
              <StatCard
                icon={<FileText className="w-6 h-6" />}
                label="总字数"
                value={stats.total_words}
                color="stone"
              />
              <StatCard
                icon={<Target className="w-6 h-6" />}
                label="平均分"
                value={avgScore ? `${avgScore}分` : '-'}
                color="blue"
              />
              <StatCard
                icon={<Flame className="w-6 h-6" />}
                label="连续创作"
                value={`${stats.current_streak}天`}
                color="orange"
              />
            </div>

            {/* Score Breakdown */}
            {stats.average_creativity_score && (
              <div className="bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-stone-200 dark:border-violet-900/30 p-6">
                <h3 className="text-lg font-semibold text-stone-800 dark:text-violet-100 mb-4">能力维度</h3>
                <div className="space-y-4">
                  {[
                    { label: '创意', value: stats.average_creativity_score },
                    { label: '情感', value: stats.average_emotion_score },
                    { label: '表达', value: stats.average_expression_score },
                    { label: '逻辑', value: stats.average_logic_score },
                    { label: '词汇', value: stats.average_vocabulary_score },
                  ].map((dimension) => (
                    <div key={dimension.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-stone-600 dark:text-violet-200/70">{dimension.label}</span>
                        <span className="text-stone-800 dark:text-violet-100 font-medium">
                          {dimension.value?.toFixed(1) || '-'}
                        </span>
                      </div>
                      <div className="h-2 bg-stone-100 dark:bg-[#2d2640] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-stone-400 to-stone-600 dark:from-violet-500 dark:to-indigo-500 rounded-full transition-all"
                          style={{ width: `${dimension.value || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Chart */}
            {chartData.length > 0 && (
              <div className="bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-stone-200 dark:border-violet-900/30 p-6">
                <h3 className="text-lg font-semibold text-stone-800 dark:text-violet-100 mb-4">近期活动</h3>
                <div className="flex items-end gap-2 h-32">
                  {chartData.slice(-14).map((data, i) => {
                    const maxWords = Math.max(...chartData.map(d => d.word_count), 1)
                    const height = (data.word_count / maxWords) * 100
                    return (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <div
                          className="w-full bg-gradient-to-t from-stone-600 to-stone-400 dark:from-violet-600 dark:to-violet-400 rounded-t transition-all hover:from-stone-700 hover:to-stone-500 dark:hover:from-violet-500 dark:hover:to-violet-300"
                          style={{ height: `${Math.max(height, 4)}%` }}
                          title={`${data.word_count} 字`}
                        />
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-stone-400 dark:text-violet-300/50 mt-2 text-center">
                  最近 14 天的写作字数
                </p>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-32">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 dark:from-violet-700 dark:to-indigo-700 flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-stone-500 dark:text-violet-200" />
            </div>
            <h3 className="text-xl font-semibold text-stone-600 dark:text-violet-200 mb-2">
              暂无统计数据
            </h3>
            <p className="text-stone-400 dark:text-violet-300/50 mb-6">开始您的第一次写作吧</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-stone-700 to-stone-800 dark:from-violet-600 dark:to-indigo-600 text-white rounded-full hover:shadow-lg dark:hover:shadow-violet-500/20 transition-all"
            >
              开始写作
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

function FileText({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  )
}
