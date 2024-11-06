import { Scene } from "phaser";
import makeHoverable from "~/game/utils/makeHoverable";
import { useNuxtApp } from "#app";
export class JoinRoom extends Scene {
  constructor() {
    super("JoinRoom");
    this.$bus = useNuxtApp().$bus;
    this.roomList = useRoomList("roomList");
  }
  generateRoomButtons() {
    for (let i = 0; i < this.roomList.value.length; i++) {
      let image = makeHoverable(
        this.add.image(8, 203 + i * 34, "room-button-select").setOrigin(0, 0),
      );
      let name = this.add
        .text(12, 206 + i * 34, this.roomList.value[i].roomKey)
        .setOrigin(0, 0);
      let users = this.add
        .text(128, 206 + i * 34, this.roomList.value[i].maxUsers)
        .setOrigin(0, 0);
      image.on("pointerover", () => {
        name.setPosition(14, 208 + i * 34);
      });
      image.on("pointerout", () => {
        name.setPosition(12, 206 + i * 34);
      });
      this.roomButtonsArr.push({
        button: image,
        name: name,
        numUsers: users,
      });
      this.roomButtonsGroup.addMultiple([image, name, users]);
    }
  }
  create() {
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);
    this.add.image(0, 192, "menu-background").setOrigin(0, 0);
    this.roomButtonsGroup = this.add.group();
    this.roomButtonsArr = [];

    this.generateRoomButtons();
    this.$bus.on("newroomlist", () => {
      this.roomButtonsArr.length = 1;
      this.roomButtonsGroup.clear(true, true);
      this.generateRoomButtons();
    });

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
    this.backButton = this.add.image(232, 360, "back-button");
    this.confirmButton = this.add.image(128, 358, "join-button-confirm");
    this.syncButton = this.add.image(6, 358, "sync-button").setOrigin(0, 0.5);
    makeHoverable(this.backButton);
    makeHoverable(this.confirmButton);
    makeHoverable(this.syncButton);
    this.backButton.on("pointerdown", () => {
      this.registry.set("minigamesTitle1", this.minigamesTitle1.x);
      this.registry.set("minigamesTitle2", this.minigamesTitle2.x);
      this.scene.start("MainMenu");
    });
    this.syncButton.on("pointerdown", () => {
      this.$bus.emit("refreshrooms");
    });
    this.$bus.emit("refreshrooms");
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
