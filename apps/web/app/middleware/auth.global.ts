import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/auth')) return

  const auth = useAuthStore()

  if (import.meta.server) {
    try {
      const supabase = useSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        auth.setUserFromSession(user)
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
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    auth.setUserFromSession(user)
    return
  }

  return navigateTo('/auth', { external: true })
})
