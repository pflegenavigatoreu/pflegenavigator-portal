import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid case code' })
  }

  // CORS-Headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // GET: Alle Antworten für einen Fall laden
  if (req.method === 'GET') {
    try {
      // Zuerst die case_id finden
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('id')
        .eq('case_code', code)
        .single()

      if (caseError || !caseData) {
        return res.status(404).json({ error: 'Case not found' })
      }

      const { data, error } = await supabase
        .from('answers')
        .select('*')
        .eq('case_id', caseData.id)
        .order('module_number')

      if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ error: error.message })
      }

      return res.status(200).json(data || [])
    } catch (err) {
      console.error('Unexpected error:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // POST: Neue Antwort speichern
  if (req.method === 'POST') {
    try {
      const { module, questionKey, answerValue } = req.body

      if (!module || !questionKey || !answerValue) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Zuerst die case_id finden
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('id')
        .eq('case_code', code)
        .single()

      if (caseError || !caseData) {
        return res.status(404).json({ error: 'Case not found' })
      }

      // Modul-Nummer zuweisen (für Pflegegrad: module = "pflegegrad", module_number = 1-6)
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

      // Existierende Antwort laden
      const { data: existingAnswer } = await supabase
        .from('answers')
        .select('answers')
        .eq('case_id', caseData.id)
        .eq('module_number', moduleNumber)
        .single()

      // Antworten zusammenführen
      const answers = existingAnswer?.answers || {}
      answers[questionKey] = answerValue

      // Upsert durchführen
      const { data, error } = await supabase
        .from('answers')
        .upsert({
          case_id: caseData.id,
          module_number: moduleNumber,
          module_name: module,
          answers: answers,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'case_id,module_number'
        })

      if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ error: error.message })
      }

      return res.status(201).json({ success: true, data })
    } catch (err) {
      console.error('Unexpected error:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}