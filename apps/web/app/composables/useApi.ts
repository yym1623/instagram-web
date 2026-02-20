import { useAuthStore } from '~/stores/auth'

export function useApi() {
  const config = useRuntimeConfig()
  const base = config.public.apiBase as string
  const origin = (config.public.socketUrl as string) || base.replace(/\/api\/?$/, '')

  function imageUrl(path: string | undefined): string {
    if (!path) return ''
    if (path.startsWith('http')) return path
    return `${origin}${path}`
  }

  async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = path.startsWith('http') ? path : `${base}${path}`
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    if (res.status === 401 && !path.includes('/auth')) {
      const auth = useAuthStore()
      await auth.logout()
      await navigateTo('/auth')
      throw new Error('세션이 만료되었습니다. 다시 로그인해 주세요.')
    }
    if (!res.ok) throw new Error(await res.text())
    const text = await res.text()
    if (!text) return {} as T
    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
      throw new Error(`API가 JSON이 아닌 응답을 반환했습니다. (${url})`)
    }
    try {
      return JSON.parse(text) as T
    } catch {
      throw new Error(`API 응답 파싱 실패: JSON이 아닙니다. (${url})`)
    }
  }

  return {
    get: <T>(path: string) => request<T>(path, { method: 'GET' }),
    post: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
    imageUrl,
  }
}
