import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { handleApiError, createSuccessResponse } from '@/lib/error-handler'
import { ValidationError, DatabaseError } from '@/lib/errors'

// POST: Antworten speichern
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { caseId, moduleNumber, moduleName, answers } = body
    
    if (!caseId) {
      throw new ValidationError('caseId ist erforderlich')
    }
    
    if (!moduleNumber || moduleNumber < 1 || moduleNumber > 10) {
      throw new ValidationError('moduleNumber muss zwischen 1 und 10 liegen')
    }
    
    if (!answers || typeof answers !== 'object') {
      throw new ValidationError('answers ist erforderlich')
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
      throw new DatabaseError('Fehler beim Speichern der Antworten', error)
    }
    
    return createSuccessResponse({ answer: data })
    
  } catch (error) {
    return handleApiError(error)
  }
}

// GET: Antworten für einen Fall laden
export async function GET(request: NextRequest) {
  try {
    const caseId = request.nextUrl.searchParams.get('caseId')
    
    if (!caseId) {
      throw new ValidationError('caseId ist erforderlich')
    }
    
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .eq('case_id', caseId)
      .order('module_number')
    
    if (error) {
      throw new DatabaseError('Fehler beim Laden der Antworten', error)
    }
    
    return createSuccessResponse({ answers: data })
    
  } catch (error) {
    return handleApiError(error)
  }
}
