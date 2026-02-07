//dynamically load selected scene
const minigames = import.meta.glob("~/game/scenes/minigames/*.js");
import makeHoverable from "~/game/utils/makeHoverable";
import { Scene } from "phaser";
import { UI_CONFIG } from "~/game/constants/constants";
export class GameSettings extends Scene {
  constructor() {
    super("GameSettings");
    this.gameState = useGameState("gameState");
    this.userData = useUserData("userData");
    this.$bus = useNuxtApp().$bus;
  }
  init() {
    this.rounds = 5;
    this.points = 25;
    this.gameState.value.data.hasBegun = false;
    this.gameState.value.data.hasEnded = false;
  }

  create() {
    //load selected gamee in background
    if (
      !this.scene.get(
        this.gameState.value.data.game
          .replace(/-./g, (match) => match.charAt(1).toUpperCase())
          .replace(/^./, (match) => match.toUpperCase()),
      )
    ) {
      this.minigameModulePromise =
        minigames[
          `/game/scenes/minigames/${this.gameState.value.data.game
            .replace(/-./g, (match) => match.charAt(1).toUpperCase())
            .replace(/^./, (match) => match.charAt(0).toUpperCase())}.js`
        ]();
      this.minigameModulePromise.then((module) => {
        this.minigameSetup = module.setup;
        this.scene.add(this.gameState.value.data?.game, module.default);
        if (this.gameState.value.users[0].id == this.userData.value.id) {
          this.handleAction({
            id: this.userData.value.id,
            data: {
              type: "loaded",
            },
          });
        } else {
          this.$bus.emit("action", { type: "loaded" });
        }
      });
    } else {
      if (!this.minigameModulePromise) {
        this.minigameModulePromise =
          minigames[
            `/game/scenes/minigames/${this.gameState.value.data.game
              .replace(/-./g, (match) => match.charAt(1).toUpperCase())
              .replace(/^./, (match) => match.charAt(0).toUpperCase())}.js`
          ]();
        this.minigameModulePromise.then((module) => {
          this.minigameSetup = module.setup;
        });
      }
      if (this.gameState.value.users[0].id == this.userData.value.id) {
        this.handleAction({
          id: this.userData.value.id,
          data: {
            type: "loaded",
          },
        });
      } else {
        this.$bus.emit("action", { type: "loaded" });
      }
    }

    //normal stuff
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);
    this.add.image(0, 192, "menu-background").setOrigin(0, 0);
    this.add.image(0, 4, "title-background").setOrigin(0, 0);

    this.add.image(4, 38, "dialogue-background3").setOrigin(0, 0);
    this.startButton = makeHoverable(this.add.image(128, 300, "start-button"));
    if (this.gameState.value.data.turn != this.userData.value.id) {
      this.startButton.disableInteractive();
    }
    this.startButton.on("pointerdown", () => {
      if (this.gameState.value.users[0].id == this.userData.value.id) {
        this.handleAction({
          id: this.userData.value.id,
          data: {
            type: "startgame",
          },
        });
      } else {
        this.$bus.emit("action", { type: "startgame" });
      }
    });
    this.backButton = this.add.image(
      UI_CONFIG.BACK_BUTTON_POSITION.x,
      UI_CONFIG.BACK_BUTTON_POSITION.y,
      "back-button",
    );

    makeHoverable(this.backButton);
    if (this.gameState.value.data.turn != this.userData.value.id) {
      this.backButton.setFrame(1).disableInteractive();
      this.startButton.setFrame(1).disableInteractive();
    }
    this.backButton.on("pointerdown", () => {
      if (this.gameState.value.users[0].id == this.userData.value.id) {
        this.gameState.value.data.game = "SelectGame";
        this.$bus.emit("update", this.gameState.value.data);
      } else {
        this.$bus.emit("action", { type: "back" });
      }
    });

    // Add text to display the selected game
    this.gameText = this.add
      .bitmapText(128, 10, "dense", "Game: " + this.game)
      .setOrigin(0.5, 0)
      .setTint(0x000000);

    let onError = function () {
      this.scene.wake("Error");
    }.bind(this);
    let onGameState = function () {
      if (this.gameState.value.data.fullyLoaded) {
        //mak button clickable
        if (this.gameState.value.data.turn == this.userData.value.id) {
          this.startButton.setFrame(0).setInteractive();
        }
        if (this.gameState.value.data.hasBegun) {
          const minigameKey = this.gameState.value.data.game
            .replace(/-./g, (match) => match.charAt(1).toUpperCase())
            .replace(/^./, (match) => match.charAt(0).toUpperCase());
          const startMinigame = () => {
            this.scene.start(minigameKey, {
              rounds: this.rounds,
              points: this.points,
            });
          };
          if (this.minigameModulePromise) {
            this.minigameModulePromise.then(() => {
              startMinigame();
            });
          } else {
            startMinigame();
          }
        }
        if (this.gameState.value.data.game == "SelectGame") {
          this.scene.start("SelectGame");
        }
      }
    }.bind(this);

    let onTry = function (args) {
      //args.id and args.data
      this.handleAction(args);
    }.bind(this);
    this.$bus.on("gamestate", onGameState);
    this.$bus.on("try", onTry);
    this.$bus.on("error", onError);

    this.events.on("shutdown", () => {
      this.$bus.off("error", onError);
      this.$bus.off("try", onTry);
      this.$bus.off("gamestate", onGameState);
    });
  }
  handleAction(args) {
    if (args.data.type == "loaded") {
      if (!this.gameState.value.data.loadedPlayers) {
        this.gameState.value.data.loadedPlayers = {};
      }
      this.gameState.value.data.loadedPlayers[args.id] = true;
      if (
        Object.values(this.gameState.value.data.loadedPlayers).every(Boolean)
      ) {
        this.gameState.value.data.fullyLoaded = true;
        this.$bus.emit("update", this.gameState.value.data);
      }
    }
    if (args.data.type == "back" && args.id == this.gameState.value.data.turn) {
      this.gameState.value.data.game = "SelectGame";
      this.$bus.emit("update", this.gameState.value.data);
    }
    if (
      args.data.type == "startgame" &&
      args.id == this.gameState.value.data.turn
    ) {
      if (typeof this.minigameSetup === "function") {
        this.minigameSetup(this.gameState);
      }
      this.gameState.value.data.hasBegun = true;

      this.$bus.emit("update", this.gameState.value.data);
    }
  }
}
