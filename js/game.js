var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

	game.load.tilemap('map-01', 'assets/opengameart/tilemaps/json/map-01.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('station-32', 'assets/opengameart/tilemaps/tiles/space-station-tileset-32.png');
	game.load.image('dirt', 'assets/opengameart/tilemaps/tiles/dirt-platformer-tiles.png');
	game.load.image('background','assets/phaser/tests/debug-grid-1920x1920.png'); // Temporarily using a test background
	game.load.image('lazerBeam', 'assets/phaser/games/invaders/bullet.png');  // Temporarily using a bullet image
	game.load.spritesheet('drone', 'assets/spritesheets/drone.png', 64, 26);

}

var player;
var lazers;
var lazerTime = 0;
var map;
var background;
var pipeWalls;
var cursors;
var fireButton;
var score = 0;
var batteryDrainTimer;
var healthText;
var batteryLevelText;
var stateText;

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);

	// Add tilemap
	map = game.add.tilemap('map-01');
	map.addTilesetImage('dirt');
	map.addTilesetImage('station-32');

	// Add layers
	background = map.createLayer('background');
	pipeWalls = map.createLayer('pipe-walls');

	// Enable collisions on the pipeWalls layer
	map.setCollisionBetween(25, 36, true, pipeWalls);  // station-32 tiles

	background.resizeWorld();

	// background.debugSettings.forceFullRedraw = true;
	// pipeWalls.resizeWorld();
	// pipeWalls.debugSettings.forceFullRedraw = true;

	// Create player
	player = new Drone(game, 100, 100);
	game.add.existing(player);

	// LAZERS!
	lazers = game.add.group();
	lazers.enableBody = true;
	lazers.physicsBodyType = Phaser.Physics.ARCADE;
	lazers.createMultiple(30, 'lazerBeam');

	// Create battery drain timer
	batteryDrainTimer = game.time.create(false);
	batteryDrainTimer.loop(5000, reduceBatteryPower, this);
	batteryDrainTimer.start();

	// Display player stats
	healthText = game.add.text(4, 4, 'Health: ' + player.health, { fontSize: '32px', fill: '#000' });
	healthText.fixedToCamera = true;
	healthText.cameraOffset.setTo(4, 4);
	batteryLevelText = game.add.text(4, 36, 'Battery: ' + player.batteryLevel, { fontSize: '32px', fill: '#000' });
	batteryLevelText.fixedToCamera = true;
	batteryLevelText.cameraOffset.setTo(4, 36);

	// Game state text
	stateText = game.add.text(400, 300,' ', { fontSize: '60px', fill: '#000' });
	stateText.fixedToCamera = true;
	stateText.cameraOffset.setTo(400, 300);
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

	// Set the camera to follow the player
	game.camera.follow(player)

}

function reduceBatteryPower() {

	player.batteryLevel--;

	batteryLevelText.text = 'Battery: ' + player.batteryLevel;

}

function update() {

	game.debug.text('Time until battery drain: ' + batteryDrainTimer.duration.toFixed(0), 4, 80);
	game.debug.bodyInfo(player, 32, 320);

	// Check for collisions
	game.physics.arcade.overlap(player, pipeWalls, player.collide, null, player);
	game.physics.arcade.overlap(lazers, pipeWalls, lazerHitsMap, null, this);

	// Player dead?
	if (player.isDead())
	{
		player.kill();

		batteryDrainTimer.stop();

		stateText.text = 'GAME OVER\nClick to restart';
		stateText.visible = true;

		// 'click to restart' handler
		game.input.onTap.addOnce(restart, this);
	}

}

function lazerHitsMap (lazerBeam, layer) {

	// Remove the lazerbeam from the screen
	lazerBeam.kill();

}

function fireLazer () {

	//  To avoid them being allowed to fire too fast we set a time limit
	if (game.time.now > lazerTime)
	{
		//  Grab the first bullet we can from the pool
		lazerBeam = lazers.getFirstExists(false);

		if (lazerBeam)
		{
			//  And fire it in the direction that the player is facing
			lazerBeam.reset(player.x, player.y);
			lazerBeam.angle = 90 * player.scale.x;
			lazerBeam.body.velocity.x = 400 * player.scale.x;
			lazerTime = game.time.now + 200;
		}
	}
}

function restart () {

	// Revive the player
	player.revive();
	player.body.velocity.setTo(0, 0);
	player.health = 100;
	player.batteryLevel = 100;

	// Recreate battery drain timer
	batteryDrainTimer = game.time.create(false);
	batteryDrainTimer.loop(5000, reduceBatteryPower, this);
	batteryDrainTimer.start();

	healthText.text = 'Health: ' + player.health;
	batteryLevelText.text = 'Battery: ' + player.batteryLevel;

	// Hide state text
	stateText.visible = false;

}