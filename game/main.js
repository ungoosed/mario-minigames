import { Boot } from "./scenes/Boot";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";
import { CreateRoom } from "./scenes/menu/CreateRoom";
import { JoinRoom } from "./scenes/menu/JoinRoom";
import { RoomLobby } from "./scenes/menu/RoomLobby";
import { SelectGame } from "./scenes/menu/SelectGame";
import { SetProfile } from "./scenes/menu/SetProfile";
import { GameSettings } from "./scenes/menu/GameSettings";
import { Results } from "./scenes/menu/Results";
import { Error } from "./scenes/Error";
import { Podium } from "./scenes/menu/Podium";
//load menu scenes, minigames will b loaded dynamically
export const createGame = (config = {}) =>
  new Phaser.Game({
    type: Phaser.AUTO,
    width: 256,
    height: 384,
    parent: "phaser",
    dom: {
      createContainer: true,
    },
    scale: {
      mode: Phaser.Scale.FIT,
    },
    input: {
      mouse: {
        target: "phaser",
      },
      touch: {
        target: "phaser",
      },
    },
    scale: {
      // Fit to window
      mode: Phaser.Scale.FIT,
    },
    backgroundColor: "#fdf6e3",
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 900 },
      },
    },
    scene: [
      Boot,
      Preloader,
      MainMenu,
      CreateRoom,
      JoinRoom,
      RoomLobby,
      SetProfile,
      SelectGame,
      GameSettings,
      Results,
      Podium,
      Error,
    ],
  });
