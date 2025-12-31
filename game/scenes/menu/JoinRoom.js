import { Scene } from "phaser";
import makeHoverable from "~/game/utils/makeHoverable";
import { UI_CONFIG } from "~/game/constants/constants";
import InputText from "phaser3-rex-plugins/plugins/inputtext.js";
import { useNuxtApp } from "#app";
import { MainMenu } from "../MainMenu";

export class JoinRoom extends Scene {
  constructor() {
    super("JoinRoom");
    this.$bus = useNuxtApp().$bus;
    this.roomList = useRoomList("roomList");
    this.numPages = 1;
    this.currentPage = 1;
    this.selectedRoom = undefined;
    this.startPoll = false;
    this.gameState = useGameState("gameState");
  }

  generateRoomButtons() {
    this.selectedRoom = undefined;
    this.roomButtonsArr.length = 0;
    this.roomButtonsGroup.clear(true, true);
    this.confirmButton.setVisible(true).setFrame(1).disableInteractive();
    this.passwordInput.setVisible(false);
    this.passwordInputBackground.setVisible(false);
    this.passwordInputBackgroundText.setVisible(false);
    this.passwordSubmitButton.setVisible(false);

    if (this.roomList.value.length % 3 == 0) {
      this.numPages = this.roomList.value.length / 3;
    } else {
      this.numPages =
        (this.roomList.value.length - (this.roomList.value.length % 3)) / 3 + 1;
    }

    let numEntries = 3;
    if (
      this.roomList.value.length % 3 != 0 &&
      this.currentPage == this.numPages
    ) {
      numEntries = this.roomList.value.length % 3;
    }
    if (this.roomList.value.length <= 4) {
      this.numPages = 1;
      numEntries = this.roomList.value.length;
      this.currentPage = 1;
      this.decreasePageButton.setVisible(false);
      this.increasePageButton.setVisible(false);
      this.pageNumberTracker.setVisible(false);
      this.pageTextBackground.setVisible(false);
      this.numPagesText.setVisible(false);
    } else {
      this.increasePageButton.setVisible(true);
      this.pageNumberTracker.setVisible(true);
      this.pageTextBackground.setVisible(true);
      this.numPagesText.setVisible(true);
    }
    for (let i = 0; i < numEntries; i++) {
      let roomData = this.roomList.value[i + this.currentPage * 3 - 3];
      let roomKey = roomData?.roomKey;
      let currentUsers = roomData?.currentUsers;
      let hasPassword = !roomData?.password;
      let maxUsers = roomData?.maxUsers;
      let formattedRoomKey;
      if (roomKey.length > 18) {
        formattedRoomKey = roomKey.slice(0, 16) + "...";
      } else {
        formattedRoomKey = roomKey;
      }
      let image = makeHoverable(
        this.add.image(8, 203 + i * 34, "room-button-select").setOrigin(0, 0),
      );
      let name = this.add
        .bitmapText(hasPassword ? 12 : 29, 207 + i * 34, "ds", formattedRoomKey)
        .setOrigin(0, 0);
      let users = this.add
        .bitmapText(205, 208 + i * 34, "ds", currentUsers + "/" + maxUsers)
        .setOrigin(0, 0);
      if (currentUsers == maxUsers) {
        users.setTint(0xffff00);
      }
      let lockIcon = this.add
        .image(12, 206 + i * 34, "lock-icon")
        .setOrigin(0, 0)
        .setVisible(hasPassword ? false : true);

      image.on("pointerover", () => {
        name.setPosition(hasPassword ? 14 : 31, 209 + i * 34);
        users.setPosition(207, 210 + i * 34);
        lockIcon.setPosition(14, 208 + i * 34);
      });
      image.on("pointerdown", () => {
        if (this.selectedRoom == i) {
          console.log(i);
          console.log(this.selectedRoom);
          this.selectedRoom = undefined;
          this.confirmButton.setFrame(1).disableInteractive().setVisible(true);
          name.setText(formattedRoomKey);
          this.passwordInput.setVisible(false);
          this.passwordInputBackground.setVisible(false);
          this.passwordInputBackgroundText.setVisible(false);
          this.passwordSubmitButton.setVisible(false);
        } else {
          this.selectedRoom = i;
          for (let i = 0; i < this.roomButtonsArr.length; i++) {
            let e = this.roomButtonsArr[i];
            e.name.setText(e.formattedRoomKey);
          }
          name.setText("[ " + formattedRoomKey + " ]");
          if (!hasPassword) {
            this.passwordInput.setVisible(true);
            this.passwordInputBackground.setVisible(true);
            this.passwordInputBackgroundText.setVisible(true);
            this.passwordSubmitButton.setVisible(true);
            this.confirmButton.setVisible(false);
          } else {
            this.passwordInput.setVisible(false);
            this.passwordInputBackground.setVisible(false);
            this.passwordInputBackgroundText.setVisible(false);
            this.passwordSubmitButton.setVisible(false);
            this.confirmButton.setFrame(0).setInteractive().setVisible(true);
          }
        }
      });
      image.on("pointerout", () => {
        lockIcon.setPosition(12, 206 + i * 34);
        name.setPosition(hasPassword ? 12 : 29, 207 + i * 34);
        users.setPosition(205, 208 + i * 34);
      });
      this.roomButtonsArr.push({
        lockIcon: lockIcon,
        button: image,
        name: name,
        numUsers: users,
        formattedRoomKey: formattedRoomKey,
        roomKey: roomKey,
        index: i,
      });
      if (currentUsers == maxUsers) {
        image.setFrame(1).disableInteractive();
        name.setPosition(hasPassword ? 14 : 31, 208 + i * 34);
        users.setPosition(207, 210 + i * 34);
        lockIcon.setPosition(14, 208 + i * 34);
      }
      this.roomButtonsGroup.addMultiple([image, name, users, lockIcon]);
    }
    if (this.currentPage > 1) {
      this.decreasePageButton.setVisible(true);
    } else {
      this.decreasePageButton.setVisible(false);
    }
    if (this.currentPage < this.numPages) {
      this.increasePageButton.setVisible(true);
    } else {
      this.increasePageButton.setVisible(false);
    }
    this.pageNumberTracker.setText(this.currentPage + "/" + this.numPages);
  }
  create() {
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);
    this.add.image(0, 192, "menu-background").setOrigin(0, 0);
    this.roomButtonsGroup = this.add.group();
    this.roomButtonsArr = [];

    // scrolling minigames logo
    this.add.image(128, 67, "scroll-strip-background");
    this.add.image(0, 150, "dialogue-background1").setOrigin(0, 0);
    let minigamesTitle1X = this.registry.get("minigamesTitle1");
    let minigamesTitle2X = this.registry.get("minigamesTitle2");

    if (!minigamesTitle1X) {
      minigamesTitle1X = 128;
    }
    if (!minigamesTitle2X) {
      minigamesTitle2X = 380;
    }
    this.minigamesTitle1 = this.add.image(
      minigamesTitle1X,
      68,
      "minigames-rainbow",
    );
    this.minigamesTitle2 = this.add.image(
      minigamesTitle2X,
      68,
      "minigames-rainbow",
    );
    this.add.image(144, 170, "dialogue3");

    // create buttons
    this.backButton = makeHoverable(
      this.add.image(
        UI_CONFIG.BACK_BUTTON_POSITION.x,
        UI_CONFIG.BACK_BUTTON_POSITION.y,
        "back-button",
      ),
    );
    this.confirmButton = makeHoverable(
      this.add.image(
        UI_CONFIG.CONFIRM_BUTTON_POSITION.x,
        360,
        "join-button-confirm",
      ),
    )
      .setFrame(1)
      .disableInteractive();

    this.syncButton = makeHoverable(
      this.add
        .image(
          UI_CONFIG.SYNC_BUTTON_POSITION.x,
          UI_CONFIG.SYNC_BUTTON_POSITION.y,
          "sync-button",
        )
        .setOrigin(0, 0.5),
    );
    // create page navigation buttons
    this.increasePageButton = makeHoverable(
      this.add.image(
        UI_CONFIG.PAGE_NAVIGATION_BUTTONS.INCREASE_PAGE.x,
        UI_CONFIG.PAGE_NAVIGATION_BUTTONS.INCREASE_PAGE.y,
        "right-arrow-button",
      ),
    );
    this.decreasePageButton = makeHoverable(
      this.add
        .image(
          UI_CONFIG.PAGE_NAVIGATION_BUTTONS.DECREASE_PAGE.x,
          UI_CONFIG.PAGE_NAVIGATION_BUTTONS.DECREASE_PAGE.y,
          "left-arrow-button",
        )
        .setVisible(false),
    );
    this.pageTextBackground = this.add.image(
      UI_CONFIG.PAGE_TEXT_BACKGROUND.x,
      UI_CONFIG.PAGE_TEXT_BACKGROUND.y,
      "text-input",
    );
    this.numPagesText = this.add.image(
      UI_CONFIG.NUM_PAGES_TEXT.x,
      UI_CONFIG.NUM_PAGES_TEXT.y,
      "num-pages-text",
    );
    this.pageNumberTracker = this.add.bitmapText(
      UI_CONFIG.PAGE_NUMBER_TRACKER.x,
      UI_CONFIG.PAGE_NUMBER_TRACKER.y,
      "ds",
      this.currentPage + "/" + this.numPages,
    );
    // password stuff
    this.passwordInputBackground = this.add
      .image(
        UI_CONFIG.PASSWORD_INPUT_BACKGROUND.x,
        UI_CONFIG.PASSWORD_INPUT_BACKGROUND.y,
        "text-input",
      )
      .setOrigin(0.5, 0)
      .setVisible(false);
    this.passwordInputBackgroundText = this.add
      .image(
        UI_CONFIG.PASSWORD_INPUT_BACKGROUND_TEXT.x,
        UI_CONFIG.PASSWORD_INPUT_BACKGROUND_TEXT.y,
        "password-text",
      )
      .setOrigin(0.5, 0)
      .setVisible(false);
    this.passwordSubmitButton = makeHoverable(
      this.add.image(
        UI_CONFIG.PASSWORD_SUBMIT_BUTTON.x,
        UI_CONFIG.PASSWORD_SUBMIT_BUTTON.y,
        "right-arrow-button",
      ),
    ).setVisible(false);
    this.passwordInput = new InputText(
      this,
      UI_CONFIG.PASSWORD_INPUT_BACKGROUND.x,
      UI_CONFIG.PASSWORD_INPUT_BACKGROUND.y + 18,
      125,
      35,
      {
        x: 0,
        y: 0,
        width: undefined,
        height: undefined,

        type: "text", // 'text'|'password'|'textarea'|'number'|'color'|...

        // Element properties
        id: "newRoomName",
        text: undefined,
        maxLength: undefined,
        minLength: undefined,
        placeholder: undefined,
        tooltip: undefined,
        readOnly: false,
        spellCheck: false,
        autoComplete: "off",

        // Style properties
        align: "center",
        paddingLeft: undefined,
        paddingRight: undefined,
        paddingTop: undefined,
        paddingBottom: undefined,
        fontFamily: undefined,
        fontSize: undefined,
        color: "#ffffff",
        border: 0,
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderRadius: undefined,
        outline: "none",
        direction: "ltr",

        selectAll: false,
      },
    );
    this.add.existing(this.passwordInput);

    //set click callbacks
    this.backButton.on("pointerdown", () => {
      this.registry.set("minigamesTitle1", this.minigamesTitle1.x);
      this.registry.set("minigamesTitle2", this.minigamesTitle2.x);
      this.scene.start("MainMenu");
      this.scene.stop();
    });
    this.increasePageButton.on("pointerdown", () => {
      this.passwordInput.setVisible(false);
      this.passwordInputBackground.setVisible(false);
      this.passwordInputBackgroundText.setVisible(false);
      this.passwordSubmitButton.setVisible(false);
      this.confirmButton.setVisible(true);

      if (this.currentPage < this.numPages) {
        this.currentPage++;
        this.generateRoomButtons();
      }
    });
    this.decreasePageButton.on("pointerdown", () => {
      this.passwordInput.setVisible(false);
      this.passwordInputBackground.setVisible(false);
      this.passwordInputBackgroundText.setVisible(false);
      this.passwordSubmitButton.setVisible(false);
      this.confirmButton.setVisible(true);
      if (this.currentPage > 1) {
        this.currentPage--;
        this.generateRoomButtons();
      }
    });
    this.confirmButton.on("pointerdown", () => {
      console.log(this.roomList);
      console.log(this.roomButtonsArr);
      console.log(this.selectedRoom);
      if (this.selectedRoom != undefined) {
        this.$bus.emit("joinroom", {
          roomKey: this.roomButtonsArr[this.selectedRoom].roomKey,
        });
      }
    });
    this.passwordSubmitButton.on("pointerdown", () => {
      console.log(this.roomList);
      console.log(this.roomButtonsArr);
      console.log(this.selectedRoom);
      if (this.selectedRoom != undefined) {
        this.$bus.emit("joinroom", {
          roomKey: this.roomButtonsArr[this.selectedRoom].roomKey,
          password: this.passwordInput.text,
        });
      }
    });
    this.syncButton.on("pointerdown", () => {
      this.passwordInput.setVisible(false);
      this.passwordInputBackground.setVisible(false);
      this.passwordInputBackgroundText.setVisible(false);
      this.passwordSubmitButton.setVisible(false);
      this.confirmButton.setFrame(1).setVisible(true).disableInteractive();
      this.generateRoomButtons();
      this.$bus.emit("refreshrooms");
    });
    // refresh room list
    this.$bus.emit("refreshrooms");
    this.currentPage = 1;

    //generate buttons
    this.generateRoomButtons();

    let onNewRoomList = function () {
      this.generateRoomButtons();
    }.bind(this);
    let onError = function (args) {
      if (args.reason == "disconnect") {
        this.scene.wake("Error");
        this.scene.start("MainMenu");
      }
      if (args.reason == "incorrect") {
        this.scene.wake("Error");
      }
      if (args.reason == "room-full") {
        this.passwordInput.setVisible(false);
        this.passwordInputBackground.setVisible(false);
        this.passwordInputBackgroundText.setVisible(false);
        this.passwordSubmitButton.setVisible(false);
        this.confirmButton.setFrame(1).setVisible(true).disableInteractive();
        this.generateRoomButtons();
        this.$bus.emit("refreshrooms");
        this.scene.wake("Error");
      }
    }.bind(this);
    let onGameState = function () {
      this.registry.set("minigamesTitle1", this.minigamesTitle1.x);
      this.registry.set("minigamesTitle2", this.minigamesTitle2.x);
      this.scene.start("RoomLobby");
    }.bind(this);
    this.$bus.on("gamestate", onGameState);
    this.$bus.on("error", onError);
    this.$bus.on("newroomlist", onNewRoomList);

    this.events.on("shutdown", () => {
      this.$bus.off("gamestate", onGameState);
      this.$bus.off("error", onError);
      this.$bus.off("newroomlist", onNewRoomList);
    });
  }
  update() {
    //scroll minigames logo
    this.minigamesTitle1.setX(this.minigamesTitle1.x + -0.5);
    this.minigamesTitle2.setX(this.minigamesTitle2.x + -0.5);
    if (this.minigamesTitle2.x < -128) {
      this.minigamesTitle2.setX(380);
    }
    if (this.minigamesTitle1.x < -128) {
      this.minigamesTitle1.setX(380);
    }
  }
}
