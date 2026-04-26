import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseServer } from '@/lib/supabase'

type Data = {
  id?: string
  caseCode?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // CORS-Headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Fall mit RPC-Funktion erstellen
    const { data, error } = await supabaseServer
      .rpc('create_case')

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: error.message })
    }

    if (!data || !data.id || !data.case_code) {
      return res.status(500).json({ error: 'Failed to create case' })
    }

    return res.status(201).json({
      id: data.id,
      caseCode: data.case_code
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}