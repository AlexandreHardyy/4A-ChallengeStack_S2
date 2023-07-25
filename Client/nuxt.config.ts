// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // @ts-ignore
    ssr: false,
    app: {
        pageTransition: {name: "page", mode: "out-in"},
        layoutTransition: {name: "layout", mode: "out-in"},
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
    css: [
        'primevue/resources/primevue.css',
        'primeicons/primeicons.css',
        '~/assets/css/theme.css',
        '~/assets/css/base.css',
    ],
    modules: [
        "@nuxtjs/tailwindcss",
        "@pinia/nuxt"
    ],
    build: {
        transpile: ['primevue']
    },
    runtimeConfig: {
        public: {
          apiBase: process.env.API_BASE || 'http://localhost:3000',
        }
    }
});
