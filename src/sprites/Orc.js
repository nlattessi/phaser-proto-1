import config from '../config'

const TILE_SIZE = config.tileSize

class Orc extends Phaser.Sprite {
  constructor(game, initX, finalX, initY, finalY, daggers) {
    super(game, initX * TILE_SIZE, initY * TILE_SIZE, 'orc_1')
    this.game.physics.arcade.enable(this)
    this.nextAction = 1000
    this.nextActionRate = 750
    this.canMove = false

    this.game.add.tween(this)
      .to({x: finalX * TILE_SIZE}, 1000, Phaser.Easing.Linear.None, true)
      .onComplete.add(() => this.canMove = true)

    this.initY = initY
    this.finalY = finalY

    this.daggers = daggers

    this.lives = 3

    // this.body.immovable = true
    this.takingDagame = false
  }

  update() {
    if (this.takingDagame) {
      return
    }

    if (!this.alive) {
      return
    }

    if (!this.canMove) {
      return
    }

    if (this.game.state.getCurrentState().gameOver) {
      return
    }

    if (this.game.time.time > this.nextAction) {
      this.canMove = false

      const action = this.game.rnd.integerInRange(0, 4)

      if (action === 0) {
        this.moveUp()
      } else if (action === 1) {
        this.attack()
        this.canMove = true
        this.nextAction = this.game.time.time + this.nextActionRate
      } else if (action === 2) {
        this.moveDown()
      } else {
        this.canMove = true
        this.nextAction = this.game.time.time + this.nextActionRate
      }

    //   const action = this.game.rnd.integerInRange(0, 4)

    //   // if (action === 0) {
    //   //   const dagger = this.game.add.sprite(this.x - 20, this.y + 24, 'dagger')
    //   //   dagger.angle = 270
    //   //   this.game.physics.arcade.enable(dagger)
    //   //   dagger.body.velocity.x = -250
    //   //   this.orcCanMove = true
    //   // }

    //   if (action === 1) {
    //     const movY = this.y + (config.tileSize)
    //     if (!(movY > this.finalY)) {
    //       this.game.add.tween(this).to({
    //         y: movY
    //       }, 100, Phaser.Easing.Linear.None, true).onComplete.add(() => {
    //         this.canMove = true
    //         this.nextAction = this.game.time.time + this.nextActionRate
    //       })
    //     }
    //   }

    //   if (action === 2) {
    //     const movY = this.y - (config.tileSize)
    //     if (!(movY < this.initY)) {
    //       this.game.add.tween(this).to({
    //         y: movY
    //       }, 100, Phaser.Easing.Linear.None, true).onComplete.add(() => {
    //         this.canMove = true
    //         this.nextAction = this.game.time.time + this.nextActionRate
    //       })
    //     }
    //   }

    //   if (action === 3) {
    //     this.canMove = true
    //     this.nextAction = this.game.time.time + this.nextActionRate
    //   }
    }
  }

  attack() {
    this.daggers.fire(this, null, null, 0, 16)
  }

  damage() {
    if (this.takingDagame) {
      return
    }

    this.lives -= 1

    if (this.lives === 0) {
      this.kill()
    } else {
      this.attack()

      this.takingDagame = true
      const bkpTint = this.tint
      this.tint = 0xff0000

      // / define the camera offset for the quake
      var rumbleOffset = 10;

      // we need to move according to the camera's current position
      var properties = {
        x: this.x - rumbleOffset
      };

      // we make it a relly fast movement
      var duration = 100;
      // because it will repeat
      var repeat = 6;
      // we use bounce in-out to soften it a little bit
      var ease = Phaser.Easing.Bounce.InOut;
      var autoStart = false;
      // a little delay because we will run it indefinitely
      var delay = 0;
      // we want to go back to the original position
      var yoyo = true;

      var quake = this.game.add.tween(this)
        .to(properties, duration, ease, autoStart, delay, 4, yoyo);

      // we're using this line for the example to run indefinitely
      quake.onComplete.addOnce(() => {
        this.attack()
        this.tint = bkpTint
        this.takingDagame = false
      });

      // let the earthquake begins
      quake.start();
    }
  }

  moveUp() {
    const actualTile = this.y / TILE_SIZE

    if (actualTile === this.initY) {
      this.canMove = true
      this.nextAction = this.game.time.time + this.nextActionRate
      return
    }

    const movY = this.y - config.tileSize
    this.game.add.tween(this)
      .to({ y: movY }, 100, Phaser.Easing.Linear.None, true)
      .onComplete.add(() => {
        this.canMove = true
        this.nextAction = this.game.time.time + this.nextActionRate
      })
  }

  moveDown() {
    const actualTile = this.y / TILE_SIZE

    if (actualTile === this.finalY) {
      this.canMove = true
      this.nextAction = this.game.time.time + this.nextActionRate
      return
    }

    const movY = this.y + config.tileSize
    this.game.add.tween(this)
      .to({ y: movY }, 100, Phaser.Easing.Linear.None, true)
      .onComplete.add(() => {
        this.canMove = true
        this.nextAction = this.game.time.time + this.nextActionRate
      })
  }

  move() {
    const actualTile = this.y / TILE_SIZE

    if (actualTile === this.initY) {
      if (this.dirY === 'down') {
        const movY = this.y + config.tileSize
        this.game.add.tween(this)
          .to({ y: movY }, 100, Phaser.Easing.Linear.None, true)
          .onComplete.add(() => {
            this.canMove = true
            this.nextAction = this.game.time.time + this.nextActionRate
          })
      } else {
        this.dirY = 'down'
        const movY = this.y + config.tileSize
        this.game.add.tween(this)
          .to({ y: movY }, 100, Phaser.Easing.Linear.None, true)
          .onComplete.add(() => {
            this.canMove = true
            this.nextAction = this.game.time.time + this.nextActionRate
          })
      }
    } else if (actualTile === (this.initY + 1)) {
      if (this.dirY === 'down') {
        const movY = this.y + config.tileSize
        this.game.add.tween(this)
          .to({ y: movY }, 100, Phaser.Easing.Linear.None, true)
          .onComplete.add(() => {
            this.canMove = true
            this.nextAction = this.game.time.time + this.nextActionRate
          })
      } else {
        const movY = this.y - config.tileSize
        this.game.add.tween(this)
          .to({ y: movY }, 100, Phaser.Easing.Linear.None, true)
          .onComplete.add(() => {
            this.canMove = true
            this.nextAction = this.game.time.time + this.nextActionRate
          })
      }
    } else if (actualTile === (this.initY + 2)) {
      if (this.dirY === 'down') {
        this.dirY = 'up'
        const movY = this.y - config.tileSize
        this.game.add.tween(this)
          .to({ y: movY }, 100, Phaser.Easing.Linear.None, true)
          .onComplete.add(() => {
            this.canMove = true
            this.nextAction = this.game.time.time + this.nextActionRate
          })
      }
    }
  }
}

export default Orc