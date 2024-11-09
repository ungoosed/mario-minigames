import { Scene } from "phaser";
import InputText from "phaser3-rex-plugins/plugins/inputtext.js";
import makeHoverable from "~/game/utils/makeHoverable";
import { useNuxtApp } from "#app";

export class CreateRoom extends Scene {
  constructor() {
    super("CreateRoom");
    this.$bus = useNuxtApp().$bus;
  }
  createEventListeners() {}
  unloadEventListeners() {}
  create() {
    this.createEventListeners();
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);
    this.add.image(0, 192, "menu-background").setOrigin(0, 0);
    this.add.image(128, 67, "scroll-strip-background");
    this.add.image(0, 150, "dialogue-background1").setOrigin(0, 0);
    this.add.image(128, 156, "dialogue2").setOrigin(0.5, 0);

    this.add.image(128, 213, "text-input").setOrigin(0.5, 0);
    this.add.image(128, 285, "number-input").setOrigin(0.5, 0);

    this.add.image(128, 200, "group-name").setOrigin(0.5, 0);
    this.add.image(128, 248, "num-people-text").setOrigin(0.5, 0);
    this.numPeopleNumbers = this.add
      .image(128, 291, "num-people-numbers")
      .setOrigin(0.5, 0)
      .setFrame(1);

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
    const roomNameInput = new InputText(this, 128, 231, 125, 35, {
      x: 0,
      y: 0,
      width: undefined,
      height: undefined,

      type: "text", // 'text'|'password'|'textarea'|'number'|'color'|...

      // Element properties
      id: "newRoomName",
      text: undefined,
      maxLength: undefined,
      minLength: undefined,
      placeholder: undefined,
      tooltip: undefined,
      readOnly: false,
      spellCheck: false,
      autoComplete: "off",

      // Style properties
      align: "center",
      paddingLeft: undefined,
      paddingRight: undefined,
      paddingTop: undefined,
      paddingBottom: undefined,
      fontFamily: undefined,
      fontSize: undefined,
      color: "#ffffff",
      border: 0,
      backgroundColor: "transparent",
      borderColor: "transparent",
      borderRadius: undefined,
      outline: "none",
      direction: "ltr",

      selectAll: false,
    });
    this.add.existing(roomNameInput);
    this.backButton = this.add.image(232, 360, "back-button");
    this.increasePlayers = this.add.image(156, 297, "right-arrow-button");
    this.decreasePlayers = this.add
      .image(97, 297, "left-arrow-button")
      .setVisible(false);
    this.confirmButton = this.add.image(128, 346, "create-button-confirm");

    const buttons = [
      this.backButton,
      this.confirmButton,
      this.increasePlayers,
      this.decreasePlayers,
    ];
    buttons.forEach((button) => {
      makeHoverable(button);
    });
    this.input.on("gameout", () => {
      this.confirmButton.setFrame(0);
    });
    this.backButton.on("pointerdown", () => {
      //return to menu
      this.registry.set("minigamesTitle1", this.minigamesTitle1.x);
      this.registry.set("minigamesTitle2", this.minigamesTitle2.x);
      this.scene.start("MainMenu");
    });
    this.confirmButton.on("pointerdown", () => {
      this.registry.set("minigamesTitle1", this.minigamesTitle1.x);
      this.registry.set("minigamesTitle2", this.minigamesTitle2.x);
      //pipe to mitt
      this.$bus.emit("createroom", {
        roomKey: roomNameInput.text,
        maxUsers: numPeople,
      });
      roomNameInput.setText("");
      //join room you created as the host
    });

    let numPeople = 2;
    this.increasePlayers.on("pointerdown", () => {
      if (numPeople < 4) {
        numPeople++;
      }
      if (numPeople == 4) {
        this.increasePlayers.setVisible(false);
      }
      if (numPeople > 2) {
        this.decreasePlayers.setVisible(true);
      }
      this.numPeopleNumbers.setFrame(numPeople - 1);
    });
    this.decreasePlayers.on("pointerdown", () => {
      if (numPeople > 2) {
        numPeople--;
      }
      if (numPeople == 2) {
        this.decreasePlayers.setVisible(false);
      }
      if (numPeople < 4) {
        this.increasePlayers.setVisible(true);
      }
      this.numPeopleNumbers.setFrame(numPeople - 1);
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
  onShutdown() {
    this.unloadEventListeners();
  }
}
