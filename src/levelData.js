// tilemap layers (consistent across all levels):
// 	background
// 	pipeWalls
// 	startZone
//  endZone


var levels = [
	{
		tilemap: "training-01",
		tilesets: [
			{
				source: "pipe-walls.png",
				name: "pipe-walls",
			}
		],
		startTileId: 12,
		collisionTiles: {
			background: [],
			pipeWalls: [ 27 ],
			endZone: [ 12 ],
		},
		barriers: [],
	}, {
		tilemap: "training-02",
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
			endZone: [ 12 ],
		},
		barriers: [
			{
				groupName: 'barriers',
				layerName: 4,
				spriteKey: 'dirtSheet',
				spriteFrame: 3,
			},
		],
	}, {
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
			endZone: [ 12 ],
		},
		barriers: [],
	},
]
