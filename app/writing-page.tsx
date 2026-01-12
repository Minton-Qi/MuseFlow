"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Lightbulb, Send, X, Save } from "lucide-react";
import { useWritingStore } from "@/lib/store/writingStore";
import { useAuthStore } from "@/lib/store/authStore";
import type { Topic } from "@/lib/types";

interface WritingPageProps {
  topic: Topic;
  initialContent: string;
  existingSessionId?: string | null;
  onBack: () => void;
  onSubmit: (content: string) => void;
}

export default function WritingPage({ topic, initialContent, existingSessionId, onBack, onSubmit }: WritingPageProps) {
  const { user } = useAuthStore()
  const {
    currentSession,
    isSaving,
    lastSavedAt,
    saveError,
    startSession,
    updateContent,
    saveSession,
    clearSession,
  } = useWritingStore()

  const [showInspiration, setShowInspiration] = useState(false)
  const [currentInspirationIndex, setCurrentInspirationIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Initialize session when component mounts or topic changes
  useEffect(() => {
    startSession(topic, existingSessionId, initialContent)
    return () => clearSession()
  }, [topic.id, existingSessionId])

  // Auto-save with debouncing
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (currentSession && currentSession.content.length >= 5 && user) {
        await saveSession()
      }
    }, 5000) // Auto-save every 5 seconds of inactivity

    return () => clearTimeout(timer)
  }, [currentSession?.content, user])

  // Calculate word count
  const wordCount = currentSession?.content
    ? currentSession.content.replace(/\s/g, "").length
    : 0

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [currentSession?.content])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateContent(e.target.value)
  }

  const handleSubmit = async () => {
    if (!currentSession || currentSession.content.trim().length < 10) return

    // Save before submitting
    await saveSession()
    onSubmit(currentSession.content)
  }

  const cycleInspiration = () => {
    setCurrentInspirationIndex((prev) => (prev + 1) % topic.inspiration.angles.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 dark:from-[#0f0d1a] dark:via-[#1a1625] dark:to-[#0f0d1a]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-[#1a1625]/90 backdrop-blur-sm border-b border-stone-200 dark:border-violet-900/30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-stone-500 dark:text-violet-300/70 hover:text-stone-800 dark:hover:text-violet-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">返回选题</span>
          </button>

          <div className="text-center px-8">
            <p className="text-sm text-stone-400 dark:text-violet-300/50">当前题目</p>
            <p className="text-stone-700 dark:text-violet-100 font-medium">{topic.title}</p>
          </div>

          {/* Auto-save indicator */}
          <div className="w-24 text-right">
            {isSaving ? (
              <div className="flex items-center justify-end gap-1 text-stone-400 dark:text-violet-300/50">
                <Save className="w-4 h-4 animate-spin" />
                <span className="text-xs">保存中</span>
              </div>
            ) : lastSavedAt ? (
              <p className="text-xs text-stone-400 dark:text-violet-300/50">
                {new Date(lastSavedAt).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })} 保存
              </p>
            ) : null}
          </div>
        </div>
      </header>

      {/* Save error notification */}
      {saveError && (
        <div className="fixed top-20 right-4 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {saveError}
        </div>
      )}

      {/* Main Writing Area */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Topic Display */}
        <div className="mb-8 text-center">
          <p className="text-stone-400 dark:text-violet-300/50 text-sm mb-2">题目</p>
          <p className="text-2xl text-stone-700 dark:text-violet-100 font-serif leading-relaxed">
            {topic.prompt}
          </p>
        </div>

        {/* Writing Area */}
        <div className="relative bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-stone-200 dark:border-violet-900/30 overflow-hidden">
          <textarea
            ref={textareaRef}
            value={currentSession?.content || ''}
            onChange={handleContentChange}
            placeholder="在这里开始您的写作...&#10;&#10;让文字自然流淌，不必拘泥于形式。"
            className="w-full min-h-[500px] p-8 text-lg leading-loose text-stone-800 dark:text-violet-100 font-serif bg-transparent resize-none focus:outline-none placeholder:text-stone-300 dark:placeholder:text-violet-400/30"
            style={{ lineHeight: "2.2" }}
          />

          {/* Word Count */}
          <div className="absolute bottom-4 right-6 text-sm text-stone-400 dark:text-violet-300/50">
            {wordCount} 字
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8">
          {/* Inspiration Button */}
          <button
            onClick={() => setShowInspiration(!showInspiration)}
            className="flex items-center gap-2 px-5 py-3 bg-white/80 dark:bg-[#2d2640]/80 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all text-stone-600 dark:text-violet-200 hover:text-stone-800 dark:hover:text-violet-100 border border-stone-200 dark:border-violet-700/30"
          >
            <Lightbulb className="w-5 h-5" />
            <span>灵感</span>
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!currentSession || currentSession.content.trim().length < 10}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-stone-700 to-stone-800 dark:from-violet-600 dark:to-indigo-600 text-white rounded-full shadow-sm hover:shadow-lg dark:hover:shadow-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            <span>完成写作</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Minimum word hint */}
        {currentSession?.content && currentSession.content.trim().length < 10 && (
          <p className="text-center mt-4 text-sm text-stone-400 dark:text-violet-300/50">
            请至少写 10 个字...
          </p>
        )}
      </main>

      {/* Inspiration Drawer */}
      {showInspiration && (
        <InspirationDrawer
          topic={topic}
          currentIndex={currentInspirationIndex}
          onCycle={cycleInspiration}
          onClose={() => setShowInspiration(false)}
        />
      )}
    </div>
  );
}

// Inspiration Drawer Component
function InspirationDrawer({
  topic,
  currentIndex,
  onCycle,
  onClose
}: {
  topic: Topic;
  currentIndex: number;
  onCycle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative bg-white dark:bg-[#1a1625] rounded-t-3xl shadow-2xl dark:shadow-violet-900/20 w-full max-w-2xl p-8 transform transition-transform animate-slideUp">
        {/* Handle */}
        <div className="w-12 h-1 bg-stone-300 dark:bg-violet-700/50 rounded-full mx-auto mb-6" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-stone-400 dark:text-violet-300/50 hover:text-stone-600 dark:hover:text-violet-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-6 h-6 text-amber-500 dark:text-violet-400" />
          <h3 className="text-xl font-semibold text-stone-800 dark:text-violet-100">构思灵感</h3>
        </div>

        {/* Current Angle */}
        <div className="bg-amber-50 dark:bg-violet-900/30 rounded-xl p-6 mb-6 border border-transparent dark:border-violet-700/30">
          <p className="text-sm text-amber-600 dark:text-violet-400 mb-2">构思角度 {currentIndex + 1}</p>
          <p className="text-stone-700 dark:text-violet-100 leading-relaxed">
            {topic.inspiration.angles[currentIndex]}
          </p>
        </div>

        {/* Cycle Button */}
        <button
          onClick={onCycle}
          className="w-full py-3 bg-stone-100 dark:bg-violet-900/40 hover:bg-stone-200 dark:hover:bg-violet-800/50 rounded-xl text-stone-600 dark:text-violet-200 transition-colors border border-transparent dark:border-violet-700/30"
        >
          换一个角度
        </button>

        {/* Examples Section */}
        <div className="mt-8">
          <p className="text-sm text-stone-400 dark:text-violet-300/50 mb-4">名家示例</p>
          <div className="space-y-4">
            {topic.inspiration.examples.map((example, index) => (
              <div
                key={index}
                className="bg-stone-50 dark:bg-[#2d2640] rounded-xl p-5 border-l-4 border-stone-300 dark:border-violet-500/50"
              >
                <p className="text-stone-600 dark:text-violet-200/80 leading-relaxed font-serif italic">
                  {example}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
