export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  imports: {
    dirs: ['composables/api'],
  },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  runtimeConfig: {
    apiBaseServer: process.env.NUXT_API_BASE_SERVER,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      cloudinaryCloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      cloudinaryUploadPreset: process.env.NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    },
  },
})
