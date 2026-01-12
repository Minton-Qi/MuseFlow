"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Feather, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn(email, password)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 dark:from-[#0f0d1a] dark:via-[#1a1625] dark:to-[#0f0d1a] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm dark:shadow-violet-900/10 border border-stone-200 dark:border-violet-900/30 p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Feather className="w-8 h-8 text-stone-600 dark:text-violet-300" />
          <h1 className="text-2xl font-light text-stone-800 dark:text-violet-100">
            灵泉 <span className="font-serif text-stone-500 dark:text-violet-300/70">MuseFlow</span>
          </h1>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-stone-800 dark:text-violet-100 mb-2">欢迎回来</h2>
          <p className="text-stone-500 dark:text-violet-300/70">登录以继续您的写作之旅</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-violet-200 mb-1">
              邮箱
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 dark:text-violet-400/50" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-stone-300 dark:border-violet-700/30 rounded-lg focus:ring-2 focus:ring-stone-500 dark:focus:ring-violet-500 focus:border-stone-500 dark:focus:border-violet-500 outline-none transition-colors bg-white dark:bg-[#2d2640] text-stone-800 dark:text-violet-100"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 dark:text-violet-200 mb-1">
              密码
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 dark:text-violet-400/50" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-stone-300 dark:border-violet-700/30 rounded-lg focus:ring-2 focus:ring-stone-500 dark:focus:ring-violet-500 focus:border-stone-500 dark:focus:border-violet-500 outline-none transition-colors bg-white dark:bg-[#2d2640] text-stone-800 dark:text-violet-100"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-stone-700 to-stone-800 dark:from-violet-600 dark:to-indigo-600 text-white rounded-lg hover:shadow-lg dark:hover:shadow-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-stone-500 dark:text-violet-300/70 text-sm">
          还没有账号？{' '}
          <Link href="/register" className="text-stone-700 dark:text-violet-300 font-medium hover:underline">
            注册
          </Link>
        </p>
      </div>
    </div>
  )
}
