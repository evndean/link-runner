var Drone = function(game, x, y) {

	Phaser.Sprite.call(this, game, x, y, 'drone');

	// Health
	this.alive = true;  // Initialize variable to track whether the player is alive or not
	this.health = 3;    // Initialize the player's health level

	// Battery
	this.batteryLevel = 100;           // Initialize the drone's battery level
	this.batteryDrainTimer = 0;        // Initialize timer to slowly drain the battery
	this.batteryDrainInterval = 5000;  // Time (in ms) after which the battery level is reduced by 1
	this.batteryDrainWhenFiring = 5;   // Amount by which the battery is drained when a shot is fired

	// Physics
	game.physics.enable(this);
	this.body.allowGravity = false;
	this.body.collideWorldBounds = true;
	this.body.velocity.setTo(0, 0);
	this.body.bounce.setTo(0.35, 0.35);
	this.body.maxVelocity.set(250);
	this.body.drag.set(150);

	this.hardCollision = 50;          // Minimum velocity required for a collision to hurt the player
	this.velocityAtCollision = null;  // Initialize variable used for collision handling

	// Animations
	this.animations.add('fly', null, 25, true);
	this.animations.play('fly');
	this.anchor.setTo(0.5, 0.5);  // Sprite flips on center axis when switching directions.

	// Sound Effects
	this.crashSound = game.add.audio('crash');

	// Weapon
	this.weapon = new Weapon.Beam(this.game);

	// Add player controls
	this.cursors = game.input.keyboard.createCursorKeys();  // up, down, left, and right
	this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

};

Drone.prototype = Object.create(Phaser.Sprite.prototype);
Drone.prototype.constructor = Drone;

// Update loop (utomatically called by World.update)
Drone.prototype.update = function() {

	// Update battery drain timer
	this.batteryDrainTimer += this.game.time.elapsed;

	// Reduce the battery level if the interval was reached
	if (this.batteryDrainTimer >= this.batteryDrainInterval) {

		this.batteryDrainTimer -= this.batteryDrainInterval;
		this.reduceBatteryLevel(1);

	}

	// Check health
	if (this.health < 1 || this.batteryLevel < 1) { this.alive = false; }

	// Reset acceleration
	this.body.acceleration.setTo(0, 0);

	// Movement left/right
	if (this.cursors.left.isDown) {

		this.body.acceleration.x = -250;
		this.scale.x = -1;

		// Rotate left
		if (this.angle > -14) { this.angle--; }

	} else if (this.cursors.right.isDown) {

		this.body.acceleration.x = 250;
		this.scale.x = 1;

		// Rotate right
		if (this.angle < 14) { this.angle++; }

	} else {

		// Rotate back to level
		if (this.angle > 0) { this.angle--; }
		if (this.angle < 0) { this.angle++; }

	}

	// Movement up/down
	if (this.cursors.up.isDown) { this.body.acceleration.y -= 250; }
	if (this.cursors.down.isDown) { this.body.acceleration.y += 250; }

	// Firing?
	if (this.fireButton.isDown) { this.weapon.fire(this); }

};

Drone.prototype.beforeCollision = function () {

	// Get the player's velocity at the time of collision (player's velocity gets reset to 0 before onCollision() is called)
	this.velocityAtCollision = this.body.velocity;

	// Return true so onCollision() gets called upon collision
	return true;

};

Drone.prototype.onCollision = function () {

	if (Math.abs(this.velocityAtCollision.x) >= this.hardCollision || Math.abs(this.velocityAtCollision.y) >= this.hardCollision) {

		// Play crash sound
		this.crashSound.play();

		// Reduce health by 1
		this.health -= 1;

	}

};

Drone.prototype.reduceBatteryLevel = function (amount) {

	this.batteryLevel -= amount;

};

Drone.prototype.disableInput = function () {

	this.game.input.keyboard.removeKey(Phaser.Keyboard.UP);
	this.game.input.keyboard.removeKey(Phaser.Keyboard.DOWN);
	this.game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
	this.game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
	this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);

};
