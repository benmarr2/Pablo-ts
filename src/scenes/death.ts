import Phaser from "phaser";

export default class Death extends Phaser.Scene
{
    constructor()
    {
        super('death')
    }
    create(){
        this.add.text(10, 100, "Ye a gonner", {
        fontSize: "18px",
        fontFamily: "font",
        color: "#eb34cf",
        });
        
        this.cameras.main.fadeOut(3000, 0, 0, 0)

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect)=>{
            this.scene.stop('death');
            this.scene.start('menu');
        })
    }
}