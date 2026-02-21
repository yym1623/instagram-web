<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { VALIDATION, parseSupabaseAuthError } from '@/app/utils/error'

definePageMeta({ layout: 'auth' })

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const errorId = ref(false)
const errorPw = ref(false)
const loading = ref(false)

const auth = useAuthStore()
const router = useRouter()

const validateEmail = (v: string) => /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-]+/.test(v)
const validatePw = (v: string) => /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&()-_=+]).{8,16}$/.test(v)

const canSubmit = computed(() => email.value && password.value && !errorId.value && !errorPw.value)

function setError(field: 'email' | 'password', msg: string) {
  errorMessage.value = msg
  if (field === 'email') errorId.value = true
  else errorPw.value = true
}

function validate(): boolean {
  errorMessage.value = ''
  errorId.value = false
  errorPw.value = false
  if (!validateEmail(email.value)) {
    setError('email', VALIDATION.EMAIL)
    return false
  }
  if (!validatePw(password.value)) {
    setError('password', VALIDATION.PASSWORD)
    return false
  }
  return true
}

function checkId() {
  errorId.value = !validateEmail(email.value) && email.value.length > 0
  if (validateEmail(email.value)) errorMessage.value = ''
}
function checkPw() {
  errorPw.value = !validatePw(password.value) && password.value.length > 0
  if (validatePw(password.value)) errorMessage.value = ''
}

async function handleLogin() {
  if (!validate() || loading.value) return
  if (auth.isLoggedIn) {
    await router.replace('/')
    return
  }
  loading.value = true
  errorMessage.value = ''
  try {
    const result = await auth.login(email.value, password.value)
    if (result.success) {
      await nextTick()
      await router.replace('/')
    } else {
      setError('email', result.message)
    }
  } catch (e) {
    setError('email', parseSupabaseAuthError(e))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (auth.isLoggedIn) router.replace('/')
})
</script>

<template>
  <div class="relative border border-neutral-200 dark:border-neutral-700 bg-app pt-8 pb-6 px-6 rounded-sm min-h-[420px]">
    <h1 class="font-lobster text-4xl text-center mb-10 text-black dark:text-white">
      Instagram
    </h1>
    <div class="login">
    <form class="flex flex-col gap-2" @submit.prevent="handleLogin">
          <div class="relative">
            <input
              id="login-id"
              v-model="email"
              type="text"
              placeholder="전화번호, 사용자 이름 또는 이메일"
              class="w-full h-[38px] px-2 bg-neutral-50 bg-app border border-neutral-200 dark:border-neutral-600 rounded text-xs outline-none box-border text-black dark:text-white placeholder-neutral-500"
              @blur="checkId()"
              @input="checkId()"
            >
            <p v-show="errorId" class="text-red-500 dark:text-red-400 text-xs pt-1">
              {{ VALIDATION.EMAIL }}
            </p>
          </div>
          <div class="relative">
            <input
              id="login-pw"
              v-model="password"
              type="password"
              placeholder="비밀번호"
              class="w-full h-[38px] px-2 bg-neutral-50 bg-app border border-neutral-200 dark:border-neutral-600 rounded text-xs outline-none box-border text-black dark:text-white placeholder-neutral-500"
              @blur="checkPw()"
              @input="checkPw()"
              @keydown.enter.prevent="handleLogin"
            >
            <p v-show="errorPw" class="text-red-500 dark:text-red-400 text-xs pt-1">
              {{ VALIDATION.PASSWORD }}
            </p>
          </div>
          <button
            type="submit"
            class="w-full h-8 text-white font-semibold text-[15px] bg-blue-500 dark:bg-blue-600 border-0 rounded disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            :class="[canSubmit ? 'cursor-pointer opacity-100' : 'opacity-50', loading && 'pointer-events-none']"
            :disabled="!canSubmit || loading"
          >
            <i v-if="loading" class="fa-solid fa-spinner fa-spin text-base" />
            로그인
          </button>
        </form>
        <div class="flex items-center gap-4 my-6">
          <div class="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          <span class="text-[13px] font-bold text-neutral-500 dark:text-neutral-400">또는</span>
          <div class="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
        </div>
        <div class="text-center">
          <button type="button" class="text-blue-800 dark:text-blue-300 text-sm flex items-center justify-center gap-2 mx-auto hover:underline">
            <i class="fa-brands fa-square-facebook text-lg" />
            Facebook으로 로그인
          </button>
          <p v-show="errorMessage" class="text-red-500 dark:text-red-400 text-[15px] mt-4">
            {{ errorMessage }}
          </p>
          <button class="block w-fit mx-auto mt-4 text-[13px] text-blue-600 dark:text-blue-400 hover:underline">
            비밀번호를 잊으셨나요?
          </button>
        </div>
  </div>
  </div>
  <div class="border border-neutral-200 dark:border-neutral-700 bg-app mt-2 py-4 text-center">
    <p class="text-sm text-neutral-900 dark:text-white">
      계정이 없으신가요?
      <NuxtLink to="/auth/signup" class="font-bold text-blue-500 dark:text-blue-400 hover:underline">
        가입하기
      </NuxtLink>
    </p>
  </div>
</template>