<script setup lang="ts">
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'

interface CommentItem {
  id: string
  make_id: string
  user_nickname: string
  comment: string
}

interface PostRow {
  id: string
  name: string
  nickname: string
  user_id?: string
  img?: string
  img_cnt?: number
  make_write?: string
}

const props = withDefaults(
  defineProps<{
    post: PostRow
    comments: CommentItem[]
    commentLength: number
    settingOpen: boolean
    liked?: boolean
    likeCount?: number
  }>(),
  {
    comments: () => [],
    commentLength: 0,
    settingOpen: false,
    liked: false,
    likeCount: 0,
  },
)

const emit = defineEmits<{
  (e: 'openProfile', name: string): void
  (e: 'openSetting'): void
  (e: 'closeSetting'): void
  (e: 'delete', postId: string): void
  (e: 'toggleLike', postId: string): void
  (e: 'openLikes', postId: string): void
  (e: 'openComments', postId: string): void
  (e: 'openShare', postId: string): void
  (e: 'msgPage'): void
}>()

const { imageUrl } = useApi()
const auth = useAuthStore()

const isOwnPost = computed(() => {
  const post = props.post as PostRow & { user_id?: string }
  if (post.user_id) return post.user_id === auth.id
  return post.name === auth.name
})

const hasImages = computed(
  () => (props.post.img_cnt ?? 0) > 0 && (props.post.img ?? '').length > 0,
)
const isSingleImage = computed(() => (props.post.img_cnt ?? 0) === 1)
const imageList = computed(() => (props.post.img ?? '').split(',').filter(Boolean))
const showSwipeUi = computed(() => imageList.value.length > 1)

const imageIndex = ref(0)

const displayLikeCount = computed(() => {
  const n = props.liked ? Math.max(1, props.likeCount) : props.likeCount
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`
  return String(n)
})

const commentCount = computed(() => props.comments.length)

const firstComment = computed(() => props.comments[0] ?? null)

function prevImage() {
  if (imageIndex.value <= 0) return
  imageIndex.value -= 1
}

function nextImage() {
  if (imageIndex.value >= imageList.value.length - 1) return
  imageIndex.value += 1
}
</script>

<template>
  <article
    class="bg-app rounded-xl overflow-hidden w-[485px] max-w-[485px] max-h-[900px] mx-16"
  >
    <header class="flex items-center justify-between min-h-[55px] py-2.5 border-b border-neutral-200 dark:border-neutral-800">
      <div class="flex items-center gap-3">
        <div
          class="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-600 cursor-pointer flex-shrink-0"
          @click="emit('openProfile', post.name)"
        />
        <div>
          <div class="text-sm font-bold text-black dark:text-white">
            {{ post.nickname }}
          </div>
          <div class="text-xs text-neutral-500 dark:text-neutral-400">
            {{ post.name }}
          </div>
        </div>
      </div>
      <button
        class="text-lg text-neutral-500 dark:text-neutral-300 hover:text-black dark:hover:text-white cursor-pointer p-1"
        @click="emit('openSetting')"
      >
        <i class="fa-solid fa-ellipsis" />
      </button>
    </header>

    <!-- 이미지 영역: 485×585, 라운드 4px -->
    <div class="relative bg-neutral-100 bg-app w-[485px] h-[585px] overflow-hidden border border-neutral-200 dark:border-neutral-800 rounded-[4px]">
      <template v-if="hasImages">
        <template v-if="isSingleImage">
          <img
            :src="imageUrl(post.img!)"
            class="w-full h-full object-contain"
            alt=""
          >
        </template>
        <template v-else>
          <div class="relative w-full h-full">
            <img
              v-for="(img, i) in imageList"
              :key="i"
              v-show="i === imageIndex"
              :src="imageUrl(img)"
              class="absolute inset-0 w-full h-full object-contain"
              alt=""
            >
            <!-- 스와이프 UI: 여러 장일 때만 -->
            <template v-if="showSwipeUi">
              <button
                type="button"
                class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white z-10"
                :class="imageIndex <= 0 ? 'invisible' : ''"
                aria-label="이전"
                @click="prevImage"
              >
                <i class="fa-solid fa-chevron-left text-sm" />
              </button>
              <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white z-10"
                :class="imageIndex >= imageList.length - 1 ? 'invisible' : ''"
                aria-label="다음"
                @click="nextImage"
              >
                <i class="fa-solid fa-chevron-right text-sm" />
              </button>
              <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                <button
                  v-for="(_, i) in imageList"
                  :key="i"
                  type="button"
                  class="w-1.5 h-1.5 rounded-full transition-colors"
                  :class="i === imageIndex ? 'bg-white' : 'bg-white/50'"
                  :aria-label="`${i + 1}번째`"
                  @click="imageIndex = i"
                />
              </div>
            </template>
          </div>
        </template>
      </template>
      <div
        v-else
        class="w-full h-full min-h-0 flex items-center justify-center bg-neutral-800/50"
      >
        <div class="text-center text-neutral-500 dark:text-neutral-400">
          <i class="fa-regular fa-image text-4xl mb-2 block" />
          <span class="text-sm">이미지 없음</span>
        </div>
      </div>
    </div>

    <!-- 액션·캡션 영역 (인스타 구조: 액션 행 → 캡션 → 댓글 1개) -->
    <div class="border-t border-neutral-200 dark:border-neutral-800 py-4">
      <section class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="flex items-center gap-1.5 text-black dark:text-white hover:opacity-70"
            @click="emit('toggleLike', post.id)"
          >
            <i
              :class="liked ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'"
              class="text-[1.4rem]"
              aria-label="좋아요"
            />
            <span
              v-if="likeCount > 0 || liked"
              class="text-sm text-black dark:text-white cursor-pointer hover:underline"
              @click.stop="emit('openLikes', post.id)"
            >
              {{ displayLikeCount }}
            </span>
          </button>
          <button
            type="button"
            class="flex items-center gap-1.5 text-black dark:text-white hover:opacity-70"
            @click="emit('openComments', post.id)"
          >
            <i
              class="fa-regular fa-comment text-[1.4rem]"
              aria-label="댓글 달기"
            />
            <span
              v-if="commentCount > 0"
              class="text-sm text-black dark:text-white cursor-pointer hover:underline"
              @click.stop="emit('openComments', post.id)"
            >
              {{ commentCount }}
            </span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center text-black dark:text-white hover:opacity-70"
            @click="emit('openShare', post.id)"
            aria-label="공유하기"
          >
            <i class="fa-regular fa-paper-plane text-[1.2rem]" />
          </button>
        </div>
        <button
          type="button"
          class="flex items-center justify-center text-black dark:text-white hover:opacity-70 flex-shrink-0"
          aria-label="저장"
        >
          <i class="fa-regular fa-bookmark text-[1.4rem]" />
        </button>
      </section>

      <!-- 캡션: 유저명 + 본문 (인스타처럼 한 줄) -->
      <div v-if="post.make_write" class="text-sm mt-3">
        <button
          type="button"
          class="font-semibold text-black dark:text-white hover:opacity-80 text-left"
          @click="emit('openProfile', post.name)"
        >
          {{ post.nickname }}
        </button>
        <span class="text-black dark:text-white">{{ post.make_write }}</span>
      </div>
    </div>

    <!-- 설정 모달 -->
    <ModalsPostSettingModal
      :open="settingOpen"
      :is-own-post="isOwnPost"
      @close="emit('closeSetting')"
      @delete="emit('delete', post.id)"
    />
  </article>
</template>
