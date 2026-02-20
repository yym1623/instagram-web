export default defineNuxtConfig({
  compatibilityDate: '2026-02-17',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt', 
    '@nuxtjs/tailwindcss'
  ],
  typescript: { strict: true },
  pinia: {
    storesDirs: ['app/stores'],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL,
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
  app: {
    head: {
      title: 'Instagram',
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Lobster&display=swap' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
})
