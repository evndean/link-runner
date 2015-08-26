var LinkRunner = LinkRunner || {};

LinkRunner.Game = function(game) {};

LinkRunner.Game.prototype.init = function () {

	this.map = null;

	this.background = null;
	this.pipeWalls = null;

	this.player = null;

	this.batteryDrainTimer = null;

	this.stateText = null;

	this.$hud = null;

	this.startTime = null;

	var level = levels[this.game.currentLevel-1];
	this.currentTilemap        = level.tilemap;
	this.currentTilesets       = level.tilesets;
	this.currentCollisionTiles = level.collisionTiles;
	this.startTileId           = level.startTileId;

};

LinkRunner.Game.prototype.preload = function () {

	// Load assets if needed

};

LinkRunner.Game.prototype.enableCollisions = function (tiles, layer) {

	if (tiles.length > 0) {
		for (i=0; i<tiles.length; i++) {
			var tile = tiles[i];
			this.map.setCollision(tile, true, layer);
		}
	}

};

LinkRunner.Game.prototype.create = function () {

	// Add tilemap
	this.map = this.game.add.tilemap(this.currentTilemap);

	// Add tilesets
	for (i=0; i<this.currentTilesets.length; i++) {
		this.map.addTilesetImage(this.currentTilesets[i].name);
	}

	// Add tile layers
	this.background = this.map.createLayer('background');
	this.pipeWalls = this.map.createLayer('pipeWalls');
	this.startZone = this.map.createLayer('startZone');
	this.endZone = this.map.createLayer('endZone');

	// Hide startZone and endZone
	this.startZone.visible = false;
	this.endZone.visible = false;

	// Enable collisions
	this.enableCollisions(this.currentCollisionTiles.pipeWalls, this.pipeWalls);
	this.enableCollisions(this.currentCollisionTiles.endZone, this.endZone);

	// Resize the world
	this.background.resizeWorld();

	// Add barriers group (to shoot at)
	this.barriers = this.game.add.group();
	this.barriers.enableBody = true;
	this.map.createFromObjects('barriers', 4, 'dirt', 4, true, false, this.barriers);
	this.barriers.physicsBodyType = Phaser.Physics.ARCADE;
	this.barriers.setAll('body.immovable', true);

	// Get player's starting coordinates
	var startTile = this.map.searchTileIndex(this.startTileId, 0, false, this.startZone);
	var startX = startTile.worldX + startTile.centerX;
	var startY = startTile.worldY + startTile.centerY;

	// Create player
	this.player = new Drone(this.game, startX, startY);
	this.game.add.existing(this.player);

	// Create battery drain timer
	this.batteryDrainTimer = this.game.time.create(false);
	this.batteryDrainTimer.loop(5000, this.reduceBatteryPower, this);
	this.batteryDrainTimer.start();

	// Game state text
	this.stateText = this.game.add.text(400, 300,' ', { font: '50px Arial', fill: '#ffffff' });
	this.stateText.fixedToCamera = true;
	this.stateText.cameraOffset.setTo(400, 300);
    this.stateText.anchor.setTo(0.5, 0.5);
    this.stateText.visible = false;

	// Set the camera to follow the player
	this.game.camera.follow(this.player);

	// Create HUD
	this.$hud = $( "#hud" );

	// Set the game's start time (miliseconds)
	this.startTime = this.game.time.now;

}

LinkRunner.Game.prototype.update = function () {

	// Update the HUD
	this.hudUpdate();

	// Enable collisions between player and barriers
	this.game.physics.arcade.collide(this.player, this.barriers);

	// Check for collisions
	this.game.physics.arcade.collide(this.player, this.pipeWalls, this.player.onCollision, this.player.beforeCollision, this.player);
	this.game.physics.arcade.overlap(this.player.weapon.children, this.pipeWalls, this.player.weapon.hitWall, null, this.player);
	this.game.physics.arcade.overlap(this.player.weapon.children, this.barriers, this.player.weapon.hitBarrier, null, this.player);
	this.game.physics.arcade.overlap(this.player, this.endZone, this.winLevel, null, this);

	// Player dead?
	if (this.player.isDead())
	{
		this.player.destroy();

		this.batteryDrainTimer.stop();

		this.stateText.text = 'GAME OVER\nClick to restart level';
		this.stateText.visible = true;

		// 'click to restart' handler
		this.game.input.onTap.addOnce(this.reloadLevel, this);
	}

}

LinkRunner.Game.prototype.hudUpdate = function () {

	var elapsedSeconds = this.timeElapsedSeconds();
	var minutes = Math.floor(elapsedSeconds / 60) % 60;
	var seconds = elapsedSeconds % 60;

	var hudHTML;
	hudHTML = "<p>";
	hudHTML += "Health: " + this.player.health;
	hudHTML += "  |  ";
	hudHTML += "Battery: " + this.player.batteryLevel;
	hudHTML += "  |  ";
	hudHTML += "Time elapsed: " + minutes + ":" + ( seconds < 10 ? "0" + seconds : seconds );
	hudHTML += "</p>";
	this.$hud.html(hudHTML);
	
}

LinkRunner.Game.prototype.winLevel = function () {

	// // Disable player input?
	// // trying to hijack the cursors doesn't work, and removing them from the drone
	// // breaks an update loop
	// this.cursors = this.game.input.keyboard.createCursorKeys();

	// Did the player win the game?
	if (this.game.currentLevel == levels.length) {

		this.game.state.start('Win');

	}

	// Display text
	this.stateText.text = 'LEVEL COMPLETE\n\nPRESS SPACE\nTO CONTINUE';
	this.stateText.visible = true;

	// Wait for player input
	var continueKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	// Call the start function
	continueKey.onDown.addOnce(this.nextLevel, this);
	
}

LinkRunner.Game.prototype.nextLevel = function () {

	this.game.currentLevel++;

	this.game.state.start('Game');

}

LinkRunner.Game.prototype.reduceBatteryPower = function () {

	this.player.batteryLevel--;

},

LinkRunner.Game.prototype.reloadLevel = function () {

	this.game.state.start('Game');

}

LinkRunner.Game.prototype.timeElapsedSeconds = function () {

	var elapsedMs = this.game.time.now - this.startTime;

	return Math.floor(elapsedMs / 1000);

}