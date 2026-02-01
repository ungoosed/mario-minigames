import { Scene } from "phaser";
import generateHand from "~/game/utils/picture-poker/generateHand";
import loadAssets from "~/game/utils/loadAssets";
import getPlacements from "~/game/utils/getPlacements";
import makeHoverable from "~/game/utils/makeHoverable";
export class Results extends Scene {
  constructor() {
    super("Results");
    this.gameState = useGameState("gameState");
    this.userData = useUserData("userData");
    this.$bus = useNuxtApp().$bus;
  }
  init(args) {
    this.results = args.results;
    this.place = args.results.indexOf(this.userData.value.id) + 1;
    this.points = args.points;
  }
  create() {
    console.log(this.gameState.value);
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);
    this.add.image(0, 192, "error-background").setOrigin(0, 0);
    this.add.image(0, 4, "title-background").setOrigin(0, 0);
    this.add.image("yoshi-label-large", 128, 80).setOrigin(0.5, 0);
    this.add.image("mario-label-large", 128, 120).setOrigin(0.5, 0);
    this.add.image("wario-label-large", 128, 160).setOrigin(0.5, 0);
    this.add.image("luigi-label-large", 128, 200).setOrigin(0.5, 0);

    this.add.bitmapText(128, 8, "ds", "Results").setOrigin(0.5, 0);
    this.add
      .bitmapText(128, 100, "ds", "Your place was " + this.place)
      .setOrigin(0.5, 0);
    this.startButton = makeHoverable(this.add.image(128, 300, "start-button"));
    if (this.gameState.value.data.turn != this.userData.value.id) {
      this.startButton.disableInteractive().setFrame(1);
    }
    this.startButton.on("pointerdown", () => {
      if (this.gameState.value.users[0].id == this.userData.value.id) {
        this.handleAction({
          id: this.userData.value.id,
          data: { type: "next" },
        });
      } else {
        this.$bus.emit("action", { type: "next" });
      }
    });
    //show player labels
    this.givePoints();
    this.drawPlayerLabels();
    let onGameState = function () {
      if (this.gameState.value.data.game == "SelectGame") {
        if (
          this.gameState.value.data.users.some((c) => {
            c.points >= 200;
          })
        ) {
          console.log("winwinwinwinwinahhahaha");
          this.scene.start("Podium");
        } else {
          this.scene.start("SelectGame");
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
  handleAction(args) {
    if (args.data.type == "next") {
      this.gameState.value.data.game = "SelectGame";
      this.gameState.value.data.turn = this.results[0];
      this.$bus.emit("update", this.gameState.value.data);
    }
  }
  givePoints() {
    let winner = this.gameState.value.users.find((c) => {
      return c.id == this.results[0];
    }, this);
    if (winner) {
      winner.points += this.points;
    }
    if (this.gameState.value.users[0].id == this.userData.value.id) {
      console.log(
        this.gameState.value.users.map((x) => {
          return x.points;
        }),
      );
      this.$bus.emit(
        "updatepoints",
        this.gameState.value.users.map((x) => {
          return x.points;
        }),
      );
    }
  }

  drawPlayerLabels() {
    //IN PROGRESS
    let placements = getPlacements(this.gameState.value.users);
    // console.log(placements);
    for (let i = 0; i < placements.length; i++) {
      let labelID = "";
      switch (i) {
        case 0:
          labelID = "mario-label-large";
          break;
        case 1:
          labelID = "luigi-label-large";
          break;
        case 2:
          labelID = "wario-label-large";
          break;
        case 3:
          labelID = "yoshi-label-large";
          break;
      }
      let x = 128 + (placements[i].placement - 1) * 10;
      let y = (170 / (placements.length + 1)) * (i + 1);
      this.add.image(x, y - 10, labelID).setOrigin(0.5, 0.5);
      this.add
        .bitmapText(x - 30, y - 10, "dense", this.gameState.value.users[i].name)
        .setCharacterTint(0, -1, true, 0xffffff);
      this.add.bitmapText(
        x + 60,
        y - 13,
        "ds",
        this.gameState.value.users[i].points,
      );
    }
  }
}
