"use client"

import Link from 'next/link'
import { Feather, User, LogOut, History, Home, Menu, X } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'
import { ThemeToggle } from './ThemeToggle'
import { useState } from 'react'

export function Header() {
  const { user, signOut } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <header className="bg-white/80 dark:bg-[#1a1625]/90 backdrop-blur-sm border-b border-stone-200 dark:border-violet-900/30 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Feather className="w-5 h-5 sm:w-6 sm:h-6 text-stone-600 dark:text-violet-300" />
          <span className="text-base sm:text-xl font-light text-stone-800 dark:text-violet-100">
            灵泉
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-4">
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

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 dark:text-violet-200/80 hover:text-stone-800 dark:hover:text-violet-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && user && (
        <nav className="sm:hidden border-t border-stone-200 dark:border-violet-900/30 py-4 px-4">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-stone-600 dark:text-violet-200/80 hover:text-stone-800 dark:hover:text-violet-100 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>写作</span>
            </Link>

            <Link
              href="/history"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-stone-600 dark:text-violet-200/80 hover:text-stone-800 dark:hover:text-violet-100 transition-colors"
            >
              <History className="w-5 h-5" />
              <span>历史</span>
            </Link>

            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-stone-600 dark:text-violet-200/80 hover:text-stone-800 dark:hover:text-violet-100 transition-colors"
            >
              <User className="w-5 h-5" />
              <span>我的</span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
