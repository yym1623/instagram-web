<script setup lang="ts">
import { useApi } from '@/app/composables/useApi'

const props = withDefaults(
  defineProps<{
    open: boolean
    /** '팔로워' | '팔로잉' */
    title: string
    list: { id: string; name: string; nickname: string }[]
  }>(),
  { list: () => [] },
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'openProfile', name: string): void
}>()

const searchQuery = ref('')
const listToShow = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return props.list
  return props.list.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      (u.nickname || '').toLowerCase().includes(q),
  )
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 overflow-auto"
      @click.self="emit('close')"
    >
      <div class="bg-[rgb(33,35,40)] rounded-xl shadow-2xl w-full max-w-[400px] max-h-[80vh] flex flex-col border border-neutral-700 overflow-hidden">
        <!-- 헤더: 제목 + 닫기 -->
        <div class="flex items-center justify-center relative py-4 border-b border-neutral-700 shrink-0">
          <span class="text-lg font-semibold text-white">{{ title }}</span>
          <button
            type="button"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white hover:bg-neutral-700 rounded-full transition-colors"
            aria-label="닫기"
            @click="emit('close')"
          >
            <i class="fa-solid fa-xmark text-xl" />
          </button>
        </div>
        <!-- 검색 -->
        <div class="px-4 py-3 border-b border-neutral-700 shrink-0">
          <div class="flex items-center gap-2 rounded-lg bg-neutral-700/50 px-3 py-2">
            <i class="fa-solid fa-magnifying-glass text-neutral-400 text-sm" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="검색"
              class="flex-1 min-w-0 bg-transparent border-0 outline-none text-sm text-white placeholder-neutral-500"
            >
          </div>
        </div>
        <!-- 리스트 -->
        <div class="flex-1 overflow-y-auto min-h-0">
          <button
            v-for="u in listToShow"
            :key="u.id"
            type="button"
            class="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-800/50 transition-colors text-left"
            @click="emit('openProfile', u.name)"
          >
            <div class="w-10 h-10 rounded-full bg-neutral-600 flex-shrink-0 overflow-hidden">
              <!-- avatar placeholder; could use imageUrl if user had img -->
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-semibold text-white truncate">{{ u.name }}</div>
              <div v-if="u.nickname" class="text-xs text-neutral-400 truncate">{{ u.nickname }}</div>
            </div>
            <span class="px-4 py-1.5 rounded-lg bg-neutral-700 text-white text-sm font-medium shrink-0">
              팔로잉
            </span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
