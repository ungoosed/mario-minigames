import { Scene } from "phaser";
import generateHand from "~/game/utils/picture-poker/generateHand";
import generateMenu from "~/game/utils/generateMenu";
import loadAssets from "~/game/utils/loadAssets";
export default class PicturePoker extends Scene {
  constructor() {
    super("picture-poker");
    this.gameState = useGameState("gameState");
    this.userData = useUserData("userData");
    this.$bus = useNuxtApp().$bus;
    this.assets = {
      "casino-background": "assets/minigames/table/casino-background.png",
      "back-card": "assets/minigames/table/back-card.png",
      "cloud-card": "assets/minigames/table/cloud-card.png",
      "mushroom-card": "assets/minigames/table/mushroom-card.png",
      "flower-card": "assets/minigames/table/flower-card.png",
      "luigi-card": "assets/minigames/table/luigi-card.png",
      "mario-card": "assets/minigames/table/mario-card.png",
      "star-card": "assets/minigames/table/back-card.png",
    };
  }
  create() {
    this.handleMenu();
    loadAssets(this, this.assets);
    this.load.start();
    this.load.once("complete", () => {
      this.$bus.emit("action", { type: "ready" });
      (this.add.image(0, 0, "casino-background").setOrigin(0, 0).setDepth(-1),
        this.add
          .image(0, 192, "casino-background")
          .setOrigin(0, 0)
          .setDepth(-1),
        (this.cards = []));
      for (let i = 0; i < 5; i++) {
        let card = this.add.sprite(20 + i * 20, 300);

        this.cards.push(card);
      }
    });
    let onGameState = function () {
      console.log(this.gameState.value);
      if (this.gameState.value.data.round > 0) {
      }
    }.bind(this);
    let onTry = function () {}.bind(this);
    this.$bus.on("try", onTry);
    this.$bus.on("gamestate", onGameState);
  }
  update() {}
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
              if (this.gameState.value.users[0] == this.userData.id) {
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
        if ((this.gameState.value.users[0].id = this.userData.id)) {
          this.initializeState();
        } else {
          this.$bus.emit("action", { type: "begin" });
        }
      },
    );
    this.menu.start.setVisible(false);
    // menu event listeners
    let onGameState = function () {
      if (this.gameState.value.data.round > 0) {
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
    this.gameState.value.data.round = 1;
    if (!this.gameState.value.data.numRounds) {
      this.gameState.value.data.numRounds = 0;
    }
    this.gameState.value.data.users = [];
    for (let i = 0; i < this.gameState.value.users.length; i++) {
      let hand = generateHand();
      this.gameState.value.data.users.push({
        id: this.gameState.value.users[i].id,
        coins: 0,
        hand: hand,
      });
      let strippedCopy = structuredClone(toRaw(this.gameState.value.data));

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
      strippedCopy.users = strippedCards;
      this.$bus.emit(
        "targetupdate",
        strippedCopy,
        this.gameState.value.users[i].id,
      );
    }
    this.$bus.emit("update", this.gameState.value.data);
  }
}
