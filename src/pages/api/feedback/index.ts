import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // GET: Alle Feedback-Einträge (Admin)
  if (req.method === 'GET') {
    try {
      const { status } = req.query

      let query = supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })

      if (status && typeof status === 'string') {
        query = query.eq('status', status)
      }

      const { data, error } = await query

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

  // POST: Neues Feedback erstellen
  if (req.method === 'POST') {
    try {
      const { caseCode, seite, feedbackText, eingabeTyp } = req.body

      if (!seite || !feedbackText) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const { data, error } = await supabase
        .from('feedback')
        .insert({
          case_code: caseCode || null,
          feedback_type: eingabeTyp || 'improvement',
          message: feedbackText,
          status: 'new'
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

  // PATCH: Feedback-Status aktualisieren
  if (req.method === 'PATCH') {
    try {
      const { id, status } = req.body

      if (!id || !status) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const { data, error } = await supabase
        .from('feedback')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ error: error.message })
      }

      return res.status(200).json({ success: true, data })
    } catch (err) {
      console.error('Unexpected error:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}