import phaser from "phaser";

export default class preload extends phaser.Scene {
  constructor() {
    super("preload");
  }
  preload() {
    //menu/UI
    this.load.image("menu_bg", "assets/images/menu/title_screen.jpg");
    this.load.image("title", "assets/images/menu/title.png");
    this.load.image("start_btn", "assets/images/menu/start.png");
    this.load.image("heart", "assets/images/menu/heart.png");
    this.load.image("heart_empty", "assets/images/menu/heart_empty.png");
    //pablo
    this.load.atlas(
      "pablo_idle",
      "assets/images/pablo/pablo_idle/pablo_idle.png",
      "assets/images/pablo/pablo_idle/pablo_idle.json"
    );
    this.load.atlas(
      "pablo_run",
      "assets/images/pablo/pablo_run/pablo_run.png",
      "assets/images/pablo/pablo_run/pablo_run.json"
    );
    this.load.atlas(
      "pablo_jump",
      "assets/images/pablo/pablo_jump/pablo_jump.png",
      "assets/images/pablo/pablo_jump/pablo_jump.json"
    );
    this.load.atlas(
      "pablo_fall",
      "assets/images/pablo/pablo_fall/pablo_fall.png",
      "assets/images/pablo/pablo_fall/pablo_fall.json"
    );
    this.load.atlas(
      "pablo_dead",
      "assets/images/pablo/pablo_dead/dead.png",
      "assets/images/pablo/pablo_dead/dead.json"
    );
    this.load.atlas(
      "pablo_hit",
      "assets/images/pablo/pablo_hit/hit.png",
      "assets/images/pablo/pablo_hit/hit.json"
    );
    this.load.atlas(
      "pablo_double_jump",
      "assets/images/pablo/pablo_double_jump/pablo_double_jump.png",
      "assets/images/pablo/pablo_double_jump/pablo_double_jump.json"
    );
    //lvl1
    this.load.tilemapTiledJSON(
      "level1",
      "assets/tilesets/level_1/level_1.json"
    );
    this.load.image(
      "grassland_tiles",
      "assets/tilesets/level_1/grassland.png"
    );
    this.load.image("misc_tiles", "assets/tilesets/level_1/misc.png");
    this.load.image("sky", "assets/images/backgrounds/level_1/sky.png");
    this.load.image("1", "assets/images/backgrounds/level_1/1.png");
    this.load.image("2", "assets/images/backgrounds/level_1/2.png");
    this.load.image("3", "assets/images/backgrounds/level_1/3.png");
    this.load.image("4", "assets/images/backgrounds/level_1/4.png");
    this.load.atlas(
      "strawberry",
      "assets/images/items/strawberry/strawberry.png",
      "assets/images/items/strawberry/strawberry.json"
    );
    this.load.atlas(
      "pineapple",
      "assets/images/items/pineapple/pineapple.png",
      "assets/images/items/pineapple/pineapple.json"
    );
    this.load.atlas(
      "collected",
      "assets/images/items/collected/collected.png",
      "assets/images/items/collected/collected.json"
    );
  }
  create() {
    this.scene.start("menu");
  }
}
