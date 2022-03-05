import Phaser from 'phaser'
import {eventEmitter as events} from './eventcenter'

export default class UI extends Phaser.Scene{

    private strawberryCount!: Phaser.GameObjects.Text
    private strawberriesCollected = 0

    private hearts!: Phaser.GameObjects.Group

    constructor(){
        super({
            key: 'UI'
        })
    }

    init(){
        this.strawberriesCollected = 0
    }

    create(){

        //STRAWB

        this.strawberryCount = this.add.text(400, 10, 'Strawbs: 0',{
            fontSize: '16px',
            fontFamily: 'font',
            color: '#eb34cf',
        })

        events.on('strawberry_collected', this.handleStrawberry, this)

        this.events.once(Phaser.Scenes.Events.DESTROY, ()=>{
            events.off('strawberry_collected', this.handleStrawberry, this)
        })

        //HEART

        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        })
        this.hearts.createMultiple({
            key: 'heart',
            setXY:{
                x: 25,
                y: 20,
                stepX: 22
            },
            quantity: 2
        })

        events.on('hit', this.handleHit, this)

        //PINEAPPLE

        events.on('pineapple_collected', this.handleHealthGain, this)

    }

    private handleStrawberry(){
        this.strawberriesCollected++
        this.strawberryCount.text = `Strawbs: ${this.strawberriesCollected} `
    }

	private handleHit(health: number)
	{
		this.hearts.children.each((go, idx) => {
			const heart = go as Phaser.GameObjects.Image
			if (idx <= health)
			{
				heart.setTexture('heart')
			}
			else
			{
				heart.setTexture('heart_empty')
			}
		})
        console.log('hit')
        
	}

    private handleHealthGain(value: number){
        this.hearts.children.each((go, idx)=>{
            const heart = go as Phaser.GameObjects.Image
            heart.setTexture('heart')
        })
    }
}