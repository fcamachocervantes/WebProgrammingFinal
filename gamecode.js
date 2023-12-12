const Game = {
	width: 500,
	height: 700,
	canvas: document.getElementById("game_canvas"),
	
	nextFruitImg: document.getElementById("next_fruit"),
	score: document.getElementById("score"),
	currentScore: 0,
	merged: [],
	fruitSizes: [
		{ radius: 24, value: 1, img: "./images/fruit1.webp" },
		{ radius: 32, value: 2, img: "./images/fruit2.webp" },
		{ radius: 40, value: 3, img: "./images/fruit3.webp" },
		{ radius: 48, value: 4, img: "./images/fruit4.webp" },
		{ radius: 56, value: 5, img: "./images/fruit5.webp" },
		{ radius: 64, value: 6, img: "./images/fruit6.webp" },
		{ radius: 72, value: 7, img: "./images/fruit7.webp" },
		{ radius: 80, value: 8, img: "./images/fruit8.webp" },
		{ radius: 88, value: 9, img: "./images/fruit9.webp" },
		{ radius: 96, value: 10, img: "./images/fruit10.webp" },
		{ radius: 102, value: 11, img: "./images/fruit11.webp" },
	],
	
	calcScore: function() {
		const sc = Game.merged.reduce((total, count, size) => {
			const val = Game.fruitSizes[size].value * count;
			return total + val;
		}, 0);
		
		Game.currentScore = sc;
		Game.score.textContent = "Score: " + Game.currentScore;
	},
	
	startGame: function() {
		Game.calcScore();
	}
}

canvas = document.getElementById("game_canvas");
//const mouse = Mouse.create(render.canvas);
Game.startGame();
