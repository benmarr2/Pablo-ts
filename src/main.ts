import Phaser from "phaser";
import preload from "./scenes/preload";
import menu from "./scenes/menu";
import level1 from "./scenes/level1";
import UI from "./scenes/UI";
import Death from "./scenes/death";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  pixelArt: true,
  physics: {
    default: "matter",
    matter: {
      debug: true,
    },
  },
  scene: [preload, menu, level1, UI, Death],
  scale: {
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
    width: 288,
    height: 208,
  },
};

export default new Phaser.Game(config);
