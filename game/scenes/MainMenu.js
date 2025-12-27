import { Scene } from "phaser";
import makeHoverable from "../utils/makeHoverable";
import { UI_CONFIG } from "~/game/utils/constants";
export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);
    this.add.image(0, 192, "menu-background").setOrigin(0, 0);
    this.add.image(128, 67, "scroll-strip-background");
    this.add.image(0, 150, "dialogue-background1").setOrigin(0, 0);
    this.add.image(40, 156, "dialogue1").setOrigin(0, 0);
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
    this.createButton = this.add.image(
      UI_CONFIG.CREATE_BUTTON_POSITION.x,
      UI_CONFIG.CREATE_BUTTON_POSITION.y,
      "create-button",
    );
    this.joinButton = this.add.image(
      UI_CONFIG.JOIN_BUTTON_POSITION.x,
      UI_CONFIG.JOIN_BUTTON_POSITION.y,
      "join-button",
    );
    const buttons = [this.createButton, this.joinButton];
    buttons.forEach((button) => {
      makeHoverable(button);
    });
    // emit events on button click
    this.createButton.on("pointerdown", () => {
      this.registry.set("minigamesTitle1", this.minigamesTitle1.x);
      this.registry.set("minigamesTitle2", this.minigamesTitle2.x);
      this.scene.start("CreateRoom");
      this.scene.stop();
    });
    this.joinButton.on("pointerdown", () => {
      this.registry.set("minigamesTitle1", this.minigamesTitle1.x);
      this.registry.set("minigamesTitle2", this.minigamesTitle2.x);
      this.scene.start("JoinRoom");
      this.scene.stop();
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
