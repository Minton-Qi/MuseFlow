"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Download, Sparkles, Star, RefreshCw } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import type { Topic } from "@/lib/types";
import { generateWritingFeedback } from "@/lib/feedback";
import type { WritingFeedback } from "@/lib/types";
import { useWritingStore } from "@/lib/store/writingStore";
import { useAuthStore } from "@/lib/store/authStore";

interface FeedbackPageProps {
  topic: Topic;
  content: string;
  onStartNew: () => void;
  onBack: () => void;
}

const scoreLabels: Record<keyof WritingFeedback["scores"], string> = {
  creativity: "创意",
  emotion: "情感",
  expression: "表达",
  logic: "逻辑",
  vocabulary: "词汇"
};

export default function FeedbackPage({ topic, content, onStartNew, onBack }: FeedbackPageProps) {
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { currentSession } = useWritingStore();

  useEffect(() => {
    const loadFeedback = async () => {
      const result = await generateWritingFeedback(content, topic.prompt);
      setFeedback(result);
      setIsAnalyzing(false);

      // Save completed writing session and feedback to database
      if (user && currentSession) {
        await saveSessionAndFeedback(result);
      }
    };
    loadFeedback();
  }, [content, topic.prompt]);

  const saveSessionAndFeedback = async (feedbackResult: WritingFeedback) => {
    try {
      // Use the existing session from writing page, or create new one if needed
      let sessionId = currentSession?.id;

      if (sessionId) {
        // Update existing session to completed status
        const updateResponse = await fetch(`/api/writing/sessions/${sessionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: content,
            word_count: content.replace(/\s/g, "").length,
            status: 'completed',
            completed_at: new Date().toISOString(),
          }),
        });

        if (!updateResponse.ok) {
          console.error('Failed to update session');
          return;
        }
      } else {
        // No existing session, create a new one (fallback for when user didn't log in when starting)
        const sessionResponse = await fetch('/api/writing/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic_id: topic.id,
            content: content,
            word_count: content.replace(/\s/g, "").length,
            status: 'completed',
            completed_at: new Date().toISOString(),
          }),
        });

        if (!sessionResponse.ok) {
          console.error('Failed to save session');
          return;
        }

        const { session } = await sessionResponse.json();
        sessionId = session.id;
      }

      setSessionId(sessionId!);

      // Then, save the feedback
      const feedbackResponse = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          scores: feedbackResult.scores,
          encouragement: feedbackResult.encouragement,
          suggestions: feedbackResult.suggestions,
          improved_sentence: feedbackResult.improvedSentence,
        }),
      });

      if (!feedbackResponse.ok) {
        console.error('Failed to save feedback');
      }
    } catch (error) {
      console.error('Error saving session and feedback:', error);
    }
  };

  const handleExport = () => {
    // Simple text export
    const text = `
《灵泉 MuseFlow》写作反馈

题目：${topic.title}
${topic.prompt}

您的文字：
${content}

${feedback ? `
评分：
创意：${feedback.scores.creativity}分
情感：${feedback.scores.emotion}分
表达：${feedback.scores.expression}分
逻辑：${feedback.scores.logic}分
词汇：${feedback.scores.vocabulary}分

评价：
${feedback.encouragement}

建议：
${feedback.suggestions.map(s => `• ${s}`).join("\n")}

${feedback.improvedSentence ? `
佳句润色：
原句：${feedback.improvedSentence.original}
润色：${feedback.improvedSentence.improved}
` : ""}
` : ""}
    `;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `灵泉写作反馈-${new Date().toLocaleDateString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (isAnalyzing || !feedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 dark:from-[#0f0d1a] dark:via-[#1a1625] dark:to-[#0f0d1a] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-stone-200 dark:border-violet-900/50"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 dark:border-t-violet-500 animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-amber-500 dark:text-violet-400 animate-pulse" />
          </div>
          <p className="text-xl text-stone-600 dark:text-violet-200 font-light">正在品读您的文字...</p>
          <p className="text-stone-400 dark:text-violet-300/50 mt-2">这需要几秒钟时间</p>
        </div>
      </div>
    );
  }

  // Prepare radar chart data
  const radarData = Object.entries(feedback.scores).map(([key, value]) => ({
    subject: scoreLabels[key as keyof typeof scoreLabels],
    value: value,
    fullMark: 100
  }));

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
            <span className="text-sm">返回写作</span>
          </button>

          <h1 className="text-lg font-medium text-stone-800 dark:text-violet-100">写作反馈</h1>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 text-stone-500 dark:text-violet-300/70 hover:text-stone-800 dark:hover:text-violet-100 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span className="text-sm">导出</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Section A: Radar Chart */}
        <section className="bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-stone-200 dark:border-violet-900/30 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-6 h-6 text-amber-500 dark:text-violet-400" />
            <h2 className="text-xl font-semibold text-stone-800 dark:text-violet-100">多维度评分</h2>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#78716C" className="dark:stroke-violet-700/50" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#78716C", fontSize: 14 }} className="dark:[&_text]:fill-violet-300" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#A8A29E", fontSize: 12 }} />
                <Radar
                  name="评分"
                  dataKey="value"
                  stroke="#D97706"
                  fill="#F59E0B"
                  fillOpacity={0.5}
                  strokeWidth={2}
                  className="dark:stroke-violet-400 dark:fill-violet-500"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Score Summary */}
          <div className="grid grid-cols-5 gap-4 mt-8">
            {Object.entries(feedback.scores).map(([key, value]) => (
              <div key={key} className="text-center">
                <p className="text-2xl font-semibold text-amber-600 dark:text-violet-400">{value}</p>
                <p className="text-xs text-stone-400 dark:text-violet-300/50 mt-1">{scoreLabels[key as keyof typeof scoreLabels]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section B: Encouragement */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-2xl shadow-sm border border-amber-200 dark:border-violet-700/30 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-amber-600 dark:text-violet-400" />
            <h2 className="text-xl font-semibold text-stone-800 dark:text-violet-100">暖心评价</h2>
          </div>

          <p className="text-lg text-stone-700 dark:text-violet-100 leading-relaxed font-serif">
            {feedback.encouragement}
          </p>
        </section>

        {/* Suggestions */}
        {feedback.suggestions.length > 0 && (
          <section className="bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-stone-200 dark:border-violet-900/30 p-8">
            <h3 className="text-lg font-semibold text-stone-800 dark:text-violet-100 mb-4">改进建议</h3>
            <ul className="space-y-3">
              {feedback.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-violet-900/50 text-amber-600 dark:text-violet-400 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="text-stone-600 dark:text-violet-200/80 leading-relaxed">{suggestion}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Section C: Improved Sentence */}
        {feedback.improvedSentence && (
          <section className="bg-white dark:bg-[#1a1625] rounded-2xl shadow-sm border border-stone-200 dark:border-violet-900/30 p-8">
            <h3 className="text-lg font-semibold text-stone-800 dark:text-violet-100 mb-4">佳句润色</h3>

            <div className="space-y-4">
              <div className="bg-stone-50 dark:bg-[#2d2640] rounded-xl p-5 border-l-4 border-stone-400 dark:border-violet-500/50">
                <p className="text-xs text-stone-400 dark:text-violet-300/50 mb-2">原句</p>
                <p className="text-stone-600 dark:text-violet-200/80 font-serif">{feedback.improvedSentence.original}</p>
              </div>

              <div className="bg-amber-50 dark:bg-violet-900/30 rounded-xl p-5 border-l-4 border-amber-500 dark:border-violet-500">
                <p className="text-xs text-amber-600 dark:text-violet-400 mb-2">润色建议</p>
                <p className="text-stone-700 dark:text-violet-100 font-serif">{feedback.improvedSentence.improved}</p>
              </div>
            </div>
          </section>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 py-4 bg-white dark:bg-[#1a1625] border border-stone-300 dark:border-violet-700/30 text-stone-600 dark:text-violet-200 rounded-xl hover:bg-stone-50 dark:hover:bg-[#2d2640] transition-colors"
          >
            返回修改
          </button>
          <button
            onClick={onStartNew}
            className="flex-1 py-4 bg-gradient-to-r from-stone-700 to-stone-800 dark:from-violet-600 dark:to-indigo-600 text-white rounded-xl hover:shadow-lg dark:hover:shadow-violet-500/20 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            开启下一篇
          </button>
        </div>
      </main>
    </div>
  );
}
