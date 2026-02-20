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

// 1: 파일선택, 2: 자르기, 3: 편집(필터), 4: 캡션/공유
const step = ref<1 | 2 | 3 | 4>(1)
const isDragged = ref(false)
const successImg = ref(false)
const caption = ref('')
const files = ref<Array<{ file: File; src: string }>>([])
const activeIndex = ref(0)
const loading = ref(false)
const errorMessage = ref('')

const filterOptions = [
  { key: 'original', label: '원본' },
  { key: 'clarendon', label: 'Clarendon' },
  { key: 'gingham', label: 'Gingham' },
  { key: 'juno', label: 'Juno' },
  { key: 'moon', label: 'Moon' },
  { key: 'lark', label: 'Lark' },
]

const selectedFilter = ref('original')
const editTab = ref<'filter' | 'adjust'>('filter')

const currentFile = computed(() => files.value[activeIndex.value] ?? null)

const headerTitle = computed(() => {
  if (successImg.value) return '새 게시물 만들기'
  if (step.value === 2) return '자르기'
  if (step.value === 3) return '편집'
  return '새 게시물 만들기'
})

function filterClassFor(key: string): string {
  switch (key) {
    case 'clarendon':
      return 'filter-clarendon'
    case 'gingham':
      return 'filter-gingham'
    case 'juno':
      return 'filter-juno'
    case 'moon':
      return 'filter-moon'
    case 'lark':
      return 'filter-lark'
    default:
      return 'filter-original'
  }
}

const filterClass = computed(() => filterClassFor(selectedFilter.value))

const modalWidthClass = computed(() => {
  if (step.value === 1 || step.value === 2) {
    return 'w-full max-w-[620px]'
  }
  return 'w-full max-w-[480px] lg:max-w-[960px]'
})

function resetState() {
  step.value = 1
  isDragged.value = false
  successImg.value = false
  caption.value = ''
  files.value = []
  activeIndex.value = 0
  selectedFilter.value = 'original'
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
    successImg.value = false
    step.value = 2
  }
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

function back() {
  if (successImg.value) {
    successImg.value = false
    step.value = 1
    return
  }
  if (step.value === 2) {
    // 파일선택 화면으로
    files.value = []
    caption.value = ''
    selectedFilter.value = 'original'
    step.value = 1
  } else if (step.value > 2) {
    step.value -= 1
  }
}

function goNext() {
  if (step.value === 2) step.value = 3
  else if (step.value === 3) step.value = 4
}

async function share() {
  if (!files.value.length || loading.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    const config = useRuntimeConfig()
    const base = config.public.apiBase as string
    const url = `${base}/posts`

    const formData = new FormData()
    files.value.forEach(({ file }) => {
      formData.append('myfile', file)
    })
    formData.append('email', auth.email)
    formData.append('name', auth.name)
    formData.append('nickname', auth.nickname)
    formData.append('write', caption.value || '')

    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      throw new Error(await res.text())
    }

    successImg.value = true
    emit('created')

    setTimeout(() => {
      close()
    }, 1500)
  } catch {
    errorMessage.value = '업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
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
        :class="[modalWidthClass, 'bg-[rgb(33,35,40)] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col']"
      >
        <!-- 헤더 -->
        <header class="flex items-center justify-between px-4 py-1 border-b border-neutral-800 bg-[rgb(33,35,40)] text-white">
          <!-- 왼쪽: 뒤로 버튼 / 챕터1에서의 빈 공간 -->
          <div class="flex items-center gap-3">
            <button
              v-if="step > 1 || successImg"
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-full text-neutral-300 hover:bg-neutral-800"
              aria-label="뒤로"
              @click="back"
            >
              <i class="fa-solid fa-arrow-left text-base" />
            </button>
            <div v-else-if="step === 1" class="w-8 h-8" />
          </div>

          <!-- 가운데: 제목 (항상 중앙 정렬) -->
          <div class="flex-1 flex justify-center">
            <h2 class="text-sm font-semibold">
              {{ headerTitle }}
            </h2>
          </div>

          <!-- 오른쪽: 다음/공유/닫기 -->
          <div class="flex items-center gap-2">
            <button
              v-if="!successImg && (step === 2 || step === 3)"
              type="button"
              class="text-sm font-semibold text-blue-400 hover:text-blue-300 disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="!files.length"
              @click="goNext"
            >
              다음
            </button>
            <button
              v-else-if="!successImg && step === 4"
              type="button"
              class="text-sm font-semibold text-blue-400 hover:text-blue-300 disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="!files.length || loading"
              @click="share"
            >
              {{ loading ? '업로드 중...' : '공유하기' }}
            </button>
            <button
              v-if="step === 1"
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-800"
              aria-label="닫기"
              @click="close"
            >
              <i class="fa-solid fa-xmark text-base" />
            </button>
          </div>
        </header>

        <!-- 본문 -->
        <!-- STEP 1: 파일 선택 / 드래그 앤 드롭 (인스타 첫 화면 스타일) -->
        <div
          v-if="step === 1 && !successImg"
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
                <!-- 왼쪽: 이미지 아이콘 -->
                <g opacity="0.9">
                  <rect
                    x="8"
                    y="8"
                    width="48"
                    height="48"
                    rx="4"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                  />
                  <!-- 산/풍경 라인 -->
                  <path
                    d="M12 44 Q20 36, 28 44 T44 44"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                  />
                  <!-- 태양/달 원형 -->
                  <circle
                    cx="20"
                    cy="20"
                    r="4"
                    fill="currentColor"
                  />
                </g>
                <!-- 오른쪽: 비디오 플레이 아이콘 (겹쳐짐) -->
                <g opacity="0.9">
                  <rect
                    x="24"
                    y="24"
                    width="48"
                    height="48"
                    rx="4"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                  />
                  <!-- 플레이 삼각형 -->
                  <path
                    d="M38 36 L38 52 L52 44 Z"
                    fill="currentColor"
                  />
                </g>
              </svg>
            </div>
            <p class="text-sm font-semibold text-neutral-50 mb-3">
              사진과 동영상을 여기에 끌어다 놓으세요
            </p>
            <label
              for="create-file-input"
              class="inline-flex items-center justify-center px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
            >
              컴퓨터에서 선택
            </label>
            <input
              id="create-file-input"
              class="hidden"
              type="file"
              name="myfile"
              multiple
              accept="image/*,video/*"
              @change="handleFileChange"
            >
          </div>
        </div>

        <!-- STEP 2: 자르기(간단 미리보기) -->
        <div
          v-else-if="step === 2 && !successImg"
          class="flex-1 flex flex-col bg-[rgb(33,35,40)]"
        >
          <div class="flex-1 flex items-center justify-center">
            <div class="w-full h-[560px] bg-[rgb(33,35,40)] flex items-center justify-center">
              <img
                v-if="currentFile"
                :src="currentFile.src"
                class="w-full h-full object-contain"
                alt=""
              >
            </div>
          </div>
        </div>

        <!-- STEP 3: 편집(필터) -->
        <div
          v-else-if="step === 3 && !successImg"
          class="flex-1 flex flex-col lg:flex-row bg-[rgb(33,35,40)]"
        >
          <!-- 큰 이미지 -->
          <div class="relative w-full lg:w-2/3 bg-[rgb(33,35,40)] flex items-center justify-center">
            <img
              v-if="currentFile"
              :src="currentFile.src"
              class="max-h-[520px] w-full object-contain"
              :class="filterClass"
              alt=""
            >
          </div>

          <!-- 필터 / 조정 탭 + 목록 -->
          <div class="w-full lg:w-1/3 border-t lg:border-t-0 lg:border-l border-neutral-800 flex flex-col bg-[rgb(33,35,40)] max-h-[520px]">
            <!-- 탭 헤더 -->
            <div class="flex border-b border-neutral-800 text-xs font-semibold">
              <button
                type="button"
                class="flex-1 px-4 py-3 text-center"
                :class="editTab === 'filter' ? 'text-white border-b border-white' : 'text-neutral-500'"
                @click="editTab = 'filter'"
              >
                필터
              </button>
              <button
                type="button"
                class="flex-1 px-4 py-3 text-center"
                :class="editTab === 'adjust' ? 'text-white border-b border-white' : 'text-neutral-500'"
                @click="editTab = 'adjust'"
              >
                조정
              </button>
            </div>

            <!-- 필터 목록 -->
            <div
              v-if="editTab === 'filter'"
              class="overflow-y-auto px-4 py-3 grid grid-cols-3 gap-3"
            >
              <button
                v-for="f in filterOptions"
                :key="f.key"
                type="button"
                class="flex flex-col items-center text-xs text-neutral-300 focus:outline-none"
                @click="selectedFilter = f.key"
              >
                <div
                  class="w-20 h-20 rounded-lg overflow-hidden mb-1 border"
                  :class="selectedFilter === f.key ? 'border-blue-400' : 'border-transparent'"
                >
                  <img
                    v-if="currentFile"
                    :src="currentFile.src"
                    class="w-full h-full object-cover"
                    :class="filterClassFor(f.key)"
                    alt=""
                  >
                </div>
                <span :class="selectedFilter === f.key ? 'text-white' : 'text-neutral-400'">
                  {{ f.label }}
                </span>
              </button>
            </div>

            <!-- 조정 탭(placeholder) -->
            <div
              v-else
              class="px-4 py-3 text-xs text-neutral-400"
            >
              조정 탭은 추후 추가 예정입니다.
            </div>
          </div>
        </div>

        <!-- STEP 4: 캡션 / 공유 -->
        <div
          v-else-if="step === 4 && !successImg"
          class="flex-1 flex flex-col lg:flex-row bg-[rgb(33,35,40)]"
        >
          <!-- 미리보기 영역 -->
          <div class="relative w-full lg:w-2/3 bg-[rgb(33,35,40)] flex items-center justify-center">
            <img
              v-if="currentFile"
              :src="currentFile.src"
              class="max-h-[520px] w-full object-contain"
              :class="filterClass"
              alt=""
            >
          </div>

          <!-- 정보/텍스트 영역 -->
          <div class="w-full lg:w-1/3 border-t lg:border-t-0 lg:border-l border-neutral-800 flex flex-col bg-[rgb(33,35,40)] max-h-[520px]">
            <div class="flex items-center gap-3 px-4 py-3">
              <div class="w-8 h-8 rounded-full bg-neutral-700 flex-shrink-0" />
              <div class="text-sm font-semibold text-white truncate">
                {{ auth.nickname || auth.name }}
              </div>
            </div>

            <div class="flex-1 px-4 py-3 overflow-y-auto">
              <textarea
                v-model="caption"
                rows="4"
                class="w-full resize-none border-0 bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
                placeholder="문구 입력..."
              />
              <p v-if="errorMessage" class="mt-2 text-xs text-red-400">
                {{ errorMessage }}
              </p>
            </div>

            <div class="border-t border-neutral-800 divide-y divide-neutral-800">
              <button
                type="button"
                class="w-full flex items-center justify-between px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800/80"
              >
                <span>위치 추가</span>
                <i class="fa-solid fa-location-dot text-sm text-neutral-400" />
              </button>
              <button
                type="button"
                class="w-full flex items-center justify-between px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800/80"
              >
                <span>접근성</span>
                <i class="fa-solid fa-angle-right text-xs text-neutral-400" />
              </button>
              <button
                type="button"
                class="w-full flex items-center justify-between px-4 py-3 text-sm text-neutral-200 hover:bg-neutral-800/80"
              >
                <span>고급 설정</span>
                <i class="fa-solid fa-angle-right text-sm text-neutral-400" />
              </button>
            </div>
          </div>
        </div>

        <!-- 업로드 완료 -->
        <div
          v-else
          class="flex-1 flex items-center justify-center p-10 bg-[rgb(33,35,40)]"
        >
          <div class="text-center space-y-3">
            <div class="flex justify-center">
              <div class="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <i class="fa-solid fa-check text-2xl text-emerald-400" />
              </div>
            </div>
            <p class="text-sm font-semibold text-neutral-50">
              업로드가 완료되었습니다
            </p>
            <p class="text-xs text-neutral-400">
              피드가 새로고침되면 새 게시물을 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.filter-original {
  filter: none;
}
.filter-clarendon {
  filter: contrast(1.2) saturate(1.35);
}
.filter-gingham {
  filter: contrast(1.05) saturate(1.1) hue-rotate(-10deg);
}
.filter-juno {
  filter: contrast(1.15) saturate(1.3) hue-rotate(-5deg);
}
.filter-moon {
  filter: grayscale(1) contrast(1.1);
}
.filter-lark {
  filter: brightness(1.05) saturate(1.2);
}
</style>