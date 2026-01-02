import { Scene } from "phaser";
import generateHand from "~/game/utils/picture-poker/generateHand";
import loadAssets from "~/game/utils/loadAssets";
import makeHoverable from "~/game/utils/makeHoverable";
export class MinigameTemplate extends Scene {
  constructor() {
    super("MinigameTemplate");
    this.gameState = useGameState("gameState");
    this.userData = useUserData("userData");
    this.$bus = useNuxtApp().$bus;
    this.assets = {
      "casino-background": "assets/minigames/table/casino-background.png",
      "back-card": "assets/minigames/table/back-card.png",
      "cloud-card": "assets/minigames/table/cloud-card.png",
      "mushroom-card": "assets/minigames/table/mushroom-card.png",
      "flower-card": "assets/minigames/table/flower-card.png",
      "luigi-card": "assets/minigames/table/luigi-card.png",
      "mario-card": "assets/minigames/table/mario-card.png",
      "star-card": "assets/minigames/table/back-card.png",
    };
    this.increaseButtons = {};
  }
  init(args) {
    this.rounds = args.rounds;
    this.points = args.points;
    this.scores = [];
  }
  create() {
    this.add.bitmapText(
      0,
      0,
      "dense",
      "Rounds: " + this.rounds + "\nPoints:" + this.points,
    );

    for (let i = 0; i < this.gameState.value.users.length; i++) {
      this.scores[i] = Math.round(Math.random() * 1000);
      let button = (this.increaseButtons[i] = makeHoverable(
        this.add.image(50, 50 + 30 * i, "blank-button-small"),
      ));
      let name = this.add
        .bitmapText(50, 51 + i * 30, "ds", this.gameState.value.users[i].name)
        .setOrigin(0.5, 1);
      let score = this.add
        .bitmapText(
          100,
          150 + i * 30,
          "ds",
          this.gameState.value.users[i].name + "'s score: " + this.scores[i],
        )
        .setOrigin(0.5, 1);
      button.on("pointerover", () => {
        name.setPosition(50, 53 + i * 30);
      });
      button.on("pointerout", () => {
        name.setPosition(50, 50 + i * 30);
      });
      button.on("pointerdown", () => {
        this.scores[i] += 10;
        score.setText(
          this.gameState.value.users[i].name + "'s score: " + this.scores[i],
        );
      });
    }
    this.endButton = makeHoverable(
      this.add.image(200, 90, "blank-button-small"),
    );
    let endText = this.add
      .bitmapText(200, 91, "ds", "end game")
      .setOrigin(0.5, 1);

    //transition to results screen
    this.endButton.on("pointerdown", () => {
      if (this.gameState.value.users[0].id == this.userData.value.id) {
        this.gameState.value.users[0].points += 100;
        this.gameState.value.data.hasEnded = true;
        this.$bus.emit("update", this.gameState.value.data);
      } else {
        this.$bus.emit("action", {
          type: "endgame",
        });
      }
    });
    let onGameState = function () {
      console.log(this.gameState.value.users);
      if (this.gameState.value.data.hasEnded) {
        this.scene.start("Results", {
          results: this.calculateResults(),
          game: this.gameState.value.data.game,
        });
      }
    }.bind(this);
    let onTry = function (args) {
      if (args.data.type == "endgame") {
        this.gameState.value.data.results = this.calculateResults();
        this.$bus.emit("update", this.gameState.value.data);
      }
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
  calculateResults() {
    let results = [];
    results[0] = this.gameState.value.users[0].id;
    for (let i = 1; i < this.scores.length; i++) {
      //sort results into order
      if (results[0].score < this.scores[i]) {
        results.unshift(this.gameState.value.users[i].id);
      } else {
        results.push(this.gameState.value.users[i].id);
      }
    }
    return results;
  }
}
