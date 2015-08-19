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
		collisionTiles: {
			background: [],
			pipeWalls: [ 27 ],
			startZone: [],
			winZone: [ 12 ],
		},
	}, {
		level: 2,
		tilemap: "banana",
		tilesets: [],
		collisionTiles: {},
	}
]