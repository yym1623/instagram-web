<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

interface UserLite {
  id: string
  name: string
  nickname: string
}

const props = defineProps<{
  users: UserLite[]
}>()

const emit = defineEmits<{
  (e: 'openProfile', name: string): void
}>()

const auth = useAuthStore()

/** 본인 제외한 전체 유저 (추천 목록) */
const otherUsers = computed(() =>
  props.users.filter((u) => u.id !== auth.id),
)

function goCurrentProfile() {
  emit('openProfile', auth.name)
}
</script>

<template>
  <aside class="hidden lg:block w-full">
    <!-- 로그인한 유저: 아바타·닉네임/이름 둘 다 클릭 시 내 프로필로 -->
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-600 cursor-pointer flex-shrink-0"
        @click="goCurrentProfile"
      />
      <button
        type="button"
        class="flex flex-col min-w-0 flex-1 text-left"
        @click="goCurrentProfile"
      >
        <span class="text-sm font-bold text-black dark:text-white leading-tight truncate block">
          {{ auth.nickname }}
        </span>
        <span class="text-xs text-neutral-500 dark:text-neutral-400 leading-tight truncate block">
          {{ auth.name }}
        </span>
      </button>
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
        <button type="button" class="text-xs font-semibold text-black dark:text-white hover:opacity-80">
          모두 보기
        </button>
      </div>
      <div v-for="u in otherUsers" :key="u.id" class="flex items-center py-3 gap-3">
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
            {{ u.name }}님을 위한 추천
          </div>
        </div>
        <button
          type="button"
          class="text-[12px] font-semibold text-blue-500 dark:text-blue-400 hover:opacity-80 flex-shrink-0"
        >
          팔로우
        </button>
      </div>
    </section>

    <footer class="mt-8 text-[11px] text-neutral-500 leading-relaxed space-y-1">
      <p class="flex flex-wrap gap-x-2 gap-y-0">
        <span>소개</span>
        <span>도움말</span>
        <span>홍보 센터</span>
        <span>API</span>
        <span>채용 정보</span>
      </p>
      <p class="flex flex-wrap gap-x-2 gap-y-0">
        <span>개인정보처리방침</span>
        <span>약관</span>
        <span>위치</span>
        <span>언어</span>
        <span>Meta Verified</span>
      </p>
      <p class="pt-2">© 2026 INSTAGRAM FROM META</p>
    </footer>
  </aside>
</template>
