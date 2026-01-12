import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/statistics/user
 * Retrieves user statistics and recent activity for charts
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user statistics
    const { data: stats, error: statsError } = await supabase
      .from('user_statistics')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (statsError && statsError.code !== 'PGRST116') {
      // PGRST116 is "not found", which is okay for new users
      return NextResponse.json(
        { error: statsError.message },
        { status: 400 }
      )
    }

    // Get recent sessions for chart data (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: recentSessions, error: sessionsError } = await supabase
      .from('writing_sessions')
      .select('created_at, word_count, status')
      .eq('user_id', user.id)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    if (sessionsError) {
      return NextResponse.json(
        { error: sessionsError.message },
        { status: 400 }
      )
    }

    // Calculate basic stats if not in database yet
    const { count: totalSessions } = await supabase
      .from('writing_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const { data: totalWordsResult } = await supabase
      .from('writing_sessions')
      .select('word_count')
      .eq('user_id', user.id)

    const totalWords = totalWordsResult?.reduce((sum, s) => sum + (s.word_count || 0), 0) || 0

    // Calculate writing streak (consecutive days with at least one writing session)
    // Get all session dates grouped by day
    const { data: allSessions } = await supabase
      .from('writing_sessions')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    let streak = 0
    if (allSessions && allSessions.length > 0) {
      const uniqueDates = [
        ...new Set(
          allSessions.map((s) => {
            const date = new Date(s.created_at)
            return date.toISOString().split('T')[0]
          })
        ),
      ]

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayStr = today.toISOString().split('T')[0]

      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      // Check if user wrote today or yesterday to start the streak
      const lastIndex = uniqueDates.indexOf(todayStr) !== -1
        ? uniqueDates.indexOf(todayStr)
        : uniqueDates.indexOf(yesterdayStr) !== -1
        ? uniqueDates.indexOf(yesterdayStr)
        : -1

      if (lastIndex !== -1) {
        streak = 1
        for (let i = lastIndex; i < uniqueDates.length - 1; i++) {
          const currentDate = new Date(uniqueDates[i])
          const nextDate = new Date(uniqueDates[i + 1])
          const diffDays = Math.floor(
            (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24)
          )
          if (diffDays === 1) {
            streak++
          } else {
            break
          }
        }
      }
    }

    return NextResponse.json({
      statistics: {
        ...(stats || {
          total_sessions: totalSessions || 0,
          total_words: totalWords || 0,
          average_creativity_score: null,
          average_emotion_score: null,
          average_expression_score: null,
          average_logic_score: null,
          average_vocabulary_score: null,
          last_activity_at: null,
        }),
        current_streak: streak,
      },
      chartData: recentSessions || [],
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
