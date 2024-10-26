// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  nitro: {
    experimental: {
      websocket: true,
    },
  },

  modules: ["@vueuse/nuxt", "@pinia/nuxt"],
  plugins: [{ src: "node_modules/nuxtjs-phaser", mode: "client" }],
});