// import { defineNuxtConfig } from "nuxt/config";

// export default defineNuxtConfig({
//   modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
//   css: ['@/assets/css/tailwind.css'],

//   imports: {
//     dirs: ['app/stores', 'app/composables']
//   },

//   // Corrected components config
//   components: [
//     { path: '~/app/components/ui', global: true },
//     { path: '~/app/components/clinics', global: true },
//     { path: '~/app/components/users', global: true },
//   ],

//   app: {
//     head: {
//       title: 'Flossly Admin Portal',
//       meta: [
//         { charset: 'utf-8' },
//         { name: 'viewport', content: 'width=device-width, initial-scale=1' },
//         { name: 'description', content: 'Flossly Dental Practice Management System - Admin Portal' }
//       ],
//       link: [
//         { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
//       ]
//     },
//     pageTransition: { name: 'page', mode: 'out-in' },
//     layoutTransition: { name: 'layout', mode: 'out-in' }
//   },

//   devtools: { enabled: true }
// })
// nuxt.config.ts
export default defineNuxtConfig({
  // Development tools
  devtools: { enabled: true },
  
  // Modules
  modules: ['@pinia/nuxt'],
  
  // CSS - Using tailwind.css (you have both main.css and tailwind.css)
  css: ['~/assets/css/tailwind.css'],
  
  // Pinia configuration
 
  
  // Auto-imports from stores and composables
  imports: {
    dirs: [
      'stores',
      'composables'
    ]
  },
  
  // Component auto-import - FIXED: removed 'app/' from paths
  // IMPORTANT: Fix component paths
  components: {
    dirs: [
      '~/components',        // This will scan all subdirectories
      '~/components/ui',
      '~/components/clinics',
      '~/components/users'
    ],
    // Add this to ensure components are properly registered
    global: true,
    // pathPrefix: false
  },
  
  // App configuration
  app: {
    head: {
      title: 'Flossly Admin Portal',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Flossly Dental Practice Management System - Admin Portal' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  
  // PostCSS configuration
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  
  // Add compatibility date (removes warning)
  compatibilityDate: '2025-03-10'
})