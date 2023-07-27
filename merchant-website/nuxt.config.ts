// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // @ts-ignore
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
          clientToken: process.env.CLIENT_TOKEN || '65098ec5-f568-4bf5-bf13-db118107fb04',
      }
  }

});
