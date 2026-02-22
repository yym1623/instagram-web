<script setup lang="ts">
import { useApi } from '@/app/composables/useApi'
import type { MockStoryHighlightItem } from '@/app/data/mock'

const props = withDefaults(
  defineProps<{
    open: boolean
    /** 2단계에서 고를 스토리 이미지 풀 (목데이터 story.img) */
    storyPool?: string[]
  }>(),
  { storyPool: () => [] },
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', highlight: MockStoryHighlightItem): void
}>()

const { imageUrl } = useApi()

const step = ref<1 | 2>(1)
const highlightName = ref('')
const selectedIndices = ref<Set<number>>(new Set())

function toggleSelect(i: number) {
  const next = new Set(selectedIndices.value)
  if (next.has(i)) next.delete(i)
  else next.add(i)
  selectedIndices.value = next
}

function goNext() {
  if (step.value === 1) {
    if (!highlightName.value.trim()) return
    step.value = 2
    return
  }
  const selected = Array.from(selectedIndices.value).sort((a, b) => a - b)
  const img = selected.map((i) => props.storyPool[i]).filter(Boolean)
  if (img.length === 0) return
  emit('created', { name: highlightName.value.trim(), img })
  close()
}

function goBack() {
  if (step.value === 2) step.value = 1
}

function close() {
  emit('close')
  step.value = 1
  highlightName.value = ''
  selectedIndices.value = new Set()
}

watch(
  () => props.open,
  (v) => {
    if (!v) {
      step.value = 1
      highlightName.value = ''
      selectedIndices.value = new Set()
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 overflow-auto"
      @click.self="close"
    >
      <div class="bg-[rgb(33,35,40)] rounded-xl shadow-2xl w-full max-w-[400px] max-h-[85vh] flex flex-col border border-neutral-700 overflow-hidden">
        <!-- Step 1: 새로운 하이라이트 (X · 타이틀 · 빈칸) -->
        <template v-if="step === 1">
          <div class="flex items-center justify-between shrink-0 py-4 px-4 border-b border-neutral-700 gap-2">
            <div class="w-9 shrink-0" />
            <h2 class="flex-1 min-w-0 text-center text-lg font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">
              새로운 하이라이트
            </h2>
            <div class="w-9 shrink-0 flex items-center justify-end">
              <button
                type="button"
                class="w-9 h-9 flex items-center justify-center text-white hover:bg-neutral-700 rounded-full"
                aria-label="닫기"
                @click="close"
              >
                <i class="fa-solid fa-xmark text-xl" />
              </button>
            </div>
          </div>
          <div class="p-4 flex flex-col gap-4">
            <input
              v-model="highlightName"
              type="text"
              placeholder="하이라이트 이름"
              class="w-full px-4 py-3 rounded-lg bg-neutral-700 border border-neutral-600 text-white placeholder-neutral-500 outline-none focus:border-neutral-500"
              @keydown.enter="goNext"
            >
            <button
              type="button"
              class="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold disabled:opacity-50"
              :disabled="!highlightName.trim()"
              @click="goNext"
            >
              다음
            </button>
          </div>
        </template>

        <!-- Step 2: 스토리 (뒤로 · 스토리 · X), 그리드, 다음 -->
        <template v-else>
          <div class="flex items-center justify-between shrink-0 py-4 px-4 border-b border-neutral-700 gap-2">
            <div class="w-9 shrink-0 flex items-center justify-start">
              <button
                type="button"
                class="w-9 h-9 flex items-center justify-center text-white hover:bg-neutral-700 rounded-full"
                aria-label="뒤로"
                @click="goBack"
              >
                <i class="fa-solid fa-chevron-left text-xl" />
              </button>
            </div>
            <h2 class="flex-1 min-w-0 text-center text-lg font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">
              스토리
            </h2>
            <div class="w-9 shrink-0 flex items-center justify-end">
              <button
                type="button"
                class="w-9 h-9 flex items-center justify-center text-white hover:bg-neutral-700 rounded-full"
                aria-label="닫기"
                @click="close"
              >
                <i class="fa-solid fa-xmark text-xl" />
              </button>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto min-h-0 p-4">
            <div
              v-if="storyPool.length === 0"
              class="flex items-center justify-center min-h-[200px] text-neutral-400 text-sm"
            >
              선택할 스토리가 없습니다.
            </div>
            <div
              v-else
              class="grid grid-cols-3 gap-2"
            >
              <button
                v-for="(src, i) in storyPool"
                :key="i"
                type="button"
                class="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-700 focus:outline-none ring-2 transition-colors"
                :class="selectedIndices.has(i) ? 'ring-blue-500 ring-offset-2 ring-offset-[rgb(33,35,40)]' : 'ring-transparent'"
                @click="toggleSelect(i)"
              >
                <img
                  :src="imageUrl(src)"
                  :alt="`스토리 ${i + 1}`"
                  class="w-full h-full object-cover"
                >
                <span class="absolute top-1 left-1 px-2 py-0.5 rounded bg-black/60 text-white text-xs">
                  {{ i + 1 }}
                </span>
                <div
                  class="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                  :class="selectedIndices.has(i) ? 'border-blue-500 bg-blue-500/30' : 'border-white/80 bg-black/30'"
                >
                  <i
                    v-if="selectedIndices.has(i)"
                    class="fa-solid fa-check text-white text-xs"
                  />
                </div>
              </button>
            </div>
          </div>
          <div class="shrink-0 p-4 border-t border-neutral-700">
            <button
              type="button"
              class="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold disabled:opacity-50"
              :disabled="selectedIndices.size === 0"
              @click="goNext"
            >
              다음
            </button>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>
