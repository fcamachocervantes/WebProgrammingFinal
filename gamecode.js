const Game = {
	width: 500,
	height: 700,
	canvas: document.getElementById("game_canvas"),
	nextFruitImg: document.getElementById("next_fruit"),
	score: document.getElementById("score"),
	currentScore: 0,
	merged: [],
	mousex: 0,
	mousey: 0,
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

	setMousePosition: function (e) {
		var rect = myGameArea.canvas.getBoundingClientRect();
		Game.mousex = e.clientX - rect.left;
		Game.mousey = e.clientY - rect.top;
		//console.log(Game.mousex + "," + Game.mousey);
	},

	calcScore: function () {
		const sc = Game.merged.reduce((total, count, size) => {
			const val = Game.fruitSizes[size].value * count;
			return total + val;
		}, 0);

		Game.currentScore = sc;
		Game.score.textContent = "Score: " + Game.currentScore;
	},

	fruitGenerated: false,
	nextFruit: null,

	generateNextFruit: function () {
		if (Game.fruitGenerated == false) {
			const randomSize = Game.fruitSizes[Math.floor(Math.random() * Game.fruitSizes.length / 2)];
			Game.nextFruit = {
				x: 0,
				y: 0,
				size: randomSize,
				img: new Image(),
			};
			Game.fruitGenerated = true;

			console.log("Fruit generated: " + Game.nextFruit);
		}
		console.log("Status: " + Game.fruitGenerated);
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

	moveFruits: function (canvasRect) {
		Game.fruits.forEach((fruit) => {
			if ((fruit.y + fruit.size.radius * 2) < Game.height) {
				fruit.y += fruit.y_velocity;
			} else {
				fruit.y_velocity = 10;
			}
			if ((fruit.x + fruit.size.radius) > canvasRect.left && (fruit.x + fruit.size.radius * 2) < Game.width) {
				fruit.x += fruit.x_velocity;
			} else {
				fruit.x_velocity = 0;
			}
		});
	},

	decayVelocity: function () {
		Game.fruits.forEach((fruit) => {
			if (fruit.colliding == false) {
				if (fruit.x_velocity > 0) {
					fruit.x_velocity -= Math.abs(fruit.x_velocity / 2);
				} else if (fruit.x_velocity < 0) {
					fruit.x_velocity += Math.abs(fruit.x_velocity / 2);
				}
			}
			if (fruit.y_velocity <= 0) {
				fruit.y_velocity += 1;
			}
		});
	},

	checkCollisions: function (canvasRect) {
		for (let i = 0; i < Game.fruits.length; i++) {
			for (let j = i + 1; j < Game.fruits.length; j++) {
				const fruit1 = Game.fruits[i];
				const fruit2 = Game.fruits[j];

				const dx = fruit1.x - fruit2.x;
				const dy = fruit1.y - fruit2.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				const sumOfRadii = fruit1.size.radius + fruit2.size.radius;
				console.log(canvasRect.left);
				//Check if the distance between the centers of two fruits is less than the sum of their radii
				if (distance < sumOfRadii) {
					console.log("Collision detected!");

					if (fruit1.size.value === fruit2.size.value) {
						//Get rid of the merging fruit
						Game.fruits.splice(i, 1);
						Game.fruits.splice(j - 1, 1);

						//Average the two fruits position to place the new fruit
						const mergedX = (fruit1.x + fruit2.x) / 2;
						const mergedY = (fruit1.y + fruit2.y) / 2;

						//Create the new merged fruit
						const nextFruitIndex = (fruit1.size.value % Game.fruitSizes.length) + 1;
						const nextFruitSize = Game.fruitSizes[nextFruitIndex - 1];
						const mergedFruit = {
							x: mergedX,
							y: mergedY,
							size: nextFruitSize,
							img: new Image(),
						};
						mergedFruit.img.src = nextFruitSize.img;

						//Add merged fruit to array
						Game.fruits.push(mergedFruit);
						Game.calcScore();

					} else {
						fruit1.colliding = true;
						fruit2.colliding = true;

						const overlap = (fruit1.size.radius + fruit2.size.radius) - distance;
						const angle = Math.atan2(dy, dx);

						// Move the fruits away from each other
						if (fruit1.x >= fruit2.x) {
							if (fruit1.x + fruit1.size.radius * 2 < Game.width) {
								fruit1.x_velocity += 1;
							}
							if (fruit2.x + fruit2.size.radius * 2 > canvasRect.left) {
								fruit2.x_velocity -= 1;
							}
						} else {
							if (fruit1.x + fruit1.size.radius * 2 > canvasRect.left) {
								fruit1.x_velocity -= 1;
							}
							if (fruit2.x + fruit2.size.radius * 2 < Game.width) {
								fruit2.x_velocity += 1;
							}
						}

						if (fruit1.y >= fruit2.y) {
							if (fruit1.y + fruit1.size.radius * 2 < Game.height) {
								fruit1.y_velocity += 1;
							}
							if (fruit2.y + fruit2.size.radius * 2 > canvasRect.top) {
								fruit2.y_velocity -= 1;
							}
						} else {
							if (fruit1.y + fruit1.size.radius * 2 > canvasRect.top) {
								fruit1.y_velocity -= 1;
							}
							if (fruit2.y_velocity + fruit2.size.radius * 2 < Game.height) {
								fruit2.y_velocity += 1;
							}
						}
					}
				} else {
					fruit1.colliding = false;
					fruit2.colliding = false;
				}
			}
		}
	},

	drawFruits: function () {
		
		Game.fruits.forEach((fruit) => {
			myGameArea.context.drawImage(fruit.img, fruit.x, fruit.y, fruit.size.radius * 2, fruit.size.radius * 2);
		});
		
		base_image = new Image();
		base_image.src = './images/fruit2.webp';
		base_image.onload = function () {
			myGameArea.context.drawImage(this, 0, 0, this.width, this.height, Game.mousex, 0, this.width * 0.8, this.height * 0.8);
		}
	},

	startGame: function () {
		Game.calcScore();
		setInterval(function () {
			myGameArea.context.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
			canvasRect = myGameArea.canvas.getBoundingClientRect();
			Game.moveFruits(canvasRect);
			Game.checkCollisions(canvasRect);
			Game.decayVelocity();
			Game.drawFruits();
		}, 20);
	},
}

var myGameArea = {
	canvas: document.getElementById("actual_canvas"),
	start: function () {
		this.context = this.canvas.getContext("2d");
		this.frameNo = 0;
		Game.generateNextFruit();
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
	Game.setMousePosition(e);
});

myGameArea.canvas.addEventListener("mousedown", function (e) {
	const clickCoords = mousePos(myGameArea.canvas, e);
	Game.createFruit(clickCoords.x);
	Game.generateNextFruit();
});
