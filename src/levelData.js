// tilemap layers (consistent across all levels):
// 	background
// 	pipeWalls
// 	winZone
// 	startZone


var levels = [
	{
		level: 1,
		tilemap: "map-01",
		tilesets: [
			{
				source: "dirt-platformer-tiles.png",
				name: "dirt",
			}, {
				source: "pipe-walls.png",
				name: "pipe-walls",
			}
		],
		startTileId: 12,
		collisionTiles: {
			background: [],
			pipeWalls: [ 27 ],
			winZone: [ 12 ],
		},
	}, {
		level: 2,
		tilemap: "banana",
		tilesets: [],
		startTileId: 12,
		collisionTiles: {},
	}
]