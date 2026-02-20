<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

const props = defineProps<{
  isMessagePage?: boolean
}>()

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const { post } = useApi()

const isHome = computed(() => route.path === '/')
const isReels = computed(() => route.path === '/reels')
const isMessage = computed(() => route.path === '/message')
const isNotifications = computed(() => route.path === '/notifications')
const isProfile = computed(() => route.path === `/user/${auth.name}` || (route.params?.id && route.params.id === auth.name))

const menuList = computed(() => [
  { key: 'home', label: '홈', to: '/', icon: 'fa-solid fa-house', iconActive: 'fa-solid fa-house', active: isHome.value },
  { key: 'search', label: '검색', icon: 'fa-solid fa-magnifying-glass', iconActive: 'fa-solid fa-magnifying-glass', active: false },
  { key: 'explore', label: '탐색 탭', icon: 'fa-regular fa-compass', iconActive: 'fa-solid fa-compass', active: false },
  { key: 'reels', label: '릴스', icon: 'fa-regular fa-circle-play', iconActive: 'fa-solid fa-circle-play', active: isReels.value },
  { key: 'message', label: '메시지', to: '/message', icon: 'fa-regular fa-paper-plane', iconActive: 'fa-solid fa-paper-plane', active: isMessage.value },
  { key: 'notifications', label: '알림', icon: 'fa-regular fa-heart', iconActive: 'fa-solid fa-heart', active: isNotifications.value },
  { key: 'create', label: '만들기', icon: 'fa-solid fa-plus', iconActive: 'fa-solid fa-plus', active: false },
  { key: 'profile', label: '프로필', to: `/user/${auth.name}`, icon: 'fa-regular fa-user', iconActive: 'fa-solid fa-user', active: isProfile.value },
])

const searchOpen = ref(false)
const createOpen = ref(false)
const searchQuery = ref('')
const userSample = ref<Array<{ id: string; name: string; nickname: string }>>([])
const searchResults = ref<Array<{ id: string; name: string; nickname: string }>>([])
const searchPanelRef = ref<HTMLElement | null>(null)
const searchBtnRef = ref<HTMLElement | null>(null)

async function loadUsers() {
  userSample.value = await post('/users/select', { name: auth.name }) ?? []
}

function myPage(name: string) {
  navigateTo(`/user/${name}`)
  searchOpen.value = false
}

function searchFilter() {
  if (searchQuery.value.length > 0) {
    searchResults.value = userSample.value.filter((u) =>
      u.name.includes(searchQuery.value) || u.nickname.includes(searchQuery.value),
    )
  } else {
    searchResults.value = []
  }
}

async function logout() {
  await auth.logout()
  await router.push('/auth')
  router.go(0)
}

function setSearchBtnRef(el: unknown) {
  searchBtnRef.value = el as HTMLElement | null
}

function handleMenuClick(menu: { key: string; to?: string }) {
  if (menu.to) {
    navigateTo(menu.to)
    return
  }
  if (menu.key === 'search') {
    searchOpen.value = !searchOpen.value
    return
  }
  if (menu.key === 'create') {
    createOpen.value = true
  }
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node
  if (searchOpen.value && searchPanelRef.value && !searchPanelRef.value.contains(target) && searchBtnRef.value && !searchBtnRef.value.contains(target)) {
    searchOpen.value = false
  }
}

onMounted(() => {
  loadUsers()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <!-- 모바일: 하단 고정, 데스크톱: 왼쪽 칼럼 -->
  <header :class="`group fixed lg:static left-0 bottom-0 lg:bottom-auto z-[100] w-full ${isMessagePage ? 'lg:w-[78px]' : 'lg:w-[244px]'} bg-app lg:h-screen flex flex-col`">
    <nav class="flex lg:flex-col items-center lg:items-stretch h-14 lg:h-auto lg:py-2 lg:px-0 border-b lg:border-b-0 border-neutral-200 dark:border-neutral-800 lg:flex-1 lg:justify-between overflow-hidden">
      <!-- 로고: 아이콘 고정, 텍스트는 호버 시 옆으로 -->
      <button
        type="button"
        class="flex items-center justify-center w-full lg:w-auto lg:justify-start px-4 lg:pl-5 lg:pr-0 py-3 lg:py-3 my-1 lg:my-1 mx-2 lg:mx-2 text-black dark:text-white hover:opacity-90"
      >
        <span class="flex items-center justify-center w-6 h-6 shrink-0">
          <i class="fa-brands fa-instagram text-[1.7rem]" />
        </span>
      </button>

      <div class="flex lg:flex-col flex-1 lg:flex-none lg:items-stretch lg:w-full lg:-mt-4">
        <button
          v-for="menu in menuList"
          :key="menu.key"
          type="button"
          :ref="menu.key === 'search' ? setSearchBtnRef : undefined"
          class="flex items-center justify-center w-full lg:w-auto lg:justify-start px-4 lg:pl-5 lg:pr-0 py-3 lg:py-3 my-1 lg:my-1 mx-2 lg:mx-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-black dark:text-white"
          @click.stop="handleMenuClick(menu)"
        >
          <span class="flex items-center justify-center w-6 h-6 shrink-0">
            <!-- 메시지: 해당 페이지일 때만 solid, 아니면 regular (호버 아님) -->
            <i
              class="text-2xl"
              :class="[
                menu.active ? menu.iconActive : menu.icon,
                menu.key === 'home' && !menu.active ? 'opacity-50' : '',
              ]"
            />
          </span>
          <span
            v-if="!isMessagePage"
            class="hidden lg:inline text-base lg:ml-4 lg:w-0 lg:min-w-0 lg:overflow-hidden lg:opacity-0 lg:whitespace-nowrap lg:group-hover:w-auto lg:group-hover:min-w-0 lg:group-hover:overflow-visible lg:group-hover:opacity-100 lg:transition-[width,opacity] lg:duration-200 lg:ease-out"
          >
            {{ menu.label }}
          </span>
        </button>
      </div>

      <button
        type="button"
        class="flex items-center justify-center w-full lg:w-auto lg:justify-start px-4 lg:pl-5 lg:pr-0 py-3 lg:py-3 my-1 lg:my-1 mx-2 lg:mx-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-black dark:text-white"
      >
        <span class="flex items-center justify-center w-6 h-6 shrink-0">
          <i class="fa-solid fa-bars text-2xl" />
        </span>
        <span
          v-if="!isMessagePage"
          class="hidden lg:inline text-base lg:ml-4 lg:w-0 lg:min-w-0 lg:overflow-hidden lg:opacity-0 lg:whitespace-nowrap lg:group-hover:w-auto lg:group-hover:min-w-0 lg:group-hover:overflow-visible lg:group-hover:opacity-100 lg:transition-[width,opacity] lg:duration-200 lg:ease-out"
        >
          더 보기
        </span>
      </button>
    </nav>

    <!-- 검색: 바깥 클릭 또는 검색 버튼 다시 누르면 닫힘, 왼쪽에서 슬라이드 -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="searchOpen"
          class="fixed inset-0 z-[105] bg-black/25 lg:bg-transparent"
          aria-hidden="true"
          @click="searchOpen = false"
        />
      </Transition>
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <div
          v-if="searchOpen"
          ref="searchPanelRef"
          class="fixed left-0 top-0 bottom-0 w-full max-w-[397px] lg:w-[397px] bg-app shadow-xl z-[110] flex flex-col border-r border-neutral-200 dark:border-neutral-800"
          @click.stop
        >
          <div class="p-4 border-b border-neutral-200 dark:border-neutral-800">
            <div class="flex items-center justify-between mb-4">
              <div class="text-xl font-bold text-black dark:text-white">검색</div>
              <button
                type="button"
                class="w-8 h-8 flex items-center justify-center rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="검색 닫기"
                @click="searchOpen = false"
              >
                <i class="fa-solid fa-xmark text-lg" />
              </button>
            </div>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="검색"
              class="w-full h-10 px-4 rounded-lg bg-app border border-neutral-200 dark:border-neutral-700 outline-none text-black dark:text-white placeholder-neutral-500"
              @input="searchFilter"
            >
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <div v-if="searchResults.length" class="space-y-1">
              <div
                v-for="u in searchResults"
                :key="u.id"
                class="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                @click="myPage(u.name)"
              >
                <div class="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-600 flex-shrink-0" />
                <div>
                  <div class="text-sm font-bold text-black dark:text-white">{{ u.nickname }}</div>
                  <div class="text-sm text-neutral-500 dark:text-neutral-400">{{ u.name }}</div>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-neutral-500 dark:text-neutral-400 font-bold pb-8">
              최근 검색 내역 없음
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <ModalsCreateFeed
      :open="createOpen"
      @close="createOpen = false"
      @created="router.go(0)"
    />
  </header>
</template>
