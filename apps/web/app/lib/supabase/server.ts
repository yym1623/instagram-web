import { createServerClient } from '@supabase/ssr'
import { parseCookies as parseH3Cookies, setCookie, deleteCookie } from 'h3'

export function createSupabaseServerClient() {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const key = config.public.supabaseAnonKey as string
  if (!url || !key) {
    throw new Error('NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY are required')
  }

  const event = useRequestEvent()
  if (!event) {
    throw new Error('createSupabaseServerClient must be called within a request context')
  }

  const parsed = parseH3Cookies(event)
  const getAll = () =>
    Object.entries(parsed).map(([name, value]) => ({ name, value: value ?? '' }))

  return createServerClient(url, key, {
    cookies: {
      getAll,
      setAll: (cookies) => {
        for (const { name, value, options } of cookies) {
          if (value) {
            setCookie(event, name, value, {
              path: '/',
              maxAge: 60 * 60 * 24 * 7,
              ...options,
            })
          } else {
            deleteCookie(event, name, { path: '/' })
          }
        }
      },
    },
  })
}
