<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/app/composables/useApi'
import { mockData, mockData_ad } from '@/app/data/mock'
import type { MockDataItem, MockFeedInner, MockFeedComment } from '@/app/data/mock'

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const { get, post } = useApi()
const auth = useAuthStore()

interface FeedResponse {
  row: Array<Record<string, unknown>>
  comment: unknown[]
  commentLength: unknown[]
}

/** 목데이터 → 피드 API 형태. startPostId 있으면 그 번호부터 (광고 합칠 때 id 충돌 방지) */
function buildFeedFromItems(items: MockDataItem[], startPostId = 1): FeedResponse {
  const row: Array<Record<string, unknown>> = []
  const comment: unknown[] = []
  const commentLength: unknown[] = []
  let postId = startPostId
  for (const u of items) {
    const f = u.feed as MockFeedInner
    const imgArr = Array.isArray(f.img) ? f.img : []
    const hasPost = f.make_write != null || imgArr.length > 0
    if (!hasPost) continue
    const id = `p${postId++}`
    row.push({
      id,
      user_id: u.id,
      nickname: u.nickname,
      name: u.name,
      img_cnt: imgArr.length,
      img: imgArr.join(','),
      make_write: f.make_write ?? '',
      like: (f as { like?: number }).like ?? 0,
    })
    commentLength.push(f.comment?.length ?? 0)
    for (const c of f.comment ?? []) {
      comment.push({ ...c, make_id: id })
    }
  }
  return { row, comment, commentLength }
}

/** 목데이터 한 곳에서만 로드. 내림차순(최신 먼저). Story/SubFeed/ShareModal에 props로 전달 */
const mockUsers = computed<MockDataItem[]>(() => [...mockData].reverse())

/** SubFeed에서 팔로우로 추가한 id */
const addedFollowingIds = ref<Set<string>>(new Set())
/** SubFeed에서 팔로잉 클릭으로 언팔로우한 id (목데이터에 있던 사람도 제외) */
const removedFollowingIds = ref<Set<string>>(new Set())

/** 팔로워: 로그인 유저가 팔로우한 목록 (목데이터 − 언팔로우 + 추가). 스토리·피드는 여기 있는 사람만 노출 */
const followingList = computed(() => {
  const me = mockUsers.value.find((m) => String(m.id) === String(auth.id))
  const fromMock = (me?.following ?? []) as { id: string; name: string; nickname: string }[]
  const fromMockFiltered = fromMock.filter((f) => !removedFollowingIds.value.has(f.id))
  const fromAdded = mockUsers.value
    .filter(
      (m) =>
        addedFollowingIds.value.has(m.id) &&
        !removedFollowingIds.value.has(m.id) &&
        !fromMock.some((f) => f.id === m.id),
    )
    .map((m) => ({ id: m.id, name: m.name, nickname: m.nickname }))
  return [...fromMockFiltered, ...fromAdded]
})
const followingIds = computed(() => new Set(followingList.value.map((f) => f.id)))

function onFollow(user: { id: string; name: string; nickname: string }) {
  addedFollowingIds.value = new Set([...addedFollowingIds.value, user.id])
  removedFollowingIds.value.delete(user.id)
}

function onUnfollow(user: { id: string }) {
  removedFollowingIds.value = new Set([...removedFollowingIds.value, user.id])
  addedFollowingIds.value.delete(user.id)
}

/** 팔로윙: 나를 팔로우한 목록. SubFeed 상단 3명 "X 님이 팔로워했습니다" */
const followersList = computed(() => {
  const me = mockUsers.value.find((m) => String(m.id) === String(auth.id))
  return (me?.followers ?? []) as { id: string; name: string; nickname: string }[]
})

/** 회원님을 위한 추천 전체 목록 (모두 보기 모달용). 나 제외 */
const recommendedListFull = computed(() =>
  mockUsers.value
    .filter((m) => String(m.id) !== String(auth.id))
    .map((m) => ({ id: m.id, name: m.name, nickname: m.nickname })),
)
const recommendedListModalOpen = ref(false)

/** 피드: 나 + 팔로우한 유저 + 광고 2개. 순서는 랜덤 (광고 끼워넣기) */
const mockFeed = computed<FeedResponse>(() => {
  const list = mockUsers.value.filter(
    (u) => String(u.id) === String(auth.id) || followingIds.value.has(u.id),
  )
  const normal = buildFeedFromItems(list)
  const ad = buildFeedFromItems(mockData_ad, 1000)
  const combinedRow = [...normal.row, ...ad.row]
  const combinedCommentLength = [...normal.commentLength, ...ad.commentLength]
  const indices = shuffleArray(combinedRow.map((_, i) => i))
  const row = indices.map((i) => combinedRow[i])
  const commentLength = indices.map((i) => combinedCommentLength[i])
  return {
    row,
    comment: [...normal.comment, ...ad.comment],
    commentLength,
  }
})

/** API로 피드 로드 성공 시 사용 (없으면 mock 사용) */
const apiFeed = ref<FeedResponse | null>(null)

/** 게시물별 목데이터 구조 댓글 목록 (추가/대댓글/댓글 좋아요 반영) */
const livePostComments = ref<Record<string, MockFeedComment[]>>({})
const comment = ref('')
const openPostId = ref<string | null>(null)
const createStoryOpen = ref(false)
const likesModalOpen = ref(false)
const commentModalOpen = ref(false)
const shareModalOpen = ref(false)
const selectedPostId = ref<string | null>(null)

/** 게시물별 좋아요 여부 (유저 기준) */
const likedByPost = ref<Record<string, boolean>>({})
/** 게시물별 좋아요 수 (목데이터 like + 토글 반영) */
const likeCountByPost = ref<Record<string, number>>({})
/** 댓글/대댓글 좋아요 여부 (현재 유저가 누른 댓글 id) */
const likedCommentIds = ref<Set<string>>(new Set())

/** base 피드에서 해당 게시물 댓글만 추출 */
function getBaseCommentsForPost(base: FeedResponse, postId: string): MockFeedComment[] {
  return (base.comment as MockFeedComment[]).filter((c) => c.make_id === postId)
}

/** 표시용 피드: base(API 또는 mock) + live 댓글/게시물 좋아요 반영 */
const mergedFeed = computed<FeedResponse>(() => {
  const base = apiFeed.value ?? mockFeed.value
  const row = (base.row as Array<Record<string, unknown>>).map((r) => ({
    ...r,
    like: likeCountByPost.value[r.id as string] ?? (r.like as number) ?? 0,
  }))
  const comment: unknown[] = []
  const commentLength: number[] = []
  for (const r of base.row as Array<{ id: string }>) {
    const list = livePostComments.value[r.id] ?? getBaseCommentsForPost(base, r.id)
    comment.push(...list)
    commentLength.push(list.length)
  }
  return { row, comment, commentLength }
})

const userList = computed<FeedResponse | null>(() => mergedFeed.value)

const selectedPost = computed(() => {
  if (!selectedPostId.value || !mergedFeed.value?.row) return null
  const row = mergedFeed.value.row as Array<Record<string, unknown>>
  return row.find((p) => (p.id as string) === selectedPostId.value) ?? null
})

const selectedPostComments = computed<MockFeedComment[]>(() => {
  if (!selectedPostId.value) return []
  return livePostComments.value[selectedPostId.value]
    ?? getBaseCommentsForPost(apiFeed.value ?? mockFeed.value, selectedPostId.value)
})

/** 좋아요 모달용 목업 (추후 API 연동) */
const likersForModal = ref<Array<{ id: string; name: string; nickname: string; subtitle?: string }>>([])

async function loadFeed() {
  try {
    const res = (await get('/posts/feed')) as FeedResponse | null
    if (!res || !Array.isArray(res.row) || res.row.length === 0) {
      apiFeed.value = null
    } else {
      apiFeed.value = res
    }
  } catch {
    apiFeed.value = null
  }
  const base = apiFeed.value ?? mockFeed.value
  for (const r of base.row as Array<{ id: string; like?: number }>) {
    if (likeCountByPost.value[r.id] === undefined) {
      likeCountByPost.value[r.id] = r.like ?? 0
    }
  }
}

function myPage(name: string) {
  navigateTo(`/user/${name}`)
}

function commentBtn(postId: string) {
  const text = comment.value.trim()
  if (!text) return
  const base = apiFeed.value ?? mockFeed.value
  const current = livePostComments.value[postId] ?? getBaseCommentsForPost(base, postId)
  const newComment: MockFeedComment = {
    id: `c_live_${Date.now()}`,
    make_id: postId,
    user_nickname: auth.nickname || auth.name || '나',
    comment: text,
    like: 0,
    reply: [],
  }
  livePostComments.value = {
    ...livePostComments.value,
    [postId]: [...current, newComment],
  }
  comment.value = ''
  commentModalOpen.value = false
  selectedPostId.value = null
}

function addReply(postId: string, parentCommentId: string, text: string) {
  const base = apiFeed.value ?? mockFeed.value
  const current = livePostComments.value[postId] ?? getBaseCommentsForPost(base, postId)
  const updateReplies = (list: MockFeedComment[]): MockFeedComment[] =>
    list.map((c) => {
      if (c.id === parentCommentId) {
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
})
</script>

<template>
  <div class="w-full h-full min-h-full flex flex-col lg:flex-row gap-8">
    <!-- 왼쪽: 메인 피드(Story + 게시글) -->
    <div class="w-full max-w-[630px] min-w-0 flex flex-col gap-4">
      <Story
        :current-nickname="auth.nickname"
        :mock-users="mockUsers"
        :following-list="followingList"
        :mock-ad-users="mockData_ad"
        @open-profile="myPage"
        @add-story="createStoryOpen = true"
      />

      <Feed
        v-for="(post, i) in (userList?.row ?? [])"
        :key="(post as { id?: string }).id"
        :post="post as { id: string; name: string; nickname: string; img?: string; img_cnt?: number; make_write?: string }"
        :comments="(userList?.comment ?? []).filter((c: unknown) => (c as { make_id: string }).make_id === (post as { id: string }).id) as { id: string; make_id: string; user_nickname: string; comment: string }[]"
        :comment-length="Number((userList?.commentLength ?? [])[i]) || 0"
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
      <SubFeed
        :mock-users="mockUsers"
        :followers-list="followersList"
        :following-ids="Array.from(followingIds)"
        @open-profile="myPage"
        @follow="onFollow"
        @unfollow="onUnfollow"
        @show-all="recommendedListModalOpen = true"
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
      :mock-users="mockUsers"
      @close="shareModalOpen = false"
      @open-profile="myPage"
      @select-user="onShareSelectUser"
    />

    <!-- 회원님을 위한 추천 전체 (모두 보기) -->
    <ModalsFollowListModal
      :open="recommendedListModalOpen"
      title="회원님을 위한 추천"
      :list="recommendedListFull"
      @close="recommendedListModalOpen = false"
      @open-profile="(n) => { myPage(n); recommendedListModalOpen = false }"
    />

    <!-- 댓글 모달 (왼쪽 이미지, 오른쪽 댓글+입력) -->
    <ModalsPostCommentModal
      :open="commentModalOpen"
      :post="selectedPost as { id: string; name: string; nickname: string; img?: string; img_cnt?: number; make_write?: string } | null"
      :comments="selectedPostComments"
      :liked="selectedPostId ? !!likedByPost[selectedPostId] : false"
      :like-count="selectedPostId ? (likeCountByPost[selectedPostId] ?? 0) : 0"
      :liked-comment-ids="Array.from(likedCommentIds)"
      v-model:comment="comment"
      @close="commentModalOpen = false; selectedPostId = null"
      @submit-comment="commentBtn"
      @add-reply="(parentId, text) => selectedPostId && addReply(selectedPostId, parentId, text)"
      @toggle-comment-like="toggleCommentLike"
      @toggle-like="selectedPostId && toggleLike(selectedPostId)"
      @open-profile="myPage"
      @msg-page="msgPage"
    />
  </div>
</template>
