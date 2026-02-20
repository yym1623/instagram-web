<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

const route = useRoute()
const { post, imageUrl } = useApi()
const auth = useAuthStore()

const name = computed(() => route.params.id as string)
const user = ref<{ id: string; name: string; nickname: string; email?: string } | null>(null)
const userPosts = ref<Array<{ id: string; img: string; img_cnt: number; make_write: string }>>([])
const tab = ref<'board' | 'play' | 'save' | 'tag'>('board')
const settingOpen = ref(false)

onMounted(async () => {
  const me = await post<Array<{ id: string; name: string; nickname: string }>>('/users/me', { name: name.value })
  user.value = me?.[0] ?? null
  const posts = await post<Array<{ id: string; img: string; img_cnt: number; make_write: string }>>('/posts/user', { name: name.value })
  userPosts.value = posts ?? []
})

function myPage(n: string) {
  navigateTo(`/user/${n}`)
}
</script>

<template>
  <div class="user w-full min-h-screen bg-neutral-50 bg-app py-8 px-4">
    <div class="max-w-[935px] mx-auto">
      <header class="flex flex-wrap items-center gap-8 mb-8">
        <div class="w-[150px] h-[150px] rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-4 mb-4">
            <h1 class="text-2xl text-neutral-900 dark:text-white">{{ user?.nickname }}</h1>
            <button class="px-4 py-1.5 border border-neutral-300 dark:border-neutral-600 rounded text-sm font-semibold text-black dark:text-white bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800">
              프로필 편집
            </button>
            <button class="relative text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white" @click="settingOpen = !settingOpen">
              <i class="fa-solid fa-gear text-2xl" />
              <div
                v-if="settingOpen"
                class="absolute right-0 top-full mt-1 w-48 bg-white bg-app rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-10"
              >
                <div class="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer text-black dark:text-white">비밀번호 변경</div>
                <div class="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer text-black dark:text-white">로그아웃</div>
                <div class="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer text-black dark:text-white" @click="settingOpen = false">취소</div>
              </div>
            </button>
          </div>
          <div class="flex gap-8 mb-2 text-neutral-900 dark:text-white">
            <span><strong>게시물</strong> {{ userPosts.length }}</span>
            <span><strong>팔로워</strong> 0</span>
            <span><strong>팔로우</strong> 0</span>
          </div>
          <div class="text-sm font-semibold text-neutral-900 dark:text-white">{{ user?.name }}</div>
        </div>
      </header>
      <nav class="flex border-t border-neutral-200 dark:border-neutral-700">
        <button
          class="py-3 px-4 text-xs font-semibold uppercase tracking-wider border-t border-transparent -mt-px text-black dark:text-white"
          :class="tab === 'board' ? 'border-current' : 'text-neutral-500 dark:text-neutral-400'"
          @click="tab = 'board'"
        >
          게시물
        </button>
        <button
          class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          @click="tab = 'play'"
        >
          재생
        </button>
        <button
          class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          @click="tab = 'save'"
        >
          저장됨
        </button>
        <button
          class="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
          @click="tab = 'tag'"
        >
          태그됨
        </button>
      </nav>
      <div class="grid grid-cols-3 gap-1 mt-4">
        <NuxtLink
          v-for="p in userPosts"
          :key="p.id"
          :to="`/p/${p.id}`"
          class="aspect-square block overflow-hidden"
        >
          <img
            v-if="p.img_cnt === 1"
            :src="imageUrl(p.img)"
            class="w-full h-full object-cover"
            alt=""
          >
          <img
            v-else
            :src="imageUrl((p.img as string).split(',')[0])"
            class="w-full h-full object-cover"
            alt=""
          >
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
