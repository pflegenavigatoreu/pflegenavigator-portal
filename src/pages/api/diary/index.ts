import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // GET: Tagebucheinträge laden
  if (req.method === 'GET') {
    try {
      const { caseCode } = req.query

      if (!caseCode || typeof caseCode !== 'string') {
        return res.status(400).json({ error: 'Missing caseCode' })
      }

      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('id')
        .eq('case_code', caseCode)
        .single()

      if (caseError || !caseData) {
        return res.status(404).json({ error: 'Case not found' })
      }

      // Tagebucheinträge aus answers laden (modul_number = 5 für Tagebuch)
      const { data, error } = await supabase
        .from('answers')
        .select('*')
        .eq('case_id', caseData.id)
        .eq('module_number', 5)
        .order('completed_at', { ascending: false })

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

  // POST: Neuen Tagebucheintrag erstellen
  if (req.method === 'POST') {
    try {
      const { caseCode, content, date, mood } = req.body

      if (!caseCode || !content) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('id')
        .eq('case_code', caseCode)
        .single()

      if (caseError || !caseData) {
        return res.status(404).json({ error: 'Case not found' })
      }

      const entryDate = date || new Date().toISOString()
      const entryKey = `entry_${new Date(entryDate).getTime()}`

      // Existierende Tagebuch-Antwort laden
      const { data: existingAnswer } = await supabase
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

      const { data, error } = await supabase
        .from('answers')
        .upsert({
          case_id: caseData.id,
          module_number: 5,
          module_name: 'tagebuch',
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