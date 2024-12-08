// config: {
// title:,
// description:,
// inputs: [],
// onStart():

import makeHoverable from "./makeHoverable";

// }
export default function generateMenu(scene, config, onStart) {
  const menu = scene.add.group(
    [
      scene.add.image(0, 0, "menu-background").setOrigin(0, 0),
      scene.add.image(0, 192, "menu-background").setOrigin(0, 0),
      scene.add.image(0, 7, "title-background").setOrigin(0, 0),
      scene.add.bitmapText(128, 10, "dense", config.title),
      scene.add.image(3, 37, "dialogue-background3").setOrigin(0, 0),
      scene.add.bitmapText(30, 50, "dense", config.description),
    ],
    {},
  );
  const obj = { inputs: [] };
  const labels = [];
  const interactive = scene.add.group();
  for (let i = 0; i < config.inputs.length; i++) {
    if (config.inputs[i].type == "picker") {
      let background = scene.add.image(128, 230 + i * 30, "text-input");
      let left = scene.add
        .image(49, 230 + i * 30, "left-arrow-button")
        .setVisible(false);
      makeHoverable(left);
      let right = scene.add.image(205, 230 + i * 30, "right-arrow-button");
      makeHoverable(right);

      obj["inputs"][i] = 0;
      let label = scene.add
        .bitmapText(128, 230 + i * 30, "ds")
        .setOrigin(0.5, 0.5)
        .setText(config.inputs[i].labels[obj["inputs"][i]]);
      labels.push(label);
      left.on("pointerdown", () => {
        if (obj["inputs"][i] > 0) {
          obj["inputs"][i]--;
          label.setText(config.inputs[i].labels[obj["inputs"][i]]);
          right.setVisible(true);
        }
        if (obj["inputs"][i] == 0) {
          left.setVisible(false);
        }
        config.inputs[i].update();
      });
      right.on("pointerdown", () => {
        if (obj["inputs"][i] <= config.inputs[i].labels.length - 1) {
          obj["inputs"][i]++;
          label.setText(config.inputs[i].labels[obj["inputs"][i]]);
          left.setVisible(true);
        }
        if (obj["inputs"][i] >= config.inputs[i].labels.length - 1) {
          right.setVisible(false);
        }
        config.inputs[i].update();
      });
      menu.addMultiple([label, background]);
      interactive.addMultiple([left, right]);
    }
  }
  obj.set = (inputIndex, labelIndex) => {
    labels[inputIndex].setText(config.inputs[inputIndex].labels[labelIndex]);
  };

  let start = makeHoverable(
    scene.add.image(128, 355, "start-button").on("pointerdown", onStart),
  );
  interactive.add(start);
  obj.start = start;
  obj.disableInput = () => {
    let objects = interactive.getChildren();
    for (let i = 0; i < objects.length; i++) {
      objects[i].disableInteractive().setFrame(1);
    }
  };
  obj.enableInput = () => {
    let objects = interactive.getChildren();
    for (let i = 0; i < objects.length; i++) {
      objects[i].setInteractive();
    }
  };
  obj.hide = () => {
    interactive.setVisible(false);
    menu.setVisible(false);
  };
  obj.show = () => {
    interactive.setVisible(true);
    menu.setVisible(true);
  };

  //returns {
  // setVisible()  let obj = { menu: menu };

  //
  //}
  return obj;
}
