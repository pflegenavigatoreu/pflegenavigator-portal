import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST: Neuen Fall erstellen
export async function POST() {
  try {
    const { data, error } = await supabase
      .rpc('create_case')
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Fehler beim Erstellen des Falls' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      caseId: data.id,
      caseCode: data.case_code
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

// GET: Fall nach Code laden
export async function GET(request: NextRequest) {
  const caseCode = request.nextUrl.searchParams.get('code')
  
  if (!caseCode) {
    return NextResponse.json(
      { error: 'Fallcode erforderlich' },
      { status: 400 }
    )
  }
  
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('case_code', caseCode)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Fall nicht gefunden' },
          { status: 404 }
        )
      }
      throw error
    }
    
    return NextResponse.json({ success: true, case: data })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
