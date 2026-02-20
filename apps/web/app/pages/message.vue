<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'
import { useSocket } from '~/composables/useSocket'

const auth = useAuthStore()
const { post, imageUrl } = useApi()

/** 왼쪽 목록: 팔로우한 사람들 (API: /users/select = 나 제외 유저. 추후 팔로우 목록 API로 교체 가능) */
const followList = ref<Array<{ id: string; name: string; nickname: string; email?: string }>>([])
/** 팝업용 전체 회원 (POST /users) */
const allUsers = ref<Array<{ id: string; name: string; nickname: string; email?: string }>>([])

const selectedUser = ref<{ name: string; email: string; id: string } | null>(null)
const msgListId = ref('')
const msgList = ref<Array<{ id: string; msg: string; img: string; my_id: string; list_id: string }>>([])
const messageInput = ref('')
const rightHide = ref(false)
const leftHide = ref(false)
const messageOpen = ref(false)
const sendPopupOpen = ref(false)
const messageSearchQuery = ref('')

const { whenReady } = useSocket()

onMounted(() => {
  loadFollowList()
  loadAllUsers()
})

/** 왼쪽 메시지 목록용: 나를 제외한 유저 (팔로우 목록 API 있으면 교체) */
async function loadFollowList() {
  const list = await post<Array<{ id: string; name: string; nickname: string; email?: string }>>('/users/select', { name: auth.name })
  followList.value = list ?? []
}

/** 메시지 보내기 팝업용: 회원 전체 */
async function loadAllUsers() {
  const list = await post<Array<{ id: string; name: string; nickname: string; email?: string }>>('/users', { email: auth.email })
  allUsers.value = (list ?? []).filter((u) => u.id !== auth.id)
}

const filteredFollowList = computed(() => {
  if (!messageSearchQuery.value.trim()) return followList.value
  const q = messageSearchQuery.value.trim().toLowerCase()
  return followList.value.filter(
    (u) =>
      u.name.toLowerCase().includes(q) || (u.nickname && u.nickname.toLowerCase().includes(q)),
  )
})

async function openChat(user: { name: string; email: string; id: string }) {
  selectedUser.value = user
  leftHide.value = true
  rightHide.value = false
  messageOpen.value = true

  const listId = await post<string>('/messages/list', { my_idx: auth.id, idx: user.id })
  msgListId.value = listId

  const messages = await post<Array<{ id: string; msg: string; img: string; my_id: string; list_id: string }>>('/messages/select', { idx: listId })
  msgList.value = messages ?? []
}

function closeChat() {
  rightHide.value = true
  leftHide.value = false
}

function openSendPopup() {
  sendPopupOpen.value = true
}

function onPopupSelect(user: { id: string; name: string; nickname: string; email?: string }) {
  sendPopupOpen.value = false
  openChat({
    id: user.id,
    name: user.name,
    email: user.email ?? '',
  })
}

async function sendMessage() {
  if (!selectedUser.value || !whenReady) return
  const s = await whenReady()
  if (!s) return
  s.emit('chat', {
    msg: messageInput.value,
    idx: msgListId.value,
    my_idx: auth.id,
    img: '',
  })
  messageInput.value = ''
  s.on('test', async () => {
    const messages = await post<Array<{ id: string; msg: string; img: string; my_id: string; list_id: string }>>('/messages/select', { idx: msgListId.value })
    msgList.value = messages ?? []
  })
}
</script>

<template>
  <!-- 메뉴바에 왼쪽이 붙고, 전체 화면 채움. 왼쪽 패널은 메뉴와 같은 배경(다크모드 동일) -->
  <div class="message w-full h-full min-h-0 flex overflow-hidden">
    <!-- 왼쪽: 메시지 목록 - 메뉴바와 붙어있고 패딩 없음, 메뉴와 같은 색 -->
    <aside
      class="w-full max-w-[350px] min-w-[280px] border-r border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden bg-app"
      :class="{ hidden: leftHide }"
    >
      <div class="flex items-center h-[60px] px-3 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <div class="flex-1 flex items-center justify-start cursor-pointer min-w-0">
          <span class="font-semibold text-black dark:text-white truncate">{{ auth.nickname }}</span>
          <span class="text-sm text-neutral-500 dark:text-neutral-400 ml-2">
            {{ auth.name }}
          </span>
        </div>
        <button
          type="button"
          class="shrink-0 w-10 h-10 flex items-center justify-center text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
          aria-label="새 메시지"
          @click="openSendPopup"
        >
          <i class="fa-regular fa-pen-to-square text-xl" />
        </button>
      </div>
      <div class="shrink-0 px-2 py-2">
        <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 bg-app">
          <i class="fa-solid fa-magnifying-glass text-neutral-400 text-sm" />
          <input
            v-model="messageSearchQuery"
            type="search"
            placeholder="검색"
            class="flex-1 bg-transparent border-0 outline-none text-sm text-black dark:text-white placeholder-neutral-500"
          >
        </div>
      </div>
      <div class="shrink-0 flex items-center justify-between px-3 py-3">
        <span class="text-sm font-semibold text-black dark:text-white">메시지</span>
        <span class="text-sm font-semibold text-neutral-500 dark:text-neutral-400">요청</span>
      </div>
      <div class="flex-1 overflow-y-auto">
        <div
          v-for="u in filteredFollowList"
          :key="u.id"
          class="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
          @click="openChat({ id: u.id, name: u.name, email: u.email ?? '' })"
        >
          <div class="w-14 h-14 rounded-full bg-neutral-200 dark:bg-neutral-600 flex-shrink-0" />
          <div class="min-w-0 flex-1">
            <div class="text-sm font-semibold text-black dark:text-white truncate">
              {{ u.nickname || u.name }}님
            </div>
            <div class="text-sm text-neutral-500 dark:text-neutral-400 truncate">
              메시지를 보내보세요
            </div>
          </div>
        </div>
        <div v-if="filteredFollowList.length === 0" class="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
          {{ messageSearchQuery ? '검색 결과가 없습니다.' : '팔로우한 사람이 없습니다.' }}
        </div>
      </div>
    </aside>

    <!-- 오른쪽: 빈 상태 또는 채팅 (배경 메뉴와 동일하게) -->
    <div
      v-if="!messageOpen"
      class="flex-1 flex items-center justify-center p-6 bg-app min-h-0"
    >
      <div class="text-center">
        <div class="text-5xl mb-5 text-neutral-400 dark:text-neutral-500">
          <i class="fa-regular fa-paper-plane border-2 border-current rounded-full p-4" />
        </div>
        <div class="text-2xl font-semibold text-neutral-900 dark:text-white">내 메시지</div>
        <div class="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
          친구나 그룹에 비공개 사진과 메시지를 보내보세요.
        </div>
        <button
          type="button"
          class="mt-5 h-9 px-5 text-sm font-bold text-white bg-blue-500 dark:bg-blue-600 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          @click="openSendPopup"
        >
          메시지 보내기
        </button>
      </div>
    </div>

    <!-- 오른쪽: 채팅방 (배경 메뉴와 동일) -->
    <div
      v-else
      class="flex-1 flex flex-col min-w-0 bg-app"
      :class="{ hidden: rightHide }"
    >
      <header class="flex items-center justify-between h-[60px] px-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <div class="flex items-center gap-3 min-w-0">
          <button
            class="lg:hidden shrink-0 w-10 h-10 flex items-center justify-center text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
            aria-label="뒤로"
            @click="closeChat"
          >
            <i class="fa-solid fa-chevron-left" />
          </button>
          <span class="font-bold text-black dark:text-white truncate">{{ selectedUser?.name }}</span>
        </div>
        <div class="flex gap-2 text-black dark:text-white shrink-0">
          <i class="fa-solid fa-phone cursor-pointer hover:opacity-70" />
          <i class="fa-solid fa-video cursor-pointer hover:opacity-70" />
          <i class="fa-solid fa-circle-info cursor-pointer hover:opacity-70" />
        </div>
      </header>
      <div class="flex-1 overflow-y-auto p-5">
        <div
          v-for="m in msgList"
          :key="m.id"
          class="py-2.5 flex"
          :class="m.my_id === auth.id ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-[250px] rounded-2xl px-4 py-3 text-sm"
            :class="m.my_id === auth.id ? 'bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white' : 'border border-neutral-200 dark:border-neutral-600 text-black dark:text-white'"
          >
            <img v-if="m.img" :src="imageUrl(m.img)" class="rounded-lg max-w-[250px] mb-2" alt="">
            <span v-if="m.msg">{{ m.msg }}</span>
          </div>
        </div>
      </div>
      <div class="p-4 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
        <div class="flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 rounded-full pl-4 pr-2 h-11 bg-transparent">
          <i class="fa-regular fa-face-smile text-xl cursor-pointer text-neutral-500 dark:text-neutral-400" />
          <input
            v-model="messageInput"
            type="text"
            placeholder="메시지 입력..."
            class="flex-1 border-0 outline-none bg-transparent h-8 text-sm text-black dark:text-white placeholder-neutral-400"
            @keydown.enter.prevent="sendMessage"
          >
          <button
            v-if="messageInput.length > 0"
            class="text-sm font-bold text-blue-500 dark:text-blue-400 px-3 py-1.5 hover:opacity-80"
            @click="sendMessage"
          >
            보내기
          </button>
          <template v-else>
            <i class="fa-regular fa-image text-xl cursor-pointer px-2 text-neutral-500 dark:text-neutral-400" />
            <i class="fa-regular fa-heart text-xl cursor-pointer px-2 text-neutral-500 dark:text-neutral-400" />
          </template>
        </div>
      </div>
    </div>
  </div>

  <ModalsMessageSend
    :open="sendPopupOpen"
    :all-users="allUsers"
    :current-user-id="auth.id"
    @close="sendPopupOpen = false"
    @select="onPopupSelect"
  />
</template>
