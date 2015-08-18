var LinkRunner = LinkRunner || {};

LinkRunner.Game = function(game) {

	this.map = null;

	this.background = null;
	this.pipeWalls = null;

	this.player = null;

	this.weapons = [];

	this.batteryDrainTimer = null;

	this.stateText = null;

	this.$hud = null;

};

LinkRunner.Game.prototype.create = function() {

	// Add tilemap
	this.map = this.game.add.tilemap('map-01');
	this.map.addTilesetImage('dirt');
	this.map.addTilesetImage('pipe-walls');

	// Add tile layers
	this.background = this.map.createLayer('background');
	this.pipeWalls = this.map.createLayer('pipe-walls');
	this.winZone = this.map.createLayer('win-zone');

	// Enable collisions on the pipeWalls layer
	this.map.setCollision(27, true, this.pipeWalls);  // pipe wall

	// Enable collision with the winZone layer
	this.map.setCollision(12, true, this.winZone); // blue tiles

	// Resize the world
	this.background.resizeWorld();

	// Create player
	this.player = new Drone(this.game, 2514, 96);
	this.game.add.existing(this.player);

	// Create battery drain timer
	this.batteryDrainTimer = this.game.time.create(false);
	this.batteryDrainTimer.loop(5000, this.reduceBatteryPower, this);
	this.batteryDrainTimer.start();

	// Game state text
	this.stateText = this.game.add.text(400, 300,' ', { fontSize: '60px', fill: '#000' });
	this.stateText.fixedToCamera = true;
	this.stateText.cameraOffset.setTo(400, 300);
    this.stateText.anchor.setTo(0.5, 0.5);
    this.stateText.visible = false;

	// Set the camera to follow the player
	this.game.camera.follow(this.player);

	// Create HUD
	this.$hud = $( "#hud" );

}

LinkRunner.Game.prototype.update = function() {

	// Update the HUD
	this.hudUpdate();

	// Check for collisions
	this.game.physics.arcade.overlap(this.player, this.pipeWalls, this.player.collide, null, this.player);
	this.game.physics.arcade.overlap(this.player.weapon.children, this.pipeWalls, this.player.weapon.hitWall, null, this.player);
	this.game.physics.arcade.overlap(this.player, this.winZone, this.winGame, null, this);

	// Player dead?
	if (this.player.isDead())
	{
		this.player.kill();

		this.batteryDrainTimer.stop();

		this.stateText.text = 'GAME OVER\nClick to restart';
		this.stateText.visible = true;

		// 'click to restart' handler
		this.game.input.onTap.addOnce(this.restart, this);
	}

}

LinkRunner.Game.prototype.hudUpdate = function() {

	var hudHTML;
	hudHTML = "<p>";
	hudHTML += "Health: " + this.player.health;
	hudHTML += "  |  ";
	hudHTML += "Battery: " + this.player.batteryLevel;
	hudHTML += "</p>";
	this.$hud.html(hudHTML);
	
}

LinkRunner.Game.prototype.winGame = function() {

	this.game.state.start('Win');
	
}

LinkRunner.Game.prototype.reduceBatteryPower = function() {

	this.player.batteryLevel--;

},

LinkRunner.Game.prototype.restart = function() {

	// Revive the player
	this.player.revive();
	this.player.body.velocity.setTo(0, 0);
	this.player.health = 100;
	this.player.batteryLevel = 100;

	// Recreate battery drain timer
	this.batteryDrainTimer = this.game.time.create(false);
	this.batteryDrainTimer.loop(5000, this.reduceBatteryPower, this);
	this.batteryDrainTimer.start();

	// Hide state text
	this.stateText.visible = false;

}
