var LinkRunner = LinkRunner || {};

LinkRunner.Boot = function(game) {};

LinkRunner.Boot.prototype.create = function() {

	// Start the physics system
	this.game.physics.startSystem(Phaser.Physics.ARCADE);

	// Call the load state
	this.game.state.start('Load');

}