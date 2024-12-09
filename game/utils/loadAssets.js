export default function loadAssets(scene, assets) {
  let imageKeys = Object.keys(assets.images);
  let imagePaths = Object.values(assets.images);
  for (let i = 0; i < imageKeys.length; i++) {
    if (!scene.textures.exists(imageKeys[i])) {
      scene.load.image(imageKeys[i], imagePaths[i]);
    }
  }
  let ssKeys = Object.keys(assets.spritesheets);
  let ssExtra = Object.values(assets.spritesheets);
  for (let i = 0; i < ssKeys.length; i++) {
    if (!scene.textures.exists(ssKeys[i])) {
      scene.load.spritesheet(ssKeys[i], ssExtra[i].url, ssExtra[i].config);
    }
  }
}
