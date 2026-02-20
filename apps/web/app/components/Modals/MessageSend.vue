<script setup lang="ts">
export interface MessageUser {
  id: string
  name: string
  nickname: string
  email?: string
}

const props = defineProps<{
  open: boolean
  allUsers: MessageUser[]
  currentUserId: string
}>()

const emit = defineEmits<{
  close: []
  select: [user: MessageUser]
}>()

const searchQuery = ref('')
const selected = ref<MessageUser | null>(null)

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return props.allUsers
  const q = searchQuery.value.trim().toLowerCase()
  return props.allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      (u.nickname && u.nickname.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)),
  )
})

const canSend = computed(() => !!selected.value)

function selectUser(user: MessageUser) {
  if (user.id === props.currentUserId) return
  selected.value = selected.value?.id === user.id ? null : user
}

function submit() {
  if (!selected.value) return
  emit('select', selected.value)
  selected.value = null
  searchQuery.value = ''
  emit('close')
}

function onClose() {
  selected.value = null
  searchQuery.value = ''
  emit('close')
}

watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    selected.value = null
    searchQuery.value = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/25 p-4"
        @click.self="onClose"
      >
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="open"
            class="w-full max-w-[400px] max-h-[80vh] flex flex-col rounded-xl overflow-hidden bg-[rgb(33,35,40)] border border-neutral-200 dark:border-neutral-700 shadow-xl"
            @click.stop
          >
            <div class="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                class="text-black dark:text-white hover:opacity-70"
                @click="onClose"
              >
                <i class="fa-solid fa-xmark text-xl" />
              </button>
              <span class="font-semibold text-black dark:text-white">새 메시지</span>
              <button
                type="button"
                class="text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed text-blue-500 dark:text-blue-400 hover:opacity-80"
                :disabled="!canSend"
                @click="submit"
              >
                다음
              </button>
            </div>
            <div class="p-2 border-b border-neutral-200 dark:border-neutral-800">
              <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 bg-app">
                <i class="fa-solid fa-magnifying-glass text-neutral-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="검색..."
                  class="flex-1 bg-transparent border-0 outline-none text-sm text-black dark:text-white placeholder-neutral-500"
                >
              </div>
            </div>
            <div class="flex-1 overflow-y-auto min-h-0">
              <div class="py-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400 px-4 pt-3">
                회원
              </div>
              <div
                v-for="u in filteredUsers"
                :key="u.id"
                class="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
                :class="u.id === currentUserId ? 'opacity-50 cursor-default' : selected?.id === u.id ? 'bg-white/10' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'"
                @click="selectUser(u)"
              >
                <div class="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-600 flex-shrink-0" />
                <div class="min-w-0 flex-1">
                  <div class="text-sm font-semibold text-black dark:text-white truncate">
                    {{ u.nickname || u.name }}
                  </div>
                  <div class="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {{ u.name }}
                  </div>
                </div>
                <div v-if="selected?.id === u.id" class="text-blue-500 dark:text-blue-400">
                  <i class="fa-solid fa-check" />
                </div>
              </div>
              <div v-if="filteredUsers.length === 0" class="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                검색 결과가 없습니다.
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
