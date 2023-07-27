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
          apiBaseClient: process.env.BASEURL_SERVER || 'http://localhost:3000',
          apiBaseServerMerchant: process.env.BASEURL_MERCHANT_SERVER || 'http://localhost:3009',
          clientToken: process.env.CLIENT_TOKEN || '2bcfcf9d-f601-48f3-b4b9-5a0e6b6cc423',
      }
  }

});
