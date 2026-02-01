import { Scene } from "phaser";
import generateHand from "~/game/utils/picture-poker/generateHand";
import loadAssets from "~/game/utils/loadAssets";
import makeHoverable from "~/game/utils/makeHoverable";
import calculateResults from "~/game/utils/minigame-template/calculateResults";
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
    this.scoreTexts = [];
  }
  init(args) {
    this.rounds = args.rounds;
    this.points = args.points;
  }
  create() {
    this.add.bitmapText(
      0,
      0,
      "dense",
      "Rounds: " + this.rounds + "\nPoints:" + this.points,
    );
    for (let i = 0; i < this.gameState.value.users.length; i++) {
      let button = (this.increaseButtons[i] = makeHoverable(
        this.add.image(50, 50 + 30 * i, "blank-button-small"),
      ));
      let name = this.add
        .bitmapText(50, 51 + i * 30, "ds", this.gameState.value.users[i].name)
        .setOrigin(0.5, 1);
      this.scoreTexts[i] = this.add
        .bitmapText(
          100,
          150 + i * 30,
          "ds",
          this.gameState.value.users[i].name +
            "'s score: " +
            this.gameState.value.data.scores[this.gameState.value.users[i].id],
        )
        .setOrigin(0.5, 1);

      button.on("pointerover", () => {
        name.setPosition(50, 53 + i * 30);
      });
      button.on("pointerout", () => {
        name.setPosition(50, 50 + i * 30);
      });
      button.on("pointerdown", () => {
        if (this.gameState.value.users[0].id == this.userData.value.id) {
          this.handleAction({
            id: this.userData.value.id,
            data: {
              type: "add",
              playerId: this.gameState.value.users[i].id,
              amount: 25,
            },
          });
        } else {
          this.$bus.emit("action", {
            type: "add",
            playerId: this.gameState.value.users[i].id,
            amount: 25,
          });
        }
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
          console.log(this.scoreTexts[i]?.active, this.scoreTexts[i]?.scene);
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
    if (args.data.type == "add") {
      this.gameState.value.data.scores[args.data.playerId] += args.data.amount;
      this.$bus.emit("update", this.gameState.value.data);
    }
  }
}
