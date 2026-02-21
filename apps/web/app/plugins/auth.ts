import { useAuthStore } from '@/stores/auth'

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  const supabase = useSupabaseClient()
  const auth = useAuthStore()

  const applyUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) auth.setUserFromSession(user)
    else auth.clearUser()
  }

  applyUser()

  supabase.auth.onAuthStateChange(async () => {
    await applyUser()
  })
})
