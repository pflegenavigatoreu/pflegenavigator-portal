import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { handleApiError, createSuccessResponse } from '@/lib/error-handler'
import { DatabaseError, ValidationError } from '@/lib/errors'

// POST: Neuen Fall erstellen
export async function POST() {
  try {
    const { data, error } = await supabase
      .rpc('create_case')
    
    if (error) {
      throw new DatabaseError('Fehler beim Erstellen des Falls', error)
    }
    
    if (!data) {
      throw new ValidationError('Keine Daten vom Server erhalten')
    }
    
    return createSuccessResponse({
      caseId: data.id,
      caseCode: data.case_code
    })
    
  } catch (error) {
    return handleApiError(error)
  }
}

// GET: Fall nach Code laden
export async function GET(request: NextRequest) {
  try {
    const caseCode = request.nextUrl.searchParams.get('code')
    
    if (!caseCode) {
      throw new ValidationError('Fallcode ist erforderlich')
    }
    
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('case_code', caseCode)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        throw new DatabaseError('Fall nicht gefunden', error)
      }
      throw new DatabaseError('Datenbankfehler beim Laden', error)
    }
    
    return createSuccessResponse({ case: data })
    
  } catch (error) {
    return handleApiError(error)
  }
}
