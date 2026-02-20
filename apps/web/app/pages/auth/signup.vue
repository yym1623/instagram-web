<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { VALIDATION, parseSupabaseAuthError } from '~/utils/error'

definePageMeta({ layout: 'auth' })

const id = ref('')
const name = ref('')
const nickname = ref('')
const pw = ref('')
const errorEmail = ref('')
const errorId = ref(false)
const errorNickname = ref(false)
const errorPw = ref(false)
const loading = ref(false)

const auth = useAuthStore()
const router = useRouter()

const validateEmail = (v: string) => /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-]+/.test(v)
const validateNickname = (v: string) => /^[a-zA-Z0-9]+$/.test(v)
const validatePw = (v: string) => /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&()-_=+]).{8,16}$/.test(v)

const canSubmit = computed(() => id.value && name.value && nickname.value && pw.value && !errorId.value && !errorNickname.value && !errorPw.value)

function checkId() {
  errorId.value = !validateEmail(id.value) && id.value.length > 0
  if (validateEmail(id.value)) errorEmail.value = ''
}
function checkNickname() {
  errorNickname.value = !validateNickname(nickname.value) && nickname.value.length > 0
}
function checkPw() {
  errorPw.value = !validatePw(pw.value) && pw.value.length > 0
}

async function register() {
  if (!canSubmit.value || loading.value) return
  loading.value = true
  errorEmail.value = ''
  try {
    const res = await auth.register({
      email: id.value,
      pw: pw.value,
      name: name.value,
      nickname: nickname.value,
    })
    if (res.success) {
      await router.replace('/auth/message')
    } else {
      errorEmail.value = parseSupabaseAuthError({ message: res.message })
      errorId.value = true
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="relative border border-neutral-200 dark:border-neutral-700 bg-app pt-8 pb-6 px-6 rounded-sm min-h-[420px]">
    <h1 class="font-lobster text-4xl text-center mb-10 text-black dark:text-white">
      Instagram
    </h1>
    <div class="register">
    <form class="flex flex-col gap-2" @submit.prevent="register">
          <div class="relative">
            <input
              v-model="id"
              type="text"
              placeholder="이메일"
              class="w-full h-[38px] px-2 bg-neutral-50 bg-app border border-neutral-200 dark:border-neutral-600 rounded text-xs outline-none box-border text-black dark:text-white placeholder-neutral-500"
              @blur="checkId()"
              @input="checkId()"
            >
            <p v-show="errorId" class="text-red-500 dark:text-red-400 text-xs pt-1">
              {{ errorEmail || VALIDATION.EMAIL }}
            </p>
          </div>
          <div class="relative">
            <input
              v-model="name"
              type="text"
              placeholder="성명"
              class="w-full h-[38px] px-2 bg-neutral-50 bg-app border border-neutral-200 dark:border-neutral-600 rounded text-xs outline-none box-border text-black dark:text-white placeholder-neutral-500"
            >
          </div>
          <div class="relative">
            <input
              v-model="nickname"
              type="text"
              placeholder="사용자 이름"
              class="w-full h-[38px] px-2 bg-neutral-50 bg-app border border-neutral-200 dark:border-neutral-600 rounded text-xs outline-none box-border text-black dark:text-white placeholder-neutral-500"
              @blur="checkNickname()"
              @input="checkNickname()"
            >
            <p v-show="errorNickname" class="text-red-500 dark:text-red-400 text-xs pt-1">
              {{ VALIDATION.NICKNAME }}
            </p>
          </div>
          <div class="relative">
            <input
              v-model="pw"
              type="password"
              placeholder="비밀번호"
              class="w-full h-[38px] px-2 bg-neutral-50 bg-app border border-neutral-200 dark:border-neutral-600 rounded text-xs outline-none box-border text-black dark:text-white placeholder-neutral-500"
              @blur="checkPw()"
              @input="checkPw()"
            >
            <p v-show="errorPw" class="text-red-500 dark:text-red-400 text-xs pt-1">
              {{ VALIDATION.PASSWORD_RULE }}
            </p>
          </div>
          <button
            type="submit"
            class="w-full h-8 text-white font-semibold text-[15px] bg-blue-500 dark:bg-blue-600 border-0 rounded disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            :class="[canSubmit ? 'cursor-pointer opacity-100' : 'opacity-50', loading && 'pointer-events-none']"
            :disabled="!canSubmit || loading"
          >
            <i v-if="loading" class="fa-solid fa-spinner fa-spin text-base" />
            가입
          </button>
    </form>
    <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-4 text-center">
      가입하면 약관 및 개인정보 처리방침에 동의하게 됩니다.
    </p>
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
