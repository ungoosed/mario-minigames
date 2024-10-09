import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "background");

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
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");
    this.load.image("qwanoes", "QC.jpg");
    this.load.spritesheet("startButton", "startbutton.png", {
      frameWidth: 32,
      frameHeight: 16,
    });
    this.load.image("burger", "burger.png");
    this.load.image("pepper", "pepper.png");
    this.load.image("burgerlogo", "burgerlogo.png");
    this.load.image("platformTiles", "platformTiles.png");
    this.load.image("floor", "floor.png");
    this.load.tilemapTiledJSON("map", "tilemap.json");
    this.load.image("player1Info", "player1Info.png");
    this.load.image("player2Info", "player2Info.png");

    this.load.setPath("assets/characters");
    this.load.spritesheet("sausage", "sausage.png", {
      frameWidth: 8,
      frameHeight: 16,
    });
    this.load.spritesheet("peter-pepper", "peter-pepper.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.setPath("assets/buttons");
    this.load.spritesheet("choosePeter", "peter-pepper-button.png", {
      frameWidth: 64,
      frameHeight: 16,
    });
    this.load.spritesheet("chooseSausage", "sausage-button.png", {
      frameWidth: 64,
      frameHeight: 16,
    });
  }

  create() {
    this.scene.start("ChooseCharacter");
  }
}
