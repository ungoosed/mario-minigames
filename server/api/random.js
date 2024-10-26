export default defineEventHandler((type) => {
  if (type == "card") {
    return "you get a reindeer card!";
  }
});
