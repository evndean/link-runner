var LinkRunner = LinkRunner || {};

LinkRunner.Preloader = function (game) {};

LinkRunner.Preloader.prototype.preload = function () {

	// If using a preloader progress bar, initialize it here

	// Load the game assets
	this.load.tilemap('map-01', 'assets/tilemaps/json/map-01.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.tilemap('training-01', 'assets/tilemaps/json/training-01.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.image('dirt', 'assets/tilemaps/tiles/dirt-platformer-tiles.png');
	this.load.image('pipe-walls', 'assets/tilemaps/tiles/pipe-walls.png');
	this.load.image('lazerBeam', 'assets/phaser/games/invaders/bullet.png');  // Temporarily using a bullet image
	this.load.spritesheet('drone', 'assets/spritesheets/drone.png', 64, 26);
	this.load.audio('laser', 'assets/audio/33-laser.wav');
	this.load.audio('crash', 'assets/audio/14-crash.wav');

};

LinkRunner.Preloader.prototype.create = function () {

	// Call the splash state
	this.game.state.start('Splash');

};