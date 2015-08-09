var LinkRunner = LinkRunner || {};

LinkRunner.Game = function(game) {};

LinkRunner.Game.prototype = {

	create: function() {

		// Add tilemap
		this.map = this.game.add.tilemap('map-01');
		this.map.addTilesetImage('dirt');
		this.map.addTilesetImage('pipe-walls');

		// Add layers
		this.background = this.map.createLayer('background');
		this.pipeWalls = this.map.createLayer('pipe-walls');

		// Enable collisions on the pipeWalls layer
		this.map.setCollision(27, true, this.pipeWalls);  // pipe wall

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

		this.$hud.update = function (player) {
			var hudHTML;
			hudHTML = "<p>";
			hudHTML += "Health: " + player.health;
			hudHTML += "  |  ";
			hudHTML += "Battery: " + player.batteryLevel;
			hudHTML += "</p>";
			this.html(hudHTML);
		}


	},

	update: function() {

		// Update the HUD
		this.$hud.update(this.player);

		// Check for collisions
		this.game.physics.arcade.overlap(this.player, this.pipeWalls, this.player.collide, null, this.player);
		this.game.physics.arcade.overlap(this.player.lazers, this.pipeWalls, this.player.lazerHitsMap, null, this.player);

		// Player dead?
		if (this.player.isDead())
		{
			this.player.kill();

			this.batteryDrainTimer.stop();

			this.stateText.text = 'GAME OVER\nClick to restart';
			this.stateText.visible = true;

			// 'click to restart' handler
			this.game.input.onTap.addOnce(restart, this);
		}

	},

	reduceBatteryPower: function() {

		this.player.batteryLevel--;

	},

	restart: function() {

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

	},

}