//display "joining room."
// add uuid to list of users in room
// request list of users in specific room, using uuid as authentication
// display all current users, max users, etc.
import makeHoverable from "~/game/utils/makeHoverable";
import { Scene } from "phaser";

//
export class RoomLobby extends Scene {
  constructor() {
    super("RoomLobby");
    this.roomData = useRoomData("roomData");
    this.$bus = useNuxtApp().$bus;
  }
  create() {
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);
    this.add.image(0, 192, "menu-background").setOrigin(0, 0);
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

    this.backButton = this.add.image(232, 360, "back-button");
    makeHoverable(this.backButton);
    this.backButton.on("pointerdown", () => {
      //return to menu
      this.registry.set("minigamesTitle1", this.minigamesTitle1.x);
      this.registry.set("minigamesTitle2", this.minigamesTitle2.x);
      this.scene.start("MainMenu");
    });
    this.$bus.on("newroomdata", () => {
      console.log("new room data");
      console.log(this.roomData.value);
      for (let i = 0; i < this.roomData.value.users.length; i++) {
        this.add.text(100, 200 + i * 34, this.roomData.value.users[i]);
      }
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
}
