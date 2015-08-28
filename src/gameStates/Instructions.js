var LinkRunner = LinkRunner || {};

LinkRunner.Instructions = function(game) {};

LinkRunner.Instructions.prototype.create = function() {

	var headerFont = { font: '42px PressStart2P', fill: '#ffffff' };
	var bodyFont = { font: '16px PressStart2P', fill: '#ffffff' };

	// Initialize timer for blinking text
	this.blinkTimer = 0;
	this.blinkInterval = 1000;

	// Add text to screen
	this.instructionsHeaderText = this.game.add.text(80, 80, 'Instructions', headerFont);
	this.instructionsBodyText = this.game.add.text(100, 160, 'Guide the drone to the exit', bodyFont);
	this.controlsHeaderText = this.game.add.text(80, 280, 'Controls', headerFont);
	this.controlsBodyText = this.game.add.text(100, 360, 'Arrow keys (up, down, left, right) to move\nSpacebar to shoot', bodyFont);
	this.pressStartText = this.game.add.text(80, this.game.world.height-100, 'Press space to continue', bodyFont);

	// Start with the 'press start' text hidden
	this.pressStartText.visible = false;

	// Add player input
	this.startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	// Call the start function
	this.startKey.onDown.addOnce(this.start, this);

};

LinkRunner.Instructions.prototype.update = function() {

	this.blinkTimer += this.game.time.elapsed;
	if (this.blinkTimer >= this.blinkInterval)
	{
		this.blinkTimer -= this.blinkInterval;
		this.pressStartText.visible = !this.pressStartText.visible;
	}

};

LinkRunner.Instructions.prototype.start = function() {

	// Initialize the current level counter
	this.game.currentLevel = 1;

	this.game.state.start('Game');

};