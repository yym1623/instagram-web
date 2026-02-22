/**
 * 상단 프로그레스 바 (페이지 이동 시에만 사용, 라우터에서 자동 연동).
 * plugins/topLoadingRouter.client.ts 에서 progress / isActive provide.
 */
export function useTopLoading() {
  const progress = inject<Ref<number>>('topLoadingProgress')
  const isActive = inject<Ref<boolean>>('topLoadingActive')

  return {
    progress: progress ?? ref(0),
    isActive: isActive ?? ref(false),
  }
}
