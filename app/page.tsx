"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, RefreshCw } from "lucide-react";
import { getRandomTopics } from "@/lib/topics";
import { useAuthStore } from "@/lib/store/authStore";
import { Header } from "@/components/common/Header";
import type { Topic } from "@/lib/types";
import WritingPage from "./writing-page";
import FeedbackPage from "./feedback-page";

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuthStore()
  const [topics, setTopics] = useState<Topic[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [writingContent, setWritingContent] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Initialize topics only on client side to avoid hydration mismatch
  useEffect(() => {
    setTopics(getRandomTopics(3));
    setMounted(true);

    // Check if editing an existing session
    const editSessionId = searchParams.get('session')
    if (editSessionId) {
      loadSessionForEdit(editSessionId)
    }
  }, [searchParams]);

  // Load existing session for editing
  const loadSessionForEdit = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/writing/sessions/${sessionId}`)
      if (response.ok) {
        const { session } = await response.json()

        // Only allow editing drafts
        if (session.status !== 'draft') {
          alert('只能编辑草稿状态的写作')
          router.push('/')
          return
        }

        // Find the topic from our topics database
        const topicFromDb = {
          id: session.topics.id,
          title: session.topics.title,
          prompt: session.topics.prompt,
          category: session.topics.category,
          inspiration: {
            angles: [],
            examples: []
          }
        }

        setSelectedTopic(topicFromDb as Topic)
        setWritingContent(session.content || '')
        setSessionId(sessionId)
      }
    } catch (error) {
      console.error('Failed to load session:', error)
      alert('加载会话失败')
      router.push('/')
    }
  }

  const handleRefreshTopics = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTopics(getRandomTopics(3));
      setIsRefreshing(false);
    }, 600);
  };

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setWritingContent("");
    setShowFeedback(false);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setWritingContent("");
    setShowFeedback(false);
  };

  const handleSubmitWriting = (content: string) => {
    setWritingContent(content);
    setShowFeedback(true);
  };

  const handleStartNew = () => {
    setSelectedTopic(null);
    setWritingContent("");
    setShowFeedback(false);
    handleRefreshTopics();
  };

  // Show feedback page
  if (showFeedback && selectedTopic && writingContent) {
    return (
      <>
        <Header />
        <FeedbackPage
          topic={selectedTopic}
          content={writingContent}
          onStartNew={handleStartNew}
          onBack={() => setShowFeedback(false)}
        />
      </>
    );
  }

  // Show writing page
  if (selectedTopic) {
    return (
      <>
        <Header />
        <WritingPage
          topic={selectedTopic}
          initialContent={writingContent}
          existingSessionId={sessionId}
          onBack={handleBackToTopics}
          onSubmit={handleSubmitWriting}
        />
      </>
    );
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 dark:from-[#0f0d1a] dark:via-[#1a1625] dark:to-[#0f0d1a] flex items-center justify-center">
        <div className="text-stone-400 dark:text-violet-300/60">加载中...</div>
      </div>
    )
  }

  // Show topic selection page
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 dark:from-[#0f0d1a] dark:via-[#1a1625] dark:to-[#0f0d1a]">
      <Header />

      {/* Hero Section */}
      <header className="pt-8 sm:pt-12 pb-6 sm:pb-8 text-center px-4">
        <h1 className="text-2xl sm:text-4xl font-light text-stone-800 dark:text-violet-100 tracking-wide mb-2">
          选择航线，开启你的旅程
        </h1>
        <p className="text-sm sm:text-base text-stone-500 dark:text-violet-300/70">
          {user ? "继续探索你的内心世界" : "登录以保存你的作品"}
        </p>
      </header>

      {/* Topic Cards */}
      <main className="max-w-5xl mx-auto px-6 pb-16">
        {!mounted ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-stone-400">加载中...</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                index={index}
                onSelect={handleSelectTopic}
              />
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={handleRefreshTopics}
            disabled={isRefreshing}
            className="group flex items-center gap-2 px-6 py-3 bg-white/60 dark:bg-[#2d2640]/60 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white dark:hover:bg-[#3d3654] text-stone-600 dark:text-violet-200 hover:text-stone-800 dark:hover:text-violet-100 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 transition-transform duration-600 ${
                isRefreshing ? "rotate-180" : ""
              } group-hover:rotate-90`}
            />
            <span className="text-sm">换一批题目</span>
          </button>
        </div>

        {/* Footer Quote */}
        <div className="mt-16 text-center">
          <blockquote className="text-stone-400 dark:text-violet-300/50 font-serif text-lg italic">
            "写作是一场与自己的对话，让文字成为灵魂的镜像。"
          </blockquote>
        </div>
      </main>
    </div>
  );
}

// Topic Card Component
function TopicCard({ topic, index, onSelect }: { topic: Topic; index: number; onSelect: (topic: Topic) => void }) {
  const categoryEmojis: Record<Topic["category"], string> = {
    imagination: "🌙",
    emotion: "💫",
    reflection: "🪞",
    creative: "✨",
    philosophical: "🌊"
  };

  return (
    <button
      onClick={() => onSelect(topic)}
      className="group relative bg-white dark:bg-[#1a1625] rounded-2xl p-8 shadow-sm hover:shadow-xl dark:hover:shadow-violet-900/20 transition-all duration-500 hover:-translate-y-2 text-left border border-stone-100 dark:border-violet-900/30 hover:border-stone-200 dark:hover:border-violet-500/40"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
      }}
    >
      {/* Category Icon */}
      <div className="text-3xl mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
        {categoryEmojis[topic.category]}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-stone-800 dark:text-violet-100 mb-4 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">
        {topic.title}
      </h3>

      {/* Prompt */}
      <p className="text-stone-600 dark:text-violet-200/80 leading-relaxed font-serif">
        {topic.prompt}
      </p>

      {/* Hover Indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Sparkles className="w-5 h-5 text-amber-500 dark:text-violet-400" />
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
        <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-stone-200 dark:from-violet-500/30 to-transparent" />
        <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-stone-200 dark:from-violet-500/30 to-transparent" />
      </div>
    </button>
  );
}
