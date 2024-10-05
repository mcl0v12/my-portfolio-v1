// nuxt.config.ts

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  css: [
    '@/assets/css/main.css',
  ],
  build: {},
  vite: {},
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Fabian Daume is a software engineer who specializes in building exceptional digital experiences.' },
        { property: 'og:site_name', content: 'Fabian Daume' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Fabian Daume - Software Engineer' },
        { property: 'og:description', content: 'Fabian Daume is a software engineer who specializes in building exceptional digital experiences.' },
        { property: 'og:image', content: 'img/me.png' },
        { property: 'og:url', content: 'https://fabian-daume.com' },
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }, 
        { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png', sizes: '16x16' },
        { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' },
        { rel: 'icon', type: 'image/png', href: '/favicon-192x192.png', sizes: '192x192' },
        { rel: 'icon', type: 'image/png', href: '/favicon-512x512.png', sizes: '512x512' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#0a1e40' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'canonical', href: 'https://fabian-daume.com' },
      ],
      script: [
        { src: 'https://js.hcaptcha.com/1/api.js', async: true, defer: true },
      ],
    }
  },
  pages: true,
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL,
    },
    email: process.env.EMAIL,
    emailPassword: process.env.EMAIL_PASSWORD,

    clientId: process.env.CLIENT_ID,  
    clientSecret: process.env.CLIENT_SECRET, 
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia',
  ],
  plugins: [
    '~/plugins/photoswipe.client.js',
  ],
  compatibilityDate: '2024-08-03',
});
