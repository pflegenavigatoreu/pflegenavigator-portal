import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types für die Tabellen
export interface Case {
  id: string
  case_code: string
  status: 'draft' | 'active' | 'completed' | 'archived'
  created_at: string
  updated_at: string
  care_level_guess?: number
  module_count: number
}

export interface Answer {
  id: string
  case_id: string
  module_number: number
  module_name: string
  answers: Record<string, any>
  completed_at?: string
  created_at: string
}

export interface Module {
  id: number
  module_number: number
  name: string
  description?: string
  estimated_duration_minutes: number
  is_active: boolean
  sgb_coverage: string[]
}

// Hilfsfunktion: Neuen Fall erstellen
export async function createCase() {
  const { data, error } = await supabase
    .rpc('create_case')
  
  if (error) throw error
  return data as { id: string; case_code: string }
}

// Hilfsfunktion: Fall nach Code laden
export async function getCaseByCode(caseCode: string) {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('case_code', caseCode)
    .single()
  
  if (error) throw error
  return data as Case
}

// Hilfsfunktion: Antworten speichern
export async function saveAnswers(
  caseId: string, 
  moduleNumber: number, 
  moduleName: string, 
  answers: Record<string, any>
) {
  const { data, error } = await supabase
    .from('answers')
    .upsert({
      case_id: caseId,
      module_number: moduleNumber,
      module_name: moduleName,
      answers,
      completed_at: new Date().toISOString()
    }, {
      onConflict: 'case_id,module_number'
    })
  
  if (error) throw error
  return data
}

// Hilfsfunktion: Alle Antworten für einen Fall laden
export async function getAnswersForCase(caseId: string) {
  const { data, error } = await supabase
    .from('answers')
    .select('*')
    .eq('case_id', caseId)
    .order('module_number')
  
  if (error) throw error
  return data as Answer[]
}

// Hilfsfunktion: Module laden
export async function getModules() {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('is_active', true)
    .order('module_number')
  
  if (error) throw error
  return data as Module[]
}
