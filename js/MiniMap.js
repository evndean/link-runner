var MiniMap = function(game, x, y, map) {

	// The pixel size of the mini map
	var pixelSize = 5;

	// Tile IDs
	var dirtId = 20;
	var pipeIds = [25, 26, 27, 28, 29];

	// The static map
	var miniMapBmd = game.add.bitmapData(map.width*pixelSize, map.height*pixelSize)
	// (width, height, key, addToCache)

	// Iterate over map layers
	for (l=0; l<map.layers.length; l++)
	{
		for (y=0; y<map.height; y++)
		{
			for (x=0; x<map.width; x++)
			{
				var tile = map.getTile(x, y, l);
				// check tile type and assign color
				if (tile && tile.index == dirtId)
				{
					miniMapBmd.ctx.fillStyle = '#413039';
					miniMapBmd.ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
				}
				for (i=0; i<pipeIds.length; i++)
				{
					if (tile && tile.index == pipeIds[i])
					{
						miniMapBmd.ctx.fillStyle = '#c1bcbc';
						miniMapBmd.ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
					}
				}
			}
		}
	}

	Phaser.Sprite.call(this, game, x, y, miniMapBmd);

};

MiniMap.prototype = Object.create(Phaser.Sprite.prototype);
MiniMap.prototype.constructor = MiniMap;

// Create the initial bitmap

// Method to reveal map