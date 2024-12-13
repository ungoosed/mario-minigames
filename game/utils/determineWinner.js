export default function determineWinner(handsArr) {
  let finalCards = [];
  let winner = 0;
  for (let i = 0; i < handsArr.length; i++) {
    let cardCount = [0, 0, 0, 0, 0, 0];
    let sortedCards = [0, 0, 0, 0, 0];
    let junk = [];
    let highest = {
      type: 0,
      suit: 0,
      suit2: 0,
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
          sortedCards.fill(i, 3, 5);
          highest.suit2 = i;
        } else if (highest.type == 1) {
          highest.suit2 = i;
          sortedCards.fill(i, 2, 4);
        } else {
          highest.suit = i;
          sortedCards.fill(i, 0, 2);
        }
      } else if (cardCount[i] == 3) {
        if (highest.type == 1) {
          highest.type = 4;
          sortedCards[3] = sortedCards[0];
          sortedCards[4] = sortedCards[1];
          highest.suit2 = highest.suit;
        } else {
          highest.type = 3;
        }
        highest.suit = i;
        sortedCards.fill(i, 0, 3);
      } else if (cardCount[i] == 4) {
        highest.type = 5;
        highest.suit = i;
        sortedCards.fill(i, 0, 4);
      } else if (cardCount[i] == 5) {
        highest.type = 6;
        highest.suit = i;
        sortedCards.fill(i, 0, 5);
      }
    }
    for (let i = 0; i < junk.length; i++) {
      sortedCards[sortedCards.length - i - 1] = junk[i];
    }
    finalCards.push({
      type: highest,
      cards: sortedCards,
    });
  }
  let highest = {
    type: 0,
    suit: 0,
    suit2: 0,
  };
  for (let i = 0; i < finalCards.length; i++) {}
}
