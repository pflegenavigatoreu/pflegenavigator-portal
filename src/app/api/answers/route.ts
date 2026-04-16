import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST: Antworten speichern
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { caseId, moduleNumber, moduleName, answers } = body
    
    if (!caseId || !moduleNumber || !answers) {
      return NextResponse.json(
        { error: 'Fehlende Pflichtfelder' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('answers')
      .upsert({
        case_id: caseId,
        module_number: moduleNumber,
        module_name: moduleName || `Modul ${moduleNumber}`,
        answers,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'case_id,module_number'
      })
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Fehler beim Speichern' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, answer: data })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// GET: Antworten für einen Fall laden
export async function GET(request: NextRequest) {
  const caseId = request.nextUrl.searchParams.get('caseId')
  
  if (!caseId) {
    return NextResponse.json(
      { error: 'caseId erforderlich' },
      { status: 400 }
    )
  }
  
  try {
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .eq('case_id', caseId)
      .order('module_number')
    
    if (error) throw error
    
    return NextResponse.json({ success: true, answers: data })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
