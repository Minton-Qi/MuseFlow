import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasBigModelKey: !!process.env.BIGMODEL_API_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  })
}
