import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.State {
    create() {
        this.skull = this.game.add.sprite(32, 24, 'skull')
        this.scoreText = this.game.add.text(62, 22, "x 20", {
            fontSize: "24px",
            fill: "#fff"
          })
          this.game.add.text(32, 2 * config.tileSize, "kill enemies until reach objective to win current level", {
            fontSize: "24px",
            fill: "#fff"
          })

        this.game.add.sprite(1 * config.tileSize, 4 * config.tileSize, 'up_arrow_key')
        this.game.add.text(2 * config.tileSize, 4 * config.tileSize,    "Move Up", {fontSize: "24px", fill: "#fff"})

        this.game.add.sprite(6 * config.tileSize, 4 * config.tileSize, 'down_arrow_key')
        this.game.add.text(7 * config.tileSize, 4 * config.tileSize,    "Move Down", {fontSize: "24px", fill: "#fff"})

        this.game.add.sprite(12 * config.tileSize, 4 * config.tileSize, 'right_arrow_key')
        this.game.add.text(13 * config.tileSize, 4 * config.tileSize,    "Shoot", {fontSize: "24px", fill: "#fff"})

        this.game.add.text(1 * config.tileSize, 6 * config.tileSize, "Use kegs as one-time defense against skeletons!", {
            fontSize: "24px",
            fill: "#fff"
          })

        this.game.add.text(1 * config.tileSize, 8 * config.tileSize, "Don't let enemies touch you or shoot you!", {
            fontSize: "24px",
            fill: "#fff"
          })

          this.game.add.text(1 * config.tileSize, 10 * config.tileSize, "Don't let any skeleton pass!", {
            fontSize: "24px",
            fill: "#fff"
          })

          this.game.add.text(1 * config.tileSize, 12 * config.tileSize, "Press ENTER to continue...", {
            fontSize: "16px",
            fill: "#fff"
          })
    }

    update() {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            this.state.start('Level1')
        }
    }
}