import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseClient() {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const key = config.public.supabaseAnonKey as string
  if (!url || !key) {
    throw new Error('NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY are required')
  }
  return createBrowserClient(url, key)
}
