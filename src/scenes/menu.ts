import phaser from "phaser";

export default class preload extends phaser.Scene {
  startBtn!: phaser.GameObjects.Image;

  constructor() {
    super("menu");
  }

  create() {
    //Draw images
    this.add.image(0, 0, "menu_bg").setOrigin(0).setScale(1.15);
    this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height * 0.2,
        "title"
      )
      .setScale(1);

    this.startBtn = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height * 0.5,
        "start_btn"
      )
      .setScale(0.7)
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        this.scene.start("level1");
      });
  }
}
