import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/auth')) return

  const auth = useAuthStore()

  if (import.meta.server) {
    try {
      const supabase = useSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        auth.setUserFromSession(session.user)
        return
      }
    } catch {
      /* ignore */
    }
    auth.clearUser()
    return navigateTo('/auth', { external: true })
  }

  if (auth.isLoggedIn) return

  const supabase = useSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    auth.setUserFromSession(session.user)
    return
  }

  return navigateTo('/auth', { external: true })
})
