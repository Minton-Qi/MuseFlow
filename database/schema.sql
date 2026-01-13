-- MuseFlow Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Topics Table (写作题目表)
-- ============================================
CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('imagination', 'emotion', 'reflection', 'creative', 'philosophical')),
  inspiration JSONB NOT NULL DEFAULT '{"angles": [], "examples": []}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample topics
INSERT INTO public.topics (id, title, prompt, category, inspiration) VALUES
  ('imagination-1', '星空下的对话', '如果星星会说话，它们会告诉你什么秘密？', 'imagination', '{"angles": ["以第一人称视角描写与星星的对话", "想象星星之间在互相交谈", "星星向地球传递古老的信息"], "examples": ["我仰望星空，听见最亮的那颗说...'s"]}),

  ('emotion-1', '雨中的心情', '描述一场雨带给你的情感变化。', 'emotion', '{"angles": ["从喜悦到忧郁的转变", "雨天如何唤起某段回忆", "雨声作为情感的载体"], "examples": ["窗外的雨淅淅沥沥，像是在诉说..."]}'),

  ('reflection-1', '镜像中的自己', '当你凝视镜子里的自己时，你在想什么？', 'reflection', '{"angles": ["观察自己的外貌变化", "思考自己的成长历程", "与镜中人的对话"], "examples": ["镜子里的那双眼睛，似乎看透了我..."]}'),

  ('creative-1', '未寄出的信', '写一封永远不会寄出的信。', 'creative', '{"angles": ["写给过去的自己", "写给未来的自己", "写给失去的人"], "examples": ["亲爱的，这封信我写了很久，却从未..."]}'),

  ('philosophical-1', '时间的颜色', '如果时间有颜色，它会是什么样子？', 'philosophical', '{"angles": ["童年时期的时间颜色", "现在的感受", "想象时间变成实体"], "examples": ["在我看来，时间是流动的紫色..."]}')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Writing Sessions Table (写作会话表)
-- ============================================
CREATE TABLE IF NOT EXISTS public.writing_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  word_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'completed')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_writing_sessions_user_id ON public.writing_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_writing_sessions_created_at ON public.writing_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_writing_sessions_status ON public.writing_sessions(status);

-- ============================================
-- Feedback History Table (反馈历史表)
-- ============================================
CREATE TABLE IF NOT EXISTS public.feedback_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.writing_sessions(id) ON DELETE CASCADE,
  scores JSONB NOT NULL DEFAULT '{}',
  encouragement TEXT NOT NULL,
  suggestions TEXT[] NOT NULL DEFAULT '{}',
  improved_sentence JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_feedback_history_session_id ON public.feedback_history(session_id);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.writing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_history ENABLE ROW LEVEL SECURITY;

-- Writing Sessions Policies
CREATE POLICY "Users can view own sessions"
  ON public.writing_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.writing_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON public.writing_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON public.writing_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Feedback History Policies
CREATE POLICY "Users can view own feedback"
  ON public.feedback_history FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.writing_sessions
      WHERE id = session_id
    )
  );

CREATE POLICY "Users can insert own feedback"
  ON public.feedback_history FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.writing_sessions
      WHERE id = session_id
    )
  );

-- ============================================
-- Functions and Triggers
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_writing_sessions_updated_at
  BEFORE UPDATE ON public.writing_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- Grant Permissions
-- ============================================

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.topics TO authenticated;
GRANT ALL ON public.writing_sessions TO authenticated;
GRANT ALL ON public.feedback_history TO authenticated;

-- Grant access to service role (for server-side operations)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ============================================
-- Notes
-- ============================================
-- 1. After running this script, your database will be ready
-- 2. The topics table includes 5 sample topics
-- 3. RLS policies ensure users can only access their own data
-- 4. The improved_sentence column stores optional sentence improvement suggestions
-- 5. All timestamps use UTC
