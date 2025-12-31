import { Boot } from "./scenes/Boot";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";
import { CreateRoom } from "./scenes/menu/CreateRoom";
import { JoinRoom } from "./scenes/menu/JoinRoom";
import { RoomLobby } from "./scenes/menu/RoomLobby";
import { SelectGame } from "./scenes/menu/SelectGame";
import { SetProfile } from "./scenes/menu/SetProfile";
import { GameSettings } from "./scenes/menu/GameSettings";
import { MinigameTemplate } from "./scenes/minigames/MinigameTemplate";
import { Error } from "./scenes/Error";
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
      MinigameTemplate,
      Error,
    ],
  });
