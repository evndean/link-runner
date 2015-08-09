Drone = function(game, x, y) {

	Phaser.Sprite.call(this, game, x, y, 'drone');

	this.health = 100;
	this.batteryLevel = 100;

	// Physics
	game.physics.enable(this);
	this.body.allowGravity = false;
	this.body.collideWorldBounds = true;
	this.body.velocity.setTo(0, 0);
	this.body.bounce.setTo(0.3, 0.3);
	this.body.maxVelocity.set(250);
	this.body.drag.set(150);

	// Animations
	this.animations.add('fly', null, 25, true);
	this.anchor.setTo(0.5, 0.5)  // Sprite flips on center axis when switching directions.

	// LAZERS!
	this.lazers = game.add.group();
	this.lazers.enableBody = true;
	this.lazers.physicsBodyType = Phaser.Physics.ARCADE;
	this.lazers.createMultiple(30, 'lazerBeam');

	// Initialize timer for lazers
	this.lazerTime = 0;

	// Controls
	this.cursors = game.input.keyboard.createCursorKeys(); // up, down, left, and right
	this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

Drone.prototype = Object.create(Phaser.Sprite.prototype);
Drone.prototype.constructor = Drone;

Drone.prototype.collide = function () {

	// Reduce health by 1, update health text
	this.health = this.health - 1;

}

Drone.prototype.isDead = function () {

	if (this.health < 1) {
		return true;
	}

	if (this.batteryLevel < 1) {
		return true;
	}

	return false;

}

// Automatically called by World.update
Drone.prototype.update = function() {

	// Reset player acceleration
	this.body.acceleration.setTo(0, 0);

	// Play animation
	this.animations.play('fly');

	// Movement left/right
	if (this.cursors.left.isDown)
	{
		this.body.acceleration.x = -250;
		this.scale.x = -1;
		if (this.angle > -14)
		{
			// Rotate sprite to the left
			this.angle--;
		}
	}
	else if (this.cursors.right.isDown)
	{
		this.body.acceleration.x = 250;
		this.scale.x = 1;
		if (this.angle < 14)
		{
			// Rotate sprite to the right
			this.angle++;
		}
	}
	else
	{
		if (this.angle > 0)
		{
			this.angle--;
		}
		if (this.angle < 0)
		{
			this.angle++;
		}
	}

	// Movement up/down
	if (this.cursors.up.isDown)
	{
		this.body.acceleration.y -= 250;
	}
	if (this.cursors.down.isDown)
	{
		this.body.acceleration.y += 250;
	}

	// Firing?
	if (this.fireButton.isDown)
	{
		this.fireLazer();
	}

}

Drone.prototype.fireLazer = function() {

	//  To avoid them being allowed to fire too fast we set a time limit
	if (this.game.time.now > this.lazerTime) {

		//  Grab the first bullet we can from the pool
		this.lazerBeam = this.lazers.getFirstExists(false);

		if (this.lazerBeam) {

			//  And fire it in the direction that the player is facing
			this.lazerBeam.reset(this.body.x, this.body.y);
			this.lazerBeam.angle = 90 * this.scale.x;
			this.lazerBeam.body.velocity.x = 400 * this.scale.x;
			this.lazerTime = this.game.time.now + 200;

		}

	}

}

Drone.prototype.lazerHitsMap = function() {

	// Remove the lazerbeam from the screen
	this.lazerBeam.kill();

}
