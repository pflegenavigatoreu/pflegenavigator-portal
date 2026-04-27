import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    
    const { data, error } = await supabaseServer
      .from('cases')
      .select('*')
      .eq('case_code', code)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Case not found' }, { status: 404 })
      }
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}