export default function initializeGameState(gameState) {
  for (let i = 0; i < gameState.value.users.length; i++) {
    //generate a random starting amount of points
    gameState.value.data.scores = {};
    gameState.value.data.scores[gameState.value.users[i].id] = Math.round(
      Math.random * 100,
    );
  }
}
