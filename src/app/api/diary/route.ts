import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const caseCode = searchParams.get('caseCode')

    if (!caseCode) {
      return NextResponse.json({ error: 'Missing caseCode' }, { status: 400 })
    }

    const { data: caseData, error: caseError } = await supabaseServer
      .from('cases')
      .select('id')
      .eq('case_code', caseCode)
      .single()

    if (caseError || !caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    const { data, error } = await supabaseServer
      .from('answers')
      .select('*')
      .eq('case_id', caseData.id)
      .eq('module_number', 5)
      .order('completed_at', { ascending: false })

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

export async function POST(request: Request) {
  try {
    const { caseCode, content, date, mood } = await request.json()

    if (!caseCode || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: caseData, error: caseError } = await supabaseServer
      .from('cases')
      .select('id')
      .eq('case_code', caseCode)
      .single()

    if (caseError || !caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    const entryDate = date || new Date().toISOString()
    const entryKey = `entry_${new Date(entryDate).getTime()}`

    const { data: existingAnswer } = await supabaseServer
      .from('answers')
      .select('answers')
      .eq('case_id', caseData.id)
      .eq('module_number', 5)
      .single()

    const answers = existingAnswer?.answers || {}
    answers[entryKey] = {
      content,
      date: entryDate,
      mood: mood || 'neutral',
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabaseServer
      .from('answers')
      .upsert({
        case_id: caseData.id,
        module_number: 5,
        module_name: 'tagebuch',
        answers,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'case_id,module_number'
      })

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