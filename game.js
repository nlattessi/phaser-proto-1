var game = new Phaser.Game(640, 320, Phaser.AUTO, "", {
  preload: preload,
  create: create,
  update: update
  //render: render
});

function preload() {
  game.load.image("bowman", "bowman.png");
  game.load.image("arrow", "arrow.png");
  game.load.image("skeleton", "skeleton.png");
}

var player;
var cursors;
var canMove = true;
var shootKey;

var skeletons;
var nextSkeleton = 0;
var skeletonRate = 1600;

var weapons = [];
var currentWeapon = 0;

function move(deltaY) {
  if (!canMove) {
    return;
  }

  canMove = false;

  game.add
    .tween(player)
    .to(
      {
        y: player.y + deltaY * 32
      },
      100,
      Phaser.Easing.Linear.None,
      true
    )
    .onComplete.add(function() {
      canMove = true;
    }, this);
}

function moveDown() {
  if (player.y + 1 * 32 >= 288) {
    return;
  }

  move(1);
}

function moveUp() {
  if (player.y - 1 * 32 <= 0) {
    return;
  }

  move(-1);
}

function shoot() {
  weapons[currentWeapon].fire(player);
}

function spawnSkeleton() {
  var posY = game.rnd.integerInRange(1, 8) * 32;
  var speedX = game.rnd.integerInRange(50, 200) * -1;
  var skeleton = skeletons.getFirstExists(false);
  skeleton.reset(640, posY);
  skeleton.body.velocity.x = speedX;
  nextSkeleton = game.time.time + skeletonRate;
}

function weaponSkeletonCollisionHandler(currentWeapon, skeleton) {
  currentWeapon.kill();
  skeleton.kill();
}

function create() {
  cursors = game.input.keyboard.createCursorKeys();
  cursors.down.onDown.add(moveDown, this);
  cursors.up.onDown.add(moveUp, this);
  cursors.up.onDown.add(moveUp, this);
  shootKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  shootKey.onDown.add(shoot, this);

  player = game.add.sprite(32, 32, "bowman");
  player.anchor.set(0.5);

  skeletons = game.add.group();
  skeletons.enableBody = true;
  skeletons.physicsBodyType = Phaser.Physics.ARCADE;
  skeletons.createMultiple(20, "skeleton");
  skeletons.callAll("anchor.set", "anchor", 0.5);
  skeletons.setAll("scale.x", -1);

  weapons.push(new Weapon.SingleArrow(game));
  currentWeapon = 0;
}

function update() {
  if (game.time.time > nextSkeleton) {
    spawnSkeleton();
  }

  game.physics.arcade.overlap(
    weapons[currentWeapon],
    skeletons,
    weaponSkeletonCollisionHandler,
    null,
    this
  );
}

function render() {
  game.debug.spriteBounds(player);
}
