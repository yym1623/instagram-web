<script setup lang="ts">
defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'logout'): void
}>()

const btnClass = 'w-full h-12 flex items-center justify-center border-b border-neutral-700 text-[14px] text-white hover:bg-neutral-700/80'
const btnClassLast = 'w-full h-12 flex items-center justify-center text-[14px] text-white hover:bg-neutral-700/80'
</script>

<template>
  <div
    v-show="open"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/25"
    @click.self="emit('close')"
  >
    <div class="bg-[rgb(33,35,40)] rounded-xl shadow-xl w-[400px] overflow-hidden border border-neutral-700">
      <button type="button" :class="btnClass">
        앱 및 웹사이트
      </button>
      <button type="button" :class="btnClass">
        QR 코드
      </button>
      <button type="button" :class="btnClass">
        알림
      </button>
      <button type="button" :class="btnClass">
        설정 및 개인정보
      </button>
      <button type="button" :class="btnClass">
        Meta Verified
      </button>
      <button type="button" :class="btnClass">
        관리 감독
      </button>
      <button type="button" :class="btnClass">
        로그인 활동
      </button>
      <button
        type="button"
        :class="btnClass + ' text-red-400 hover:text-red-300'"
        @click="emit('logout')"
      >
        로그아웃
      </button>
      <button
        type="button"
        :class="btnClassLast"
        @click="emit('close')"
      >
        취소
      </button>
    </div>
  </div>
</template>
