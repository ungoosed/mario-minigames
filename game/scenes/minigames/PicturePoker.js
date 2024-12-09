import { Scene } from "phaser";
import generateHand from "~/game/utils/generateHand";
import generateMenu from "~/game/utils/generateMenu";
import loadAssets from "~/game/utils/loadAssets";
export default class PicturePoker extends Scene {
  constructor() {
    super("picture-poker");
    this.gameState = useGameState("gameState");
    this.userData = useUserData("userData");
    this.$bus = useNuxtApp().$bus;
    this.assets = {
      images: {
        "casino-background": "assets/minigames/table/casino-background.png",
      },
      spritesheets: {
        "back-card": {
          url: "assets/minigames/table/back-card.png",
          config: {
            frameWidth: 32,
            frameHeight: 38,
          },
        },
        "cloud-card": {
          url: "assets/minigames/table/cloud-card.png",
          config: {
            frameWidth: 32,
            frameHeight: 38,
          },
        },
        "mushroom-card": {
          url: "assets/minigames/table/mushroom-card.png",
          config: {
            frameWidth: 32,
            frameHeight: 38,
          },
        },
        "flower-card": {
          url: "assets/minigames/table/flower-card.png",
          config: {
            frameWidth: 32,
            frameHeight: 38,
          },
        },
        "luigi-card": {
          url: "assets/minigames/table/luigi-card.png",
          config: {
            frameWidth: 32,
            frameHeight: 38,
          },
        },
        "mario-card": {
          url: "assets/minigames/table/mario-card.png",
          config: {
            frameWidth: 32,
            frameHeight: 38,
          },
        },
        "star-card": {
          url: "assets/minigames/table/star-card.png",
          config: {
            frameWidth: 32,
            frameHeight: 38,
          },
        },
      },
    };
  }
  create() {
    this.handleMenu();
    loadAssets(this, this.assets);
    this.load.start();
    this.cards = [];
    this.load.once("complete", () => {
      this.$bus.emit("action", { type: "ready" });
      this.add.image(0, 0, "casino-background").setOrigin(0, 0).setDepth(-1);
      this.add.image(0, 192, "casino-background").setOrigin(0, 0).setDepth(-1);
    });
    let onGameState = function () {
      console.log(this.gameState.value);
      if (this.gameState.value.data.round > 0) {
        for (let i = 0; i < this.gameState.value.data.users.length; i++) {
          for (let k = 0; k < 5; k++) {
            let key = Object.keys(this.assets.spritesheets)[
              this.gameState.value.data.users[i].hand[k]
            ];
            this.add.sprite(20 + k * 30, 100 + i * 70, key);
          }
        }
      }
    }.bind(this);
    let onTry = function () {}.bind(this);
    this.$bus.on("try", onTry);
    this.$bus.on("gamestate", onGameState);
  }
  handleMenu() {
    // generate menu object
    this.menu = generateMenu(
      this,
      {
        title: "Picture Poker",
        description: "eesiofl sjfc ksnv mn dm",
        inputs: [
          {
            type: "picker",
            labels: ["3 Rounds", "5 Rounds", "7 Rounds"],
            update: () => {
              if (this.gameState.value.users[0].id == this.userData.id) {
                this.gameState.value.data.numRounds == this.menu.inputs[0];
                this.$bus.emit("update", this.gameState.value.data);
              } else {
                this.$bus.emit("action", {
                  type: "numRounds",
                  rounds: this.menu.inputs[0],
                });
              }
            },
          },
        ],
      },
      () => {
        if (this.gameState.value.users[0].id == this.userData.id) {
          this.initializeState();
          this.dealCards();
        } else {
          this.$bus.emit("action", { type: "begin" });
        }
      },
    );
    this.menu.start.setVisible(false);
    // menu event listeners
    let onGameState = function () {
      if (this.gameState.value.data.round) {
        this.menu.hide();
      } else {
        if (
          this.gameState.value.data.ready.length ==
            this.gameState.value.users.length &&
          this.gameState.value.data.round != 1
        ) {
          this.menu.start.setVisible(true);
          if (this.gameState.value.data.turn == this.userData.value.id) {
            this.menu.enableInput();
          } else {
            this.menu.disableInput();
          }
          // show and make start button interactive
        } else {
          this.menu.start.setVisible(false);
        }
        if (this.gameState.value.data.numRounds != undefined) {
          this.menu.set(0, this.gameState.value.data.numRounds);
        }
      }
    }.bind(this);
    let onTry = function (args) {
      if (args?.data?.type == "ready") {
        if (!this.gameState.value.data.ready) {
          this.gameState.value.data.ready = [];
        }
        this.gameState.value.data.ready.push(args?.id);

        this.$bus.emit("update", this.gameState.value.data);
      }
      if (
        args?.data?.type == "numRounds" &&
        args?.id == this.gameState.value.data.turn
      ) {
        this.gameState.value.data.numRounds = args?.data.rounds;
        this.$bus.emit("update", this.gameState.value.data);
      }
      if (args?.data?.type == "begin") {
        this.initializeState();
        this.dealCards();
      }
    }.bind(this);
    this.$bus.on("gamestate", onGameState);
    this.$bus.on("try", onTry);
    // load game specific assets
    this.events.on("shutdown", () => {
      this.$bus.off("gamestate", onGameState);
      this.$bus.off("try", onTry);
    });
  }
  initializeState() {
    // reset state and define variables
    let turn = this.gameState.value.data.turn;
    this.gameState.value.data = { game: "picture-poker", turn: turn };
    this.gameState.value.data.round = 1;
    if (!this.gameState.value.data.numRounds) {
      this.gameState.value.data.numRounds = 0;
    }
    this.gameState.value.data.users = [];
    for (let i = 0; i < this.gameState.value.users.length; i++) {
      this.gameState.value.data.users.push({
        id: this.gameState.value.users[i].id,
        coins: 0,
        hand: [],
      });
    }
  }
  dealCards() {
    for (let i = 0; i < this.gameState.value.users.length; i++) {
      let hand = generateHand();
      this.gameState.value.data.users[i].hand = hand;
      // if client is not host
      console.log(toRaw(this.gameState.value.users));
      if (
        !(this.gameState.value.users[i].id == this.gameState.value.users[0].id)
      ) {
        let strippedCards = [];
        for (let k = 0; k < this.gameState.value.users.length; k++) {
          if (k == i) {
            strippedCards.push({
              id: this.gameState.value.users[i].id,
              coins: 0,
              hand: hand,
            });
          } else {
            strippedCards.push({
              id: this.gameState.value.users[i].id,
              coins: 0,
              hand: [0, 0, 0, 0, 0],
            });
          }
        }
        let strippedCopy = structuredClone(toRaw(this.gameState.value.data));
        strippedCopy.users = strippedCards;
        this.$bus.emit("targetupdate", {
          data: strippedCopy,
          target: this.gameState.value.users[i].id,
        });
      }
    }
    this.$bus.emit("targetupdate", {
      data: this.gameState.value.data,
      target: this.userData.value.id,
    });
  }
}
