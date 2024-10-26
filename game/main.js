import { Boot } from "./scenes/Boot";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

export const createGame = (config = {}) =>
  new Phaser.Game({
    type: Phaser.AUTO,
    width: 256,
    height: 384,
    parent: "phaser",
    backgroundColor: "#fdf6e3",
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 900 },
      },
    },
    scene: [Boot, Preloader, MainMenu],
  });
