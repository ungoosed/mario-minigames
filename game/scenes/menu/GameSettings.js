//display "joining room."
// add uuid to list of users in room
// request list of users in specific room, using uuid as authentication
// display all current users, max users, etc.
import makeHoverable from "~/game/utils/makeHoverable";
import { Scene } from "phaser";
import { UI_CONFIG } from "~/game/constants/constants";
import initializeGameState from "~/game/utils/minigame-template/initializeGameState";
export class GameSettings extends Scene {
  constructor() {
    super("GameSettings");
    this.gameState = useGameState("gameState");
    this.userData = useUserData("userData");
    this.$bus = useNuxtApp().$bus;
  }
  init(args) {
    this.game = args.game;
    this.rounds = 5;
    this.points = 25;
    this.gameState.value.data.hasBegun = false;
    this.gameState.value.data.hasEnded = false;
  }

  create() {
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);
    this.add.image(0, 192, "menu-background").setOrigin(0, 0);
    this.add.image(0, 4, "title-background").setOrigin(0, 0);

    this.add.image(4, 38, "dialogue-background3").setOrigin(0, 0);
    this.startButton = makeHoverable(this.add.image(128, 300, "start-button"));
    if (this.gameState.value.data.turn != this.userData.value.id) {
      this.startButton.disableInteractive();
    }
    this.startButton.on("pointerdown", () => {
      if (this.gameState.value.users[0].id == this.userData.value.id) {
        this.gameState.value.data.hasBegun = true;
        initializeGameState(this.gameState);
        this.$bus.emit("update", this.gameState.value.data);
      } else {
        this.$bus.emit("action", { type: "startgame" });
      }
    });
    this.backButton = this.add.image(
      UI_CONFIG.BACK_BUTTON_POSITION.x,
      UI_CONFIG.BACK_BUTTON_POSITION.y,
      "back-button",
    );

    makeHoverable(this.backButton);
    if (this.gameState.value.data.turn != this.userData.value.id) {
      this.backButton.setFrame(1).disableInteractive();
      this.startButton.setFrame(1).disableInteractive();
    }
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
      .bitmapText(128, 10, "dense", "Game: " + this.game)
      .setOrigin(0.5, 0)
      .setTint(0x000000);

    let onError = function () {
      this.scene.wake("Error");
    }.bind(this);
    let onGameState = function () {
      if (this.gameState.value.data.hasBegun == true) {
        console.log("begin");
      }
      if (this.gameState.value.data.game == "SelectGame") {
        this.scene.start("SelectGame");
      }
      if (this.gameState.value.data.hasBegun == true) {
        this.scene.start("MinigameTemplate", {
          rounds: this.rounds,
          points: this.points,
        });
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
      if (
        args.data.type == "startgame" &&
        args.id == this.gameState.value.data.turn
      ) {
        this.gameState.value.data.hasBegun = true;
        initializeGameState(this.gameState);
        this.$bus.emit("update", this.gameState.value.data);
      }
    }.bind(this);
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
