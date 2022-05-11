import Phaser from "phaser";
import { eventEmitter as events } from "../util/eventcenter";

export default class UI extends Phaser.Scene {
  private strawberryCount!: Phaser.GameObjects.Text;
  private strawberriesCollected = 0;

  private hearts!: Phaser.GameObjects.Group;

  constructor() {
    super({
      key: "UI",
    });
  }

  init() {
    this.strawberriesCollected = 0;
  }

  create() {
    //STRAWB
    events.on("strawberry_collected", this.handleStrawberry, this);
    events.on("hit", this.handleHit, this);
    events.on("pineapple_collected", this.handleHealthGain, this);
    events.on("death", this.handleDeath, this)

    this.strawberryCount = this.add.text(200, 10, "Score: 0", {
      fontSize: "8px",
      fontFamily: "font",
      color: "#eb34cf",
    });

    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      events.off("strawberry_collected", this.handleStrawberry, this);
    });

    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    });

    this.hearts.createMultiple({
      key: "heart",
      setXY: {
        x: 12,
        y: 17,
        stepX: 22,
      },
      quantity: 2,
    });
  }

  private handleStrawberry() {
    this.strawberriesCollected++;
    this.strawberryCount.text = `Score: ${this.strawberriesCollected*10} `;
  }

  private handleHit(health: number) {
    this.hearts.children.each((go, idx) => {
      const heart = go as Phaser.GameObjects.Image;
      if (idx <= health) {
        heart.setTexture("heart");
      } else {
        heart.setTexture("heart_empty");
      }
    });
    console.log("hit");
  }

  private handleHealthGain() {
    this.hearts.children.each((go) => {
      const heart = go as Phaser.GameObjects.Image;
      heart.setTexture("heart");
    });
  }

  private handleDeath(){
    this.strawberriesCollected = 0;
    console.log(this.strawberriesCollected)
    console.log("hi")
  }
}
