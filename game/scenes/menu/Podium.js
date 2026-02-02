import { Scene } from "phaser";
import generateHand from "~/game/utils/picture-poker/generateHand";
import loadAssets from "~/game/utils/loadAssets";
import getPlacements from "~/game/utils/getPlacements";
import makeHoverable from "~/game/utils/makeHoverable";
export class Podium extends Scene {
  constructor() {
    super("Podium");
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
    this.startButton = makeHoverable(this.add.image(128, 300, "start-button"));
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
    //handle communications
    let onGameState = function () {
      if (this.gameState.value.data.game == "done") {
        console.log("winwinwinwinwinahhahaha");
        this.scene.start("MainMenu");
        //disconnect
        this.$bus.emit("leaveroom");
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
  //handle "try" requests
  handleAction(args) {
    if (args.data.type == "next") {
      this.gameState.value.data.game = "done";
      this.$bus.emit("update", this.gameState.value.data);
    }
  }
}
