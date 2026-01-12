import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/feedback?session_id=xxx
 * Fetches feedback for a writing session
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const session_id = searchParams.get('session_id')

    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      )
    }

    // Verify the session belongs to the user
    const { data: session } = await supabase
      .from('writing_sessions')
      .select('user_id')
      .eq('id', session_id)
      .single()

    if (!session || session.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Session not found or unauthorized' },
        { status: 403 }
      )
    }

    // Fetch feedback
    const { data: feedback, error } = await supabase
      .from('feedback_history')
      .select('*')
      .eq('session_id', session_id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json({ feedback })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/feedback
 * Saves AI feedback for a writing session
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { session_id, scores, encouragement, suggestions, improved_sentence } = body

    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      )
    }

    // Verify the session belongs to the user
    const { data: session } = await supabase
      .from('writing_sessions')
      .select('user_id')
      .eq('id', session_id)
      .single()

    if (!session || session.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Session not found or unauthorized' },
        { status: 403 }
      )
    }

    // Save feedback
    const { data: feedback, error } = await supabase
      .from('feedback_history')
      .insert({
        session_id,
        scores,
        encouragement,
        suggestions,
        improved_sentence: improved_sentence || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ feedback })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
