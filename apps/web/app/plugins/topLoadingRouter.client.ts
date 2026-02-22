/**
 * 페이지 이동 시에만 상단 프로그레스 바.
 * 이동 시작 시 0% → 진행 중엔 실제 이동 느낌으로 증가 → 완료 시 100% 후 숨김.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const progress = ref(0)
  const isActive = ref(false)
  let trickleTimer: ReturnType<typeof setInterval> | null = null

  function startNavigation() {
    isActive.value = true
    progress.value = 0
    if (trickleTimer) clearInterval(trickleTimer)
    // 0 → 약 90% 까지 이동 느낌으로 증가 (완료 시 100%로 마무리)
    trickleTimer = setInterval(() => {
      progress.value = Math.min(90, progress.value + Math.random() * 8 + 4)
    }, 80)
  }

  function finishNavigation() {
    if (trickleTimer) {
      clearInterval(trickleTimer)
      trickleTimer = null
    }
    progress.value = 100
    setTimeout(() => {
      isActive.value = false
      progress.value = 0
    }, 200)
  }

  nuxtApp.provide('topLoadingProgress', progress)
  nuxtApp.provide('topLoadingActive', isActive)

  const router = useRouter()
  router.beforeEach(() => startNavigation())
  router.afterEach(() => finishNavigation())
  router.onError(() => finishNavigation())
})
