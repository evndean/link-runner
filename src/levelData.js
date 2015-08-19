// tilemap layers (consistent across all levels):
// 	background
// 	pipeWalls
// 	winZone
// 	startZone


var levels = [
	{
		level: 1,
		tilemap: "map-01.json",
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
			winZone: [ 12 ],
			startZone: [],
		},
	}
]