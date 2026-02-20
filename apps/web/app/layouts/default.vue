<script setup lang="ts">
import Menu from '~/components/Menu.vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const route = useRoute()

const isMessagePage = computed(() => route.path === '/message')
</script>

<template>
  <div class="h-screen overflow-hidden bg-app text-white flex">
    <Menu :is-message-page="isMessagePage" class="flex-shrink-0" />
    <main class="flex-1 min-h-0 overflow-y-auto">
      <div class="mx-auto w-full max-w-[1400px] pb-10">
        <slot />
      </div>
    </main>
  </div>
</template>
