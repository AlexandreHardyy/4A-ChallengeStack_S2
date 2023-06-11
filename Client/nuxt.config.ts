// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "PayGate",
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
        },
      ],
    },
  },
  modules: ["@nuxtjs/tailwindcss", "@invictus.codes/nuxt-vuetify"],
  vuetify: {
    vuetifyOptions: {
      // @TODO: list all vuetify options
      theme: {
        defaultTheme: "dark",
      },
    },
  },
});
