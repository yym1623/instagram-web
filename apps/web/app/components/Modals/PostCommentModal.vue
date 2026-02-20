<script setup lang="ts">
import { useApi } from '~/composables/useApi'

interface CommentItem {
  id: string
  make_id: string
  user_nickname: string
  comment: string
}

interface PostDetail {
  id: string
  name: string
  nickname: string
  img?: string
  img_cnt?: number
  make_write?: string
}

const props = withDefaults(
  defineProps<{
    open: boolean
    post: PostDetail | null
    comments: CommentItem[]
    comment: string
    liked?: boolean
    likeCount?: number
  }>(),
  { liked: false, likeCount: 0 },
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:comment', value: string): void
  (e: 'submitComment', postId: string): void
  (e: 'openProfile', name: string): void
  (e: 'msgPage'): void
}>()

const { imageUrl } = useApi()

const hasImages = computed(
  () =>
    (props.post?.img_cnt ?? 0) > 0 && (props.post?.img ?? '').length > 0,
)
const isSingleImage = computed(() => (props.post?.img_cnt ?? 0) === 1)
const imageList = computed(() =>
  (props.post?.img ?? '').split(',').filter(Boolean),
)

const imageIndex = ref(0)

watch(
  () => props.open,
  (v) => {
    if (v) imageIndex.value = 0
  },
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && post"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-4"
      @click.self="emit('close')"
    >
      <div class="bg-[rgb(33,35,40)] rounded-b-xl shadow-2xl w-[90vw] max-w-[950px] h-[90vh] flex overflow-hidden border border-neutral-700 flex-col lg:flex-row">
        <!-- 왼쪽: 게시물 이미지 (450px) -->
        <div class="relative w-full lg:w-[450px] lg:flex-shrink-0 flex flex-col bg-[rgb(33,35,40)] min-h-0">
          <template v-if="hasImages">
            <img
              v-if="isSingleImage"
              :src="imageUrl(post.img!)"
              class="w-full h-full object-contain flex-1 min-h-0"
              alt=""
            >
            <div v-else class="relative flex-1 min-h-0 overflow-hidden">
              <img
                v-for="(img, i) in imageList"
                :key="i"
                :src="imageUrl(img)"
                class="absolute inset-0 w-full h-full object-contain"
                :class="i === imageIndex ? 'z-10' : 'z-0 opacity-0 pointer-events-none'"
                alt=""
              >
              <button
                v-if="imageIndex > 0"
                type="button"
                class="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white"
                @click="imageIndex--"
              >
                <i class="fa-solid fa-chevron-left" />
              </button>
              <button
                v-if="imageIndex < imageList.length - 1"
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white"
                @click="imageIndex++"
              >
                <i class="fa-solid fa-chevron-right" />
              </button>
            </div>
          </template>
          <div
            v-else
            class="flex-1 min-h-[200px] flex items-center justify-center bg-neutral-800/50"
          >
            <span class="text-neutral-500 text-sm">이미지 없음</span>
          </div>
        </div>

        <!-- 오른쪽: 헤더 → 댓글 목록 → 액션 바 → 댓글 입력 (500px) -->
        <div class="w-full lg:w-[500px] lg:flex-shrink-0 border-t lg:border-t-0 lg:border-l border-neutral-700 flex flex-col bg-[rgb(33,35,40)] min-h-0">
          <!-- 헤더: 프로필, 닉네임, 오리지널 오디오, 더보기 -->
          <div class="flex items-center gap-3 p-4 border-b border-neutral-700 shrink-0">
            <button
              type="button"
              class="w-9 h-9 rounded-full bg-neutral-600 flex-shrink-0 overflow-hidden"
              @click="emit('openProfile', post.name)"
            />
            <div class="min-w-0 flex-1 text-left">
              <div class="text-sm font-semibold text-white truncate">{{ post.nickname }}</div>
              <div class="text-xs text-neutral-400 truncate">오리지널 오디오</div>
            </div>
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-white shrink-0"
              aria-label="더보기"
            >
              <i class="fa-solid fa-ellipsis" />
            </button>
          </div>

          <!-- 댓글 스크롤 영역: 캡션 + 댓글 목록(프로필, 유저명, 댓글, 시간, 좋아요/답글, 하트) -->
          <div class="flex-1 overflow-y-auto min-h-0 px-4 py-3">
            <div
              v-for="c in comments"
              :key="c.id"
              class="flex gap-3 py-3 border-b border-neutral-800/50 last:border-0"
            >
              <div class="w-8 h-8 rounded-full bg-neutral-600 flex-shrink-0" />
              <div class="min-w-0 flex-1">
                <div class="text-sm">
                  <span class="font-semibold text-white">{{ c.user_nickname }}</span>
                  <span class="text-neutral-300">{{ c.comment }}</span>
                </div>
                <div class="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                  <span>9시간</span>
                  <button type="button" class="hover:underline">좋아요 0개</button>
                  <button type="button" class="hover:underline">답글 달기</button>
                </div>
              </div>
              <button
                type="button"
                class="self-start text-neutral-400 hover:text-white shrink-0"
              >
                <i class="fa-regular fa-heart text-sm" />
              </button>
            </div>
          </div>

          <!-- 액션 바: FeedCard와 동일 (좋아요·댓글·공유·북마크) -->
          <div class="p-3 shrink-0">
            <section class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="flex items-center gap-1.5 text-white hover:opacity-70"
                >
                  <i
                    :class="liked ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'"
                    class="text-[1.4rem]"
                    aria-label="좋아요"
                  />
                </button>
                <button
                  type="button"
                  class="flex items-center gap-1.5 text-white hover:opacity-70"
                >
                  <i class="fa-regular fa-comment text-[1.4rem]" aria-label="댓글 달기" />
                </button>
                <button
                  type="button"
                  class="flex items-center justify-center text-white hover:opacity-70"
                  aria-label="공유하기"
                  @click="emit('msgPage')"
                >
                  <i class="fa-regular fa-paper-plane text-[1.2rem]" />
                </button>
              </div>
              <button
                type="button"
                class="flex items-center justify-center text-white hover:opacity-70 flex-shrink-0"
                aria-label="저장"
              >
                <i class="fa-regular fa-bookmark text-[1.4rem]" />
              </button>
            </section>
            <!-- 좋아요 개수 + 게시 시간 (목업) -->
            <div class="mt-3 flex flex-col gap-0.5 text-sm text-white">
              <span class="font-semibold">좋아요 {{ likeCount }}개</span>
              <span class="text-neutral-500">9시간 전</span>
            </div>
          </div>

          <!-- 최하단 댓글 입력: 이모지 · 입력창 · 게시 -->
          <div class="flex items-center gap-2 px-3 py-2 border-t border-neutral-700 shrink-0">
            <button
              type="button"
              class="flex items-center justify-center w-9 h-9 rounded-full text-neutral-400 hover:text-white shrink-0"
              aria-label="이모지"
            >
              <i class="fa-regular fa-face-smile text-xl" />
            </button>
            <input
              :value="comment"
              type="text"
              placeholder="댓글 달기..."
              class="flex-1 min-w-0 py-2 bg-transparent border-0 outline-none text-sm text-white placeholder-neutral-500"
              @input="emit('update:comment', ($event.target as HTMLInputElement).value)"
            >
            <button
              type="button"
              class="font-semibold text-sm shrink-0 disabled:opacity-40"
              :class="comment ? 'text-blue-400 hover:opacity-80' : 'text-neutral-500'"
              :disabled="!comment"
              @click="emit('submitComment', post.id)"
            >
              게시
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
