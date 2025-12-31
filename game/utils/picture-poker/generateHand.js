export default function generateHand() {
  let hand = [];
  for (let i = 0; i < 5; i++) {
    hand.push(Math.floor(Math.random() * 6) + 1);
  }
  return hand;
}
