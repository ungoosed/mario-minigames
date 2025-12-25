import { Scene } from "phaser";
import makeHoverable from "../utils/makeHoverable";
export class Error extends Scene {
  constructor() {
    super("Error");
  }
  create() {
    this.add.image(0, 0, "error-background").setOrigin(0, 0);
    this.add.image(0, 192, "error-background").setOrigin(0, 0);
    this.add.text(100, 100, "Error", { fontSize: "32px", fill: "#fff" });
    this.backButton = makeHoverable(this.add.image(232, 360, "back-button"));
    this.backButton.on("pointerdown", () => {
      this.scene.sleep("Error");
    });
  }
  update() {}
}
