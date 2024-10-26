export const useGameStateStore = defineStore("game", () => {
  const state = ref({});
  const luigi = ref(["hello", "reindeer", "mastere", "poo!", "hi"]);
  const mario = ref(["hello", "reindeer", "mastere", "poo!", "hi"]);

  return { luigi, state, mario };
});
