import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/writing/sessions
 * Lists all writing sessions for the authenticated user
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

    const { data: sessions, error } = await supabase
      .from('writing_sessions')
      .select(`
        *,
        topics (
          id,
          title,
          prompt,
          category
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ sessions })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/writing/sessions
 * Creates a new writing session
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
    const { topic_id, content, word_count, status } = body

    if (!topic_id) {
      return NextResponse.json(
        { error: 'topic_id is required' },
        { status: 400 }
      )
    }

    const { data: session, error } = await supabase
      .from('writing_sessions')
      .insert({
        user_id: user.id,
        topic_id,
        content: content || '',
        word_count: word_count || 0,
        status: status || 'draft',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ session })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
