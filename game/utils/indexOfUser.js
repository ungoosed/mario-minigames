const gameState = useGameState("gameState");
export default function indexOfUser(user) {
  return gameState.value.users.findIndex((e) => {
    return e.id == user;
  });
}
