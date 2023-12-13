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
		const randomSize = Game.fruitSizes[Math.floor(Math.random() * Game.fruitSizes.length / 2)];
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

		for (let i = 0; i < Game.fruits.length; i++) {
			for (let j = i + 1; j < Game.fruits.length; j++) {
				const fruit1 = Game.fruits[i];
				const fruit2 = Game.fruits[j];

				const dx = fruit1.x - fruit2.x;
				const dy = fruit1.y - fruit2.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				//Check if the distance between the centers of two fruits is less than the sum of their radii
				if (distance < fruit1.size.radius + fruit2.size.radius) {
					// Collision detected, you may want to handle the collision here (e.g., remove or merge the collided fruits)
					console.log("Collision detected!");

					const overlap = (fruit1.size.radius + fruit2.size.radius) - distance;
					const angle = Math.atan2(dy, dx);

					// Move the fruits away from each other
					if (fruit1.y + fruit1.size.radius * 2 < Game.height) {
						fruit1.y += (overlap / 2) * Math.sin(angle);
					}
					if (fruit1.x + fruit1.size.radius * 2 < Game.width) {
						fruit1.x += (overlap / 2) * Math.cos(angle);
					}
					if (fruit2.x + fruit2.size.radius * 2 > 0) {
						fruit2.x -= (overlap / 2) * Math.cos(angle);
					}
					if (fruit2.y + fruit2.size.radius * 2 > 0) {
						fruit2.y -= (overlap / 2) * Math.sin(angle);
					}
				}
			}
		}
	},

	drawFruits: function () {
		Game.fruits.forEach((fruit) => {
			myGameArea.context.drawImage(fruit.img, fruit.x, fruit.y, fruit.size.radius * 2, fruit.size.radius * 2);
		});
	},

	startGame: function () {
		Game.calcScore();
		setInterval(function () {
			Game.moveFruits();
			myGameArea.context.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
			Game.drawFruits();
		}, 20);
	},
}

var myGameArea = {
	canvas: document.getElementById("actual_canvas"),
	start: function () {
		this.context = this.canvas.getContext("2d");
		this.frameNo = 0;
		Game.startGame();
	},
}


myGameArea.start();

function mousePos(canvas, evt) {
	var rect = myGameArea.canvas.getBoundingClientRect();
	//console.log("Coordinate x: " + (evt.clientX - rect.left), "Coordinate y: " + (evt.clientY - rect.top));
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

myGameArea.canvas.addEventListener("mousemove", function (e) {
	coords = mousePos(myGameArea.canvas, e);

	var img = new Image('./images/fruit1.webp')
	myGameArea.context.drawImage(
		img, coords.x, 0,
		img.width,
		img.height
	);
});

myGameArea.canvas.addEventListener("mousedown", function (e) {
	const clickCoords = mousePos(myGameArea.canvas, e);
	Game.createFruit(clickCoords.x);
});
