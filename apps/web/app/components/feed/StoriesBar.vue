<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'

interface UserLite {
  id: string
  name: string
  nickname: string
}

const props = withDefaults(
  defineProps<{
    currentNickname: string
    users: UserLite[]
    usersWithStories?: UserLite[]
  }>(),
  { usersWithStories: () => [] },
)

const emit = defineEmits<{
  (e: 'openProfile', name: string): void
  (e: 'addStory'): void
}>()

const modules = [Navigation]
const swiperRef = ref<SwiperType | null>(null)
const canGoLeft = ref(false)
const canGoRight = ref(false)

const storyUsers = computed(() => props.usersWithStories ?? [])
const hasStoryUsers = computed(() => storyUsers.value.length > 0)

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
    <!-- 왼쪽 화살표: 넘길 게 있을 때만 -->
    <button
      v-if="hasStoryUsers && canGoLeft"
      type="button"
      class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-app/90 border border-neutral-600 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-600/80 transition-colors shadow-lg"
      aria-label="이전"
      @click="goPrev"
    >
      <i class="fa-solid fa-chevron-left text-[10px]" />
    </button>

    <!-- 오른쪽 화살표: 넘길 게 있을 때만 -->
    <button
      v-if="hasStoryUsers && canGoRight"
      type="button"
      class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-app/90 border border-neutral-600 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-600/80 transition-colors shadow-lg"
      aria-label="다음"
      @click="goNext"
    >
      <i class="fa-solid fa-chevron-right text-[10px]" />
    </button>

    <div class="w-full overflow-hidden" :class="hasStoryUsers ? 'px-8' : ''">
      <template v-if="!hasStoryUsers">
        <button
          type="button"
          class="flex-shrink-0 flex flex-col items-center cursor-pointer focus:outline-none"
          @click="emit('addStory')"
        >
          <div
            class="w-[74px] h-[74px] rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex items-center justify-center ring-2 ring-white dark:ring-black bg-app"
          >
            <i class="fa-solid fa-plus text-white text-xl" />
          </div>
          <span class="text-[12px] text-neutral-600 dark:text-neutral-300 mt-1.5 truncate max-w-[92px]">
            추가하기
          </span>
        </button>
      </template>

      <template v-else>
        <Swiper
          :modules="modules"
          :slides-per-view="6"
          :space-between="12"
          class="stories-swiper"
          @swiper="onSwiper"
          @slide-change="() => updateNav(swiperRef)"
        >
          <SwiperSlide v-for="u in storyUsers" :key="u.id">
            <button
              type="button"
              class="w-full flex flex-col items-center cursor-pointer focus:outline-none py-1"
              @click="emit('openProfile', u.name)"
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
      </template>
    </div>
  </section>
</template>

<style scoped>
.stories-swiper :deep(.swiper-wrapper) {
  align-items: flex-start;
}
</style>
