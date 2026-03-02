import { Scene } from "phaser";
import generateHand from "~/game/utils/picture-poker/generateHand";
import loadAssets from "~/game/utils/loadAssets";
import indexOfUser from "~/game/utils/indexOfUser";
import isHost from "~/game/utils/isHost";
import makeHoverable from "~/game/utils/makeHoverable";
import calculateResults from "~/game/utils/minigame-template/calculateResults";
export default class PicturePoker extends Scene {
  constructor() {
    super("PicturePoker");
    this.gameState = useGameState("gameState");
    this.userData = useUserData("userData");
    this.$bus = useNuxtApp().$bus;
    this.increaseButtons = {};
    this.scoreTexts = [];
  }
  init(args) {
    this.clickable = true;
    this.rounds = args.rounds;
    this.turnsTaken = 0;
    this.points = args.points;
    this.stage = 0;
    this.hands = [];
    this.selectedCards = [false, false, false, false, false];
    this.coins = [];
    this.cards = [];
    this.CARDTYPES = [
      "back-card",
      "cloud-card",
      "mushroom-card",
      "flower-card",
      "luigi-card",
      "mario-card",
      "star-card",
    ];
  }
  preload() {
    this.load.setPath("assets/minigames/table");
    this.load.image("coin", "coin.png");
    this.load.image("casino-background", "casino-background.png");

    this.load.spritesheet("back-card", "back-card.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("cloud-card", "cloud-card.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("mushroom-card", "mushroom-card.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("flower-card", "flower-card.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("luigi-card", "luigi-card.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("mario-card", "mario-card.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("star-card", "star-card.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }
  create() {
    //background graphic
    this.add
      .image(128, 96, "casino-background")
      .setOrigin(0.5, 0.5)
      .setRotation(Math.PI);
    this.add.image(0, 192, "casino-background").setOrigin(0, 0);

    //debug info
    console.log(this.gameState.value.data);
    this.add.bitmapText(
      0,
      0,
      "dense",
      "Rounds: " + this.rounds + "\nPoints:" + this.points,
    );
    this.createButtons();
    //setup coins
    for (let i = 0; i < this.gameState.value.users.length; i++) {
      this.coins[i] = [];
      let startingCoins = 30;
      for (let b = 0; b < startingCoins; b++) {
        let y =
          this.gameState.value.users[i].id == this.userData.id
            ? 150
            : 30 * i + 50;
        this.coins[i][b] = this.add.image(10, y, "coin");
      }
    }
    //rounds
    this.roundText = this.add
      .bitmapText(200, 192, "ds", "Round: 1/5")
      .setOrigin(0.5, 0.5);
    // make the cards
    this.createCardObjects();

    //play selecting player animation
    this.whoStarts = this.add
      .bitmapText(
        128,
        100,
        "ds",
        "Who will start? \n" +
          this.gameState.value.users[
            indexOfUser(this.gameState.value.data.activePlayer)
          ].name,
      )
      .setVisible(true)
      .setCenterAlign()
      .setOrigin(0.5, 1);
    this.whosTurnText = this.add
      .bitmapText(128, 250, "ds", "")
      .setVisible(true)
      .setCenterAlign()
      .setOrigin(0.5, 1);
    if (this.gameState.value.data.activePlayer == this.userData.value.id) {
      this.whosTurnText.setText("It's your turn.");
    } else {
      this.whosTurnText.setText(
        "It's " +
          this.gameState.value.users[
            indexOfUser(this.gameState.value.data.activePlayer)
          ].name +
          "'s turn.",
      );
    }
    //select player animation
    for (let i = 0; i < this.gameState.value.users.length; i++) {
      setTimeout(() => {
        this.whoStarts.setText(
          "Who will start? \n" + this.gameState.value.users[i].name,
        );
      }, i * 600);
    }
    for (
      let i = 0;
      i <= indexOfUser(this.gameState.value.data.activePlayer);
      i++
    ) {
      setTimeout(
        () => {
          this.whoStarts.setText(
            "Who will start? \n" + this.gameState.value.users[i].name,
          );
          if (i == indexOfUser(this.gameState.value.data.activePlayer)) {
            setTimeout(() => {
              this.whoStarts.setVisible(false);
              //start next animation
            }, 400);
          }
        },
        i * 600 + this.gameState.value.users.length * 600,
      );
    }
    let onGameState = function () {
      console.log(this.gameState.value.data);
      if (
        this.gameState.value.data.hasEnded ||
        this.gameState.value.data.round == 5
      ) {
        let results = calculateResults(this.gameState);
        this.cleanup();
        this.scene.start("Results", {
          results: results,
          game: this.gameState.value.data.game,
          points: this.points,
        });
      }
      if (this.gameState.value.data.stage == 1) {
        this.whosTurnText.setVisible(true);
        this.roundText.setText(
          "Round: " + this.gameState.value.data.round + "/" + this.rounds,
        );
        this.whosTurnText.setVisible(true);
        if (this.gameState.value.data.activePlayer == this.userData.value.id) {
          this.whosTurnText.setText("It's your turn.");
        } else {
          this.whosTurnText.setText(
            "It's " +
              this.gameState.value.users[
                indexOfUser(this.gameState.value.data.activePlayer)
              ].name +
              "'s turn.",
          );
        }

        //the round starts, player is chosen, activeplayer can pick cards
        // cards are dealt
        // once a player is done picking, move onto the next player
        //update card selecting
        if (this.turnsTaken != this.gameState.value.data.turnsTaken) {
          this.turnsTaken = this.gameState.value.data.turnsTaken;
          //update card objects with the new cards
          this.updateCardObjects(this.oldActivePlayer, this.oldSelectedCards);
          this.selectedCards = this.gameState.value.data.selectedCards;
          if (
            this.gameState.value.data.activePlayer == this.userData.value.id
          ) {
            this.whosTurnText.setText("It's your turn.");
          } else {
            this.whosTurnText.setText(
              "It's " +
                this.gameState.value.users[
                  indexOfUser(this.gameState.value.data.activePlayer)
                ].name +
                "'s turn.",
            );
          }
        } else {
          if (this.gameState.value.data.selectedCards != this.selectedCards) {
            //update cards and play animations
            if (
              this.gameState.value.data.activePlayer != this.userData.value.id
            ) {
              for (
                let i = 0;
                i <
                this.cards[indexOfUser(this.gameState.value.data.activePlayer)]
                  .length;
                i++
              ) {
                //play card going up/down animation
                if (
                  this.selectedCards[i] !=
                  this.gameState.value.data.selectedCards[i]
                ) {
                  if (this.gameState.value.data.selectedCards[i] == true) {
                    this.cards[
                      indexOfUser(this.gameState.value.data.activePlayer)
                    ][i].y -= 5;
                  } else {
                    this.cards[
                      indexOfUser(this.gameState.value.data.activePlayer)
                    ][i].y += 5;
                  }
                }
              }
              this.selectedCards = this.gameState.value.data.selectedCards;
            }
          }
        }
        this.oldActivePlayer = this.gameState.value.data.activePlayer;
        this.oldSelectedCards = this.gameState.value.data.selectedCards;
      }
      if (this.gameState.value.data.stage == 2) {
        // new starting player is set, coins are dealt out
        // back to stage 1
        this.whosTurnText.setVisible(false);
        this.roundText.setText(
          "Round: " + this.gameState.value.data.round + "/5",
        );
        this.turnsTaken = this.gameState.value.data.turnsTaken;
        //update card objects with the new cards
        this.updateCardObjects(this.oldActivePlayer, this.oldSelectedCards);
        this.selectedCards = this.gameState.value.data.selectedCards;
      }
      if (this.gameState.value.data.stage == 3) {
      }
    }.bind(this);
    let onTry = function (args) {
      this.handleAction(args);
    }.bind(this);
    let onError = function () {}.bind(this);
    this.$bus.on("try", onTry);
    this.$bus.on("error", onError);
    this.$bus.on("gamestate", onGameState);

    this.events.on("shutdown", () => {
      this.$bus.off("error", onError);
      this.$bus.off("try", onTry);
      this.$bus.off("gamestate", onGameState);
    });
  }
  cleanup() {
    //delete variables in gameState so its all good next time
    delete this.gameState.value.data.scores;
  }
  handleAction(args) {
    if (args.data.type == "endgame") {
      this.gameState.value.data.results = calculateResults(this.gameState);
      this.gameState.value.data.hasEnded = true;
      this.$bus.emit("update", this.gameState.value.data);
    }
    if (args.data.type == "select") {
      if (args.id == this.gameState.value.data.activePlayer) {
        this.gameState.value.data.selectedCards = args.data.cards;
        this.$bus.emit("update", this.gameState.value.data);
      }
    }
    if (args.data.type == "submit") {
      if (args.id == this.gameState.value.data.activePlayer) {
        //replace all cards and draw new ones
        for (let i = 0; i < args.data.cards.length; i++) {
          console.log(args.data.cards[i]);
          if (args.data.cards[i]) {
            //replace card with a new one
            this.gameState.value.data.hands[indexOfUser(args.id)][i] =
              Math.floor(Math.random() * 6) + 1;
          }
        }
        //reset selectedCards
        this.gameState.value.data.selectedCards = [
          false,
          false,
          false,
          false,
          false,
        ];
        //set the activeplayer to the next person
        this.gameState.value.data.turnsTaken++;
        console.log(this.gameState.value.data.turnsTaken);
        if (
          this.gameState.value.data.turnsTaken ==
          this.gameState.value.users.length
        ) {
          // if this is the last player, complete the round and calculate coins
          this.gameState.value.data.turnsTaken = 0;
          this.gameState.value.data.stage = 2;
          this.gameState.value.data.round++;
          //stage = 2
          // calculate scores
        } else {
          //set turn to next person
          if (indexOfUser(args.id) >= this.gameState.value.users.length - 1) {
            this.gameState.value.data.activePlayer =
              this.gameState.value.users[0].id;
          } else {
            this.gameState.value.data.activePlayer =
              this.gameState.value.users[indexOfUser(args.id) + 1].id;
          }
        }
        this.$bus.emit("update", this.gameState.value.data);
      }
    }
  }
  createCardObjects() {
    let passedPlayer = false;
    let handLength = 5;
    for (let i = 0; i < this.gameState.value.users.length; i++) {
      this.cards[i] = [];
      console.log(this.cards);
      if (this.gameState.value.users[i].id == this.userData.value.id) {
        // Your own cards
        passedPlayer = true;
        for (let c = 0; c < handLength; c++) {
          this.cards[i][c] = this.add
            .image(
              70 + c * 40,
              340,
              this.CARDTYPES[this.gameState.value.data.hands[i][c]],
              1,
            )
            .setInteractive();
          this.cards[i][c].on("pointerdown", () => {
            if (
              this.gameState.value.data.activePlayer == this.userData.value.id
            ) {
              if (this.selectedCards[c]) {
                // if already selected
                this.selectedCards[c] = false;
                this.cards[i][c].y += 5;
              } else {
                this.selectedCards[c] = true;
                this.cards[i][c].y -= 5;
              }
              if (this.gameState.value.users[0].id == this.userData.value.id) {
                this.handleAction({
                  id: this.userData.value.id,
                  data: {
                    type: "select",
                    cards: this.selectedCards,
                  },
                });
              } else {
                this.$bus.emit("action", {
                  type: "select",
                  cards: this.selectedCards,
                });
              }
            }
          });
        }
      } else {
        // other people's cards
        for (let c = 0; c < handLength; c++) {
          console.log("asda");
          let y = 30 + i * 48;
          y -= passedPlayer ? 30 : 0;
          this.cards[i][c] = this.add.image(
            30 + c * 40,
            y,
            this.CARDTYPES[this.gameState.value.data.hands[i][c]],
            1,
          );
        }
      }
    }
  }
  updateCardObjects(playerID, cards) {
    console.log("updating cards");
    console.log(playerID);
    console.log(cards);
    console.log(this.gameState.value.data.hands);
    // cards is the array of numbers
    // the function for animating the cards when drawn
    let handLength = 5;
    let i = indexOfUser(playerID);
    for (let e = 0; e < cards.length; e++) {
      if (cards[e]) {
        this.cards[i][e].setTexture(
          this.CARDTYPES[this.gameState.value.data.hands[i][e]],
        );
      }
    }
  }
  createButtons() {
    // end game and proceed
    this.endButton = makeHoverable(
      this.add.image(200, 90, "blank-button-small"),
    );
    let endText = this.add
      .bitmapText(200, 91, "ds", "end game")
      .setOrigin(0.5, 1);
    //transition to results screen
    this.endButton.on("pointerdown", () => {
      if (this.gameState.value.users[0].id == this.userData.value.id) {
        this.handleAction({
          id: this.userData.value.id,
          data: {
            type: "endgame",
          },
        });
      } else {
        this.$bus.emit("action", {
          type: "endgame",
        });
      }
    });
    //the submit cards button
    this.continueButton = makeHoverable(
      this.add.image(128, 300, "continue-button").setOrigin(0.5, 0.5),
    );
    this.continueButton.on("pointerdown", () => {
      if (this.gameState.value.data.activePlayer == this.userData.value.id) {
        if (isHost(this.gameState, this.userData.value.id)) {
          this.handleAction({
            id: this.userData.value.id,
            data: { type: "submit", cards: this.selectedCards },
          });
        } else {
          this.$bus.emit("action", {
            type: "submit",
            cards: this.selectedCards,
          });
        }
      }
    });
  }
  dealHands() {
    for (let i = 0; i < this.gameState.value.users.length; i++) {
      this.gameState.value.data.hands[i] = generateHand();
    }
    this.$bus.emit("update", this.gameState.value.data);
  }
}
export function setup(gs) {
  console.log("setting up");
  gs.value.data.stage = 1;
  gs.value.data.scores = [];
  gs.value.data.coins = [];
  gs.value.data.hands = [];
  gs.value.data.turnsTaken = 0;
  gs.value.data.round = 1;
  gs.value.data.selectedCards = [false, false, false, false, false];
  gs.value.data.activePlayer =
    gs.value.users[Math.floor(Math.random() * gs.value.users.length)].id;
  for (let i = 0; i < gs.value.users.length; i++) {
    gs.value.data.hands[i] = generateHand();
    //hand is a array of 5 numbers between 1-6 corresponding to CARDTYPES
    gs.value.data.coins[i] = 0;
  }
}
