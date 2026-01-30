import { Scene } from "phaser";
import generateHand from "~/game/utils/picture-poker/generateHand";
import loadAssets from "~/game/utils/loadAssets";
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
  }
  create() {
    console.log("started");
    this.add.image("yoshi-label-large", 128, 80).setOrigin(0.5, 0);
    this.add.image("mario-label-large", 128, 120).setOrigin(0.5, 0);
    this.add.image("wario-label-large", 128, 160).setOrigin(0.5, 0);
    this.add.image("luigi-label-large", 128, 200).setOrigin(0.5, 0);

    this.add
      .bitmapText(128, 8, "ds", "Your place was " + this.place)
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

    let onGameState = function () {
      if (this.gameState.value.data.game == "SelectGame") {
        this.scene.start("SelectGame");
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
}
