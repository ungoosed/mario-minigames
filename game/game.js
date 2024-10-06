// import { BootScene } from "./scene";
import Phaser from "phaser";
export const createGame = (config) =>
  new Phaser.Game({
    parent: "phaser",
    type: Phaser.AUTO,
    width: 220,
    height: 200,
    backgroundColor: "#bdae58",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 500 },
      },
    },
    render: {
      pixelArt: true,
    },
    ...config,
  });
