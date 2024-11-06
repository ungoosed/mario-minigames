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
  }
  generateRoomButtons() {
    this.roomButtonsArr.length = 1;
    this.roomButtonsGroup.clear(true, true);
    if (this.roomList.value.length <= 4) {
      this.numPages = 1;
      this.currentPage = 1;
      this.decreasePageButton.setVisible(false);
      this.increasePageButton.setVisible(false);
      this.pageNumberTracker.setVisible(false);
      this.pageTextBackground.setVisible(false);
      this.numPagesText.setVisible(false);

      for (let i = 0; i < this.roomList.value.length; i++) {
        let image = makeHoverable(
          this.add.image(8, 203 + i * 34, "room-button-select").setOrigin(0, 0),
        );
        let name = this.add
          .text(12, 206 + i * 34, this.roomList.value[i].roomKey)
          .setOrigin(0, 0);
        let users = this.add
          .text(207, 206 + i * 34, "1" + "/" + this.roomList.value[i].maxUsers)
          .setOrigin(0, 0);
        image.on("pointerover", () => {
          name.setPosition(14, 208 + i * 34);
          users.setPosition(209, 208 + i * 34);
        });
        image.on("pointerout", () => {
          name.setPosition(12, 206 + i * 34);

          users.setPosition(207, 206 + i * 34);
        });
        this.roomButtonsArr.push({
          button: image,
          name: name,
          numUsers: users,
        });
        this.roomButtonsGroup.addMultiple([image, name, users]);
      }
    } else {
      this.increasePageButton.setVisible(true);
      this.pageNumberTracker.setVisible(true);
      this.pageTextBackground.setVisible(true);
      this.numPagesText.setVisible(true);
      if (this.roomList.value.length % 3 == 0) {
        this.numPages = this.roomList.value.length / 3;
      } else {
        this.numPages =
          (this.roomList.value.length - (this.roomList.value.length % 3)) / 3 +
          1;
      }

      let numEntries = 3;
      if (
        this.roomList.value.length % 3 != 0 &&
        this.currentPage == this.numPages
      ) {
        numEntries = this.roomList.value.length % 3;
      }
      for (let i = 0; i < numEntries; i++) {
        let image = makeHoverable(
          this.add.image(8, 203 + i * 34, "room-button-select").setOrigin(0, 0),
        );
        let name = this.add
          .text(
            12,
            206 + i * 34,
            this.roomList.value[i + this.currentPage * 3 - 3]?.roomKey,
          )
          .setOrigin(0, 0);
        let users = this.add
          .text(
            207,
            206 + i * 34,
            "0" +
              "/" +
              this.roomList.value[i + this.currentPage * 3 - 3]?.maxUsers,
          )
          .setOrigin(0, 0);
        image.on("pointerover", () => {
          name.setPosition(14, 208 + i * 34);
          users.setPosition(209, 208 + i * 34);
        });
        image.on("pointerout", () => {
          name.setPosition(12, 206 + i * 34);

          users.setPosition(207, 206 + i * 34);
        });
        this.roomButtonsArr.push({
          button: image,
          name: name,
          numUsers: users,
        });
        this.roomButtonsGroup.addMultiple([image, name, users]);
      }
    }
    this.pageNumberTracker.setText(this.currentPage + "/" + this.numPages);
  }
  create() {
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);
    this.add.image(0, 192, "menu-background").setOrigin(0, 0);
    this.roomButtonsGroup = this.add.group();
    this.roomButtonsArr = [];

    // generate roomButtons based off of roomList
    this.$bus.on("newroomlist", () => {
      this.generateRoomButtons();
    });
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
    this.numPagesText = this.add.image(102, 322, "num-pages-text");
    this.pageNumberTracker = this.add.text(
      128,
      312,
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
    this.syncButton.on("pointerdown", () => {
      this.$bus.emit("refreshrooms");
    });
    // refresh room list
    this.$bus.emit("refreshrooms");
    //create buttopns
    this.currentPage = 1;

    this.generateRoomButtons();
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
}
