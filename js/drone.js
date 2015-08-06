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

	// Controls
	this.cursors = game.input.keyboard.createCursorKeys(); // up, down, left, and right
	this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

Drone.prototype = Object.create(Phaser.Sprite.prototype);
Drone.prototype.constructor = Drone;

Drone.prototype.collide = function () {

	// Reduce health by 1, update health text
	this.health = this.health - 1;
	healthText.text = 'Health: ' + this.health;

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
			this.angle--;
		}
	}
	else if (this.cursors.right.isDown)
	{
		this.body.acceleration.x = 250;
		this.scale.x = 1;
		if (this.angle < 14)
		{
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
		fireLazer();
	}

}