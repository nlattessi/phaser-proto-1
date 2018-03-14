import Phaser from 'phaser'
import config from '../config'
import Orc from '../sprites/Orc'
import BlueDragon from '../sprites/BlueDragon';

const TILE_SIZE = config.tileSize

export default class extends Phaser.State {
  init() {
    this.canMove = true
    this.nextSkeleton = 2000
    this.skeletonRate = 1600
    this.score = 0
    this.objective = 20
    this.showReturn = false
    this.returnText = null
    this.gameOver = false
    this.showNextLevel = false
    this.nextLevelText = null
    this.currentLevel = 0
    this.nextLevelString = ''
    this.useSkeletons = false
    this.useOrcs = false
    this.useBlueDragons = false
    this.isLevelStarted = false
  }

  create() {
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

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

    this.daggers = this.game.add.weapon(30, 'dagger')
    this.daggers.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.daggers.fireAngle = Phaser.ANGLE_RIGHT
    this.daggers.bulletAngleOffset = 270
    this.daggers.bulletSpeed = -300;
    this.daggers.fireRate = 500

    this.blueArrows = game.add.group()
    this.blueArrows.enableBody = true
    this.blueArrows.physicsBodyType = Phaser.Physics.ARCADE
    this.blueArrows.createMultiple(60, 'arrow_2')
    this.blueArrows.setAll('checkWorldBounds', true)
    this.blueArrows.setAll('outOfBoundsKill', true)

    this.setupSkeletons()
    this.setupOrcs()
    this.setupBlueDragons()

    this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP)
    this.upKey.onDown.add(this.moveUp, this)

    this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
    this.downKey.onDown.add(this.moveDown, this)

    this.fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    this.fireKey.onDown.add(this.fire, this)

    this.skull = this.game.add.sprite(12, 12, 'skull')

    this.scoreText = this.game.add.text(50, 8, "x " + this.score, {
      fontSize: "32px",
      fill: "#fff"
    })

    this.objectiveText = this.game.add.text(150, 8, `Kill ${this.objective} monsters`, {
      fontSize: "28px",
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

    if (!this.useSkeletons) {
        return
    }

    this.skeletons.enableBody = true
    this.skeletons.physicsBodyType = Phaser.Physics.ARCADE
    for (var i = 0; i < 20; i++) {
      const skeleton = this.game.add.sprite(0, 0, 'skeleton_1')
      skeleton.exists = false
      skeleton.scale.x = -1
      this.skeletons.add(skeleton, false)
    }
  }

  setupOrcs() {
    this.orcs = game.add.group()

    if (!this.useOrcs) {
        return
    }

    let initX = 20
    let finalX = this.game.rnd.integerInRange(15, 19)
    let initY = 3
    let finalY = 3
    let orc = new Orc(this.game, initX, finalX, initY, finalY, this.daggers)
    this.orcs.add(orc, false)

    finalX = this.game.rnd.integerInRange(15, 19)
    initY = 5
    finalY = 6
    orc = new Orc(this.game, initX, finalX, initY, finalY, this.daggers)
    this.orcs.add(orc, false)

    finalX = this.game.rnd.integerInRange(15, 19)
    initY = 7
    finalY = 8
    orc = new Orc(this.game, initX, finalX, initY, finalY, this.daggers)
    this.orcs.add(orc, false)

    finalX = this.game.rnd.integerInRange(15, 19)
    initY = 9
    finalY = 10
    orc = new Orc(this.game, initX, finalX, initY, finalY, this.daggers)
    this.orcs.add(orc, false)

    finalX = this.game.rnd.integerInRange(15, 19)
    initY = 11
    finalY = 11
    orc = new Orc(this.game, initX, finalX, initY, finalY, this.daggers)
    this.orcs.add(orc, false)
  }

  setupBlueDragons() {
    this.blueDragons = game.add.group()

    if (!this.useBlueDragons) {
        return
    }


    let initX = 16
    let initY = -2
    let finalY = 4
    let blueDragon = new BlueDragon(this.game, initX, initX, initY, finalY, this.player, this.blueArrows)
    this.blueDragons.add(blueDragon, false)

    initX = 12
    initY = -2
    finalY = 8
    blueDragon = new BlueDragon(this.game, initX, initX, initY, finalY, this.player, this.blueArrows)
    this.blueDragons.add(blueDragon, false)
  }

  levelHasStarted() {

    if (this.isLevelStarted) {
      return true
    }

    if (!this.isLevelStarted) {
      if (this.useSkeletons) {
        this.isLevelStarted = true
      } else if (this.useBlueDragons) {
        this.blueDragons.forEachAlive(element => {
          this.isLevelStarted = element.canMove
        }, this, true);
      }
    }

    return false
  }

  moveDown() {
    if (!this.levelHasStarted()) {
      return
    }

    if (this.gameOver) {
      return
    }

    const actualTile = this.player.y / TILE_SIZE
    const movY = actualTile + 1

    if (movY === 12) {
      return
    }

    this.canMove = false
    this.game.add.tween(this.player).to({ y: this.player.y + TILE_SIZE }, 100, Phaser.Easing.Linear.None, true).onComplete.add(() => this.canMove = true)
  }

  moveUp() {
    if (!this.levelHasStarted()) {
      return
    }

    if (this.gameOver) {
      return
    }

    const actualTile = this.player.y / TILE_SIZE
    const movY = actualTile - 1

    if (movY === 2) {
      return
    }

    this.canMove = false
    this.game.add.tween(this.player).to({ y: this.player.y - TILE_SIZE }, 100, Phaser.Easing.Linear.None, true).onComplete.add(() => this.canMove = true)
  }

  update() {
    if (!this.levelHasStarted()) {
      return
    }


    if (!this.gameOver) {
      this.game.physics.arcade.overlap(this.weapon.bullets, this.skeletons, this.arrowVsSkeleton, null, this)
      this.game.physics.arcade.overlap(this.weapon.bullets, this.orcs, this.arrowVsOrc, null, this)
      this.game.physics.arcade.overlap(this.weapon.bullets, this.blueDragons, this.arrowVsBlueDragons, null, this)
      this.game.physics.arcade.collide(this.player, this.skeletons, this.playerVsSkeleton, null, this)
      this.game.physics.arcade.collide(this.skeletons, this.objectLayer, this.skeletonVsObjects, null, this)
      this.game.physics.arcade.overlap(this.daggers.bullets, this.player, this.daggerVsPlayer, null, this)
      this.game.physics.arcade.overlap(this.blueArrows, this.player, this.blueArrowVsPlayer, null, this)

      if (this.game.time.time > this.nextSkeleton) {
        this.spawnSkeleton()
      }
    }

    if (this.showReturn && this.game.time.now > this.showReturn) {
      this.returnText = this.game.add.text(
      this.game.width / 2,
      this.game.height / 2 + 20,
      "Press SPACE to restart level",
      { font: "16px sans-serif", fill: "#fff" }
      );
      this.returnText.anchor.setTo(0.5, 0.5);
      this.showReturn = false;
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      if (this.returnText && this.returnText.exists) {
        this.resetGame();
      } else if (this.nextLevelText && this.nextLevelText.exists) {
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

  blueArrowVsPlayer(blueArrow, player) {
    if (!this.gameOver) {
      this.player.kill()
      this.runGameOver()
    }
  }

  daggerVsPlayer(dagger, player) {
    if (!this.gameOver) {
      this.player.kill()
      this.runGameOver()
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
    if (this.returnText) {
      this.returnText.destroy()
    }
    if (this.nextLevelText) {
      this.nextLevelText.destroy()
    }

    this.daggers.destroy()
    this.orcs.destroy()
  }

  goToNextLevel() {
    this.cleanState()
    this.state.start(this.nextLevelString)
  }

  fire() {
    if (!this.levelHasStarted()) {
      return
    }

    if (this.gameOver) {
      return
    }

    this.weapon.fire(this.player, null, null, 42, 16)
  }

  arrowVsSkeleton(arrow, skeleton) {
    arrow.kill()
    skeleton.kill()

    this.score += 1
    this.scoreText.text = "x " + this.score

    this.scoreIncreased()

    if (this.score === this.objective) {
      this.nextLevel()
    }
  }

  scoreIncreased() {

  }

  arrowVsOrc(arrow, orc) {
    arrow.kill()

    orc.damage()

    if (!orc.alive) {
      this.score += 1
      this.scoreText.text = "x " + this.score

      if (this.score === 0) {
        this.nextLevel()
      }
    }
  }

  arrowVsBlueDragons(arrow, blueDragon) {
    arrow.kill()

    blueDragon.damage()

    if (!blueDragon.alive) {
      this.score += 1
      this.scoreText.text = "x " + this.score

      if (this.score === 0) {
        this.nextLevel()
      }
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
    if (!this.useSkeletons) {
      return
    }

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
    // this.game.debug.spriteBounds(this.orc)
    // this.game.debug.spriteBounds(this.orc2)
    // this.game.debug.spriteBounds(this.orc3)
    // this.game.debug.spriteBounds(this.player)
    // this.daggers.debug()
  }
}
