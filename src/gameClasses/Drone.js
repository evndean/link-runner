var Drone = function(game, x, y) {

	Phaser.Sprite.call(this, game, x, y, 'drone');

	this.health = 3;
	this.batteryLevel = 100;
	this.hardCollision = 50;
	this.velocityAtCollision = null;

	// Physics
	game.physics.enable(this);
	this.body.allowGravity = false;
	this.body.collideWorldBounds = true;
	this.body.velocity.setTo(0, 0);
	this.body.bounce.setTo(0.35, 0.35);
	this.body.maxVelocity.set(250);
	this.body.drag.set(150);

	// Animations
	this.animations.add('fly', null, 25, true);
	this.animations.play('fly');
	this.anchor.setTo(0.5, 0.5)  // Sprite flips on center axis when switching directions.

	// Sound Effects
	this.crashSound = game.add.audio('crash');

	// Weapon
	this.weapon = new Weapon.Beam(this.game);

	// Controls
	this.cursors = game.input.keyboard.createCursorKeys(); // up, down, left, and right
	this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

Drone.prototype = Object.create(Phaser.Sprite.prototype);
Drone.prototype.constructor = Drone;

// Update loop (utomatically called by World.update)
Drone.prototype.update = function() {

	// Reset acceleration
	this.body.acceleration.setTo(0, 0);

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
		this.weapon.fire(this);
	}

}

Drone.prototype.beforeCollision = function () {

	// Get the player's velocity at the time of collision (player's velocity gets reset to 0 before onCollision() is called)
	this.velocityAtCollision = this.body.velocity;

	// Return true so onCollision() gets called upon collision
	return true;

}

Drone.prototype.onCollision = function () {

	if (Math.abs(this.velocityAtCollision.x) >= this.hardCollision || Math.abs(this.velocityAtCollision.y) >= this.hardCollision) {

		// Play crash sound
		this.crashSound.play();

		// Reduce health by 1
		this.health = this.health - 1;

	}

}

Drone.prototype.isDead = function () {

	if (this.health < 1)
	{
		return true;
	}

	if (this.batteryLevel < 1)
	{
		return true;
	}

	return false;

}
