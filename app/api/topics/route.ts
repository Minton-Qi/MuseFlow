import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build query
    let query = supabase
      .from('topics')
      .select('*')
      .order('created_at', { ascending: false })

    // Filter by category if specified
    if (category) {
      query = query.eq('category', category)
    }

    // Apply limit
    query = query.limit(limit)

    const { data: topics, error } = await query

    if (error) {
      console.error('Error fetching topics:', error)
      return NextResponse.json(
        { error: 'Failed to fetch topics' },
        { status: 500 }
      )
    }

    return NextResponse.json({ topics })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
