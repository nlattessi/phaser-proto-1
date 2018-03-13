var Weapon = {};

Weapon.SingleArrow = function(game) {
  Phaser.Group.call(
    this,
    game,
    game.world,
    "Single Arrow",
    false,
    true,
    Phaser.Physics.ARCADE
  );
  this.nextFire = 0;
  this.arrowSpeed = 400;
  this.fireRate = 800;

  for (var i = 0; i < 64; i++) {
    this.add(new Arrow(game, "arrow"), true);
  }

  return this;
};

Weapon.SingleArrow.prototype = Object.create(Phaser.Group.prototype);
Weapon.SingleArrow.prototype.constructor = Weapon.SingleArrow;

Weapon.SingleArrow.prototype.fire = function(source) {
  if (this.game.time.time < this.nextFire) {
    return;
  }

  var x = source.x + 20;
  var y = source.y;

  this.getFirstExists(false).fire(x, y, 0, this.arrowSpeed, 0, 0);

  this.nextFire = this.game.time.time + this.fireRate;
};
