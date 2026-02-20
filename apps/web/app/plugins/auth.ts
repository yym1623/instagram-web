import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  const supabase = useSupabaseClient()
  const auth = useAuthStore()

  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      auth.setUserFromSession(session.user)
    } else {
      auth.clearUser()
    }
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      auth.setUserFromSession(session.user)
    } else {
      auth.clearUser()
    }
  })
})
