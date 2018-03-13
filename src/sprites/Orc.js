import config from '../config'

class Orc extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x, y, 'orc_1')
        this.game.physics.arcade.enable(this)
        this.orcNextAction = 1000
        this.orcNextActionRate = 750
        this.orcCanMove = true
    }

    update() {
        if (this.game.time.time > this.orcNextAction) {

            this.orcCanMove = false

            const action = this.game.rnd.integerInRange(0, 4)

            if (action === 0) {
              const dagger = this.game.add.sprite(this.x - 20, this.y + 24, 'dagger')
              dagger.angle = 270
            this.game.physics.arcade.enable(dagger)
            dagger.body.velocity.x = -250
            this.orcCanMove = true
            }

            if (action === 1) {
              const movY = this.y + (config.tileSize)
              if (!(movY > 352)) {
                this.game.add.tween(this).to({y: movY}, 100, Phaser.Easing.Linear.None, true).onComplete.add(() => {
                  this.orcCanMove = true
                  this.orcNextAction = this.game.time.time + this.orcNextActionRate
                })

            }
          }

            if (action === 2) {
              const movY = this.y - (config.tileSize)
              if (!(movY < 256)) {
              this.game.add.tween(this).to({y: movY}, 100, Phaser.Easing.Linear.None, true).onComplete.add(() => {
                this.orcCanMove = true
                this.orcNextAction = this.game.time.time + this.orcNextActionRate
              })
            }
          }

            if (action === 3) {
              this.orcCanMove = true
            }

            this.orcNextAction = this.game.time.time + this.orcNextActionRate
          }
    }
  }

  export default Orc