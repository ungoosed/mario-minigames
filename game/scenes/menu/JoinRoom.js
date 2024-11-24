import { Scene } from "phaser";
import makeHoverable from "~/game/utils/makeHoverable";
import { useNuxtApp } from "#app";
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
    this.roomButtonsArr.length = 0;
    this.roomButtonsGroup.clear(true, true);

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
      let roomKey = this.roomList.value[i + this.currentPage * 3 - 3]?.roomKey;
      let formattedRoomKey;
      if (roomKey.length > 18) {
        formattedRoomKey = roomKey.slice(0, 16) + " ...";
      } else {
        formattedRoomKey = roomKey;
      }
      let image = makeHoverable(
        this.add.image(8, 203 + i * 34, "room-button-select").setOrigin(0, 0),
      );
      let name = this.add
        .bitmapText(12, 207 + i * 34, "ds", formattedRoomKey)
        .setOrigin(0, 0);
      let users = this.add
        .bitmapText(
          205,
          208 + i * 34,
          "ds",
          this.roomList.value[i + this.currentPage * 3 - 3].currentUsers +
            "/" +
            this.roomList.value[i + this.currentPage * 3 - 3].maxUsers,
        )
        .setOrigin(0, 0);

      image.on("pointerover", () => {
        name.setPosition(14, 208 + i * 34);
        users.setPosition(207, 210 + i * 34);
      });
      image.on("pointerdown", () => {
        if (this.selectedRoom == i) {
          this.selectedRoom = undefined;
          name.setText(formattedRoomKey);
        } else {
          this.selectedRoom = i;
          for (let i = 0; i < this.roomButtonsArr.length; i++) {
            let e = this.roomButtonsArr[i];
            e.name.setText(e.formattedRoomKey);
          }
          name.setText("[ " + formattedRoomKey + " ]");
        }
      });
      image.on("pointerout", () => {
        name.setPosition(12, 206 + i * 34);
        users.setPosition(205, 208 + i * 34);
      });
      this.roomButtonsArr.push({
        button: image,
        name: name,
        numUsers: users,
        formattedRoomKey: formattedRoomKey,
        roomKey: roomKey,
        index: i,
      });
      this.roomButtonsGroup.addMultiple([image, name, users]);
    }

    this.pageNumberTracker.setText(this.currentPage + "/" + this.numPages);
  }
  onNewRoomList() {
    return () => {
      this.generateRoomButtons();
    };
  }
  create() {
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);
    this.add.image(0, 192, "menu-background").setOrigin(0, 0);
    this.roomButtonsGroup = this.add.group();
    this.roomButtonsArr = [];
    this.$bus.on("newroomlist", this.onNewRoomList());

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
    this.backButton = makeHoverable(this.add.image(232, 360, "back-button"));
    this.confirmButton = makeHoverable(
      this.add.image(128, 358, "join-button-confirm"),
    );
    this.syncButton = makeHoverable(
      this.add.image(6, 358, "sync-button").setOrigin(0, 0.5),
    );
    // create page navigation buttons
    this.increasePageButton = makeHoverable(
      this.add.image(205, 320, "right-arrow-button"),
    );
    this.decreasePageButton = makeHoverable(
      this.add.image(48, 320, "left-arrow-button").setVisible(false),
    );
    this.pageTextBackground = this.add.image(128, 320, "text-input");
    this.numPagesText = this.add.image(112, 322, "num-pages-text");
    this.pageNumberTracker = this.add.bitmapText(
      143,
      314,
      "ds",
      this.currentPage + "/" + this.numPages,
    );
    //set click callbacks
    this.backButton.on("pointerdown", () => {
      this.registry.set("minigamesTitle1", this.minigamesTitle1.x);
      this.registry.set("minigamesTitle2", this.minigamesTitle2.x);
      this.scene.start("MainMenu");
    });
    this.increasePageButton.on("pointerdown", () => {
      if (this.currentPage < this.numPages) {
        this.currentPage++;
        this.generateRoomButtons();
        if (this.currentPage > 1) {
          this.decreasePageButton.setVisible(true);
        }
        if (this.currentPage == this.numPages) {
          this.increasePageButton.setVisible(false);
        }
      }
    });
    this.decreasePageButton.on("pointerdown", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.generateRoomButtons();
        if (this.currentPage == 1) {
          this.decreasePageButton.setVisible(false);
        }
        if (this.currentPage < this.numPages) {
          this.increasePageButton.setVisible(true);
        }
      }
    });
    this.confirmButton.on("pointerdown", () => {
      if (this.selectedRoom != undefined) {
        this.$bus.emit("joinroom", {
          roomKey: this.roomButtonsArr[this.selectedRoom].roomKey,
        });
      }
    });
    this.syncButton.on("pointerdown", () => {
      this.$bus.emit("refreshrooms");
    });
    // refresh room list
    this.$bus.emit("refreshrooms");
    this.currentPage = 1;

    //generate buttons
    this.generateRoomButtons();
    this.$bus.on("gamestate", () => {
      this.registry.set("minigamesTitle1", this.minigamesTitle1.x);
      this.registry.set("minigamesTitle2", this.minigamesTitle2.x);
      this.scene.start("RoomLobby");
    });
  }

  update() {
    this.minigamesTitle1.setX(this.minigamesTitle1.x + -0.5);
    this.minigamesTitle2.setX(this.minigamesTitle2.x + -0.5);
    if (this.minigamesTitle2.x < -128) {
      this.minigamesTitle2.setX(380);
    }
    if (this.minigamesTitle1.x < -128) {
      this.minigamesTitle1.setX(380);
    }
  }
  onShutdown() {
    this.$bus.off("newroomlist", this.onNewRoomList());
  }
}
