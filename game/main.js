import { Boot } from "./scenes/Boot";
import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { ChooseCharacter } from "./scenes/ChooseCharacter";
import { Preloader } from "./scenes/Preloader";
import { Hud } from "./scenes/Hud";

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
    scene: [Boot, Preloader, ChooseCharacter, Game, GameOver, Hud],
  });
