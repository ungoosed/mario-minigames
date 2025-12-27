//display "joining room."
// add uuid to list of users in room
// request list of users in specific room, using uuid as authentication
// display all current users, max users, etc.
import makeHoverable from "~/game/utils/makeHoverable";
import { Scene } from "phaser";
import { UI_CONFIG } from "~/game/utils/constants";

export class RoomLobby extends Scene {
  constructor() {
    super("RoomLobby");
    this.gameState = useGameState("gameState");
    this.userData = useUserData("userData");
    this.$bus = useNuxtApp().$bus;
    this.userListItems = [];
  }
  drawUsers() {
    this.userListItems.forEach((item) => {
      item.destroy();
    });
    this.userListItems.length = 0;
    for (let i = 0; i < this.gameState.value.users.length; i++) {
      let identifierText = i === 0 ? "Host" : "";
      this.gameState.value.users[i].id == this.userData.value.id
        ? (identifierText += "&You:")
        : (identifierText += ":");
      let tag = this.add.bitmapText(20, 210 + i * 34, "ds", identifierText);
      let name = this.add.bitmapText(
        120,
        210 + i * 34,
        "ds",
        this.gameState.value.users[i].name,
      );
      this.userListItems.push(tag, name);
    }
  }
  create() {
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);
    this.add.image(0, 192, "menu-background").setOrigin(0, 0);
    this.add.image(128, 67, "scroll-strip-background");
    this.add.image(0, 150, "dialogue-background1").setOrigin(0, 0);
    let minigamesTitle1X = this.registry.get("minigamesTitle1");
    let minigamesTitle2X = this.registry.get("minigamesTitle2");

    if (!minigamesTitle1X) {
      minigamesTitle1X = 128;
    }
    if (!minigamesTitle2X) {
      minigamesTitle2X = 380;
    }
    this.minigamesTitle1 = this.add.image(
      minigamesTitle1X,
      68,
      "minigames-rainbow",
    );
    this.minigamesTitle2 = this.add.image(
      minigamesTitle2X,
      68,
      "minigames-rainbow",
    );

    this.backButton = this.add.image(
      UI_CONFIG.BACK_BUTTON_POSITION.x,
      UI_CONFIG.BACK_BUTTON_POSITION.y,
      "back-button",
    );
    makeHoverable(this.backButton);
    this.backButton.on("pointerdown", () => {
      this.scene.start("MainMenu");

      //return to menu
      this.$bus.emit("leaveroom");
      this.registry.set("minigamesTitle1", this.minigamesTitle1.x);
      this.registry.set("minigamesTitle2", this.minigamesTitle2.x);
    });

    this.startGameButton = this.add.image(105, 345, "start-game-button");
    makeHoverable(this.startGameButton);
    if (
      this.gameState.value.users[0]?.id != this.userData.value.id ||
      this.gameState.value.users.length == 1
    ) {
      this.startGameButton.setFrame(1).disableInteractive();
    }
    this.startGameButton.on("pointerdown", () => {
      if (this.gameState.value.users[0].id == this.userData.value.id) {
        this.$bus.emit("update", {
          game: "SelectGame",
          turn: this.gameState.value.users[0].id,
          category: "action",
        });
      }
    });
    this.dialogue = this.add
      .bitmapText(
        30,
        155,
        "dense",
        this.gameState.value.users.length > 1
          ? "Wait for the host\n to start the game . . ."
          : "Wait for players to join . . ",
      )
      .setCharacterTint(0, -1, true, 0xffffff);
    this.drawUsers();
    let password = this.add.bitmapText(
      150,
      200,
      "ds",
      this.gameState.value.password,
    );
    console.log(this.gameState.value.password);
    let onError = function () {
      this.scene.start("MainMenu");
    }.bind(this);
    let onGameState = function () {
      if (
        this.gameState.value.users[0]?.id == this.userData.value.id ||
        this.gameState.value.users.length == 1
      ) {
        this.startGameButton.setInteractive();
        this.startGameButton.setFrame(0);
      }
      this.drawUsers();
      if (this.gameState.value.data.game == "SelectGame") {
        this.scene.start("SelectGame");
      }
      console.log(this.gameState.value);
    }.bind(this);
    this.$bus.on("gamestate", onGameState);
    this.$bus.on("error", onError);

    this.events.on("shutdown", () => {
      this.$bus.off("error", onError);
      this.$bus.off("gamestate", onGameState);
    });
  }
  update() {
    this.minigamesTitle1.setX(this.minigamesTitle1.x + -0.5);
    this.minigamesTitle2.setX(this.minigamesTitle2.x + -0.5);
    if (this.minigamesTitle2.x < -128) {
      this.minigamesTitle2.setX(380);
    }
    if (this.minigamesTitle1.x < -128) {
      this.minigamesTitle1.setX(380);
    }
  }
}
