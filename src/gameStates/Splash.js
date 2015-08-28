var LinkRunner = LinkRunner || {};

LinkRunner.Splash = function(game) {};

LinkRunner.Splash.prototype.create = function() {

	// Display the name of the game
	var nameLabel = this.game.add.text(80, 80, 'Link Runner', { font: '42px PressStart2P', fill: '#ffffff' });

	// Display instructions
	var startLabel = this.game.add.text(80, this.game.world.height-100, 'Press space to continue', { font: '16px PressStart2P', fill: '#ffffff' });

	// Add player input
	var startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	// Call the start function
	startKey.onDown.addOnce(this.start, this);

};

LinkRunner.Splash.prototype.start = function() {

	this.game.state.start('Instructions');

};