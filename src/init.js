var LinkRunner = LinkRunner || {};

LinkRunner.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

// Game States
LinkRunner.game.state.add('Boot', LinkRunner.Boot);
LinkRunner.game.state.add('Preloader', LinkRunner.Preloader);
LinkRunner.game.state.add('Splash', LinkRunner.Splash);
LinkRunner.game.state.add('Instructions', LinkRunner.Instructions);
LinkRunner.game.state.add('Game', LinkRunner.Game);
LinkRunner.game.state.add('Win', LinkRunner.Win);

// Start the game by calling the boot state
LinkRunner.game.state.start('Boot');