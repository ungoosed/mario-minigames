import { Scene } from "phaser";
import generateHand from "~/game/utils/generateHand";
import generateMenu from "~/game/utils/generateMenu";
import indexOfUser from "~/game/utils/indexOfUser";
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
      spritesheets: {},
    };
    this.cardTypes = [
      "back",
      "cloud",
      "mushroom",
      "flower",
      "luigi",
      "mario",
      "star",
    ];
    for (let i = 0; i < this.cardTypes.length; i++) {
      this.assets.spritesheets[this.cardTypes[i] + "-card"] = {
        url: "assets/minigames/table/" + this.cardTypes[i] + "-card.png",
        config: {
          frameWidth: 32,
          frameHeight: 48,
        },
      };
      if (this.cardTypes[i] != "back") {
        if (this.cardTypes[i] == "star") {
          this.assets.spritesheets[this.cardTypes[i] + "-indicator"] = {
            url:
              "assets/minigames/table/" + this.cardTypes[i] + "-indicator.png",
            config: {
              frameWidth: 20,
              frameHeight: 17,
            },
          };
        } else {
          this.assets.spritesheets[this.cardTypes[i] + "-indicator"] = {
            url:
              "assets/minigames/table/" + this.cardTypes[i] + "-indicator.png",
            config: {
              frameWidth: 20,
              frameHeight: 16,
            },
          };
        }
      }
    }
  }
  create() {
    this.handleMenu();
    loadAssets(this, this.assets);
    this.load.start();
    this.cards = [];
    this.load.once("complete", () => {
      this.$bus.emit("action", { type: "ready" });
      this.add
        .image(128, 96, "casino-background")
        .setOrigin(0.5, 0.5)

        .setRotation(Math.PI);
      this.add.image(0, 192, "casino-background").setOrigin(0, 0);
      this.p2coins = this.add
        .bitmapText(15, 192, "ds", "30")
        .setOrigin(0, 0)
        .setTint(0xffff00);
      this.createGlobalAnims();
    });
    let onGameState = function () {
      console.log(this.gameState.value);
      if (this.gameState.value.data.round > 0) {
        for (let i = 0; i < this.gameState.value.data.users.length; i++) {
          if (this.gameState.value.users[i].id == this.userData.value.id) {
            this.drawCards(50, 310, this.gameState.value.data.users[i].hand);
          } else {
            this.drawCards(20, 30 + i * 50, [0, 0, 0, 0, 0]);
          }
        }
      }
    }.bind(this);
    let onTry = function (args) {
      if (args.id == this.gameState.value.data.turn) {
        if (args.data.type == "select") {
          let userIndex = this.gameState.value.data.users.findIndex((usr) => {
            usr.id == args.id;
          });
          this.gameState.value.data.users[userIndex].selected[args.data.card] =
            true;
        }
        if (args.data.type == "deselect") {
          let userIndex = this.gameState.value.data.users.findIndex((usr) => {
            usr.id == args.id;
          });
          this.gameState.value.data.users[userIndex].selected[args.data.card] =
            false;
        }
      }
    }.bind(this);
    this.$bus.on("try", onTry);
    this.$bus.on("gamestate", onGameState);
  }
  drawCards(x, y, cards) {
    let cardObjects = [];
    for (let i = 0; i < cards.length; i++) {
      let interactiveCard = this.add.sprite(
        x + i * 40,
        y,
        Object.keys(this.assets.spritesheets)[cards[i]],
      );
      if (!(cards[i] == 0)) {
        // animations
        interactiveCard.play("begin-turn");
        interactiveCard.chain("finish-turn-" + this.cardTypes[cards[i]]);
        interactiveCard
          .setInteractive()
          .setData("type", this.cardTypes[cards[i]])
          .setData("selected", false);
        interactiveCard.on("pointerdown", () => {
          if (interactiveCard.getData("selected")) {
            interactiveCard.setData("selected", false);
            this.tweens.add({
              targets: interactiveCard, // The sprite to move
              x: x + i * 40, // The destination x-coordinate
              y: y, // The destination y-coordinate
              ease: "Power1", // Easing function
              duration: 200, // Duration in milliseconds
            });
            this.$bus.emit("action", { type: "select", card: i });
          } else {
            interactiveCard.setData("selected", true);
            this.tweens.add({
              targets: interactiveCard, // The sprite to move
              x: x + i * 40, // The destination x-coordinate
              y: y - 20, // The destination y-coordinate
              ease: "Power1", // Easing function
              duration: 200, // Duration in milliseconds
            });
            this.$bus.emit("action", { type: "deselect", card: i });
          }
        });
      } else {
        interactiveCard.setFrame(0);
      }
      cardObjects.push(interactiveCard);
    }
    return cardObjects;
  }
  createGlobalAnims() {
    this.anims.create({
      key: "begin-turn",
      frames: [
        {
          key: "back-card",
          frame: 0,
        },
        {
          key: "back-card",
          frame: 1,
        },
        {
          key: "back-card",
          frame: 2,
        },
      ],
      // time
      frameRate: 12,
    });
    for (let i = 1; i < this.cardTypes.length; i++) {
      this.anims.create({
        key: "finish-turn-" + this.cardTypes[i],
        frames: [
          {
            key: this.cardTypes[i] + "-card",
            frame: 0,
          },
          {
            key: this.cardTypes[i] + "-card",
            frame: 1,
          },
        ],
        // time
        frameRate: 12,
      });
    }
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
        coins: 30,
        hand: [],
        selected: [false, false, false, false, false],
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
        this.$bus.emit("targetupdate", {
          data: this.strippedGameState(this.gameState.value.users[i].id),
          target: this.gameState.value.users[i].id,
        });
      }
    }
    this.$bus.emit("targetupdate", {
      data: this.gameState.value.data,
      target: this.userData.value.id,
    });
  }
  strippedGameState(user, hand) {
    let i = indexOfUser(user);
    console.log(user);
    console.log(i);
    let strippedCards = [];
    for (let k = 0; k < this.gameState.value.users.length; k++) {
      if (k == i) {
        strippedCards.push({
          id: this.gameState.value.users[i].id,
          coins: 0,
          hand: this.gameState.value.data.users[i].hand,
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
    return strippedCopy;
  }
}
