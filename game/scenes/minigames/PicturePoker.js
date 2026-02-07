import { Scene } from "phaser";
import generateHand from "~/game/utils/picture-poker/generateHand";
import loadAssets from "~/game/utils/loadAssets";
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
    this.rounds = args.rounds;
    this.points = args.points;
    this.activePlayer = this.gameState.value.data.turn;
    this.hands = [];
    this.selectedCards = [];
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
    console.log(this.gameState.value.data);
    this.add.bitmapText(
      0,
      0,
      "dense",
      "Rounds: " + this.rounds + "\nPoints:" + this.points,
    );
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

    this.createCardObjects();

    let onGameState = function () {
      if (this.gameState.value.data.hasEnded) {
        let results = calculateResults(this.gameState);
        this.cleanup();
        this.scene.start("Results", {
          results: results,
          game: this.gameState.value.data.game,
          points: this.points,
        });
      } else {
        for (let i = 0; i < this.gameState.value.users.length; i++) {
          this.scoreTexts[i].setText(
            this.gameState.value.users[i].name +
              "'s score: " +
              this.gameState.value.data.scores[
                this.gameState.value.users[i].id
              ],
          );
        }
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
  }
  createCardObjects() {
    for (let i = 0; i < this.gameState.value.users.length; i++) {
      this.cards[i] = [];
      console.log(this.cards);
      for (let c = 0; c < this.gameState.value.data.hands[i].length; c++) {
        this.cards[i][c] = this.add.image(
          30 + c * 40,
          30 + i * 48,
          this.CARDTYPES[this.gameState.value.data.hands[i][c]],
          1,
        );
      }
    }
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
  gs.value.data.scores = [];
  gs.value.data.coins = [];
  gs.value.data.hands = [];
  gs.value.data.selectedCards = [];
  gs.value.data.activePlayer =
    gs.value.users[Math.floor(Math.random() * gs.value.users.length)].id;
  for (let i = 0; i < gs.value.users.length; i++) {
    gs.value.data.hands[i] = generateHand();
    //hand is a array of 5 numbers between 1-6 corresponding to CARDTYPES
    gs.value.data.coins[i] = 0;
  }
}
