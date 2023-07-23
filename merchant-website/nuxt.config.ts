// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // @ts-ignore
  app: {
      head: {
          charset: "utf-8",
          viewport: "width=device-width, initial-scale=1",
          title: "Mechant Site",
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
  }

});
