// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  nitro: {
    experimental: {
      websocket: true,
    },
    preset: "node-server",
  },
  modules: ["@vueuse/nuxt"],
  plugins: [
    { src: "node_modules/nuxtjs-phaser", mode: "client" },
    "~/plugins/mitt.js",
  ],
});
