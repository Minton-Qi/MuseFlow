-- ============================================
-- MuseFlow Database Schema
-- ============================================
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE
-- Extends Supabase Auth users with additional profile data
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. TOPICS TABLE
-- Stores writing prompts/topics
-- ============================================
CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('imagination', 'emotion', 'reflection', 'creative', 'philosophical')),
  inspiration JSONB NOT NULL DEFAULT '{"angles": [], "examples": []}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. WRITING SESSIONS TABLE
-- Stores user writing sessions
-- ============================================
CREATE TABLE IF NOT EXISTS public.writing_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  word_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'archived')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. FEEDBACK HISTORY TABLE
-- Stores AI feedback for writing sessions
-- ============================================
CREATE TABLE IF NOT EXISTS public.feedback_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.writing_sessions(id) ON DELETE CASCADE NOT NULL,
  scores JSONB NOT NULL DEFAULT '{"creativity": 0, "emotion": 0, "expression": 0, "logic": 0, "vocabulary": 0}'::jsonb,
  encouragement TEXT NOT NULL,
  suggestions TEXT[] NOT NULL DEFAULT '{}',
  improved_sentence JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. USER STATISTICS TABLE
-- Materialized user statistics for performance
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_statistics (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  total_words INTEGER NOT NULL DEFAULT 0,
  average_creativity_score DECIMAL(5,2),
  average_emotion_score DECIMAL(5,2),
  average_expression_score DECIMAL(5,2),
  average_logic_score DECIMAL(5,2),
  average_vocabulary_score DECIMAL(5,2),
  last_activity_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
-- Writing sessions indexes
CREATE INDEX IF NOT EXISTS idx_writing_sessions_user_id ON public.writing_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_writing_sessions_topic_id ON public.writing_sessions(topic_id);
CREATE INDEX IF NOT EXISTS idx_writing_sessions_created_at ON public.writing_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_writing_sessions_status ON public.writing_sessions(status);

-- Feedback history indexes
CREATE INDEX IF NOT EXISTS idx_feedback_history_session_id ON public.feedback_history(session_id);

-- User statistics index
CREATE INDEX IF NOT EXISTS idx_user_statistics_last_activity ON public.user_statistics(last_activity_at DESC);

-- ============================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to writing_sessions
DROP TRIGGER IF EXISTS update_writing_sessions_updated_at ON public.writing_sessions;
CREATE TRIGGER update_writing_sessions_updated_at
  BEFORE UPDATE ON public.writing_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to user_statistics
DROP TRIGGER IF EXISTS update_user_statistics_updated_at ON public.user_statistics;
CREATE TRIGGER update_user_statistics_updated_at
  BEFORE UPDATE ON public.user_statistics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;
-- Topics table is public, no RLS needed

-- ============================================
-- GRANTS
-- ============================================
-- Allow authenticated users to access their data
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.writing_sessions TO authenticated;
GRANT ALL ON public.feedback_history TO authenticated;
GRANT ALL ON public.user_statistics TO authenticated;

-- Allow everyone to read topics
GRANT SELECT ON public.topics TO anon, authenticated;
