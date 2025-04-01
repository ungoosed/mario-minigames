import { Scene } from "phaser";
import makeHoverable from "~/game/utils/makeHoverable";
import InputText from "phaser3-rex-plugins/plugins/inputtext.js";

export class SetProfile extends Scene {
  constructor() {
    super("SetProfile");
    this.userData = useUserData("userData");
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
    this.add.image(128, 213, "text-input").setOrigin(0.5, 0);
    this.continueButton = this.add.image(128, 360, "continue-button");
    makeHoverable(this.continueButton);
    this.continueButton.on("pointerdown", () => {
      this.registry.set("minigamesTitle1", this.minigamesTitle1.x);
      this.registry.set("minigamesTitle2", this.minigamesTitle2.x);
      this.userData.value.name = nameInput.text;
      this.scene.start("MainMenu");
    });
    this.add.text(50, 170, "enter your name here");
    const nameInput = new InputText(this, 128, 231, 125, 35, {
      x: 0,
      y: 0,
      width: undefined,
      height: undefined,

      type: "text", // 'text'|'password'|'textarea'|'number'|'color'|...

      // Element properties
      id: "nameInput",
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
    this.add.existing(nameInput);
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
