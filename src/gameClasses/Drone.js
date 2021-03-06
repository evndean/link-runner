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
	this.anchor.setTo(0.5, 0.5);  // Sprite flips on center axis when switching directions
	this.rotate = null;       // Initialize variable used for rotating the drone during the update phase
	this.maxRotation = 14;        // The maximum value for the angle of rotation of a sprite

	// Sound Effects
	this.crashSound = game.add.audio('crash');

	// Weapon
	this.weapon = new Weapon.Beam(this.game);
	this.isFiring = false;  // Initialize variable to track whether or not the player is currently firing

	// Add event listeners for player controls
	this.game.controls.up.onDown.add(this.handleUpOnDown, this);
	this.game.controls.up.onUp.add(this.handleUpOnUp, this);
	this.game.controls.down.onDown.add(this.handleDownOnDown, this);
	this.game.controls.down.onUp.add(this.handleDownOnUp, this);
	this.game.controls.left.onDown.add(this.handleLeftOnDown, this);
	this.game.controls.left.onUp.add(this.handleLeftOnUp, this);
	this.game.controls.right.onDown.add(this.handleRightOnDown, this);
	this.game.controls.right.onUp.add(this.handleRightOnUp, this);
	this.game.controls.shoot.onDown.add(this.handleShootOnDown, this);
	this.game.controls.shoot.onUp.add(this.handleShootOnUp, this);

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

	// Check rotation
	if (this.rotate == 'right') {
		if (Math.abs(this.angle) >= this.maxRotation) {
			this.rotate == null;
		} else {
			this.angle++;
		}
	}
	if (this.rotate == 'left') {
		if (Math.abs(this.angle) >= this.maxRotation) {
			this.rotate = null;
		} else {
			this.angle--;
		}
	}
	if (this.rotate == 'center') {
		if (this.angle == 0) {
			this.rotate == null;
		} else if (this.angle < 0) {
			this.angle++;
		} else {
			this.angle--;
		}
	}

	// Check health
	if (this.health < 1 || this.batteryLevel < 1) { this.alive = false; }

	// Is the player firing the laser?
	if (this.isFiring) { this.weapon.fire(this); }

};

Drone.prototype.handleUpOnDown = function () {
	this.body.acceleration.y = -250;
};

Drone.prototype.handleUpOnUp = function () {
	this.body.acceleration.y = 0;
};

Drone.prototype.handleDownOnDown = function () {
	this.body.acceleration.y = 250;
};

Drone.prototype.handleDownOnUp = function () {
	this.body.acceleration.y = 0;
};

Drone.prototype.handleRightOnDown = function () {
	this.body.acceleration.x = 250;
	this.scale.x = 1;
	this.rotate = 'right';
};

Drone.prototype.handleRightOnUp = function () {
	this.body.acceleration.x = 0;
	this.rotate = 'center';
};

Drone.prototype.handleLeftOnDown = function () {
	this.body.acceleration.x = -250;
	this.scale.x = -1;
	this.rotate = 'left';
};

Drone.prototype.handleLeftOnUp = function () {
	this.body.acceleration.x = 0;
	this.rotate = 'center';
};

Drone.prototype.handleShootOnDown = function () {

	this.isFiring = true;

};

Drone.prototype.handleShootOnUp = function () {

	this.isFiring = false;

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

		// Dispatch event to emphasize health text
		this.game.events.hudBlink.dispatch('health');

	}

};

Drone.prototype.reduceBatteryLevel = function (amount) {

	this.batteryLevel -= amount;

};
