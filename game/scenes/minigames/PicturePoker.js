import { Scene } from "phaser";
import generateHand from "~/game/utils/generateHand";
import generateMenu from "~/game/utils/generateMenu";
import indexOfUser from "~/game/utils/indexOfUser";
import loadAssets from "~/game/utils/loadAssets";
import makeHoverable from "~/game/utils/makeHoverable";
export default class PicturePoker extends Scene {
  constructor() {
    super("picture-poker");
    this.gameState = useGameState("gameState");
    this.userData = useUserData("userData");
    this.$bus = useNuxtApp().$bus;
    this.hands = [];
    this.coins = [];
    this.assets = {
      images: {
        "casino-background": "assets/minigames/table/casino-background.png",
        coin: "assets/minigames/table/coin.png",
      },
      spritesheets: {
        "hand-type-text": {
          url: "assets/minigames/table/hand-type-text.png",
          config: {
            frameWidth: 110,
            frameHeight: 15,
          },
        },
        "hold-draw-button": {
          url: "assets/minigames/table/hold-draw-button.png",
          config: {
            frameWidth: 144,
            frameHeight: 32,
          },
        },
      },
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
        .setRotation(Math.PI)
        .setDepth(-1);
      this.add.image(0, 192, "casino-background").setOrigin(0, 0).setDepth(-1);
      let numOpps = 0;
      for (let i = 0; i < this.gameState.value.users.length; i++) {
        let y =
          this.gameState.value.users[i].id == this.userData.value.id
            ? 200
            : 180 - numOpps++ * 40;

        let text = this.add
          .bitmapText(15, y, "ds", "30")
          .setOrigin(0, 0)
          .setTint(0xffff00);
        let coin = this.add.image(15, 200, "coin");
        this.coins.push({ object: text });
      }

      this.turnStatus = this.add.bitmapText(128, 280, "ds").setOrigin(0.5, 0.5);
      //draw button
      this.drawButton = this.add
        .image(128, 230, "hold-draw-button")
        .setInteractive();
      this.drawButton.on("pointerdown", () => {
        let selectedCards = [];
        for (
          let i = 0;
          i < this.hands[indexOfUser(this.userData.value.id)].objects.length;
          i++
        ) {
          selectedCards.push(
            this.hands[indexOfUser(this.userData.value.id)].objects[i].getData(
              "selected",
            ),
          );
          this.hands[indexOfUser(this.userData.value.id)].objects[i].setData(
            "selected",
            false,
          );
        }
        this.$bus.emit("action", {
          type: "draw",
          selected: selectedCards,
        });
      });
      this.drawIndicators();
      this.createGlobalAnims();
    });
    let maskGraphic = this.make.graphics();
    maskGraphic.fillRect(0, 192, 256, 192);
    maskGraphic.fillStyle(0xffffff);
    this.upperScreenMask = maskGraphic.createGeometryMask();

    let onGameState = function () {
      if (this.gameState.value.data.round > 0) {
        //when game has started
        //loop over each user
        let opponentCount = 0;
        for (let i = 0; i < this.gameState.value.data.users.length; i++) {
          let buffer = () => {
            setTimeout(() => {
              this.coins[i].object.text = Number(this.coins[i].object.text) + 1;
              if (
                this.gameState.value.data.users[i].coins !=
                this.coins[i].object.text
              ) {
                buffer();
              }
            }, 50);
          };

          if (this.gameState.value.users[i].id == this.userData.value.id) {
            if (!this.hands[i]) {
              this.hands[i] = this.drawCards(
                67,
                345,
                this.gameState.value.data.users[i].hand,
                false,
                true,
              );
            } else {
              //update own hand
              let oldHand = [];
              for (let k = 0; k < 5; k++) {
                oldHand.push(
                  this.cardTypes.indexOf(
                    this.hands[i].objects[k].getData("type"),
                  ),
                );
              }
              if (
                JSON.stringify(oldHand) !=
                JSON.stringify(this.gameState.value.data.users[i].hand)
              )
                this.hands[i].replace(
                  oldHand,
                  this.gameState.value.data.users[i].hand,
                  this.gameState.value.data.users[i].drawn,
                );
            }
          } else {
            if (!this.hands[i]) {
              this.hands[i] = this.drawCards(
                100,
                150 - opponentCount * 50,
                [0, 0, 0, 0, 0],
                true,
              );
              opponentCount++;
            } else {
              // this.hands[i].reveal(this.gameState.value.data.users[i].hand);
            }
          }
          if (
            this.gameState.value.data.users[i].selected &&
            this.hands[i] &&
            this.gameState.value.users[i].id != this.userData.value.id
          ) {
            this.hands[i].setSelected(
              this.gameState.value.data.users[i].selected,
            );
          }
        }
        if (this.gameState.value.data.turn == this.userData.value.id) {
          this.drawButton.setVisible(true);
          this.turnStatus.setText("It's your turn.");
        } else {
          this.drawButton.setVisible(false);
          this.turnStatus.setText(
            "It's " +
              this.gameState.value.users[
                indexOfUser(this.gameState.value.data.turn)
              ].name +
              "'s turn.",
          );
        }
        if (
          this.gameState.value.data?.users[
            indexOfUser(this.userData.value.id)
          ]?.selected?.includes(true)
        ) {
          this.drawButton.setFrame(1);
        } else {
          this.drawButton.setFrame(0);
        }
      }
    }.bind(this);
    let onTry = function (args) {
      console.log(args);
      // only update when it is their turn
      if (args.id == this.gameState.value.data.turn) {
        let userIndex = indexOfUser(args.id);
        if (args.data.type == "select") {
          console.log("sending");
          console.log(userIndex);

          this.gameState.value.data.users[userIndex].selected[args.data.card] =
            true;
          this.broadcastStrippedGameState();
        }
        if (args.data.type == "deselect") {
          this.gameState.value.data.users[userIndex].selected[args.data.card] =
            false;
          this.broadcastStrippedGameState();
        }
        if (args.data.type == "draw") {
          let userIndex = indexOfUser(args.id);
          for (let i = 0; i < args.data.selected.length; i++) {
            if (args.data.selected[i]) {
              this.gameState.value.data.users[userIndex].hand[i] =
                Math.floor(Math.random() * 6) + 1;
            }
          }
          this.gameState.value.data.users[userIndex].drawn = args.data.selected;
          this.gameState.value.data.users[userIndex].selected = [
            false,
            false,
            false,
            false,
            false,
          ];
          this.gameState.value.data.users[userIndex].coins += 100;
          let nextTurn =
            this.gameState.value.users[indexOfUser(args.id) + 1]?.id;
          if (nextTurn) {
            this.gameState.value.data.turn = nextTurn;
          } else {
            this.gameState.value.data.turn = this.gameState.value.users[0].id;
          }
          this.broadcastStrippedGameState();
          for (let i = 0; i < this.gameState.value.users.length; i++) {
            this.gameState.value.data.users[i].drawn = [];
          }
        }
      }
    }.bind(this);
    this.$bus.on("try", onTry);
    this.$bus.on("gamestate", onGameState);
  }
  drawCards(x, y, cards, noMargin, onBottom) {
    console.log("drawCards");
    let cardObjects = [];
    for (let i = 0; i < cards.length; i++) {
      let interactiveCard = this.add.sprite(
        128,
        192,
        this.cardTypes[cards[i]] + "-card",
      );
      if (onBottom) {
        interactiveCard.setMask(this.upperScreenMask);
      }
      if (!(cards[i] == 0)) {
        // animations
        interactiveCard.play("begin-turn");
        interactiveCard.chain("finish-turn-" + this.cardTypes[cards[i]]);
        interactiveCard
          .setInteractive()
          .setFrame(1)
          .setData("type", this.cardTypes[cards[i]])
          .setData("selected", false);
        this.tweens.add({
          targets: interactiveCard, // The sprite to move
          x: x + i * (noMargin ? 32 : 40), // The destination x-coordinate
          y: y, // The destination y-coordinate
          ease: "Linear", // Easing function
          duration: 200, // Duration in milliseconds
        });
        interactiveCard.on("pointerdown", () => {
          if (this.gameState.value.data.turn == this.userData.value.id) {
            if (interactiveCard.getData("selected")) {
              interactiveCard.setData("selected", false);
              this.tweens.add({
                targets: interactiveCard, // The sprite to move
                x: x + i * (noMargin ? 32 : 40), // The destination x-coordinate
                y: y, // The destination y-coordinate
                ease: "Power1", // Easing function
                duration: 200, // Duration in milliseconds
              });
              this.$bus.emit("action", { type: "deselect", card: i });
            } else {
              interactiveCard.setData("selected", true);
              this.tweens.add({
                targets: interactiveCard, // The sprite to move
                x: x + i * (noMargin ? 32 : 40), // The destination x-coordinate
                y: y - 20, // The destination y-coordinate
                ease: "Power1", // Easing function
                duration: 200, // Duration in milliseconds
              });
              this.$bus.emit("action", { type: "select", card: i });
            }
          }
        });
      } else {
        interactiveCard.setFrame(0);
      }
      cardObjects.push(interactiveCard);
    }
    return {
      objects: cardObjects,
      setSelected: (hand) => {
        console.log("SetSelected");
        for (let i = 0; i < hand.length; i++) {
          cardObjects[i].setData("selected", hand[i]);
          this.tweens.add({
            targets: cardObjects[i], // The sprite to move
            x: x + i * (noMargin ? 32 : 40), // The destination x-coordinate
            y: y - (hand[i] ? 20 : 0), // The destination y-coordinate
            ease: "Power1", // Easing function
            duration: 200, // Duration in milliseconds
          });
        }
      },
      reveal: (hand) => {
        for (let i = 0; i < hand.length; i++) {
          if (hand[i] != -1) {
            cardObjects[i].anims.play("begin-turn");
            cardObjects[i].chain("finish-turn-" + this.cardTypes[hand[i]]);
          }
        }
      },
      replace: (hand, newHand, drawn) => {
        let cardsAnimated = 0;
        for (let i = 0; i < hand.length; i++) {
          let delay = 200 + cardsAnimated * 300;
          if (drawn[i]) {
            cardObjects[i].anims.playReverse(
              "finish-turn-" + this.cardTypes[hand[i]],
            );
            setTimeout(() => {
              cardObjects[i].anims.playReverse("begin-turn");
              this.tweens.add({
                targets: cardObjects[i], // The sprite to move
                x: x + i * (noMargin ? 32 : 40), // The destination x-coordinate
                y: y - 200, // The destination y-coordinate
                ease: "Linear", // Easing function
                duration: 400, // Duration in milliseconds
                onComplete: () => {
                  cardObjects[i].setPosition(128, y - 200);
                  cardObjects[i].setTexture("back-card", 0);
                  setTimeout(() => {
                    this.tweens.add({
                      targets: cardObjects[i], // The sprite to move
                      x: x + i * (noMargin ? 32 : 40), // The destination x-coordinate
                      y: y, // The destination y-coordinate
                      ease: "Linear", // Easing function
                      duration: 300, // Duration in milliseconds
                      onComplete: () => {
                        cardObjects[i].anims.play("begin-turn");
                        cardObjects[i].anims.chain(
                          "finish-turn-" + this.cardTypes[newHand[i]],
                        );
                      },
                    });
                  }, delay);
                },
              });
            }, 200);

            cardObjects[i].setData("type", this.cardTypes[newHand[i]]);
            cardsAnimated++;
          }
        }
      },
    };
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
        drawn: [],
      });
    }
  }
  dealCards() {
    for (let i = 0; i < this.gameState.value.users.length; i++) {
      let hand = generateHand();
      this.gameState.value.data.users[i].hand = hand;
      // if client is not host
    }
    this.broadcastStrippedGameState();
  }
  strippedGameState(user) {
    let i = indexOfUser(user);
    let strippedCopy = structuredClone(toRaw(this.gameState.value.data));
    for (let k = 0; k < this.gameState.value.users.length; k++) {
      if (k == i) {
        strippedCopy.users[i].hand = this.gameState.value.data.users[k].hand;
      } else {
        strippedCopy.users[k].hand = [0, 0, 0, 0, 0];
      }
    }
    return strippedCopy;
  }
  broadcastStrippedGameState() {
    for (let i = 1; i < this.gameState.value.users.length; i++) {
      // send targeted update to everyone but the host
      let strippedState = this.strippedGameState(
        this.gameState.value.users[i].id,
      );
      console.log(strippedState);
      console.log(this.gameState.value.users[i].id);
      this.$bus.emit("targetupdate", {
        data: strippedState,
        target: this.gameState.value.users[i].id,
      });
    }
    //send full game data to self (host) also to trigger stuff, prob not as efficient as it could be but whatever
    this.$bus.emit("targetupdate", {
      data: this.gameState.value.data,
      target: this.userData.value.id,
    });
  }
  drawIndicators() {
    let indicators = [];
    let flash = (index) => {
      indicators[index].play("flash");
    };
    for (let i = 1; i < 7; i++) {
      let indicator = this.add
        .sprite(
          10,
          370 - i * 16 + (i == 6 ? 1 : 0),
          this.cardTypes[i] + "-indicator",
        )
        .setOrigin(0, 0);
      indicators.push(indicator);
      indicator.anims.create({
        key: "flash",
        frames: [
          {
            key: this.cardTypes[i] + "-indicator",
            frame: 1,
          },
          {
            key: this.cardTypes[i] + "-indicator",
            frame: 0,
          },
        ],
        repeat: 6,
        frameRate: 8,
      });
      indicator.setInteractive();
      indicator.on("pointerdown", () => {
        flash(i - 1);
      });
    }
    return {
      objects: indicators,
      flash: flash,
    };
  }
}
