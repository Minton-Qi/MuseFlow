"use client"

import Link from 'next/link'
import { Feather, User, LogOut, History, Home } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const { user, signOut } = useAuthStore()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <header className="bg-white/80 dark:bg-[#1a1625]/90 backdrop-blur-sm border-b border-stone-200 dark:border-violet-900/30 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Feather className="w-6 h-6 text-stone-600 dark:text-violet-300" />
          <span className="text-xl font-light text-stone-800 dark:text-violet-100">
            灵泉 <span className="font-serif text-stone-500 dark:text-violet-300/70">MuseFlow</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <ThemeToggle />

          <div className="flex items-center gap-6">
            {user ? (
            <>
              <Link
                href="/"
                className="flex items-center gap-1 text-stone-600 dark:text-violet-200/80 hover:text-stone-800 dark:hover:text-violet-100 transition-colors text-sm"
              >
                <Home className="w-4 h-4" />
                <span>写作</span>
              </Link>

              <Link
                href="/history"
                className="flex items-center gap-1 text-stone-600 dark:text-violet-200/80 hover:text-stone-800 dark:hover:text-violet-100 transition-colors text-sm"
              >
                <History className="w-4 h-4" />
                <span>历史</span>
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-1 text-stone-600 dark:text-violet-200/80 hover:text-stone-800 dark:hover:text-violet-100 transition-colors text-sm"
              >
                <User className="w-4 h-4" />
                <span>我的</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 text-stone-600 dark:text-violet-200/80 hover:text-stone-800 dark:hover:text-violet-100 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>退出</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-stone-600 dark:text-violet-200/80 hover:text-stone-800 dark:hover:text-violet-100 transition-colors text-sm"
              >
                登录
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-stone-700 to-stone-800 dark:from-violet-600 dark:to-indigo-600 text-white rounded-full text-sm hover:shadow-md dark:hover:shadow-violet-500/20 transition-all"
              >
                注册
              </Link>
            </>
          )}
          </div>
        </nav>
      </div>
    </header>
  )
}
