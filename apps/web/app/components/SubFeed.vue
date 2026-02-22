<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/app/composables/useApi'
import type { UserLite } from '@/app/data/mock'

const props = withDefaults(
  defineProps<{
    mockUsers?: UserLite[]
    /** 팔로윙: 나를 팔로우한 사람. 상단 3명 "{{ nickname }} 님이 팔로워했습니다" */
    followersList?: { id: string; name: string; nickname: string }[]
    /** 내가 이미 팔로우한 id 목록 (팔로우 버튼 → 이 목록에 추가되면 피드/스토리에 그 사람 노출) */
    followingIds?: string[]
  }>(),
  { mockUsers: () => [], followersList: () => [], followingIds: () => [] },
)

const emit = defineEmits<{
  (e: 'openProfile', name: string): void
  (e: 'follow', user: UserLite): void
  (e: 'unfollow', user: UserLite): void
  (e: 'showAll'): void
}>()

const auth = useAuthStore()
const { post } = useApi()
const usersList = ref<UserLite[]>([])

async function loadUsers() {
  try {
    const res = (await post('/users/select', { name: auth.name })) as UserLite[] | null
    if (res && Array.isArray(res) && res.length > 0) {
      usersList.value = res
    } else {
      usersList.value = props.mockUsers
    }
  } catch {
    usersList.value = props.mockUsers
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 날 팔로윙한 사람 최대 3명 (유저 정보만) */
const followedMe = computed(() => (props.followersList ?? []).slice(0, 3))

/** 항상 5명: 팔로윙 최대 3 + 나머지는 전체 중 랜덤. 순서는 매번 랜덤 */
const displayList = ref<(UserLite & { _isFollower?: boolean })[]>([])

function buildFive() {
  const all = usersList.value.length > 0 ? usersList.value : props.mockUsers
  const exceptMe = all.filter((u) => String(u.id) !== String(auth.id))
  const followerIds = new Set(followedMe.value.map((f) => f.id))
  const fromFollowers: (UserLite & { _isFollower?: boolean })[] = exceptMe
    .filter((u) => followerIds.has(u.id))
    .slice(0, 3)
    .map((u) => ({ ...u, _isFollower: true }))
  const pool = exceptMe.filter((u) => !followerIds.has(u.id))
  const need = 5 - fromFollowers.length
  const fromRandom = shuffle(pool).slice(0, need).map((u) => ({ ...u, _isFollower: false }))
  const five = [...fromFollowers, ...fromRandom]
  displayList.value = shuffle(five)
}

function isFollower(u: UserLite) {
  return (u as UserLite & { _isFollower?: boolean })._isFollower === true
}

const followingIdSet = computed(() => new Set(props.followingIds ?? []))

function isFollowing(u: UserLite) {
  return followingIdSet.value.has(u.id)
}

function onFollowClick(u: UserLite) {
  if (isFollowing(u)) {
    emit('unfollow', u)
  } else {
    emit('follow', u)
  }
}

onMounted(() => {
  loadUsers().then(() => buildFive())
})

watch([() => props.mockUsers, () => props.followersList], () => {
  nextTick(buildFive)
}, { immediate: true })

function goCurrentProfile() {
  emit('openProfile', auth.name)
}
</script>

<template>
  <aside class="hidden lg:block w-full">
    <!-- 로그인한 유저: 리스트 행과 동일 구조 (아바타 버튼 + 닉네임/이름 + 전환 버튼) -->
    <div class="flex items-center gap-3 py-3">
      <button
        type="button"
        class="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-600 cursor-pointer flex-shrink-0"
        @click="goCurrentProfile"
      />
      <div
        class="flex-1 min-w-0 text-left"
      >
        <div class="text-sm font-bold text-black dark:text-white leading-tight truncate block">
          {{ auth.nickname }}
        </div>
        <div class="text-xs text-neutral-500 dark:text-neutral-400 leading-tight truncate block">
          {{ auth.name }}
        </div>
      </div>
      <button
        type="button"
        class="text-[12px] font-semibold text-blue-500 dark:text-blue-400 hover:opacity-80 flex-shrink-0"
      >
        전환
      </button>
    </div>

    <section class="mt-2">
      <div class="flex justify-between items-center py-2">
        <span class="text-sm font-semibold text-neutral-500 dark:text-neutral-400">회원님을 위한 추천</span>
        <button
          type="button"
          class="text-xs font-semibold text-black dark:text-white hover:opacity-80"
          @click="emit('showAll')"
        >
          모두 보기
        </button>
      </div>
      <div v-for="u in displayList" :key="u.id" class="flex items-center py-3 gap-3">
        <button
          type="button"
          class="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-600 cursor-pointer flex-shrink-0"
          @click="emit('openProfile', u.name)"
        />
        <div class="flex-1 min-w-0">
          <div class="text-sm font-bold text-black dark:text-white truncate">
            {{ u.nickname }}
          </div>
          <div class="text-xs text-neutral-500 dark:text-neutral-400 truncate">
            {{ isFollower(u) ? `${u.nickname} 님이 팔로워했습니다` : '회원님을 위한 추천' }}
          </div>
        </div>
        <button
          type="button"
          class="text-[12px] font-semibold flex-shrink-0 cursor-pointer"
          :class="isFollowing(u) ? 'text-neutral-500 dark:text-neutral-400 hover:opacity-80' : 'text-blue-500 dark:text-blue-400 hover:opacity-80'"
          @click="onFollowClick(u)"
        >
          {{ isFollowing(u) ? '팔로잉' : '팔로우' }}
        </button>
      </div>
    </section>
  </aside>
</template>
