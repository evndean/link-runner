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

	// early test of levels data
	var currentLevel = 1;
	for (i=0; i<levels.length; i++) {
		if (levels[i].level == currentLevel) {
			this.currentTilemap = levels[i].tilemap;
			this.currentTilesets = levels[i].tilesets;
			this.currentCollisionTiles = levels[i].collisionTiles;
			this.startTileId = levels[i].startTileId;
		}
	}

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

	// // Add tile layers and enable collisions
	// for (var key in this.currentCollisionTiles) {
	// 	this.key = this.map.createLayer(key);
	// }

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
	this.stateText = this.game.add.text(400, 300,' ', { fontSize: '60px', fill: '#000' });
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

	// Check for collisions
	this.game.physics.arcade.overlap(this.player, this.pipeWalls, this.player.collide, null, this.player);
	this.game.physics.arcade.overlap(this.player.weapon.children, this.pipeWalls, this.player.weapon.hitWall, null, this.player);
	this.game.physics.arcade.overlap(this.player, this.endZone, this.winGame, null, this);

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

LinkRunner.Game.prototype.winGame = function () {

	this.game.state.start('Win');
	
}

LinkRunner.Game.prototype.reduceBatteryPower = function () {

	this.player.batteryLevel--;

},

LinkRunner.Game.prototype.restart = function () {

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

LinkRunner.Game.prototype.timeElapsedSeconds = function () {

	var elapsedMs = this.game.time.now - this.startTime;

	return Math.floor(elapsedMs / 1000);

}