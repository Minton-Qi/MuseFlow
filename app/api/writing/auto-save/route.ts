import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * POST /api/writing/auto-save
 * Auto-saves a writing session (creates or updates)
 * Designed for debounced auto-save functionality
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
    const { id, topic_id, content, word_count } = body

    if (!topic_id) {
      return NextResponse.json(
        { error: 'topic_id is required' },
        { status: 400 }
      )
    }

    let session

    // If we have an ID, update existing session
    if (id) {
      const { data: existingSession, error: checkError } = await supabase
        .from('writing_sessions')
        .select('id, user_id')
        .eq('id', id)
        .single()

      if (checkError || !existingSession) {
        // Session doesn't exist, create new one
        const { data: newSession, error: insertError } = await supabase
          .from('writing_sessions')
          .insert({
            user_id: user.id,
            topic_id,
            content: content || '',
            word_count: word_count || 0,
            status: 'draft',
          })
          .select()
          .single()

        if (insertError) {
          return NextResponse.json(
            { error: insertError.message },
            { status: 400 }
          )
        }

        session = newSession
      } else {
        // Verify ownership
        if (existingSession.user_id !== user.id) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 403 }
          )
        }

        // Update existing session
        const { data: updatedSession, error: updateError } = await supabase
          .from('writing_sessions')
          .update({
            content: content || '',
            word_count: word_count || 0,
          })
          .eq('id', id)
          .select()
          .single()

        if (updateError) {
          return NextResponse.json(
            { error: updateError.message },
            { status: 400 }
          )
        }

        session = updatedSession
      }
    } else {
      // No ID, create new session
      const { data: newSession, error: insertError } = await supabase
        .from('writing_sessions')
        .insert({
          user_id: user.id,
          topic_id,
          content: content || '',
          word_count: word_count || 0,
          status: 'draft',
        })
        .select()
        .single()

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 400 }
        )
      }

      session = newSession
    }

    return NextResponse.json({ session })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
