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
      .from('answers')
      .select('*')
      .eq('case_id', caseData.id)
      .order('module_number')

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
    const { module, questionKey, answerValue } = await request.json()

    if (!module || !questionKey || !answerValue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: caseData, error: caseError } = await supabaseServer
      .from('cases')
      .select('id')
      .eq('case_code', code)
      .single()

    if (caseError || !caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    const moduleNumberMap: Record<string, number> = {
      'pflegegrad': 1,
      'emr': 2,
      'gdb': 3,
      'sgb14': 4,
      'tagebuch': 5,
      'widerspruch': 6,
      'widerruf': 7,
    }

    const moduleNumber = moduleNumberMap[module] || 1

    const { data: existingAnswer } = await supabaseServer
      .from('answers')
      .select('answers')
      .eq('case_id', caseData.id)
      .eq('module_number', moduleNumber)
      .single()

    const answers = existingAnswer?.answers || {}
    answers[questionKey] = answerValue

    const { data, error } = await supabaseServer
      .from('answers')
      .upsert({
        case_id: caseData.id,
        module_number: moduleNumber,
        module_name: module,
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