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
  create() {
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);
    this.add.image(0, 192, "error-background").setOrigin(0, 0);
    this.add.image(0, 4, "title-background").setOrigin(0, 0);
    this.add.image("yoshi-label-large", 128, 80).setOrigin(0.5, 0);
    this.add.image("mario-label-large", 128, 120).setOrigin(0.5, 0);
    this.add.image("wario-label-large", 128, 160).setOrigin(0.5, 0);
    this.add.image("luigi-label-large", 128, 200).setOrigin(0.5, 0);
    //title
    this.add.bitmapText(128, 8, "ds", "Podium").setOrigin(0.5, 0);

    //handle communications
    let onGameState = function () {}.bind(this);
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
  //handle "try" requests
  handleAction(args) {}
}
