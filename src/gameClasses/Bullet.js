// Borrowed and modified from http://phaser.io/tutorials/coding-tips-007

var Bullet = function (game, key) {

	Phaser.Sprite.call(this, game, 0, 0, key);

	this.anchor.set(0.5);

	// Kill the bullet if it's outside the world bounds
	// (this shouldn't happen, but I'll leave it in for now)
	this.checkWorldBounds = true;
	this.outOfBoundsKill = true;
	this.exists = false;

};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.fire = function (x, y, speed, direction) {

	this.reset(x, y);
	this.body.velocity.x = speed * direction;
	this.angle = 90 * direction;

};

Bullet.prototype.collide = function () {

	this.kill();

};

Bullet.prototype.update = function () {

	// // Check for collisions
	// // this.game.physics.arcade.overlap(this, LinkRunner.game.pipeWalls, this.collide(), null, this);

	// if (this.tracking) {
	// 	this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
	// }

	// if (this.scaleSpeed > 0) {
	// 	this.scale.x += this.scaleSpeed;
	// 	this.scale.y += this.scaleSpeed;
	// }

};
