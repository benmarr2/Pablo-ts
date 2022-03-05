import Phaser from 'phaser'
import StateMachine from './state_machine'
import ObstaclesController from '../obstacles_controller'

import { eventEmitter as events } from '../eventcenter'

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys


export default class playerController {

    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private cursors: CursorKeys
    private obstacles: ObstaclesController

    private stateMachine: StateMachine
    private canDoubleJump: boolean = true

    private health = 1


    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, cursors: CursorKeys, obstacles: ObstaclesController) {

        this.scene = scene
        this.sprite = sprite
        this.cursors = cursors
        this.obstacles = obstacles

        this.createAnimations()

        this.stateMachine = new StateMachine(this, 'player')

        this.stateMachine.addState('idle', {
            onEnter: this.idleOnEnter,
            onUpdate: this.idleOnUpdate
        })
            .addState('walk', {
                onEnter: this.walkOnEnter,
                onUpdate: this.walkOnUpdate,

            })
            .addState('jump', {
                onEnter: this.jumpOnEnter,
                onUpdate: this.jumpOnUpdate
            })
            .addState('double_jump', {
                onEnter: this.doubleJumpOnEnter,
                onUpdate: this.doubleJumpOnUpdate
            })
            .addState('hit', {
                onEnter: this.hitOnEnter
            })
            .addState('bounce', {
                onEnter: this.bounceOnEnter,
                onUpdate: this.bounceOnUpdate
            })
            .setState('idle')

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {

            const body = data.bodyB as MatterJS.BodyType
            if (this.obstacles.is('spikes', body)) {
                this.stateMachine.setState('hit')
                this.health -1
                return
            }
            else if (this.obstacles.is('bounce', body)) {
                console.log('bounce')
                this.stateMachine.setState('bounce')
                return
            }

            const gameObject = body.gameObject
            if (!gameObject) {
                return
            }

            if (gameObject instanceof Phaser.Physics.Matter.TileBody) {

                if (this.stateMachine.isCurrentState('jump')) {
                    this.stateMachine.setState('idle')
                }
                else if (this.stateMachine.isCurrentState('double_jump')) {
                    this.stateMachine.setState('idle')
                }
                else if (this.stateMachine.isCurrentState('bounce')) {
                    this.stateMachine.setState('idle')
                }
                return
            }

            const sprite = gameObject as Phaser.Physics.Matter.Sprite
            const type = sprite.getData('type')

            switch (type) {
                case 'strawberry': {
                    events.emit('strawberry_collected')
                    sprite.play('collected')
                    sprite.on('animationcomplete', sprite.destroy)
                    break
                }

                case 'pineapple': {
                    events.emit('pineapple_collected', this.health)
                    sprite.play('collected')
                    sprite.on('animationcomplete', sprite.destroy)
                }

            }


        })


    }

    update(dt: number) {
        this.stateMachine.update(dt)
    }

    private idleOnEnter() {
        this.sprite.play('pablo_idle')
    }

    private idleOnUpdate() {
        if (this.cursors.left.isDown || this.cursors.right.isDown) {
            this.stateMachine.setState('walk')
        }
        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        if (spaceJustPressed) {
            this.stateMachine.setState('jump')
        }
    }

    private walkOnEnter() {
        this.sprite.play('pablo_run')
    }

    private walkOnUpdate() {
        const speed = 1

        if (this.cursors.left.isDown) {
            this.sprite.flipX = true
            this.sprite.setVelocityX(-speed)
        }
        else if (this.cursors.right.isDown) {
            this.sprite.flipX = false
            this.sprite.setVelocityX(speed)
        }
        else {
            this.sprite.setVelocityX(0)
            this.stateMachine.setState('idle')
        }
        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        if (spaceJustPressed) {
            this.stateMachine.setState('jump')

        }

    }

    private jumpOnEnter() {

        this.sprite.setVelocityY(-5)
        this.sprite.play('pablo_jump')
        this.canDoubleJump = true;

    }

    private jumpOnUpdate() {
        const speed = 5
        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)


        if (this.cursors.left.isDown) {
            this.sprite.flipX = true
            this.sprite.setVelocityX(-speed)
        }
        else if (this.cursors.right.isDown) {
            this.sprite.flipX = false
            this.sprite.setVelocityX(speed)
        }
        else if (this.sprite.body.velocity.y > 0) {
            this.sprite.play('pablo_fall')
        }



        if (spaceJustPressed && this.canDoubleJump) {
            this.stateMachine.setState('double_jump')
            this.canDoubleJump = false
        }




    }

    private doubleJumpOnEnter() {
        this.sprite.setVelocityY(-4)
        this.sprite.play('pablo_double_jump', true)

    }

    private doubleJumpOnUpdate() {
        const speed = 5

        if (this.cursors.left.isDown) {
            this.sprite.flipX = true
            this.sprite.setVelocityX(-speed)
        }
        else if (this.cursors.right.isDown) {
            this.sprite.flipX = false
            this.sprite.setVelocityX(speed)
        }
        else if (this.sprite.body.velocity.y > 0) {
            this.sprite.play('pablo_fall', true)
        }


    }

    private hitOnEnter() {
        this.sprite.setVelocityY(-5)

        const startColor = Phaser.Display.Color.ValueToColor(0xffffff)
        const endColor = Phaser.Display.Color.ValueToColor(0xff0000)

        this.scene.tweens.addCounter({
            from: 0,
            to: 100,
            duration: 100,
            repeat: 2,
            yoyo: true,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: tween => {
                const value = tween.getValue()
                const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
                    startColor,
                    endColor,
                    100,
                    value
                )

                const color = Phaser.Display.Color.GetColor(
                    colorObject.r,
                    colorObject.g,
                    colorObject.b
                )

                this.sprite.setTint(color)
            }
        })
        
        console.log(this.health)
        events.emit('hit', this.health)

        this.stateMachine.setState('idle')
    }

    private bounceOnEnter() {
        this.sprite.setVelocityY(-5),
            this.sprite.play('pablo_jump')

    }

    private bounceOnUpdate() {
        const speed = 5

        if (this.cursors.left.isDown) {
            this.sprite.flipX = true
            this.sprite.setVelocityX(-speed)
        }
        else if (this.cursors.right.isDown) {
            this.sprite.flipX = false
            this.sprite.setVelocityX(speed)
        }
        else if (this.sprite.body.velocity.y > 0) {
            this.sprite.play('pablo_fall')
        }
    }
    
    
	private setHealth(value: number)
	{
		this.health = Phaser.Math.Clamp(value, -1, 2)

		events.emit('health-changed', this.health)

		// TODO: check for death
		if (this.health <= 0)
		{
			this.stateMachine.setState('dead')
		}
    }

    private createAnimations() {
        this.sprite.anims.create({
            key: 'pablo_idle',
            frameRate: 20,
            frames: this.sprite.anims.generateFrameNames('pablo_idle', {
                start: 0,
                end: 10,
                prefix: 'Idle (32x32)-',
                suffix: '.png'
            }),
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'pablo_run',
            frameRate: 20,
            frames: this.sprite.anims.generateFrameNames('pablo_run', {
                start: 0,
                end: 11,
                prefix: 'Run (32x32)-',
                suffix: '.png'
            }),
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'pablo_double_jump',
            frameRate: 20,
            frames: this.sprite.anims.generateFrameNames('pablo_double_jump', {
                start: 0,
                end: 5,
                prefix: 'Double Jump (32x32)-',
                suffix: '.png'
            }),
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'pablo_jump',
            frameRate: 20,
            frames: 'pablo_jump',
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'pablo_fall',
            frameRate: 20,
            frames: 'pablo_fall',
            repeat: -1
        })

    }
}

