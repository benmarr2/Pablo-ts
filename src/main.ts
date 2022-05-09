import Phaser from 'phaser'
import preload from './scenes/preload'
import menu from './scenes/menu'
import level1 from './scenes/level1'
import UI from './scenes/UI'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	pixelArt: true,
	physics: {
		default: 'matter',
		matter: {
			debug: false
		}
	},
	scene: [preload, menu, level1, UI],
	scale: {
        autoCenter: Phaser.Scale.Center.CENTER_BOTH,
        mode: Phaser.Scale.FIT,
        width: 288*2, 
        height: 208*2
    }
}

export default new Phaser.Game(config)
