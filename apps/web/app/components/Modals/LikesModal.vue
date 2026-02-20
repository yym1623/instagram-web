<script setup lang="ts">
interface Liker {
  id: string
  name: string
  nickname: string
  /** 선택: 부가 설명 (예: 실명, 소개) */
  subtitle?: string
}

const props = defineProps<{
  open: boolean
  likers: Liker[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'openProfile', name: string): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-4"
      @click.self="emit('close')"
    >
      <div class="bg-[rgb(33,35,40)] rounded-xl shadow-xl w-full max-w-[400px] max-h-[80vh] flex flex-col border border-neutral-700 overflow-hidden">
        <header class="flex items-center justify-center relative py-3 border-b border-neutral-800">
          <h2 class="text-base font-semibold text-white">좋아요</h2>
          <button
            type="button"
            class="absolute right-3 w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
            aria-label="닫기"
            @click="emit('close')"
          >
            <i class="fa-solid fa-xmark text-lg" />
          </button>
        </header>
        <div class="flex-1 overflow-y-auto">
          <div
            v-for="u in likers"
            :key="u.id"
            class="flex items-center gap-3 px-4 py-3 hover:bg-white/5"
          >
            <button
              type="button"
              class="w-11 h-11 rounded-full bg-neutral-600 flex-shrink-0 overflow-hidden"
              @click="emit('openProfile', u.name)"
            />
            <button
              type="button"
              class="flex-1 min-w-0 text-left"
              @click="emit('openProfile', u.name)"
            >
              <div class="text-sm font-semibold text-white truncate">
                {{ u.nickname }}
              </div>
              <div v-if="u.subtitle" class="text-xs text-neutral-400 truncate">
                {{ u.subtitle }}
              </div>
            </button>
            <button
              type="button"
              class="text-sm font-semibold text-blue-400 hover:text-blue-300 flex-shrink-0 px-4 py-1.5 rounded-lg"
            >
              팔로우
            </button>
          </div>
          <div
            v-if="likers.length === 0"
            class="py-8 text-center text-sm text-neutral-500"
          >
            좋아요를 누른 사람이 없습니다.
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
