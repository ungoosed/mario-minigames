import { Boot } from "./scenes/Boot";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";
import { CreateRoom } from "./scenes/menu/CreateRoom";
import { JoinRoom } from "./scenes/menu/JoinRoom";
import TextEditPlugin from "phaser3-rex-plugins/plugins/textedit-plugin.js";
export const createGame = (config = {}) =>
  new Phaser.Game({
    type: Phaser.AUTO,
    width: 256,
    height: 384,
    parent: "phaser",
    dom: {
      createContainer: true,
    },
    input: {
      mouse: {
        target: "phaser",
      },
      touch: {
        target: "phaser",
      },
    },
    backgroundColor: "#fdf6e3",
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 900 },
      },
    },
    scene: [Boot, Preloader, MainMenu, CreateRoom, JoinRoom],
  });
