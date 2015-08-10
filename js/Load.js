var LinkRunner = LinkRunner || {};

LinkRunner.Load = function(game) {};

LinkRunner.Load.prototype.preload = function () {

	// Load the assets
	this.load.tilemap('map-01', 'assets/opengameart/tilemaps/json/map-01.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.image('dirt', 'assets/opengameart/tilemaps/tiles/dirt-platformer-tiles.png');
	this.load.image('pipe-walls', 'assets/opengameart/tilemaps/tiles/pipe-walls.png');
	this.load.image('lazerBeam', 'assets/phaser/games/invaders/bullet.png');  // Temporarily using a bullet image
	this.load.spritesheet('drone', 'assets/spritesheets/drone.png', 64, 26);

}

LinkRunner.Load.prototype.create = function () {

	// Call the splash state
	this.game.state.start('Splash');

}