var LinkRunner = LinkRunner || {};

LinkRunner.Splash = function(game) {};

LinkRunner.Splash.prototype.create = function() {

	// Initialize timer for blinking text
	this.blinkTimer = 0;
	this.blinkInterval = 1000;

	// Add text to screen
	this.titleText = this.game.add.text(80, 80, 'Link Runner', { font: '42px PressStart2P', fill: '#ffffff' });
	this.pressStartText = this.game.add.text(80, this.game.world.height-100, 'Press space to continue', { font: '16px PressStart2P', fill: '#ffffff' });

	// Start with the 'press start' text hidden
	this.pressStartText.visible = false;

	// Add player input
	this.startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	// Call the start function
	this.startKey.onDown.addOnce(this.start, this);

};

LinkRunner.Splash.prototype.update = function() {

	this.blinkTimer += this.game.time.elapsed;
	if (this.blinkTimer >= this.blinkInterval)
	{
		this.blinkTimer -= this.blinkInterval;
		this.pressStartText.visible = !this.pressStartText.visible;
	}

};

LinkRunner.Splash.prototype.start = function() {

	this.game.state.start('Instructions');

};