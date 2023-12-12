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

	fruits: [],

	calcScore: function () {
		const sc = Game.merged.reduce((total, count, size) => {
			const val = Game.fruitSizes[size].value * count;
			return total + val;
		}, 0);

		Game.currentScore = sc;
		Game.score.textContent = "Score: " + Game.currentScore;
	},

	createFruit: function (x) {
		const randomSize = Game.fruitSizes[Math.floor(Math.random() * Game.fruitSizes.length)];
		const newFruit = {
			x: x,
			y: 0,
			size: randomSize,
			img: new Image(),
		};

		newFruit.img.src = randomSize.img;

		Game.fruits.push(newFruit);
	},

	moveFruits: function () {
		Game.fruits.forEach((fruit) => {
			if (fruit.y + fruit.size.radius * 2 < Game.height) {
				fruit.y += 5;
			}
		});
	},


	drawFruits: function () {
		Game.fruits.forEach((fruit) => {
			context.drawImage(fruit.img, fruit.x, fruit.y, fruit.size.radius * 2, fruit.size.radius * 2);
		});
	},

	startGame: function () {
		Game.calcScore();
		setInterval(function () {
			Game.moveFruits();
			context.clearRect(0, 0, canvas.width, canvas.height);
			Game.drawFruits();
		}, 20);
	},
}

var canvas = document.getElementById("actual_canvas");
var context = canvas.getContext("2d");
Game.startGame();

function mousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	//console.log("Coordinate x: " + (evt.clientX - rect.left), "Coordinate y: " + (evt.clientY - rect.top));
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

canvas.addEventListener("mousemove", function (e) {
	coords = mousePos(canvas, e);

	/*
	Will need to change this next line, this is just to prevent the image from staying
	look at https://www.w3schools.com/graphics/game_intro.asp for help
	*/
	context.clearRect(0, 0, canvas.width, canvas.height);

	//Load Image
	var img = new Image();
	img.src = "./images/fruit1.webp";
	img.onload = function () {
		context.drawImage(
			img, coords.x, 0,
			img.width,
			img.height
		)
	};

});

canvas.addEventListener("mousedown", function (e) {
	const clickCoords = mousePos(canvas, e);
	Game.createFruit(clickCoords.x);
});
