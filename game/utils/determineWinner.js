export default function determineWinner(hand1, hand2) {
  let cardCount1 = [0, 0, 0, 0, 0, 0];
  let cardCount2 = [0, 0, 0, 0, 0, 0];
  for (let card in hand1) {
    cardCount1[card]++;
  }
  for (let card in hand2) {
    cardCount2[card]++;
  }
}
