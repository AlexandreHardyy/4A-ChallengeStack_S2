// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // @ts-ignore
  ssr: false,
  app: {
      head: {
          charset: "utf-8",
          viewport: "width=device-width, initial-scale=1",
          title: "Merchant Site",
          link: [
              {
                  rel: "stylesheet",
                  href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
              },
          ],
      },
  },
  css: [
    "primevue/resources/themes/lara-light-blue/theme.css"
  ],
  build: {
    transpile: ["primevue"]
  },
  runtimeConfig: {
      public: {
          apiBaseClient: process.env.BASEURL_CLIENT || 'http://localhost:3000',
          apiBaseServerMerchant: process.env.BASEURL_MERCHANT_SERVER || 'http://localhost:3009',
          clientToken: process.env.CLIENT_TOKEN || '346d4380-d0c7-4a8b-b32b-2041953efdbb',
      }
  }

});
