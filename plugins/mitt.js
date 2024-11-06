import mitt from "mitt";

export default defineNuxtPlugin((nuxtApp) => {
  const emitter = mitt();

  // Inject the mitt instance as `$bus` to make it globally available
  nuxtApp.provide("bus", emitter);
});
