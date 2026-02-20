import { defineStore } from 'pinia'
import type { SessionUser } from '~/types'
import { useApi } from '~/composables/useApi'
import { parseSupabaseAuthError } from '~/utils/error'

const PROFILE_COOKIE = 'instagram_profile'

export const useAuthStore = defineStore('auth', {
  state: (): { user: SessionUser | null } => ({
    user: null,
  }),
  getters: {
    isLoggedIn: (s) => !!s.user,
    id: (s) => s.user?.id ?? '',
    email: (s) => s.user?.email ?? '',
    name: (s) => s.user?.name ?? '',
    nickname: (s) => s.user?.nickname ?? '',
  },
  actions: {
    setUser(user: SessionUser | null) {
      this.user = user
      const cookie = useCookie<SessionUser | null>(PROFILE_COOKIE, { path: '/', maxAge: 60 * 60 * 24 * 7 })
      cookie.value = user
    },
    setUserFromSession(supabaseUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }) {
      const profileCookie = useCookie<SessionUser | null>(PROFILE_COOKIE, { path: '/' })
      const profile = profileCookie.value
      if (profile && profile.id === supabaseUser.id) {
        this.user = profile
      } else {
        const meta = supabaseUser.user_metadata as Record<string, string> | undefined
        this.user = {
          id: supabaseUser.id,
          email: supabaseUser.email ?? '',
          name: meta?.name ?? '',
          nickname: meta?.nickname ?? '',
        }
      }
    },
    clearUser() {
      this.user = null
      const cookie = useCookie<SessionUser | null>(PROFILE_COOKIE, { path: '/' })
      cookie.value = null
    },
    async login(email: string, pw: string) {
      const { post } = useApi()
      const res = await post<{
        user?: SessionUser
        access_token?: string
        refresh_token?: string
        success?: boolean
        message?: string
      }>('/auth/login', { email, pw })

      if (res.message && 'success' in res && res.success === false) {
        return { success: false as const, message: parseSupabaseAuthError({ message: res.message }) }
      }

      const user = res.user
      const accessToken = res.access_token
      const refreshToken = res.refresh_token

      if (!user || !accessToken || !refreshToken) {
        return { success: false as const, message: parseSupabaseAuthError({ message: '로그인에 실패했습니다' }) }
      }

      const supabase = useSupabaseClient()
      await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      this.setUser(user)
      return { success: true as const }
    },
    async register(data: { email: string; pw: string; name: string; nickname: string }) {
      const { post } = useApi()
      const res = await post<{ success: boolean; message?: string }>('/auth/register', data)
      if (res.success === false) return { success: false as const, message: parseSupabaseAuthError({ message: res.message }) ?? '' }
      return { success: true as const }
    },
    async logout() {
      const supabase = useSupabaseClient()
      await supabase.auth.signOut()
      this.clearUser()
    },
  },
})
