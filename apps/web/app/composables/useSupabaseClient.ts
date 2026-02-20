import type { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseClient } from '~/lib/supabase/client'
import { createSupabaseServerClient } from '~/lib/supabase/server'

let _client: SupabaseClient | null = null

export function useSupabaseClient(): SupabaseClient {
  if (import.meta.server) {
    return createSupabaseServerClient()
  }
  if (!_client) {
    _client = createSupabaseClient()
  }
  return _client
}
