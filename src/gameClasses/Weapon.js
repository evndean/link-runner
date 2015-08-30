// Borrowed and modified from http://phaser.io/tutorials/coding-tips-007

var Weapon = {};

Weapon.Beam = function (game) {

	Phaser.Group.call(this, game, game.world, 'Beam', false, true, Phaser.Physics.ARCADE);

	this.nextFire = 0;
	this.bulletSpeed = 750;
	this.fireRate = 500;

	for (var i = 0; i < 64; i++) {

		this.add(new Bullet(game, 'lazerBeam'), true);

	}

	// Sound effect
	this.laserSound = game.add.audio('laser');

	return this;

};

Weapon.Beam.prototype = Object.create(Phaser.Group.prototype);
Weapon.Beam.prototype.constructor = Weapon.Beam;

Weapon.Beam.prototype.fire = function (source) {

	if (this.game.time.time < this.nextFire) { return; }

	var x = source.x + 10 * source.scale.x;
	var y = source.y + 5;
	var direction = source.scale.x

	// Play sound
	this.laserSound.play();

	this.getFirstExists(false).fire(x, y, this.bulletSpeed, direction);

	source.batteryLevel -= source.batteryDrainWhenShooting;

	this.nextFire = this.game.time.time + this.fireRate;

};

Weapon.Beam.prototype.hitWall = function(beam, layer) {

	beam.kill();

}

Weapon.Beam.prototype.hitBarrier = function(beam, layer) {

	beam.kill();
	layer.kill();

};