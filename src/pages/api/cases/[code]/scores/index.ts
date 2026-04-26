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

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('id')
        .eq('case_code', code)
        .single()

      if (caseError || !caseData) {
        return res.status(404).json({ error: 'Case not found' })
      }

      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('case_id', caseData.id)

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

  if (req.method === 'POST') {
    try {
      const { module, rawPoints, weightedPoints } = req.body

      if (!module || rawPoints === undefined || weightedPoints === undefined) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('id')
        .eq('case_code', code)
        .single()

      if (caseError || !caseData) {
        return res.status(404).json({ error: 'Case not found' })
      }

      // Scores werden in answers gespeichert oder extra Tabelle
      // Für jetzt: Speichere als JSON in cases.care_level_guess
      const { data, error } = await supabase
        .from('cases')
        .update({
          care_level_guess: weightedPoints,
          updated_at: new Date().toISOString()
        })
        .eq('id', caseData.id)

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