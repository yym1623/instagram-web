<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'

interface UserLite {
  id: string
  name: string
  nickname: string
}

const props = defineProps<{
  open: boolean
  users: UserLite[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'openProfile', name: string): void
  (e: 'selectUser', user: UserLite): void
}>()

const searchQuery = ref('')

const filteredUsers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return props.users
  return props.users.filter(
    (u) =>
      u.name.toLowerCase().includes(q) || u.nickname.toLowerCase().includes(q),
  )
})

const swiperModules = [FreeMode]

const shareOptions = [
  { key: 'link', label: '링크 복사', icon: 'fa-solid fa-link' },
  { key: 'facebook', label: 'Facebook', icon: 'fa-brands fa-facebook' },
  { key: 'messenger', label: 'Messenger', icon: 'fa-brands fa-facebook-messenger' },
  { key: 'whatsapp', label: 'WhatsApp', icon: 'fa-brands fa-whatsapp' },
  { key: 'email', label: 'Email', icon: 'fa-regular fa-envelope' },
  { key: 'threads', label: 'Threads', icon: 'fa-brands fa-threads' },
  { key: 'share', label: '공유', icon: 'fa-solid fa-share-nodes' },
]
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-4"
      @click.self="emit('close')"
    >
      <div class="bg-[rgb(33,35,40)] rounded-xl shadow-xl w-full max-w-[420px] max-h-[85vh] flex flex-col border border-neutral-700 overflow-hidden">
        <!-- 헤더: 좌 빈요소 · 가운데 타이틀 · 우 X (flex justify-between으로 타이틀 중앙) -->
        <header class="relative flex items-center justify-between px-3 py-3 border-b border-neutral-800 shrink-0">
          <div class="w-8 h-8 flex-shrink-0" />
          <h2 class="text-base font-semibold text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            공유
          </h2>
          <button
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 flex-shrink-0"
            aria-label="닫기"
            @click="emit('close')"
          >
            <i class="fa-solid fa-xmark text-lg" />
          </button>
        </header>

        <!-- 검색 -->
        <div class="px-3 py-2 border-b border-neutral-800 shrink-0">
          <div class="flex items-center gap-2 h-9 px-3 rounded-lg bg-neutral-800">
            <i class="fa-solid fa-magnifying-glass text-neutral-500 text-sm" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="검색"
              class="flex-1 bg-transparent border-0 outline-none text-sm text-white placeholder-neutral-500"
            >
          </div>
        </div>

        <!-- 그리드: 회원가입한 유저 전체 -->
        <div class="flex-1 overflow-y-auto min-h-0 p-3">
          <div class="grid grid-cols-4 gap-4">
            <button
              v-for="u in filteredUsers"
              :key="u.id"
              type="button"
              class="flex flex-col items-center gap-2 text-neutral-300 hover:text-white"
              @click="emit('selectUser', u)"
            >
              <div class="w-14 h-14 rounded-full bg-neutral-600 flex-shrink-0 overflow-hidden" />
              <span class="text-xs truncate w-full text-center">{{ u.nickname || u.name }}</span>
            </button>
          </div>
          <p v-if="filteredUsers.length === 0" class="text-sm text-neutral-500 text-center py-6">
            검색 결과가 없습니다.
          </p>
        </div>

        <!-- 푸터: Swiper로 공유 옵션 버튼들 -->
        <div class="border-t border-neutral-800 p-3 shrink-0">
          <Swiper
            class="share-swiper"
            :modules="swiperModules"
            :slides-per-view="'auto'"
            :space-between="12"
            :free-mode="true"
          >
            <SwiperSlide
              v-for="opt in shareOptions"
              :key="opt.key"
              class="!w-[72px] flex flex-col items-center gap-1.5"
            >
              <button
                type="button"
                class="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-white hover:bg-neutral-600 flex-shrink-0"
              >
                <i :class="[opt.icon, 'text-lg']" />
              </button>
              <span class="text-[10px] text-neutral-400 truncate w-full text-center">{{ opt.label }}</span>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.share-swiper :deep(.swiper-slide) {
  flex-shrink: 0;
}
</style>
