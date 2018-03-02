var game = new Phaser.Game(640, 354, Phaser.AUTO, "", {
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

var score = 0;
var scoreText;

var showReturn = false;
var returnText;

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

function currentWeaponSkeletonCollisionHandler(currentWeapon, skeleton) {
  currentWeapon.kill();
  skeleton.kill();

  score += 10;
  scoreText.text = "Score: " + score;
}

function playerSkeletonsCollisionHandler(player, skeleton) {
  player.kill();
  displayEnd();
}

function displayEnd() {
  // you can't win and lose at the same time
  if (endText && endText.exists) {
    return;
  }

  var msg = "Game Over!";
  var endText = game.add.text(game.width / 2, game.height / 2 - 60, msg, {
    font: "72px serif",
    fill: "#fff"
  });
  endText.anchor.setTo(0.5, 0);
  showReturn = game.time.now + Phaser.Timer.SECOND * 2;
}

function resetGame() {
  player.destroy();
  skeletons.destroy();
  weapons.forEach(element => {
    element.destroy();
  });
  scoreText.destroy();
  returnText.destroy();

  game.state.restart();
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
  game.physics.enable(player, Phaser.Physics.ARCADE);

  skeletons = game.add.group();
  skeletons.enableBody = true;
  skeletons.physicsBodyType = Phaser.Physics.ARCADE;
  for (var i = 0; i < 20; i++) {
    skeletons.add(new Skeleton(game, "skeleton"), true);
  }

  weapons.push(new Weapon.SingleArrow(game));
  currentWeapon = 0;

  scoreText = game.add.text(16, 298, "score: 0", {
    fontSize: "32px",
    fill: "#fff"
  });
}

function update() {
  if (game.time.time > nextSkeleton) {
    spawnSkeleton();
  }

  game.physics.arcade.overlap(
    weapons[currentWeapon],
    skeletons,
    currentWeaponSkeletonCollisionHandler,
    null,
    this
  );

  game.physics.arcade.overlap(
    player,
    skeletons,
    playerSkeletonsCollisionHandler,
    null,
    this
  );

  if (game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
    if (returnText && returnText.exists) {
      resetGame();
    }
  }

  if (showReturn && game.time.now > showReturn) {
    returnText = game.add.text(
      game.width / 2,
      game.height / 2 + 20,
      "Press Z or Tap Game to go back to Main Menu",
      { font: "16px sans-serif", fill: "#fff" }
    );
    returnText.anchor.setTo(0.5, 0.5);
    showReturn = false;
  }
}

function render() {
  game.debug.spriteBounds(player);
}
