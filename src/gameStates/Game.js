var LinkRunner = LinkRunner || {};

LinkRunner.Game = function(game) {};

LinkRunner.Game.prototype.preload = function () {

	// Load assets if needed

};

LinkRunner.Game.prototype.create = function () {

	// Get data for the current level from the levels data structure
	var level = levels[this.game.currentLevel-1];
	this.currentTilemap        = level.tilemap;
	this.currentTilesets       = level.tilesets;
	this.currentCollisionTiles = level.collisionTiles;
	this.currentBarriers       = level.barriers;
	this.startTileId           = level.startTileId;

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

	// Enable collisions for tilemap items
	this.enableTileCollisions(this.currentCollisionTiles.pipeWalls, this.pipeWalls);
	this.enableTileCollisions(this.currentCollisionTiles.endZone, this.endZone);

	// Resize the world
	this.background.resizeWorld();

	// Add barriers group (to shoot at)
	this.addBarriersToMap();

	// Get player's starting coordinates
	var startTile = this.map.searchTileIndex(this.startTileId, 0, false, this.startZone);
	var startX = startTile.worldX + startTile.centerX;
	var startY = startTile.worldY + startTile.centerY;

	// Create controls
	this.game.controls = this.game.input.keyboard.createCursorKeys();  // up, down, left, and right
	this.game.controls.shoot = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	// Create player
	this.player = new Drone(this.game, startX, startY);
	this.game.add.existing(this.player);

	// Initialize game state text
	this.stateText = this.game.add.text(400, 300,' ', { font: '42px PressStart2P', fill: '#ffffff' });
	this.stateText.fixedToCamera = true;
	this.stateText.cameraOffset.setTo(400, 300);
    this.stateText.anchor.setTo(0.5, 0.5);
    this.stateText.visible = false;

	// Set the camera to follow the player
	this.game.camera.follow(this.player);

	// Show HUD
	this.game.$hud.show();

	// Initialize variable for time tracking
	this.elapsedTimeMS = 0;

};

LinkRunner.Game.prototype.update = function () {

	if ( this.player.alive ) {

		// Update time tracking
		this.elapsedTimeMS += this.game.time.physicsElapsedMS;

		// Update the HUD
		this.hudUpdate();

		// Check for collisions
		this.game.physics.arcade.collide(this.player, this.pipeWalls, this.player.onCollision, this.player.beforeCollision, this.player);
		this.game.physics.arcade.collide(this.player, this.barriers, this.player.onCollision, this.player.beforeCollision, this.player);;
		this.game.physics.arcade.collide(this.player.weapon.children, this.pipeWalls, this.player.weapon.hitWall, null, this.player);
		this.game.physics.arcade.collide(this.player.weapon.children, this.barriers, this.player.weapon.hitBarrier, null, this.player);
		this.game.physics.arcade.overlap(this.player, this.endZone, this.winLevel, null, this);

	} else {

		// Player died, call lose level function
		this.loseLevel();

	}

};

LinkRunner.Game.prototype.enableTileCollisions = function (tiles, layer) {

	if (tiles.length > 0) {
		for (i=0; i<tiles.length; i++) {
			var tile = tiles[i];
			this.map.setCollision(tile, true, layer);
		}
	}

};

LinkRunner.Game.prototype.addBarriersToMap = function () {

	if (this.currentBarriers.length > 0)
	{
		this.barriers = this.game.add.group();
		this.barriers.enableBody = true;
		for ( i = 0; i < this.currentBarriers.length; i++ )
		{
			var b = this.currentBarriers[i];
			this.map.createFromObjects(b.groupName, b.layerName, b.spriteKey, b.spriteFrame, true, false, this.barriers);
		}
		this.barriers.physicsBodyType = Phaser.Physics.ARCADE;
		this.barriers.setAll('body.immovable', true);
	}

};

LinkRunner.Game.prototype.hudUpdate = function () {

	var elapsedSeconds = Math.floor(this.elapsedTimeMS / 1000);
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
	this.game.$hud.html(hudHTML);
	
};

LinkRunner.Game.prototype.winLevel = function () {

	// If the player was holding keys, send a release message
	this.game.controls.up.onUp.dispatch();
	this.game.controls.down.onUp.dispatch();
	this.game.controls.left.onUp.dispatch();
	this.game.controls.right.onUp.dispatch();
	this.game.controls.shoot.onUp.dispatch();

	// Remove event listeners (from the player)
	this.game.controls.up.onDown.removeAll(this.player);
	this.game.controls.up.onUp.removeAll(this.player);
	this.game.controls.down.onDown.removeAll(this.player);
	this.game.controls.down.onUp.removeAll(this.player);
	this.game.controls.left.onDown.removeAll(this.player);
	this.game.controls.left.onUp.removeAll(this.player);
	this.game.controls.right.onDown.removeAll(this.player);
	this.game.controls.right.onUp.removeAll(this.player);
	this.game.controls.shoot.onDown.removeAll(this.player);
	this.game.controls.shoot.onUp.removeAll(this.player);

	// Did the player win the game?
	if (this.game.currentLevel == levels.length) {

		this.game.state.start('Win');

	} else {

		// Display text
		this.stateText.text = 'LEVEL COMPLETE\n\nPRESS SPACE\nTO CONTINUE';
		this.stateText.visible = true;

		// Add event handler to advance to the next level
		this.game.controls.shoot.onDown.addOnce(this.nextLevel, this);

	}
	
};

LinkRunner.Game.prototype.loseLevel = function () {

	// Remove the player sprite
	this.player.destroy();

	// Display 'game over' text
	this.stateText.text = 'GAME OVER\n\nPRESS SPACE\nTO RESTART LEVEL';
	this.stateText.visible = true;

	// Create 'space to restart' button handler
	var restartKey = this.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );

	// Call the reload level function
	restartKey.onDown.addOnce(this.reloadLevel, this);

};

LinkRunner.Game.prototype.nextLevel = function () {

	this.game.currentLevel++;

	this.game.state.start('Game');

};

LinkRunner.Game.prototype.reloadLevel = function () {

	this.game.state.start('Game');

};
