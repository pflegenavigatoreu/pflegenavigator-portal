import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseServer } from '@/lib/supabase'

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('case_code', code)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Case not found' })
      }
      console.error('Supabase error:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('Unexpected error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}