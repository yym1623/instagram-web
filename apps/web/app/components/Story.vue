<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/app/composables/useApi'
import type { MockDataItem, UserLite } from '@/app/data/mock'

const props = withDefaults(
  defineProps<{
    currentNickname: string
    mockUsers?: MockDataItem[]
    /** 내가 팔로우한 유저 목록. 스토리는 여기 있는 사람만 노출 */
    followingList?: { id: string; name: string; nickname: string }[]
    /** 광고 계정 2개. 팔로우 여부 무관, others와 합쳐서 랜덤 순서로 노출 (SubFeed에는 안 나옴) */
    mockAdUsers?: MockDataItem[]
  }>(),
  { mockUsers: () => [], followingList: () => [], mockAdUsers: () => [] },
)

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const emit = defineEmits<{
  (e: 'openProfile', name: string): void
  (e: 'addStory'): void
}>()

/** 스토리 뷰어 모달: 열림 여부, 열 때 초기 인덱스 */
const storyViewerOpen = ref(false)
const storyViewerIndex = ref(0)

const auth = useAuthStore()
const { post } = useApi()
const usersWithStories = ref<(UserLite & { story?: Record<string, unknown> })[]>([])

async function loadUsers() {
  try {
    const res = (await post('/users/select', { name: auth.name })) as (UserLite & { story?: Record<string, unknown> })[] | null
    if (res && Array.isArray(res) && res.length > 0) {
      usersWithStories.value = res
    } else {
      usersWithStories.value = props.mockUsers
    }
  } catch {
    usersWithStories.value = props.mockUsers
  }
}

onMounted(loadUsers)

const modules = [Navigation]
const swiperRef = ref<SwiperType | null>(null)
const canGoLeft = ref(false)
const canGoRight = ref(false)

/** 나 외: 스토리 있음 = img 배열 길이 >= 1. API 유저(story 없음)는 true */
function hasStory(u: { story?: Record<string, unknown> & { img?: string[] } }): boolean {
  if (!('story' in u) || !u.story || typeof u.story !== 'object') return true
  const s = u.story
  return Array.isArray(s.img) && s.img.length >= 1
}

const followingIds = computed(() => new Set((props.followingList ?? []).map((f) => f.id)))

/** 나 제외, story 있으면서 내가 팔로우한 유저만 노출 */
const othersWithStories = computed(() => {
  const list = usersWithStories.value.length > 0 ? usersWithStories.value : props.mockUsers
  return list.filter(
    (u) =>
      String(u.id) !== String(auth.id) &&
      hasStory(u) &&
      followingIds.value.has(u.id),
  )
})

/** others + 광고 유저 합친 뒤 랜덤 순서 (링·뷰어 동일 순서) */
const othersWithStoriesAndAds = ref<(UserLite & { story?: Record<string, unknown> })[]>([])
watch(
  [othersWithStories, () => props.mockAdUsers],
  ([others, ads]) => {
    const o = (others ?? []) as (UserLite & { story?: Record<string, unknown> })[]
    const a = (ads ?? []) as (UserLite & { story?: Record<string, unknown> })[]
    othersWithStoriesAndAds.value = shuffleArray([...o, ...a])
  },
  { immediate: true },
)

/** 나는 스토리 없어도 노출. 스토리 있으면 일반 링, 없으면 우하단 + 겹침 */
const meHasStory = computed(() => {
  const list = usersWithStories.value.length > 0 ? usersWithStories.value : props.mockUsers
  const me = list.find((u) => String(u.id) === String(auth.id))
  return me ? hasStory(me) : false
})

/** 뷰어용 리스트: 나(스토리 있으면) + others+광고 랜덤 순서 */
const storyViewerList = computed(() => {
  const list = usersWithStories.value.length > 0 ? usersWithStories.value : props.mockUsers
  const me = list.find((u) => String(u.id) === String(auth.id))
  const meStory = me?.story ?? {}
  const others = othersWithStoriesAndAds.value
  const meItem = {
    id: auth.id,
    name: auth.name,
    nickname: auth.nickname || auth.name || '나',
    story: meStory as { img?: string[] },
  }
  if (meHasStory.value) return [meItem, ...others] as typeof meItem[]
  return others as typeof meItem[]
})

function openStoryViewer(index: number) {
  storyViewerIndex.value = index
  storyViewerOpen.value = true
}

/** Swiper 슬라이드 수 = 나(1) + others+광고. 7개부터 화살표 */
const totalSlides = computed(() => 1 + othersWithStoriesAndAds.value.length)
const showArrows = computed(() => totalSlides.value > 6)

function updateNav(s: SwiperType | null) {
  if (!s) return
  canGoLeft.value = !s.isBeginning
  canGoRight.value = !s.isEnd
}

function onSwiper(s: SwiperType) {
  swiperRef.value = s
  updateNav(s)
}

function goPrev() {
  swiperRef.value?.slidePrev()
}

function goNext() {
  swiperRef.value?.slideNext()
}
</script>

<template>
  <section class="rounded-xl px-4 py-3 min-h-[140px] flex items-center relative">
    <!-- 왼쪽 화살표: 수직 중앙, 수평은 왼쪽 끝에 맞춤 -->
    <button
      v-if="showArrows && canGoLeft"
      type="button"
      class="absolute left-[23px] top-[60px] -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-app/95 border border-neutral-600 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-600/80 transition-colors shadow-lg"
      aria-label="이전"
      @click="goPrev"
    >
      <i class="fa-solid fa-chevron-left text-[10px]" />
    </button>

    <!-- 오른쪽 화살표: 수직 중앙, 수평은 오른쪽 끝에 맞춤 -->
    <button
      v-if="showArrows && canGoRight"
      type="button"
      class="absolute right-[23px] top-[60px] -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-app/95 border border-neutral-600 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-600/80 transition-colors shadow-lg"
      aria-label="다음"
      @click="goNext"
    >
      <i class="fa-solid fa-chevron-right text-[10px]" />
    </button>

    <!-- 같은 Swiper: 가장 좌측 나(로그인 유저) → 그 오른쪽으로 스토리 있는 다른 유저, 6개씩 노출 -->
    <div class="w-full overflow-hidden">
      <Swiper
        :modules="modules"
        :slides-per-view="6"
        :space-between="16"
        class="stories-swiper"
        @swiper="onSwiper"
        @slide-change="() => updateNav(swiperRef)"
      >
        <!-- 1. 가장 좌측: 나 (로그인 유저). 구조는 목데이터와 동일(아바타+닉네임). 스토리 없으면 우하단 + 겹침 -->
        <SwiperSlide key="me">
          <div class="w-full flex flex-col items-center py-1">
            <div class="relative w-[74px] h-[74px] flex-shrink-0">
              <button
                type="button"
                class="w-full h-full flex flex-col items-center justify-center cursor-pointer focus:outline-none rounded-full"
                @click="meHasStory ? openStoryViewer(0) : undefined"
              >
                <div
                  class="w-[74px] h-[74px] rounded-full p-[2px] flex items-center justify-center ring-2 ring-white dark:ring-black"
                  :class="meHasStory ? 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]' : 'border-2 border-dashed border-neutral-300 dark:border-neutral-600 bg-app'"
                >
                  <div class="w-[70px] h-[70px] rounded-full bg-app ring-2 ring-white dark:ring-black" />
                </div>
              </button>
              <!-- 스토리 없을 때만: 원 우하단에 + 겹침, 클릭 시 스토리 추가 -->
              <button
                v-if="!meHasStory"
                type="button"
                class="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-500 border-2 border-white dark:border-black flex items-center justify-center text-white hover:bg-blue-600 cursor-pointer"
                aria-label="스토리 추가"
                @click.stop="emit('addStory')"
              >
                <i class="fa-solid fa-plus text-[10px]" />
              </button>
            </div>
            <span class="text-[12px] text-neutral-600 dark:text-neutral-300 mt-1.5 truncate max-w-[92px] block">
              {{ auth.nickname || auth.name || '나' }}
            </span>
          </div>
        </SwiperSlide>
        <!-- 2. 그 오른쪽: 스토리 있는 다른 유저만. 클릭 시 스토리 뷰어 모달 -->
        <SwiperSlide v-for="(u, i) in othersWithStoriesAndAds" :key="u.id">
          <button
            type="button"
            class="w-full flex flex-col items-center cursor-pointer focus:outline-none py-1"
            @click="openStoryViewer(meHasStory ? i + 1 : i)"
          >
            <div
              class="w-[74px] h-[74px] rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px] flex items-center justify-center ring-2 ring-white dark:ring-black flex-shrink-0"
            >
              <div class="w-[70px] h-[70px] rounded-full bg-app ring-2 ring-white dark:ring-black" />
            </div>
            <span class="text-[12px] text-neutral-600 dark:text-neutral-300 mt-1.5 truncate max-w-[92px] block">
              {{ u.nickname }}
            </span>
          </button>
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- 스토리 전체화면 뷰어: 중앙 = 클릭한 사람, 좌/우 = 순서 그대로 -->
    <ModalsStoryViewerModal
      :open="storyViewerOpen"
      :story-list="storyViewerList"
      :initial-index="storyViewerIndex"
      @close="storyViewerOpen = false"
      @open-profile="(name) => { storyViewerOpen = false; emit('openProfile', name) }"
    />
  </section>
</template>

<style scoped>
.stories-swiper :deep(.swiper-wrapper) {
  align-items: flex-start;
}
</style>
