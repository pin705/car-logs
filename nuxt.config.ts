// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    'nuxt-mongoose',
    '@vite-pwa/nuxt',
    'nuxt-auth-utils',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
  },

  mongoose: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/car-logs',
    options: {},
    modelsDir: 'server/models',
    devtools: true
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'CarLogs - Car Error Community',
      short_name: 'CarLogs',
      description: 'Community-driven platform for sharing and verifying car errors, symptoms, and solutions',
      theme_color: '#003366',
      background_color: '#ffffff',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    }
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'CarLogs - Cộng Đồng Lỗi Xe',
      htmlAttrs: {
        lang: 'vi'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Cộng đồng chia sẻ và tra cứu lỗi xe, mã OBD-II, triệu chứng và giải pháp sửa chữa ô tô tại Việt Nam' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#003366' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
