export default function loadAssets(scene, assets) {
  let keys = Object.keys(assets);
  let paths = Object.values(assets);
  for (let i = 0; i < keys.length; i++) {
    if (!scene.textures.exists(keys[i])) {
      scene.load.image(keys[i], paths[i]);
    }
  }
}
