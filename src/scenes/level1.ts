import Phaser from 'phaser'
import playerController from './states/player_controller'
import ObstaclesController from './obstacles_controller'

export default class level1 extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    private pablo !: Phaser.Physics.Matter.Sprite
    // private strawberry !: Phaser.Physics.Matter.Sprite
    private playerController?: playerController
    private obstacles!: ObstaclesController



    sky!: Phaser.GameObjects.TileSprite
    layer1!: Phaser.GameObjects.TileSprite
    layer2!: Phaser.GameObjects.TileSprite
    layer3!: Phaser.GameObjects.TileSprite
    layer4!: Phaser.GameObjects.TileSprite

    strawberry!: Phaser.Physics.Matter.Sprite
    pineapple!: Phaser.Physics.Matter.Sprite
    

    constructor() {
        super('level1')
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.obstacles = new ObstaclesController()
    }

    create() {
        // const { width, height } = this.scale

        this.scene.launch('UI')
        //background
        this.sky = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'sky').setScale(2, 2).setOrigin(0, 0)
        this.layer1 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, '4').setScale(2, 2).setOrigin(0, 0)
        this.layer2 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, '3').setScale(2, 2).setOrigin(0, 0)
        this.layer3 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, '2').setScale(2, 2).setOrigin(0, 0)
        this.layer4 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, '1').setScale(2, 2).setOrigin(0, 0)
        //tilemap
        const map = this.make.tilemap({ key: 'level1' })
        const tileset = map.addTilesetImage('grassland', 'grassland_tiles')
        const miscTileset = map.addTilesetImage('misc', 'misc_tiles')

        const platformLayer = map.createLayer('platforms', tileset)
        const miscLayer = map.createLayer('obstacles', miscTileset)
        platformLayer.setCollisionByProperty({ collides: true })

        

        //tilemap objects
        const objectLayer = map.getObjectLayer('objects')


        objectLayer.objects.forEach(objData => {
            const { x = 0, y = 0, name, width = 0, height = 0} = objData

            switch (name) {
                case 'spawn': {
                    this.pablo = this.matter.add.sprite(x, y, 'pablo')
                        .setFixedRotation()

                    this.playerController = new playerController(this,this.pablo, this.cursors, this.obstacles)
                    this.cameras.main.startFollow(this.pablo)

                    break
                }
                case 'strawberry': {
                    this.strawberry = this.matter.add.sprite(x, y, 'strawberry', undefined, {
                        isStatic: true,
                        isSensor: true,
                    })

                    this.strawberry.setData('type', 'strawberry')
                    this.strawberry.anims.create({
                        key: 'strawberry',
                        frameRate: 20,
                        frames: this.anims.generateFrameNames('strawberry',{
                            start: 0,
                            end: 16,
                            
                            suffix: '.png'
                        }),
                        repeat: -1
                    })
                    this.strawberry.anims.create({
                        key: 'collected',
                        frameRate:20,
                        frames: this.anims.generateFrameNames('collected', {
                            start: 0,
                            end: 5,
                            suffix: '.png'
                        })
                        
                    })

                    this.strawberry.play('strawberry')
                    break
                }

                case 'pineapple': {
                    this.pineapple = this.matter.add.sprite(x, y, 'pineapple', undefined, {
                        isStatic: true,
                        isSensor: true,
                    })

                    this.pineapple.setData('type', 'pineapple')
                    this.pineapple.setData('healPoints', 1)


                    this.pineapple.anims.create({
                        key: 'pineapple',
                        frameRate: 20,
                        frames: this.anims.generateFrameNames('pineapple',{
                            start: 0,
                            end: 16,
                            
                            suffix: '.png'
                        }),
                        repeat: -1
                    })
                    
                    this.pineapple.anims.create({
                        key: 'collected',
                        frameRate:20,
                        frames: this.anims.generateFrameNames('collected', {
                            start: 0,
                            end: 5,
                            suffix: '.png'
                        })
                    })


                    this.pineapple.play('pineapple')
                    break
                }


                case 'bounce': {
                    const bounce = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width , height,{
                        isStatic:true 
                    })
                    this.obstacles.add('bounce', bounce)
                    break
                     
                }
                
                case 'spikes': {
                    //hitbox slightly off so adjusted
                    const spike = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width , height,{
                        isStatic:true 
                    })
                    this.obstacles.add('spikes', spike)
                    break
                }
                
            }

            this.matter.world.convertTilemapLayer(platformLayer)
            this.cameras.main.startFollow(this.pablo)
            this.cameras.main.setBounds(0, 0, this.scale.width* 3, this.scale.height)
            this.matter.world.setBounds(0, 0, 16 * 70, 16 * 26)

        })
  
        
    }
    update(t: number, dt: number) {

        if (!this.playerController) {
            return
        }
        this.playerController.update(dt)

        

        this.layer4.tilePositionX = this.cameras.main.scrollX * .09
        this.layer3.tilePositionX = this.cameras.main.scrollX * .06
        this.layer2.tilePositionX = this.cameras.main.scrollX * .04
        this.layer1.tilePositionX = this.cameras.main.scrollX * .02



    }
}