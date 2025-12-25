import { Scene } from "phaser";
const minigames = import.meta.glob("~/game/scenes/minigames/*.js");
import makeHoverable from "~/game/utils/makeHoverable";
export class SelectGame extends Scene {
  constructor() {
    super("SelectGame");
    this.gameState = useGameState("gameState");
    this.userData = useUserData("userData");
    this.$bus = useNuxtApp().$bus;
  }
  create() {
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);
    this.add.image(0, 192, "menu-background").setOrigin(0, 0);
    this.add.image(0, 150, "dialogue-background1").setOrigin(0, 0);
    for (let i = 0; i < this.gameState.value.users?.length; i++) {
      this.add
        .bitmapText(
          128,
          30 + i * 15,
          "dense",
          "name: " + this.gameState.value.users[i]?.name,
        )
        .setOrigin(0.5, 0);
    }
    const categories = ["action", "puzzle", "table", "variety"];

    const actionGames = ["picture-poker", "bob-omb-blast"];
    const puzzleGames = [];
    const tableGames = [];
    const varietyGames = [];
    let allGames = [actionGames, puzzleGames, tableGames, varietyGames];
    let gamesButtons = [];
    //create thumbnails
    for (let j = 0; j < 4; j++) {
      let e = [];
      for (let i = 0; i < allGames[j].length; i++) {
        // draw thumbnail of game
        let thumb = this.add
          .image(87, 202 + 57 * i, allGames[j][i] + "-thumbnail")
          .setOrigin(0, 0);
        //draw frame of thumbnail
        let frame = this.add
          .image(85, 200 + 57 * i, "thumbnail-frame")
          .setOrigin(0, 0);
        thumb.setInteractive();
        thumb.on("pointerover", () => {
          thumb.setTint("0xfffa05");
        });
        thumb.on("pointerout", () => {
          thumb.clearTint();
        });
        thumb.on("pointerdown", () => {
          if (this.gameState.value.users[0].id == this.userData.value.id) {
            this.gameState.value.data.game = allGames[j][i];

            this.$bus.emit("update", this.gameState.value.data);
          } else {
            this.$bus.emit("action", { type: "setgame", game: allGames[j][i] });
          }
        });
        e.push(thumb, frame);
      }
      gamesButtons.push(e);
    }

    let updateThumbnails = function () {
      for (let i = 0; i < gamesButtons.length; i++) {
        let interactable;
        if (this.userData.value.id == this.gameState.value.data?.turn) {
          interactable = true;
        } else {
          interactable = false;
        }
        for (let j = 0; j < gamesButtons[i].length; j++) {
          gamesButtons[i][j].setVisible(
            categories[i] == this.gameState.value.data?.category,
          );
          //idk what is going on why are some inverted HELP MEEEEEEE
          if (!interactable) {
            gamesButtons[i][j].setInteractive();
          }
        }
      }
    }.bind(this);
    //draw game category buttons
    let categoryButtons = [];
    //create category buttons
    for (let i = 0; i < categories.length; i++) {
      let button = this.add
        .image(0, 144 + 48 * (i + 1), categories[i] + "-games-button")
        .setOrigin(0, 0)
        .setFrame(1);
      makeHoverable(button);
      categoryButtons.push(button);
      button.on("pointerdown", () => {
        if (this.gameState.value.users[0]?.id == this.userData.value.id) {
          this.gameState.value.data.category = categories[i];
          this.$bus.emit("update", this.gameState.value.data);
        } else {
          this.$bus.emit("action", {
            type: "setcategory",
            category: categories[i],
          });
        }
      });
    }
    //sets buttons to interative depending on
    // if they are already selected
    // or they are not the host
    let updateCategories = function () {
      for (let i = 0; i < categoryButtons.length; i++) {
        if (this.gameState.value.data?.category == categories[i]) {
          categoryButtons[i].setFrame(1).disableInteractive();
        } else {
          categoryButtons[i].setFrame(0).setInteractive();
        }
        if (this.gameState.value.data?.turn != this.userData.value.id) {
          categoryButtons[i].disableInteractive();
        }
      }
    }.bind(this);
    //run updates
    updateCategories();
    updateThumbnails();

    let onTry = function (args) {
      if (
        args?.data?.type == "setcategory" &&
        args?.id == this.gameState.value.data?.turn &&
        allGames.find((c) => {
          return c.indexOf(args?.data?.category) != -1;
        })
      ) {
        this.gameState.value.data.category = args.data?.category;
        this.$bus.emit("update", this.gameState.value.data);
      }
      if (
        args.data.type == "setgame" &&
        args.id == this.gameState.value.data?.turn
      ) {
        this.gameState.value.data.game = args.data?.game;
        this.$bus.emit("update", this.gameState.value.data);
      }
    }.bind(this);
    let onGameState = function () {
      updateCategories();
      updateThumbnails();
      if (this.gameState.value.data.game != "SelectGame") {
        minigames[
          `/game/scenes/minigames/${this.gameState.value.data.game
            .replace(/-./g, (match) => match.charAt(1).toUpperCase())
            .replace(/^./, (match) => match.toUpperCase())}.js`
        ]().then((module) => {
          this.scene.add(this.gameState.value.data?.game, module.default);
          this.scene.start(this.gameState.value.data?.game);
        });
      }
    }.bind(this);
    let onError = function () {
      this.scene.start("MainMenu");
    }.bind(this);
    this.$bus.on("gamestate", onGameState);
    this.$bus.on("try", onTry);
    this.$bus.on("error", onError);

    this.events.on("shutdown", () => {
      this.$bus.off("gamestate", onGameState);
      this.$bus.off("try", onTry);
      this.$bus.off("error", onError);
    });
  }
  update() {}
}
