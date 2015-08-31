var LinkRunner = LinkRunner || {};

LinkRunner.Boot = function (game) {};

LinkRunner.Boot.prototype.init = function () {

	// No need for multi-touch
	this.input.maxPointers = 1;

	// Stop Phaser from automatically pausing if the browser tab loses focus
	this.stage.disableVisibilityChange = true;

	// Hide the HUD DIV
	this.game.$hud = $('#hud');
	this.game.$hud.hide();

};

LinkRunner.Boot.prototype.preload = function () {

	// If using a preloader progress bar, load the assets for it here

};

LinkRunner.Boot.prototype.create = function () {

	// Start the physics system
	this.game.physics.startSystem(Phaser.Physics.ARCADE);

	// Call the load state
	this.game.state.start('Preloader');

};