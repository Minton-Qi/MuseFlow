-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensure users can only access their own data
-- ============================================

-- ============================================
-- 1. PROFILES POLICIES
-- ============================================

-- Users can view all profiles (for public profile pages)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. WRITING SESSIONS POLICIES
-- ============================================

-- Users can view their own writing sessions
DROP POLICY IF EXISTS "Users can view own sessions" ON public.writing_sessions;
CREATE POLICY "Users can view own sessions"
  ON public.writing_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own writing sessions
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.writing_sessions;
CREATE POLICY "Users can insert own sessions"
  ON public.writing_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own writing sessions
DROP POLICY IF EXISTS "Users can update own sessions" ON public.writing_sessions;
CREATE POLICY "Users can update own sessions"
  ON public.writing_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own writing sessions
DROP POLICY IF EXISTS "Users can delete own sessions" ON public.writing_sessions;
CREATE POLICY "Users can delete own sessions"
  ON public.writing_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 3. FEEDBACK HISTORY POLICIES
-- ============================================

-- Users can view feedback for their own sessions
DROP POLICY IF EXISTS "Users can view own feedback" ON public.feedback_history;
CREATE POLICY "Users can view own feedback"
  ON public.feedback_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.writing_sessions
      WHERE writing_sessions.id = feedback_history.session_id
      AND writing_sessions.user_id = auth.uid()
    )
  );

-- Users can insert feedback for their own sessions
DROP POLICY IF EXISTS "Users can insert own feedback" ON public.feedback_history;
CREATE POLICY "Users can insert own feedback"
  ON public.feedback_history FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.writing_sessions
      WHERE writing_sessions.id = feedback_history.session_id
      AND writing_sessions.user_id = auth.uid()
    )
  );

-- Users can update their own feedback
DROP POLICY IF EXISTS "Users can update own feedback" ON public.feedback_history;
CREATE POLICY "Users can update own feedback"
  ON public.feedback_history FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.writing_sessions
      WHERE writing_sessions.id = feedback_history.session_id
      AND writing_sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.writing_sessions
      WHERE writing_sessions.id = feedback_history.session_id
      AND writing_sessions.user_id = auth.uid()
    )
  );

-- Users can delete their own feedback
DROP POLICY IF EXISTS "Users can delete own feedback" ON public.feedback_history;
CREATE POLICY "Users can delete own feedback"
  ON public.feedback_history FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.writing_sessions
      WHERE writing_sessions.id = feedback_history.session_id
      AND writing_sessions.user_id = auth.uid()
    )
  );

-- ============================================
-- 4. USER STATISTICS POLICIES
-- ============================================

-- Users can view their own statistics
DROP POLICY IF EXISTS "Users can view own statistics" ON public.user_statistics;
CREATE POLICY "Users can view own statistics"
  ON public.user_statistics FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own statistics
DROP POLICY IF EXISTS "Users can insert own statistics" ON public.user_statistics;
CREATE POLICY "Users can insert own statistics"
  ON public.user_statistics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own statistics
DROP POLICY IF EXISTS "Users can update own statistics" ON public.user_statistics;
CREATE POLICY "Users can update own statistics"
  ON public.user_statistics FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own statistics
DROP POLICY IF EXISTS "Users can delete own statistics" ON public.user_statistics;
CREATE POLICY "Users can delete own statistics"
  ON public.user_statistics FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 5. AUTOMATIC STATISTICS UPDATE FUNCTION
-- ============================================

-- Function to trigger statistics update when a session is completed
CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user statistics
  INSERT INTO public.user_statistics (user_id, total_sessions, total_words, last_activity_at)
  VALUES (
    NEW.user_id,
    1,
    NEW.word_count,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_sessions = user_statistics.total_sessions + 1,
    total_words = user_statistics.total_words + NEW.word_count,
    last_activity_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update statistics on session insert
DROP TRIGGER IF EXISTS trigger_update_statistics_on_session_create
  ON public.writing_sessions;
CREATE TRIGGER trigger_update_statistics_on_session_create
  AFTER INSERT ON public.writing_sessions
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION update_user_statistics();

-- ============================================
-- 6. AUTOMATIC PROFILE CREATION
-- ============================================

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created
  ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
