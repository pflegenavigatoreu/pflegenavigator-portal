import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Case = {
  id: string;
  code: string;
  module1_score: number;
  module2_score: number;
  module3_score: number;
  module4_score: number;
  module5_score: number;
  module6_score: number;
  total_score: number;
  care_level: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type DiaryEntry = {
  id: string;
  case_id: string;
  date: string;
  content: string;
  created_at: string;
};
