<script setup lang="ts">
/** 스토리 뷰어에 넘길 유저 항목 (id, name, nickname, story.img[]) */
export interface StoryViewerItem {
  id: string
  name: string
  nickname: string
  story: { img?: string[] }
}

const props = withDefaults(
  defineProps<{
    open: boolean
    storyList?: StoryViewerItem[]
    initialIndex?: number
  }>(),
  { storyList: () => [], initialIndex: 0 },
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'openProfile', name: string): void
}>()

const activeIndex = ref(0)
const currentImageIndex = ref(0)
const elapsedMs = ref(0)
const DURATION_MS = 10000
let timerId: ReturnType<typeof setInterval> | null = null

const activeItem = computed(() => props.storyList?.[activeIndex.value])
const images = computed(() => {
  const img = activeItem.value?.story?.img
  return Array.isArray(img) ? img : []
})
const currentImageUrl = computed(() => images.value[currentImageIndex.value] ?? '')
const hasPrevUser = computed(() => activeIndex.value > 0)
const hasNextUser = computed(() => activeIndex.value < (props.storyList?.length ?? 1) - 1)
const hasPrevImage = computed(() => currentImageIndex.value > 0)
const hasNextImage = computed(() => currentImageIndex.value < images.value.length - 1)

/** 현재 사진 기준 진행률 0~1 */
const currentSegmentProgress = computed(() => Math.min(1, elapsedMs.value / DURATION_MS))

function startTimer() {
  stopTimer()
  timerId = setInterval(() => {
    elapsedMs.value += 100
    if (elapsedMs.value >= DURATION_MS) {
      if (!hasNextImage.value && !hasNextUser.value) {
        stopTimer()
        elapsedMs.value = DURATION_MS
        return
      }
      elapsedMs.value = 0
      goNext()
    }
  }, 100)
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

function goNext() {
  if (hasNextImage.value) {
    currentImageIndex.value++
    elapsedMs.value = 0
    return
  }
  if (hasNextUser.value) {
    activeIndex.value++
    currentImageIndex.value = 0
    elapsedMs.value = 0
  }
}

function goPrev() {
  if (hasPrevImage.value) {
    currentImageIndex.value--
    elapsedMs.value = 0
    return
  }
  if (hasPrevUser.value) {
    activeIndex.value--
    const prevImgs = props.storyList?.[activeIndex.value]?.story?.img
    const prevLen = Array.isArray(prevImgs) ? prevImgs.length : 0
    currentImageIndex.value = Math.max(0, prevLen - 1)
    elapsedMs.value = 0
  }
}

function onFrameClick(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement
  if (!target) return
  const rect = target.getBoundingClientRect()
  const x = e.clientX - rect.left
  const isLeft = x < rect.width / 2
  if (isLeft) goPrev()
  else goNext()
}

watch(
  () => [props.open, props.initialIndex] as const,
  ([open, idx]) => {
    if (open && props.storyList?.length) {
      const idxClamped = Math.max(0, Math.min(Number(idx), props.storyList.length - 1))
      activeIndex.value = idxClamped
      currentImageIndex.value = 0
      elapsedMs.value = 0
      nextTick(() => startTimer())
    } else {
      stopTimer()
    }
  },
  { immediate: true },
)

watch([activeIndex, currentImageIndex], () => {
  if (props.open && images.value.length) {
    elapsedMs.value = 0
    startTimer()
  }
})

onBeforeUnmount(stopTimer)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[200] flex flex-col bg-black/90"
      @click.self="emit('close')"
    >
      <!-- 좌측 상단: 인스타그램 로고 / 우측 상단: 닫기 -->
      <header class="flex items-center justify-between px-4 py-3 shrink-0 absolute top-0 left-0 right-0 z-10">
        <span class="text-white text-xl font-semibold tracking-tight">Instagram</span>
        <button
          type="button"
          class="w-10 h-10 flex items-center justify-center rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="닫기"
          @click="emit('close')"
        >
          <i class="fa-solid fa-xmark text-xl" />
        </button>
      </header>

      <!-- 좌측: 이전 유저 스와이프 버튼 (작은 화살표) -->
      <button
        v-if="storyList && storyList.length > 0 && (hasPrevImage || hasPrevUser)"
        type="button"
        class="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white/90 hover:text-white transition-colors"
        aria-label="이전"
        @click="goPrev"
      >
        <i class="fa-solid fa-chevron-left text-sm" />
      </button>

      <!-- 우측: 다음 유저 스와이프 버튼 -->
      <button
        v-if="storyList && storyList.length > 0 && (hasNextImage || hasNextUser)"
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white/90 hover:text-white transition-colors"
        aria-label="다음"
        @click="goNext"
      >
        <i class="fa-solid fa-chevron-right text-sm" />
      </button>

      <!-- 중앙: 스토리 프레임 (높이 거의 꽉, 좌우 비슷한 크기) -->
      <div class="flex-1 min-h-0 flex items-center justify-center px-4 py-14">
        <div
          v-if="activeItem && images.length > 0"
          class="relative w-full max-w-[405px] h-[min(85vh,720px)] rounded-xl overflow-hidden bg-neutral-900 flex flex-col shadow-2xl"
          @click="onFrameClick"
        >
          <!-- 상단: 진행 바 (사진 개수만큼, 10초 기준) -->
          <div class="absolute top-0 left-0 right-0 flex gap-0.5 p-2 z-10">
            <div
              v-for="(_, i) in images"
              :key="i"
              class="h-0.5 flex-1 rounded-full bg-white/30 overflow-hidden"
            >
              <div
                class="h-full bg-white transition-all duration-100"
                :style="{
                  width: i < currentImageIndex ? '100%' : i === currentImageIndex ? `${currentSegmentProgress * 100}%` : '0%',
                }"
              />
            </div>
          </div>

          <!-- 유저 정보: 프로필 + 닉네임 + 이름 (SubFeed 스타일) -->
          <div class="absolute top-12 left-0 right-0 flex items-center gap-3 px-3 z-10">
            <button
              type="button"
              class="w-9 h-9 rounded-full bg-neutral-600 flex-shrink-0 overflow-hidden ring-2 ring-white/50"
              @click.stop="emit('openProfile', activeItem.name)"
            >
              <img
                v-if="currentImageUrl"
                :src="currentImageUrl"
                :alt="activeItem.nickname"
                class="w-full h-full object-cover"
              >
              <div v-else class="w-full h-full bg-neutral-500" />
            </button>
            <div class="flex flex-col min-w-0 text-left">
              <span class="text-sm font-bold text-white leading-tight truncate block">
                {{ activeItem.nickname }}
              </span>
              <span class="text-xs text-white/70 leading-tight truncate block">
                {{ activeItem.name }}
              </span>
            </div>
          </div>

          <!-- 스토리 이미지 (수직·수평 중앙) -->
          <div class="flex-1 min-h-0 flex items-center justify-center bg-black">
            <img
              :src="currentImageUrl"
              :alt="activeItem.nickname"
              class="w-full h-full object-contain pointer-events-none"
            >
          </div>

          <!-- 하단: 답장 입력 -->
          <div class="absolute bottom-0 left-0 right-0 p-3 z-10">
            <div class="flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2">
              <input
                type="text"
                :placeholder="`${activeItem.nickname}님에게 답장하기...`"
                class="flex-1 bg-transparent border-0 outline-none text-white text-sm placeholder-white/50"
              >
              <button
                type="button"
                class="text-white/80 hover:text-white"
                aria-label="보내기"
              >
                <i class="fa-solid fa-paper-plane text-sm" />
              </button>
            </div>
          </div>
        </div>
        <p v-else class="text-neutral-500">스토리가 없습니다.</p>
      </div>
    </div>
  </Teleport>
</template>
