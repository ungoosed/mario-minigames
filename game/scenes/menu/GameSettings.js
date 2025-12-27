//display "joining room."
// add uuid to list of users in room
// request list of users in specific room, using uuid as authentication
// display all current users, max users, etc.
import makeHoverable from "~/game/utils/makeHoverable";
import { Scene } from "phaser";
import { UI_CONFIG } from "~/game/utils/constants";

export class GameSettings extends Scene {
  constructor() {
    super("GameSettings");
    this.gameState = useGameState("gameState");
    this.userData = useUserData("userData");
    this.$bus = useNuxtApp().$bus;
  }
  init(args) {
    this.game = args.game;
  }
  create() {
    this.backButton = this.add.image(
      UI_CONFIG.BACK_BUTTON_POSITION.x,
      UI_CONFIG.BACK_BUTTON_POSITION.y,
      "back-button",
    );
    makeHoverable(this.backButton);
    this.backButton.on("pointerdown", () => {
      if (this.gameState.value.users[0].id == this.userData.value.id) {
        this.gameState.value.data.game = "SelectGame";
        this.$bus.emit("update", this.gameState.value.data);
      } else {
        this.$bus.emit("action", { type: "back" });
      }
    });

    // Add text to display the selected game
    this.gameText = this.add
      .bitmapText(100, 100, "dense", "Game: " + this.game)
      .setOrigin(0.5, 0);

    let onError = function () {
      this.scene.wake("Error");
    }.bind(this);
    let onGameState = function () {
      if (this.gameState.value.data.game == "SelectGame") {
        this.scene.start("SelectGame");
      }
    }.bind(this);
    let onTry = function (args) {
      //args.id and args.data
      if (
        args.data.type == "back" &&
        args.id == this.gameState.value.data.turn
      ) {
        this.gameState.value.data.game = "SelectGame";
        this.$bus.emit("update", this.gameState.value.data);
      }
    };
    this.$bus.on("gamestate", onGameState);
    this.$bus.on("try", onTry);
    this.$bus.on("error", onError);

    this.events.on("shutdown", () => {
      this.$bus.off("error", onError);
      this.$bus.off("try", onTry);
      this.$bus.off("gamestate", onGameState);
    });
  }
  update() {}
}
