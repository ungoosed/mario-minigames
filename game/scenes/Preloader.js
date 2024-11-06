import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    // this.add.image(512, 384, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.setPath("assets/menu");

    this.load.image("menu-background", "menu-background.png");
    this.load.image("text-input", "text-input.png");
    this.load.image("number-input", "number-input.png");
    this.load.image("minigames-rainbow", "minigames-rainbow.png");
    this.load.image("scroll-strip-background", "scroll-strip-background.png");

    //load text-based assets
    this.load.setPath("assets/text");

    this.load.image("dialogue-background1", "dialogue-background1.png");
    this.load.image("group-name", "group-name.png");
    this.load.image("dialogue1", "dialogue1.png");
    this.load.image("dialogue2", "dialogue2.png");
    this.load.image("blank-text-background", "blank-text-background.png");
    this.load.image("num-pages-text", "num-pages-text.png");

    this.load.image("num-people-text", "num-people-text.png");
    this.load.spritesheet("num-people-numbers", "num-people-numbers.png", {
      frameWidth: 25,
      frameHeight: 15,
    });

    //load buttons
    this.load.setPath("assets/buttons");
    this.load.spritesheet("back-button", "back-button.png", {
      frameWidth: 35,
      frameHeight: 31,
    });
    this.load.spritesheet("sync-button", "sync-button.png", {
      frameWidth: 35,
      frameHeight: 31,
    });
    this.load.spritesheet("join-button", "join-button.png", {
      frameWidth: 243,
      frameHeight: 59,
    });
    this.load.spritesheet("room-button-select", "room-button-select.png", {
      frameWidth: 237,
      frameHeight: 27,
    });
    this.load.spritesheet("create-button", "create-button.png", {
      frameWidth: 243,
      frameHeight: 59,
    });
    this.load.spritesheet(
      "create-button-confirm",
      "create-button-confirm.png",
      {
        frameWidth: 163,
        frameHeight: 59,
      },
    );
    this.load.spritesheet("join-button-confirm", "join-button-confirm.png", {
      frameWidth: 147,
      frameHeight: 35,
    });
    this.load.spritesheet("left-arrow-button", "left-arrow-button.png", {
      frameWidth: 23,
      frameHeight: 27,
    });
    this.load.spritesheet("right-arrow-button", "right-arrow-button.png", {
      frameWidth: 23,
      frameHeight: 27,
    });
  }

  create() {
    this.scene.start("MainMenu");
  }
}
