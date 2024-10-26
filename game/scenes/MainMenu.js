import { Scene } from "phaser";
import { useGameStateStore } from "#imports";
export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    // const store = useGameStateStore();
    // for (let i = 0; i < store.luigi.length; i++) {
    //   this.add.image(i * 100 + 100, 100, "luigi-card").setScale(3, 3);
    // }
    // for (let i = 0; i < store.mario.length; i++) {
    //   this.add.image(i * 100 + 100, 200, "mario-card").setScale(3, 3);
    // }
    this.add.image(128, 96, "menu-background").setScale(1);
    this.add.image(128, 67, "scroll-strip-background").setScale(1);
  }
}
