<script setup lang="ts">
definePageMeta({ layout: 'auth' })
</script>

<template>
  <div class="relative border border-neutral-200 dark:border-neutral-700 bg-app pt-8 pb-6 px-6 rounded-sm min-h-[420px]">
    <h1 class="font-lobster text-4xl text-center mb-10 text-black dark:text-white">
      Instagram
    </h1>
    <div class="success">
      <div class="flex flex-col items-center gap-6">
        <div class="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
          <i class="fa-regular fa-circle-check text-4xl text-blue-500 dark:text-blue-400" />
        </div>
        <div class="text-center space-y-3">
          <p class="text-base text-black dark:text-white font-medium">
            회원가입이 완료되었습니다
          </p>
          <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            이메일 확인이 완료되었습니다.<br />
            로그인해주세요.
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="border border-neutral-200 dark:border-neutral-700 bg-app mt-2 py-4 text-center">
    <p class="text-sm text-neutral-900 dark:text-white">
      계정이 있으신가요?
      <NuxtLink to="/auth" class="font-bold text-blue-500 dark:text-blue-400 hover:underline">
        로그인
      </NuxtLink>
    </p>
  </div>
</template>
