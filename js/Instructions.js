var LinkRunner = LinkRunner || {};

LinkRunner.Instructions = function(game) {};

LinkRunner.Instructions.prototype.create = function() {

	// Display the name of the game
	var nameLabel = this.game.add.text(80, 80, 'Controls', { font: '50px Arial', fill: '#ffffff' });

	// Display controls
	var controlText = 'Arrow keys (up, down, left, right) to move\nSpacebar to shoot'
	var controlLabel = this.game.add.text(100, 200, controlText, { font: '25px Arial', fill: '#ffffff' });

	// Display instructions
	var startLabel = this.game.add.text(80, this.game.world.height-100, 'Press space to continue', { font: '25px Arial', fill: '#ffffff' });

	// Player input
	var startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	// Call the start function
	startKey.onDown.addOnce(this.start, this);

};

LinkRunner.Instructions.prototype.start = function() {

	this.game.state.start('Game');

};