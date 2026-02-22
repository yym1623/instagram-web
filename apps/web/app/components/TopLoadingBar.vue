<script setup lang="ts">
const { progress, isActive } = useTopLoading()
</script>

<template>
  <Transition name="top-loading">
    <div
      v-show="isActive"
      class="fixed top-0 left-0 right-0 h-[2px] z-[9999] overflow-hidden pointer-events-none bg-white/10"
      aria-hidden="true"
    >
      <div
        class="absolute inset-y-0 left-0 h-full transition-[width] duration-150 ease-out"
        :style="{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ec4899, #ef4444)',
        }"
      />
    </div>
  </Transition>
</template>

<style scoped>
.top-loading-enter-active,
.top-loading-leave-active {
  transition: opacity 0.15s ease;
}
.top-loading-enter-from,
.top-loading-leave-to {
  opacity: 0;
}
</style>
