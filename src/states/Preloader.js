import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.game.load.tilemap('tilemap', 'assets/maps/proto1.json', null, Phaser.Tilemap.TILED_JSON)
    this.game.load.spritesheet('tiles', 'assets/images/tileset2.png', 32, 32)

    this.game.load.image('arrow_1', 'assets/images/arrow_1.png')
    this.game.load.image('skeleton_1', 'assets/images/skeleton_1.png')
    this.game.load.image('skull', 'assets/images/skull.png')
    this.game.load.image('dagger', 'assets/images/dagger.png')
    this.game.load.image('orc_1', 'assets/images/orc_1.png')
    this.game.load.image('up_arrow_key', 'assets/images/up_arrow_key.png')
    this.game.load.image('down_arrow_key', 'assets/images/down_arrow_key.png')
    this.game.load.image('right_arrow_key', 'assets/images/right_arrow_key.png')
    this.game.load.image('arrow_2', 'assets/images/arrow_2.png')
    this.game.load.image('blue_dragon', 'assets/images/blue_dragon.png')
    this.game.load.image('blue_magic_2', 'assets/images/blue_magic_2.png')
    this.game.load.image('blue_magic', 'assets/images/blue_magic.png')
  }

  create () {
    // this.state.start('Tutorial')
    this.state.start('Level3')
  }
}
