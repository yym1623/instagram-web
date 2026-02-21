<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/app/composables/useApi'
import { mockData } from '@/app/data/mock'
import type { MockDataItem, MockFeedInner, MockFeedComment } from '@/app/data/mock'

const route = useRoute()
const { post: postApi, imageUrl } = useApi()
const auth = useAuthStore()

const name = computed(() => route.params.id as string)
const isMe = computed(() => name.value === auth.name || name.value === String(auth.id))

/** 목데이터에서 유저 찾기 (name 또는 id로) */
const profileUser = computed<MockDataItem | null>(() => {
  const id = name.value
  return mockData.find((m) => m.name === id || String(m.id) === id) ?? null
})

/** 표시용 유저 정보 (내 프로필이면 auth 반영, 없으면 API) */
const user = computed(() => {
  const mock = profileUser.value
  if (isMe.value && mock) {
    return {
      id: auth.id,
      name: auth.name,
      nickname: auth.nickname || auth.name || mock.nickname,
    }
  }
  if (mock) return { id: mock.id, name: mock.name, nickname: mock.nickname }
  if (apiUser.value) return apiUser.value
  return null
})

/** API 폴백: 목데이터에 없을 때 */
const apiUser = ref<{ id: string; name: string; nickname: string } | null>(null)
const apiPosts = ref<Array<{ id: string; img: string; img_cnt: number; make_write: string }>>([])

/** 팔로워 목록 (목데이터 기준) */
const followersList = computed(() => {
  const u = profileUser.value
  return (u?.followers ?? []) as { id: string; name: string; nickname: string }[]
})

/** 팔로우 목록 (목데이터 기준) */
const followingList = computed(() => {
  const u = profileUser.value
  return (u?.following ?? []) as { id: string; name: string; nickname: string }[]
})

/** 게시물 수: 목데이터면 feed 있으면 1, API면 length */
const postCount = computed(() => {
  if (profileUser.value) {
    const f = profileUser.value.feed as MockFeedInner
    const hasPost = f?.make_write != null || (Array.isArray(f?.img) && f.img.length > 0)
    return hasPost ? 1 : 0
  }
  return apiPosts.value.length
})

/** 그리드용 게시물 목록 (목데이터 1건 또는 API 여러 건). row 형태로 통일 */
interface PostRow {
  id: string
  name: string
  nickname: string
  user_id?: string
  img: string
  img_cnt: number
  make_write?: string
}
const userPostsForGrid = computed<PostRow[]>(() => {
  const u = profileUser.value
  if (u) {
    const f = u.feed as MockFeedInner
    const imgArr = Array.isArray(f?.img) ? f.img : []
    const hasPost = f?.make_write != null || imgArr.length > 0
    if (!hasPost) return []
    return [
      {
        id: 'p1',
        user_id: u.id,
        name: u.name,
        nickname: u.nickname,
        img: imgArr.join(','),
        img_cnt: imgArr.length,
        make_write: f?.make_write ?? '',
      },
    ]
  }
  return apiPosts.value.map((p, i) => ({
    id: p.id,
    name: apiUser.value?.name ?? '',
    nickname: apiUser.value?.nickname ?? '',
    img: p.img,
    img_cnt: p.img_cnt,
    make_write: p.make_write ?? '',
  }))
})

/** 그리드에서 클릭한 게시물 → 댓글 모달용 post id */
const selectedPostId = ref<string | null>(null)
const commentModalOpen = ref(false)
const comment = ref('')
const likedByPost = ref<Record<string, boolean>>({})
const likeCountByPost = ref<Record<string, number>>({})
const livePostComments = ref<Record<string, MockFeedComment[]>>({})
const likedCommentIds = ref<Set<string>>(new Set())

const selectedPost = computed(() => {
  if (!selectedPostId.value) return null
  return userPostsForGrid.value.find((p) => p.id === selectedPostId.value) ?? null
})

function getBaseCommentsForPost(postId: string): MockFeedComment[] {
  const u = profileUser.value
  if (!u) return []
  const f = u.feed as MockFeedInner
  if (f?.comment && postId === 'p1') return f.comment
  return []
}

const selectedPostComments = computed<MockFeedComment[]>(() => {
  if (!selectedPostId.value) return []
  return (
    livePostComments.value[selectedPostId.value] ??
    getBaseCommentsForPost(selectedPostId.value)
  )
})

function openCommentModal(postId: string) {
  selectedPostId.value = postId
  commentModalOpen.value = true
}

function closeCommentModal() {
  commentModalOpen.value = false
  selectedPostId.value = null
}

function submitComment(postId: string) {
  const text = comment.value.trim()
  if (!text) return
  const current = livePostComments.value[postId] ?? getBaseCommentsForPost(postId)
  const newComment: MockFeedComment = {
    id: `c_live_${Date.now()}`,
    make_id: postId,
    user_nickname: auth.nickname || auth.name || '나',
    comment: text,
    like: 0,
    reply: [],
  }
  livePostComments.value = { ...livePostComments.value, [postId]: [...current, newComment] }
  comment.value = ''
  closeCommentModal()
}

function addReply(parentId: string, text: string) {
  const postId = selectedPostId.value
  if (!postId) return
  const current = livePostComments.value[postId] ?? getBaseCommentsForPost(postId)
  const updateReplies = (list: MockFeedComment[]): MockFeedComment[] =>
    list.map((c) => {
      if (c.id === parentId) {
        const reply: MockFeedComment = {
          id: `c_live_r_${Date.now()}`,
          make_id: postId,
          user_nickname: auth.nickname || auth.name || '나',
          comment: text,
          like: 0,
          reply: [],
        }
        return { ...c, reply: [...(c.reply ?? []), reply] }
      }
      return { ...c, reply: updateReplies(c.reply ?? []) }
    })
  livePostComments.value = { ...livePostComments.value, [postId]: updateReplies(current) }
}

function toggleCommentLike(commentId: string) {
  const set = new Set(likedCommentIds.value)
  if (set.has(commentId)) set.delete(commentId)
  else set.add(commentId)
  likedCommentIds.value = set
}

function toggleLike(postId: string) {
  const cur = likedByPost.value[postId] ?? false
  const count = likeCountByPost.value[postId] ?? 0
  likedByPost.value[postId] = !cur
  likeCountByPost.value[postId] = cur ? Math.max(0, count - 1) : count + 1
}

const tab = ref<'board' | 'play' | 'save' | 'tag'>('board')
const followModalKind = ref<'followers' | 'following' | null>(null)

function openFollowModal(kind: 'followers' | 'following') {
  followModalKind.value = kind
}

function myPage(n: string) {
  navigateTo(`/user/${n}`)
}

onMounted(async () => {
  if (!profileUser.value) {
    const me = await postApi<Array<{ id: string; name: string; nickname: string }>>('/users/me', {
      name: name.value,
    })
    apiUser.value = me?.[0] ?? null
    const posts = await postApi<
      Array<{ id: string; img: string; img_cnt: number; make_write: string }>
    >('/posts/user', { name: name.value })
    apiPosts.value = posts ?? []
  }
  // 초기 좋아요 수 (목데이터 feed.like)
  const u = profileUser.value
  if (u?.feed && typeof u.feed === 'object' && 'like' in u.feed) {
    likeCountByPost.value['p1'] = (u.feed as { like?: number }).like ?? 0
  }
})
</script>

<template>
  <div class="user w-full min-h-screen bg-app pt-[50px] px-[20px]">
    <!-- 위·아래 묶는 부모: max-width 1457px, mx-auto -->
    <div class="max-w-[1457px] ml-auto mr-[230px]">
      <!-- 위쪽만 max-width 680, mx-auto -->
      <div class="max-w-[680px] mx-auto mb-[16px]">
        <header class="flex flex-wrap items-start gap-8 mb-6">
        <div class="relative flex-shrink-0">
          <div class="w-[150px] h-[150px] rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-4 mb-4">
            <h1 class="text-xl font-semibold text-neutral-900 dark:text-white">
              {{ user?.nickname }}
            </h1>
          </div>
          <div class="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
            {{ user?.name }}
          </div>
          <div class="flex gap-6 mb-3 text-neutral-900 dark:text-white">
            <span><strong>게시물</strong> {{ postCount }}</span>
            <button
              type="button"
              class="hover:opacity-80"
              @click="openFollowModal('followers')"
            >
              <strong>팔로워</strong> {{ followersList.length }}
            </button>
            <button
              type="button"
              class="hover:opacity-80"
              @click="openFollowModal('following')"
            >
              <strong>팔로우</strong> {{ followingList.length }}
            </button>
          </div>
        </div>
        <!-- 프로필 편집 / 보관된 스토리: 헤더 아래 한 줄 전체 -->
        <div class="w-full flex-[0_0_100%] flex gap-2 mt-2">
          <button
            type="button"
            class="flex-1 py-2 px-4 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm font-semibold hover:opacity-90"
          >
            프로필 편집
          </button>
          <button
            type="button"
            class="flex-1 py-2 px-4 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm font-semibold hover:opacity-90"
          >
            보관된 스토리 보기
          </button>
        </div>
      </header>
      </div>

      <!-- 스토리 하이라이트 (위쪽 680 영역에 추가) -->
      <div class="max-w-[680px] mx-auto mb-6 flex gap-6 overflow-x-auto pb-2">
        <div class="flex flex-col items-center shrink-0">
          <div class="w-20 h-20 rounded-full bg-neutral-200 dark:bg-neutral-700 border-2 border-neutral-300 dark:border-neutral-600 overflow-hidden flex items-center justify-center">
            <span class="text-neutral-500 text-xs">연습</span>
          </div>
          <span class="text-xs text-neutral-700 dark:text-neutral-300 mt-1">연습</span>
        </div>
        <div class="flex flex-col items-center shrink-0">
          <div class="w-20 h-20 rounded-full bg-neutral-200 dark:bg-neutral-700 border-2 border-neutral-300 dark:border-neutral-600 overflow-hidden flex items-center justify-center">
            <span class="text-neutral-500 text-xs">일상</span>
          </div>
          <span class="text-xs text-neutral-700 dark:text-neutral-300 mt-1">일상</span>
        </div>
        <div class="flex flex-col items-center shrink-0">
          <div class="w-20 h-20 rounded-full border-2 border-dashed border-neutral-400 dark:border-neutral-500 flex items-center justify-center">
            <i class="fa-solid fa-plus text-neutral-500" />
          </div>
          <span class="text-xs text-neutral-700 dark:text-neutral-300 mt-1">신규</span>
        </div>
      </div>

      <!-- 아래 nav·게시물 (1457 안에서 전체 너비) -->
      <nav class="flex flex-wrap justify-center gap-0">
        <button
          type="button"
          class="flex flex-col items-center w-[195px] py-3 transition-colors"
          :class="tab === 'board' ? 'text-black dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'"
          @click="tab = 'board'"
        >
          <i class="fa-solid fa-table-cells text-lg mb-1" />
          <div
            class="w-full h-0.5 rounded-full transition-colors"
            :class="tab === 'board' ? 'bg-black dark:bg-white' : 'bg-transparent'"
          />
        </button>
        <button
          type="button"
          class="flex flex-col items-center w-[195px] py-3 transition-colors"
          :class="tab === 'play' ? 'text-black dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'"
          @click="tab = 'play'"
        >
          <i class="fa-solid fa-circle-play text-lg mb-1" />
          <div
            class="w-full h-0.5 rounded-full transition-colors"
            :class="tab === 'play' ? 'bg-black dark:bg-white' : 'bg-transparent'"
          />
        </button>
        <button
          type="button"
          class="flex flex-col items-center w-[195px] py-3 transition-colors"
          :class="tab === 'save' ? 'text-black dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'"
          @click="tab = 'save'"
        >
          <i class="fa-regular fa-bookmark text-lg mb-1" />
          <div
            class="w-full h-0.5 rounded-full transition-colors"
            :class="tab === 'save' ? 'bg-black dark:bg-white' : 'bg-transparent'"
          />
        </button>
        <button
          type="button"
          class="flex flex-col items-center w-[195px] py-3 transition-colors"
          :class="tab === 'tag' ? 'text-black dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'"
          @click="tab = 'tag'"
        >
          <i class="fa-solid fa-camera text-lg mb-1" />
          <div
            class="w-full h-0.5 rounded-full transition-colors"
            :class="tab === 'tag' ? 'bg-black dark:bg-white' : 'bg-transparent'"
          />
        </button>
      </nav>


      <!-- 게시물 탭: 4열 그리드, 클릭 시 댓글 모달 -->
      <div v-if="tab === 'board'" class="grid grid-cols-4 gap-0.5 mt-0.5">
        <button
          v-for="p in userPostsForGrid"
          :key="p.id"
          type="button"
          class="aspect-[4/3] block overflow-hidden bg-neutral-100 dark:bg-neutral-800"
          @click="openCommentModal(p.id)"
        >
          <img
            v-if="p.img"
            :src="imageUrl(p.img_cnt === 1 ? p.img : p.img.split(',')[0])"
            class="w-full h-full object-cover"
            alt=""
          >
          <div v-else class="w-full h-full flex items-center justify-center text-neutral-500 text-sm">
            게시물
          </div>
        </button>
      </div>

      <div
        v-else
        class="flex items-center justify-center min-h-[280px] text-neutral-500 dark:text-neutral-400 text-sm"
      >
        <p class="text-center">
          이 탭과 관련된 게시물이 없습니다.<br>
          메시지로 공유된 내용이 여기에 표시됩니다.
        </p>
      </div>
    </div>

    <!-- 팔로워 모달 -->
    <ModalsFollowListModal
      :open="followModalKind === 'followers'"
      title="팔로워"
      :list="followersList"
      @close="followModalKind = null"
      @open-profile="(n) => { myPage(n); followModalKind = null }"
    />
    <!-- 팔로잉 모달 -->
    <ModalsFollowListModal
      :open="followModalKind === 'following'"
      title="팔로잉"
      :list="followingList"
      @close="followModalKind = null"
      @open-profile="(n) => { myPage(n); followModalKind = null }"
    />

    <!-- 댓글 모달 (피드와 동일) -->
    <ModalsPostCommentModal
      :open="commentModalOpen"
      :post="selectedPost as { id: string; name: string; nickname: string; img?: string; img_cnt?: number; make_write?: string } | null"
      :comments="selectedPostComments"
      :liked="selectedPostId ? !!likedByPost[selectedPostId] : false"
      :like-count="selectedPostId ? (likeCountByPost[selectedPostId] ?? 0) : 0"
      :liked-comment-ids="Array.from(likedCommentIds)"
      v-model:comment="comment"
      @close="closeCommentModal"
      @submit-comment="submitComment"
      @add-reply="(parentId, text) => selectedPostId && addReply(parentId, text)"
      @toggle-comment-like="toggleCommentLike"
      @toggle-like="selectedPostId && toggleLike(selectedPostId)"
      @open-profile="myPage"
      @msg-page="() => navigateTo('/message')"
    />
  </div>
</template>
