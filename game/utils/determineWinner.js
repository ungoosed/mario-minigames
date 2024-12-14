export default function determineWinner(handsArr) {
  // where hands arr is an array containing more than one array that has a length of 5, and contains numbers from 0 - 5, where the number corresponds to the suit of the card (picture poker)
  let finalCards = [];
  for (let i = 0; i < handsArr.length; i++) {
    let cardCount = [0, 0, 0, 0, 0, 0];
    let junk = [];
    let highest = {
      type: 0,
      suit: 0,
      suit2: 0,
      sorted: [0, 0, 0, 0, 0],
    };
    let { type, suit, suit2, sorted } = highest;
    handsArr[i].forEach((card) => {
      cardCount[card]++;
    });
    for (let i = 0; i < cardCount.length; i++) {
      switch (cardCount[i]) {
        default:
          junk.push(i);
        case 2:
          if (type == 3) {
            sorted.fill(i, 3, 5);
            suit2 = i;
          } else if (type == 1) {
            if (suit < i) {
              suit2 = suit;
              suit = i;
              sorted[2] = sorted[0];
              sorted[3] = sorted[1];
              sorted.fill(i, 0, 2);
            } else {
              sorted.fill(i, 2, 4);
            }
          } else {
            suit = i;
            sorted.fill(i, 0, 2);
          }
        case 3:
          if (type == 1) {
            type = 4;
            sorted[3] = sorted[0];
            sorted[4] = sorted[1];
            suit2 = suit;
          } else {
            type = 3;
          }
          suit = i;
          sorted.fill(i, 0, 3);
        case 4:
          type = 5;
          suit = i;
          sorted.fill(i, 0, 4);
        case 5:
          type = 6;
          suit = i;
          sorted.fill(i, 0, 5);
      }
    }
    for (let i = 0; i < junk.length; i++) {
      sorted[sorted.length - i - 1] = junk[i];
    }
    finalCards.push(highest);
  }
  let overallHighest = {
    type: 0,
    suit: 0,
    suit2: 0,
    winners: [],
    cards: finalCards,
  };
  for (let i = 0; i < finalCards.length; i++) {
    if (finalCards[i].type > overallHighest.type) {
      overallHighest.type = finalCards[i].type;
      overallHighest.suit = finalCards[i].suit;
      overallHighest.suit2 = finalCards[i].suit2;
      overallHighest.winners = [i];
    } else if (finalCards[i].type == overallHighest.type) {
      if (finalCards[i].suit > overallHighest.suit) {
        overallHighest.suit = finalCards[i].suit;
        overallHighest.suit2 = finalCards[i].suit2;
        overallHighest.winners = [i];
      } else if (finalCards[i].suit == overallHighest.suit) {
        if (finalCards[i].suit2 > overallHighest.suit2) {
          overallHighest.suit2 = finalCards[i].suit2;
          overallHighest.winners = [i];
        } else {
          overallHighest.winners.push(i);
        }
      }
    }
  }
  return overallHighest;
}
