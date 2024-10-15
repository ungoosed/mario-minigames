import { Boot } from "./scenes/Boot";
import { ChooseCharacter } from "./scenes/ChooseCharacter";
import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
export const createGame = (config = {}) =>
  new Phaser.Game({
    type: Phaser.AUTO,
    width: 1024,
    height: 860,
    parent: "phaser",
    backgroundColor: "#028af8",
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 900 },
      },
    },
    scene: [Boot, Preloader, ChooseCharacter],
  });
