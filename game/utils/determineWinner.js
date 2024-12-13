export default function determineWinner(handsArr) {
  let finalCards = [];
  let winner = 0;
  for (let i = 0; i < handsArr.length; i++) {
    let cardCount = [0, 0, 0, 0, 0, 0];
    let junk = [];
    let highest = {
      type: 0,
      suit: 0,
      suit2: 0,
      sorted: [0, 0, 0, 0, 0],
    };
    for (let card in handsArr[i]) {
      cardCount[card]++;
    }
    for (let i = 0; i < cardCount.length; i++) {
      if (cardCount[i] == 1) {
        junk.push(i);
      } else if (cardCount[i] == 2) {
        highest.type++;
        if (highest.type == 3) {
          highest.sorted.fill(i, 3, 5);
          highest.suit2 = i;
        } else if (highest.type == 1) {
          if (highest.suit < i) {
            highest.suit2 = highest.suit;
            highest.suit = i;
          }
          highest.sorted.fill(i, 2, 4);
        } else {
          highest.suit = i;
          highest.sorted.fill(i, 0, 2);
        }
      } else if (cardCount[i] == 3) {
        if (highest.type == 1) {
          highest.type = 4;
          highest.sorted[3] = highest.sorted[0];
          highest.sorted[4] = highest.sorted[1];
          highest.suit2 = highest.suit;
        } else {
          highest.type = 3;
        }
        highest.suit = i;
        highest.sorted.fill(i, 0, 3);
      } else if (cardCount[i] == 4) {
        highest.type = 5;
        highest.suit = i;
        highest.sorted.fill(i, 0, 4);
      } else if (cardCount[i] == 5) {
        highest.type = 6;
        highest.suit = i;
        highest.sorted.fill(i, 0, 5);
      }
    }
    for (let i = 0; i < junk.length; i++) {
      highest.sorted[highest.sorted.length - i - 1] = junk[i];
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
    }
    if (finalCards[i].type == overallHighest.type) {
      if (finalCards[i].suit > overallHighest.suit) {
        overallHighest.suit = finalCards[i].suit;
        overallHighest.suit2 = finalCards[i].suit2;
        overallHighest.winners.push(i);
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
