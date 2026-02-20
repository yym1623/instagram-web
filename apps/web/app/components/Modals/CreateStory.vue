<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

const auth = useAuthStore()

const step = ref<1 | 2>(1)
const isDragged = ref(false)
const caption = ref('')
const files = ref<Array<{ file: File; src: string }>>([])
const activeIndex = ref(0)
const loading = ref(false)
const errorMessage = ref('')

const currentFile = computed(() => files.value[activeIndex.value] ?? null)

function resetState() {
  step.value = 1
  isDragged.value = false
  caption.value = ''
  files.value = []
  activeIndex.value = 0
  errorMessage.value = ''
}

function close() {
  resetState()
  emit('close')
}

function onDragenter() {
  isDragged.value = true
}

function onDragleave() {
  isDragged.value = false
}

function handleDrop(fileList: FileList | null) {
  if (!fileList || !fileList.length) return
  addFiles(fileList)
  isDragged.value = false
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement | null
  const fileList = target?.files
  if (!fileList || !fileList.length) return
  addFiles(fileList)
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve((e.target?.result as string) || '')
    }
    reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'))
    reader.readAsDataURL(file)
  })
}

async function addFiles(fileList: FileList) {
  const local: Array<{ file: File; src: string }> = []
  for (let i = 0; i < fileList.length; i += 1) {
    const file = fileList[i]!
    const src = await readFile(file)
    local.push({ file, src })
  }
  if (local.length) {
    files.value = [...files.value, ...local]
    activeIndex.value = 0
    step.value = 2
  }
}

function back() {
  if (step.value === 2) {
    files.value = []
    caption.value = ''
    step.value = 1
  }
}

async function shareStory() {
  if (!files.value.length || loading.value) return
  loading.value = true
  errorMessage.value = ''
  try {
    // TODO: 스토리 업로드 API 연동
    emit('created')
    close()
  } catch {
    errorMessage.value = '업로드 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[120] flex items-center justify-center bg-black/25 px-3 py-6"
      @click.self="close"
    >
      <div
        :class="[
          step === 1 ? 'w-full max-w-[620px]' : 'w-full max-w-[420px] max-h-[90vh]',
          'bg-[rgb(33,35,40)] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col',
        ]"
      >
        <!-- 헤더: 스텝1·스텝2 동일 (제목 + X 닫기) -->
        <header class="flex items-center justify-between px-4 py-1 border-b border-neutral-800 bg-[rgb(33,35,40)] text-white shrink-0">
          <div class="flex items-center gap-3">
            <button
              v-if="step === 2"
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-full text-neutral-300 hover:bg-neutral-800"
              aria-label="뒤로"
              @click="back"
            >
              <i class="fa-solid fa-arrow-left text-base" />
            </button>
            <div v-else class="w-8 h-8" />
          </div>
          <div class="flex-1 flex justify-center">
            <h2 class="text-sm font-semibold">새 스토리 추가</h2>
          </div>
          <button
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-800"
            aria-label="닫기"
            @click="close"
          >
            <i class="fa-solid fa-xmark text-base" />
          </button>
        </header>

        <!-- STEP 1: 파일 선택 (CreateFeed와 동일) -->
        <div
          v-if="step === 1"
          class="flex-1 flex items-center justify-center bg-[rgb(33,35,40)]"
        >
          <div
            class="w-full h-[560px] flex flex-col items-center justify-center text-center p-6 transition-colors"
            :class="isDragged ? 'bg-blue-900/10' : ''"
            @drop.prevent="handleDrop($event.dataTransfer?.files || null)"
            @dragover.prevent
            @dragenter="onDragenter"
            @dragleave="onDragleave"
          >
            <div class="mb-6 flex items-center justify-center">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="text-neutral-200"
              >
                <g opacity="0.9">
                  <rect x="8" y="8" width="48" height="48" rx="4" stroke="currentColor" stroke-width="2" fill="none" />
                  <path d="M12 44 Q20 36, 28 44 T44 44" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
                  <circle cx="20" cy="20" r="4" fill="currentColor" />
                </g>
                <g opacity="0.9">
                  <rect x="24" y="24" width="48" height="48" rx="4" stroke="currentColor" stroke-width="2" fill="none" />
                  <path d="M38 36 L38 52 L52 44 Z" fill="currentColor" />
                </g>
              </svg>
            </div>
            <p class="text-sm font-semibold text-neutral-50 mb-3">
              사진과 동영상을 여기에 끌어다 놓으세요
            </p>
            <label
              for="create-story-file-input"
              class="inline-flex items-center justify-center px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
            >
              컴퓨터에서 선택
            </label>
            <input
              id="create-story-file-input"
              class="hidden"
              type="file"
              multiple
              accept="image/*,video/*"
              @change="handleFileChange"
            >
          </div>
        </div>

        <!-- STEP 2: 스토리 편집 화면 (헤더 제외 아래 디자인만) -->
        <template v-else-if="step === 2">
          <div class="relative flex-1 flex flex-col min-h-0 bg-[rgb(33,35,40)] overflow-hidden">
            <!-- 이미지 영역 + 오른쪽 도구들(헤더 밖, 본문 안에 고정) -->
            <div class="relative flex-1 flex items-center justify-center bg-neutral-900 min-h-[280px] min-w-0">
              <img
                v-if="currentFile"
                :src="currentFile.src"
                class=" w-full object-contain"
                alt=""
              >
              <div class="absolute right-2 top-[120px] -translate-y-1/2 flex flex-col gap-1.5">
                <button type="button" class="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white text-xs font-bold shrink-0">Aa</button>
                <button type="button" class="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white shrink-0">
                  <i class="fa-regular fa-face-smile text-sm" />
                </button>
                <button type="button" class="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white shrink-0">
                  <i class="fa-solid fa-music text-sm" />
                </button>
                <button type="button" class="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white text-sm font-bold shrink-0">@</button>
                <button type="button" class="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white shrink-0">
                  <i class="fa-solid fa-chevron-down text-xs" />
                </button>
              </div>
            </div>


            <!-- 캡션 입력 -->
            <div class="px-3 py-2 border-t border-neutral-800 shrink-0">
              <input
                v-model="caption"
                type="text"
                class="w-full bg-transparent text-sm text-white placeholder-neutral-500 outline-none py-1"
                placeholder="캡션 추가..."
              >
              <p v-if="errorMessage" class="mt-1 text-xs text-red-400">
                {{ errorMessage }}
              </p>
            </div>

            <!-- 하단 바: 내 스토리, 친한 친구, 다음 -->
            <div class="flex items-center gap-2 px-3 py-3 bg-[rgb(33,35,40)] border-t border-neutral-800 shrink-0">
              <button
                type="button"
                class="flex items-center gap-2 flex-1 min-w-0 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-neutral-600 flex-shrink-0 overflow-hidden">
                  <!-- 프로필 이미지 자리 -->
                </div>
                <span class="text-sm font-medium text-white truncate">내 스토리</span>
              </button>
              <button
                type="button"
                class="flex items-center gap-2 flex-1 min-w-0 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <i class="fa-solid fa-star text-white text-xs" />
                </div>
                <span class="text-sm font-medium text-white truncate">친한 친구</span>
              </button>
              <button
                type="button"
                class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 disabled:opacity-50 shrink-0"
                :disabled="loading"
                @click="shareStory"
              >
                <i class="fa-solid fa-arrow-right text-lg" />
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>
