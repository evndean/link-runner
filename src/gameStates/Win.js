var LinkRunner = LinkRunner || {};

LinkRunner.Win = function(game) {};

LinkRunner.Win.prototype.create = function() {

	// Display the name of the game
	var nameLabel = this.game.add.text(80, 80, 'You Won!', { font: '50px Arial', fill: '#ffffff' });

	// Display instructions
	var restartLabel = this.game.add.text(80, 500, 'Press space to play again', { font: '25px Arial', fill: '#ffffff' });

	// Player input
	var restartKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	// Call the start function
	restartKey.onDown.addOnce(this.restart, this);

};

LinkRunner.Win.prototype.restart = function() {

	this.game.currentLevel = 1;

	this.game.state.start('Game');

};