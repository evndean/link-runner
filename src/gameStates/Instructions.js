var LinkRunner = LinkRunner || {};

LinkRunner.Instructions = function(game) {};

LinkRunner.Instructions.prototype.create = function() {

	var headerFont = { font: '50px Arial', fill: '#ffffff' };
	var bodyFont = { font: '25px Arial', fill: '#ffffff' };

	// Header - Instructions
	var instructionsHeader = this.game.add.text(80, 80, 'Instructions', headerFont);

	// Display instructions
	var instructionsBody = this.game.add.text(100, 160, 'Guide the drone to the exit', bodyFont);

	// Header - Controls
	var controlsHeader = this.game.add.text(80, 280, 'Controls', headerFont);

	// Display controls
	var controlText = 'Arrow keys (up, down, left, right) to move\nSpacebar to shoot'
	var controlLabel = this.game.add.text(100, 360, controlText, bodyFont);

	// Display instructions
	var startLabel = this.game.add.text(80, this.game.world.height-100, 'Press space to continue', bodyFont);

	// Player input
	var startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	// Call the start function
	startKey.onDown.addOnce(this.start, this);

};

LinkRunner.Instructions.prototype.start = function() {

	this.game.state.start('Game');

};