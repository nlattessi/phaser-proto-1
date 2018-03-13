import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.State {
  init() { }
  preload() { }

  create() {
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    this.map = this.game.add.tilemap('tilemap')
    this.map.addTilesetImage('tiles32', 'tiles')

    this.backgroundLayer = this.map.createLayer('BackgroundLayer')
    this.groundLayer = this.map.createLayer('GroundLayer')
    this.objectLayer = this.map.createLayer('ObjectLayer')
    this.map.setCollisionBetween(1, 100, true, 'ObjectLayer')

    this.player = this.game.add.sprite(32, 7 * config.tileSize, 'tiles', 80)
    this.game.physics.arcade.enable(this.player)

    this.weapon = this.game.add.weapon(30, 'arrow_1')
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.fireAngle = 360
    this.weapon.bulletAngleOffset = 45
    this.weapon.bulletSpeed = 400;
    this.weapon.fireRate = 500

    this.setupSkeletons()

    this.canMove = true
    this.nextSkeleton = 0
    this.skeletonRate = 1600
    // this.score = 20
    this.score = 1
    this.showReturn = false
    this.returnText = null
    this.gameOver = false
    this.showNextLevel = false
    this.nextLevelText = null
    this.currentLevel = 1

    this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP)
    this.upKey.onDown.add(this.moveUp, this)

    this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
    this.downKey.onDown.add(this.moveDown, this)

    this.fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.fireKey.onDown.add(this.fire, this)

    this.skull = this.game.add.sprite(12, 12, 'skull')

    this.scoreText = this.game.add.text(50, 8, "x " + this.score, {
      fontSize: "32px",
      fill: "#fff"
    })

    this.levelText = this.game.add.text(config.tileSize * 16, 8, "Level: " + this.currentLevel, {
      fontSize: "32px",
      fill: "#fff"
    })

    this.backgroundLayer.resizeWorld()
  }

  setupSkeletons() {
    this.skeletons = game.add.group()
    this.skeletons.enableBody = true
    this.skeletons.physicsBodyType = Phaser.Physics.ARCADE
    for (var i = 0; i < 20; i++) {
      const skeleton = this.game.add.sprite(0, 0, 'skeleton_1')
      skeleton.exists = false
      skeleton.scale.x = -1
      this.skeletons.add(skeleton, false)
    }
  }

  moveDown() {
    if (this.gameOver) {
      return
    }

    const movY = this.player.y + (config.tileSize)

    if (movY === 448) {
      return
    }

    this.canMove = false
    this.game.add.tween(this.player).to({y: movY}, 100, Phaser.Easing.Linear.None, true).onComplete.add(() => this.canMove = true)
  }

  moveUp() {
    if (this.gameOver) {
      return
    }

    const movY = this.player.y + (config.tileSize)

    if (movY === 192) {
      return
    }

    this.canMove = false
    this.game.add.tween(this.player).to({y: this.player.y - (config.tileSize)}, 100, Phaser.Easing.Linear.None, true).onComplete.add(() => this.canMove = true)
  }

  update() {
    if (!this.gameOver) {
      this.game.physics.arcade.collide(this.weapon.bullets, this.skeletons, this.arrowVsSkeleton, null, this)
      this.game.physics.arcade.collide(this.player, this.skeletons, this.playerVsSkeleton, null, this)
      this.game.physics.arcade.collide(this.skeletons, this.objectLayer, this.skeletonVsObjects, null, this)

      if (this.game.time.time > this.nextSkeleton) {
        this.spawnSkeleton()
      }
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
      if (this.returnText && this.returnText.exists) {
        this.resetGame();
      }
    }

    if (this.showReturn && this.game.time.now > this.showReturn) {
      this.returnText = this.game.add.text(
      this.game.width / 2,
      this.game.height / 2 + 20,
      "Press Z or Tap Game to go back to Main Menu",
      { font: "16px sans-serif", fill: "#fff" }
      );
      this.returnText.anchor.setTo(0.5, 0.5);
      this.showReturn = false;
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      if (this.nextLevelText && this.nextLevelText.exists) {
        this.goToNextLevel()
      }
    }

    if (this.showNextLevel && this.game.time.now > this.showNextLevel) {
      this.nextLevelText = this.game.add.text(
        this.game.width / 2,
        this.game.height / 2 + 20,
        "Press SPACE to go to next level",
        { font: "16px sans-serif", fill: "#fff" }
      );
      this.nextLevelText.anchor.setTo(0.5, 0.5);
      this.showNextLevel = false;
    }
  }

  resetGame() {
    this.cleanState()
    this.game.state.restart()
  }

  cleanState() {
    this.player.destroy()
    this.skeletons.destroy()
    this.weapon.destroy()
    this.scoreText.destroy()
    this.returnText.destroy()
    this.nextLevelText.destroy()
  }

  goToNextLevel() {
    this.state.start('Level2')
  }

  fire() {
    if (!this.gameOver) {
      this.weapon.fire(this.player, null, null, 42, 16)
    }
  }

  arrowVsSkeleton(arrow, skeleton) {
    arrow.kill()
    skeleton.kill()

    this.score -= 1
    this.scoreText.text = "x " + this.score

    if (this.score === 0) {
      this.nextLevel()
    }
  }

  nextLevel() {
    this.gameOver = true

    var msg = "Level completed!";
    var endText = this.game.add.text(this.game.width / 2, this.game.height / 2 - 60, msg, {
      font: "72px serif",
      fill: "#fff"
    });
    endText.anchor.setTo(0.5, 0);
    this.showNextLevel = this.game.time.now + Phaser.Timer.SECOND * 2;
  }

  skeletonVsObjects(skeleton, object) {
    skeleton.kill()
    this.map.removeTile(object.x, object.y, this.objectLayer).destroy();
  }

  playerVsSkeleton(player, skeleton) {
    if (!this.gameOver) {
      player.kill()
      this.runGameOver()
    }
  }

  runGameOver() {
    this.gameOver = true

    var msg = "Game Over!";
    var endText = this.game.add.text(this.game.width / 2, this.game.height / 2 - 60, msg, {
      font: "72px serif",
      fill: "#fff"
    });
    endText.anchor.setTo(0.5, 0);
    this.showReturn = this.game.time.now + Phaser.Timer.SECOND * 2;
  }

  spawnSkeleton() {
    const posY = this.game.rnd.integerInRange(3, 11) * config.tileSize
    const speedX = this.game.rnd.integerInRange(50, 200) * -1
    const skeleton = this.skeletons.getFirstExists(false)
    skeleton.reset(640, posY)
    skeleton.body.velocity.x = speedX
    skeleton.checkWorldBounds = true
    skeleton.events.onOutOfBounds.add(this.skeletonOut, this)
    this.nextSkeleton = this.game.time.time + this.skeletonRate
  }

  skeletonOut(skeleton) {
    this.runGameOver()
  }

  render() {
    // this.weapon.debug()
  }
}
