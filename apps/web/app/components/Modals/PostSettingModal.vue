<script setup lang="ts">
defineProps<{
  open: boolean
  isOwnPost?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'delete'): void
}>()

const btnClass = 'w-full h-12 flex items-center justify-center border-b border-neutral-700 text-[14px] hover:bg-neutral-700/80'
const btnClassLast = 'w-full h-12 flex items-center justify-center text-[14px] hover:bg-neutral-700/80'
</script>

<template>
  <div
    v-show="open"
    class="fixed inset-0 z-10 flex items-center justify-center bg-black/25"
    @click.self="emit('close')"
  >
    <div class="bg-[rgb(33,35,40)] rounded-xl shadow-xl w-[400px] overflow-hidden border border-neutral-700">
      <button
        type="button"
        :class="[btnClass, 'text-red-400 hover:text-red-300']"
      >
        신고
      </button>
      <button
        type="button"
        :class="[btnClass, 'text-red-400 hover:text-red-300']"
      >
        팔로우 취소
      </button>
      <button
        type="button"
        :class="[btnClass, 'text-white']"
      >
        즐겨찾기에 추가
      </button>
      <button
        type="button"
        :class="[btnClass, 'text-white']"
      >
        게시물로 이동
      </button>
      <button
        type="button"
        :class="[btnClass, 'text-white']"
      >
        공유 대상...
      </button>
      <button
        type="button"
        :class="[btnClass, 'text-white']"
      >
        링크 복사
      </button>
      <button
        type="button"
        :class="[btnClass, 'text-white']"
      >
        퍼가기
      </button>
      <button
        type="button"
        :class="[btnClass, 'text-white']"
      >
        이 계정 정보
      </button>
      <button
        v-if="isOwnPost"
        type="button"
        :class="[btnClass, 'text-red-400 hover:text-red-300']"
        @click="emit('delete')"
      >
        삭제
      </button>
      <button
        type="button"
        :class="[btnClassLast, 'text-white']"
        @click="emit('close')"
      >
        취소
      </button>
    </div>
  </div>
</template>
