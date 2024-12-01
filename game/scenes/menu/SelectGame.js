import { Scene } from "phaser";
import makeHoverable from "~/game/utils/makeHoverable";
export class SelectGame extends Scene {
  constructor() {
    super("SelectGame");
    this.gameState = useGameState("gameState");
    this.userData = useUserData("userData");
    this.$bus = useNuxtApp().$bus;
  }
  create() {
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);
    this.add.image(0, 192, "menu-background").setOrigin(0, 0);
    this.add.image(0, 150, "dialogue-background1").setOrigin(0, 0);
    for (let i = 0; i < this.gameState.value.users.length; i++) {
      this.add
        .bitmapText(
          128,
          30 + i * 15,
          "dense",
          "name: " + this.gameState.value.users[i].name,
        )
        .setOrigin(0.5, 0);
    }
    let actionGames = ["picture-poker", "bob-omb-blast"];
    for (let i = 0; i < actionGames.length; i++) {
      let thumb = this.add
        .image(87, 202 + 57 * i, actionGames[i] + "-thumbnail")
        .setOrigin(0, 0);
      let frame = this.add
        .image(85, 200 + 57 * i, "thumbnail-frame")
        .setOrigin(0, 0);
      thumb.setInteractive().on("pointerover", () => {
        thumb.setTint("0xfffa05");
      });
      thumb.setInteractive().on("pointerout", () => {
        thumb.clearTint();
      });
    }
    this.actionButton = this.add
      .image(0, 144 + 48, "action-games-button")
      .setOrigin(0, 0)
      .setFrame(1);
    this.puzzleButton = this.add
      .image(0, 144 + 48 * 2, "puzzle-games-button")
      .setOrigin(0, 0);
    this.tableButton = this.add
      .image(0, 144 + 48 * 3, "table-games-button")
      .setOrigin(0, 0);
    this.varietyButton = this.add
      .image(0, 144 + 48 * 4, "variety-games-button")
      .setOrigin(0, 0);
    makeHoverable(this.actionButton);
    makeHoverable(this.puzzleButton);
    makeHoverable(this.tableButton);
    makeHoverable(this.varietyButton);
  }
  update() {}
}
