var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

	game.load.tilemap('map', 'assets/opengameart/station-tilemap-test.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('StationTileset', 'assets/opengameart/StationTileset.png');
	game.load.image('background','assets/phaser/tests/debug-grid-1920x1920.png'); // Temporarily using a test background
	game.load.image('lazerBeam', 'assets/phaser/games/invaders/bullet.png');  // Temporarily using a bullet image
	game.load.spritesheet('astronaut', 'assets/opengameart/astronaut3_0.png', 29, 37);

}

var worldWidth = 5000;
var worldHeight = 1000;
var player;
var lazers;
var lazerTime = 0;
var map;
var platforms;
var bmd;
var rechargeZone;
var rechargeTime = 0;
var cursors;
var fireButton;
var score = 0;
var batteryDrainTimer;
var healthText;
var batteryLevelText;
var stateText;

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);

	// Add background
	game.add.tileSprite(0, 0, worldWidth, worldHeight, 'background');

	game.world.setBounds(0, 0, worldWidth, worldHeight);

	// Add tilemap
	map = game.add.tilemap('map');
	map.addTilesetImage('StationTileset');
	map.setCollisionBetween(1, 12);  // Station Tilemap tiles

	platforms = map.createLayer('Platform Layer');
	platforms.resizeWorld();
	platforms.debugSettings.forceFullRedraw = true;

	// Add test charging zone
	bmd = game.add.bitmapData(100, 100);
	bmd.ctx.beginPath();
	bmd.ctx.rect(0, 0, 100, 100);
	bmd.ctx.fillStyle = 'yellow';
	bmd.ctx.fill();
	rechargeZone = game.add.sprite(300, 100, bmd);
	game.physics.enable(rechargeZone);

	// Create player
	player = game.add.sprite(100, 100, 'astronaut');
	player.health = 100;
	player.batteryLevel = 100;

	// Player physics
	game.physics.enable(player);
	player.body.allowGravity = false;
	player.body.collideWorldBounds = true;
	player.body.velocity.setTo(0, 0);
	player.body.bounce.setTo(0.3, 0.3);
	player.body.maxVelocity.set(250);
	player.body.drag.set(150);

	// Player animations
	player.animations.add('left', [1, 2], 10, true);
	player.animations.add('right', [2, 1], 10, true);
	player.anchor.setTo(0.5, 1)  // Sprite flips on center axis when switching directions.

	// LAZERS!
	lazers = game.add.group();
	lazers.enableBody = true;
	lazers.physicsBodyType = Phaser.Physics.ARCADE;
	lazers.createMultiple(30, 'lazerBeam');

	// Create battery drain timer
	batteryDrainTimer = game.time.create(false);
	batteryDrainTimer.loop(1000, reduceBatteryPower, this);
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

	// Controls
	cursors = game.input.keyboard.createCursorKeys();
	fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	// Set the camera to follow the player
	game.camera.follow(player)

}

function reduceBatteryPower() {

	player.batteryLevel--;

	batteryLevelText.text = 'Battery: ' + player.batteryLevel;

}

function update() {

	game.debug.text('Time until battery drain: ' + batteryDrainTimer.duration.toFixed(0), 4, 80);
	game.debug.text('rechargeTime: ' + rechargeTime, 4, 100);

	// Check for collisions
	game.physics.arcade.overlap(player, platforms, playerHitsMap, null, this);
	game.physics.arcade.overlap(lazers, platforms, lazerHitsMap, null, this);
	game.physics.arcade.overlap(player, rechargeZone, rechargeBattery, null, this);

	// Player dead?
	if (player.health < 1 || player.batteryLevel < 1)
	{
		player.kill();

		batteryDrainTimer.stop();

		stateText.text = 'GAME OVER\nClick to restart';
		stateText.visible = true;

		// 'click to restart' handler
		game.input.onTap.addOnce(restart, this);
	}

	// Reset player acceleration
	player.body.acceleration.setTo(0, 0);

	// Movement left/right
	if (cursors.left.isDown)
	{
		player.body.acceleration.x = -250;
		player.scale.x = -1;
		player.animations.play('left');
	}
	else if (cursors.right.isDown)
	{
		player.body.acceleration.x = 250;
		player.scale.x = 1;
		player.animations.play('right');
	}
	else
	{
		player.animations.stop();
		player.frame = 0;
	}

	// Movement up/down
	if (cursors.up.isDown)
	{
		player.body.acceleration.y -= 250;
	}
	else if (cursors.down.isDown)
	{
		player.body.acceleration.y += 250;
	}

	// Firing?
	if (fireButton.isDown)
	{
		fireLazer();
	}

}

function playerHitsMap (player, layer) {

	// Reduce health by 1, update health text
	player.health -= 1;
	healthText.text = 'Health: ' + player.health;

}

function lazerHitsMap (lazerBeam, layer) {

	// Remove the lazerbeam from the screen
	lazerBeam.kill();

}

function rechargeBattery () {

	// Don't recharge too quickly; set a time limit
	if (player.batteryLevel <= 100 && game.time.now > rechargeTime)
	{
		// Increase battery level
		player.batteryLevel++;
		rechargeTime = game.time.now + 500;

	}
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