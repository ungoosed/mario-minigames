export default function calculateResults(gameState) {
  let results = [];
  results[0] = gameState.value.users[0].id;
  for (let i = 1; i < gameState.value.users.length; i++) {
    //sort results into order
    if (
      gameState.value.data.scores[results[0]] <
      gameState.value.data.scores[gameState.value.users[i].id]
    ) {
      results.unshift(gameState.value.users[i].id);
    } else {
      results.push(gameState.value.users[i].id);
    }
  }
  return results;
}
