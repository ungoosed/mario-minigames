import determineWinner from "~/game/utils/picture-poker/determineWinner";
export default class PicturePokerServer {
  constructor(currentState) {
    this.hands = [];
    this.coins = [];
  }
  shuffleHand(handIndex, selectedCards) {}
  getAnimations(playerIndex) {
    //define types of animations
    let animationTypes = [
      { swap: [] },
      { deal: [] },
      { return: [] },
      { draw: [] },
      { choosePlayer: "playername" },
      { select: ["player", ["cards"]] },
      { showRound: "Round number" },
      { showTurn: "playerIndex" },
      { updateCoins: ["player", "amount"] },
    ];
  }
  calculatePoints(hands) {
    // internal
    let winners = determineWinner(hands);
    return winners;
  }
}
