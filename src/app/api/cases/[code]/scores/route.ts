import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    
    const { data: caseData, error: caseError } = await supabaseServer
      .from('cases')
      .select('id')
      .eq('case_code', code)
      .single()

    if (caseError || !caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    const { data, error } = await supabaseServer
      .from('scores')
      .select('*')
      .eq('case_id', caseData.id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const { weightedPoints } = await request.json()

    const { data: caseData, error: caseError } = await supabaseServer
      .from('cases')
      .select('id')
      .eq('case_code', code)
      .single()

    if (caseError || !caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    const { data, error } = await supabaseServer
      .from('cases')
      .update({
        care_level_guess: weightedPoints,
        updated_at: new Date().toISOString()
      })
      .eq('id', caseData.id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}