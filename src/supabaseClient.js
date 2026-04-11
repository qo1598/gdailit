import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 로컬 환경변수 미설정 시에도 앱이 크래시되지 않도록 방어 로직 추가
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        select: () => ({ eq: () => ({ data: [], error: null }) }),
        insert: () => ({ data: [], error: null }),
        update: () => ({ eq: () => ({ data: [], error: null }) }),
        upsert: () => ({ data: [], error: null }),
      }),
      auth: { getSession: async () => ({ data: { session: null }, error: null }) }
    };
