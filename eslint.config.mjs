export default [
  {
    files: ['**/*.{js,ts,jsx,tsx,vue}'],
    ignores: [
      'node_modules',
      'dist',
      'apps/api/dist',
      'apps/web/.nuxt',
      '.turbo',
    ],
    languageOptions: {
      sourceType: 'module',
      globals: {
        useRoute: 'readonly',
        useRouter: 'readonly',
        useRuntimeConfig: 'readonly',
        navigateTo: 'readonly',
        defineNuxtConfig: 'readonly',
        definePageMeta: 'readonly',
        useHead: 'readonly',
        useState: 'readonly',
        useAsyncData: 'readonly',
        useFetch: 'readonly',
        ref: 'readonly',
        computed: 'readonly',
        reactive: 'readonly',
        watch: 'readonly',
        onMounted: 'readonly',
        onUnmounted: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
]

