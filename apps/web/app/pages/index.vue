<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'
import RightSidebar from '~/components/feed/RightSidebar.vue'
import StoriesBar from '~/components/feed/StoriesBar.vue'
import { mockFeed, mockUsers } from '~/data/feed'

const { get, post, imageUrl } = useApi()
const auth = useAuthStore()

interface FeedResponse {
  row: Array<Record<string, unknown>>
  comment: unknown[]
  commentLength: unknown[]
}

const userList = ref<FeedResponse | null>(null)
const usersList = ref<Array<{ id: string; name: string; nickname: string }>>([])
const comment = ref('')
const openPostId = ref<string | null>(null)
const createStoryOpen = ref(false)
const likesModalOpen = ref(false)
const commentModalOpen = ref(false)
const shareModalOpen = ref(false)
const selectedPostId = ref<string | null>(null)

/** 게시물별 좋아요 여부 (유저 기준) */
const likedByPost = ref<Record<string, boolean>>({})
/** 게시물별 좋아요 수 */
const likeCountByPost = ref<Record<string, number>>({})

const selectedPost = computed(() => {
  if (!selectedPostId.value || !userList.value?.row) return null
  const row = userList.value.row as Array<Record<string, unknown>>
  return row.find((p) => (p.id as string) === selectedPostId.value) ?? null
})

const selectedPostComments = computed(() => {
  if (!selectedPostId.value || !userList.value?.comment) return []
  const comments = userList.value.comment as Array<{ make_id: string; id: string; user_nickname: string; comment: string }>
  return comments.filter((c) => c.make_id === selectedPostId.value)
})

/** 좋아요 모달용 목업 (추후 API 연동) */
const likersForModal = ref<Array<{ id: string; name: string; nickname: string; subtitle?: string }>>([])

async function loadFeed() {
  try {
    const res = (await get('/posts/feed')) as FeedResponse | null
    if (!res || !Array.isArray(res.row) || res.row.length === 0) {
      userList.value = mockFeed as FeedResponse
    } else {
      userList.value = res
    }
  } catch {
    userList.value = mockFeed as FeedResponse
  }
}

async function loadUsers() {
  try {
    const res = (await post('/users/select', { name: auth.name })) as Array<{ id: string; name: string; nickname: string }> | null
    if (!res || !Array.isArray(res) || res.length === 0) {
      usersList.value = mockUsers
    } else {
      usersList.value = res
    }
  } catch {
    usersList.value = mockUsers
  }
}

function myPage(name: string) {
  navigateTo(`/user/${name}`)
}

async function commentBtn(idx: string) {
  await post('/comments', { idx, comment: comment.value, nickname: auth.nickname, user_id: auth.id })
  comment.value = ''
  commentModalOpen.value = false
  selectedPostId.value = null
  await loadFeed()
}

function toggleLike(postId: string) {
  const cur = likedByPost.value[postId] ?? false
  const count = likeCountByPost.value[postId] ?? 0
  likedByPost.value[postId] = !cur
  likeCountByPost.value[postId] = cur ? Math.max(0, count - 1) : count + 1
}

function openLikesModal(postId: string) {
  selectedPostId.value = postId
  likersForModal.value = [] // TODO: API로 좋아요 누른 사람 목록 조회
  likesModalOpen.value = true
}

function openCommentModal(postId: string) {
  selectedPostId.value = postId
  commentModalOpen.value = true
}

async function boardDelete(idx: string) {
  await post('/posts/delete', { make_idx: idx })
  await loadFeed()
}

function msgPage() {
  navigateTo('/message')
}

function openShareModal(_postId: string) {
  shareModalOpen.value = true
}

function onShareSelectUser(_user: { id: string; name: string; nickname: string }) {
  shareModalOpen.value = false
  navigateTo('/message')
}

onMounted(() => {
  loadFeed()
  loadUsers()
})
</script>

<template>
  <div class="w-full h-full min-h-full flex flex-col lg:flex-row gap-8">
    <!-- 왼쪽: 메인 피드(StoriesBar + 게시글) -->
    <div class="w-full max-w-[630px] min-w-0 flex flex-col gap-4">
      <StoriesBar
        :current-nickname="auth.nickname"
        :users="usersList"
        @open-profile="myPage"
        @add-story="createStoryOpen = true"
      />

      <FeedCard
        v-for="post in (userList?.row ?? [])"
        :key="(post as { id?: string }).id"
        :post="post as { id: string; name: string; nickname: string; img?: string; img_cnt?: number; make_write?: string }"
        :comments="(userList?.comment ?? []).filter((c: unknown) => (c as { make_id: string }).make_id === (post as { id: string }).id) as { id: string; make_id: string; user_nickname: string; comment: string }[]"
        :setting-open="openPostId === (post as { id: string }).id"
        :liked="likedByPost[(post as { id: string }).id] ?? false"
        :like-count="likeCountByPost[(post as { id: string }).id] ?? 0"
        @open-profile="myPage"
        @open-setting="openPostId = (post as { id: string }).id"
        @close-setting="openPostId = null"
        @delete="boardDelete"
        @toggle-like="toggleLike"
        @open-likes="openLikesModal"
        @open-comments="openCommentModal"
        @open-share="openShareModal"
        @msg-page="msgPage"
      />
    </div>

    <!-- Right sidebar (desktop) -->
    <div class="hidden lg:block w-full max-w-[320px] flex-shrink-0 ml-6 my-6 mt-10 pl-6">
      <RightSidebar
        :users="usersList"
        @open-profile="myPage"
      />
    </div>

    <!-- 스토리 추가 모달 -->
    <ModalsCreateStory
      :open="createStoryOpen"
      @close="createStoryOpen = false"
      @created="createStoryOpen = false"
    />

    <!-- 좋아요 모달 -->
    <ModalsLikesModal
      :open="likesModalOpen"
      :likers="likersForModal"
      @close="likesModalOpen = false; selectedPostId = null"
      @open-profile="myPage"
    />

    <!-- 공유 모달 -->
    <ModalsShareModal
      :open="shareModalOpen"
      :users="usersList"
      @close="shareModalOpen = false"
      @open-profile="myPage"
      @select-user="onShareSelectUser"
    />

    <!-- 댓글 모달 (왼쪽 이미지, 오른쪽 댓글+입력) -->
    <ModalsPostCommentModal
      :open="commentModalOpen"
      :post="selectedPost as { id: string; name: string; nickname: string; img?: string; img_cnt?: number; make_write?: string } | null"
      :comments="selectedPostComments"
      :liked="selectedPostId ? !!likedByPost[selectedPostId] : false"
      :like-count="selectedPostId ? (likeCountByPost[selectedPostId] ?? 0) : 0"
      v-model:comment="comment"
      @close="commentModalOpen = false; selectedPostId = null"
      @submit-comment="commentBtn"
      @open-profile="myPage"
      @msg-page="msgPage"
    />
  </div>
</template>
