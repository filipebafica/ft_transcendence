// board
const boardWidth = 800;
const boardHeight = 600;
let context: CanvasRenderingContext2D | null;

// paddles
const playerWidth = 10;
const playerHeight = 90;

// players
let player1 = {
	x: 10,
	y: (boardHeight - playerHeight) / 2,
	width: playerWidth,
	height: playerHeight,
	speed: 0,
	numTouches: 0,
};

let player2 = {
	x: boardWidth - playerWidth - 10,
	y: (boardHeight - playerHeight) / 2,
	width: playerWidth,
	height: playerHeight,
	speed: 0,
	numTouches: 0,
};

// ball
const ballWidth = 10;
const ballHeight = 10;

let ball = {
	x: (boardWidth - ballWidth) / 2,
	y: (boardHeight - ballHeight) / 2,
	width: ballWidth,
	height: ballHeight,
	vX: 2,
	vY: 2,
};

const maxPoints = 5;
let player1Score = 0;
let player2Score = 0;

window.onload = () => {
	const board: HTMLCanvasElement = document.getElementById(
		"board"
	) as HTMLCanvasElement;
	const button = document.querySelector("button");
	context = board.getContext("2d");

	if (!board || !button || !context) return;

	board.width = boardWidth;
	board.height = boardHeight;

	context.fillStyle = "white";
	// * draw initial player1
	context.fillRect(player1.x, player1.y, player1.width, player1.height);

	// * draw initial player2
	context.fillRect(player2.x, player2.y, player2.width, player2.height);

	button.addEventListener("click", recreateGame);
	document.addEventListener("keydown", movePlayer);
	document.addEventListener("keyup", stopMovement);

	requestAnimationFrame(update);
};

function update() {
	if (!context) return;

	// * end game
	if (player1Score === maxPoints) {
		context.fillText("Player 1 wins!", (boardWidth - 300) / 2, 100);
		return;
	} else if (player2Score === maxPoints) {
		context.fillText("Player 2 wins!", (boardWidth - 300) / 2, 100);
		return;
	}

	requestAnimationFrame(update);
	context.clearRect(0, 0, boardWidth, boardHeight);

	context.fillStyle = "white";
	// * player1
	const newPlayer1Y = player1.y + player1.speed;
	// * do not allow player 1 to exit canvas
	if (!outOfBounds(newPlayer1Y, playerHeight)) {
		player1.y = newPlayer1Y;
	}
	context.fillRect(player1.x, player1.y, player1.width, player1.height);

	// * player2
	const newPlayer2Y = player2.y + player2.speed;
	// * do not allow player 2 to exit canvas
	if (!outOfBounds(newPlayer2Y, playerHeight)) {
		player2.y = newPlayer2Y;
	}
	context.fillRect(player2.x, player2.y, player2.width, player2.height);

	// * move ball
	ball.x += ball.vX;
	ball.y += ball.vY;
	context.fillRect(ball.x, ball.y, ball.width, ball.height);

	// * ball touches top or bottom of canvas
	if (outOfBounds(ball.y, ballHeight)) {
		ball.vY *= -1;
	}

	// * ball touches paddles
	// * find distances where ball is inside paddle
	// * when distance is minimum, that is where collision happened
	// * ball is dislocated to position when touching paddle
	// * if collision is at the top or bottom:
	// * - if paddle is not moving, ball speed on y is inverted
	// * - else, ball speed is added to player speed
	let dTop, dHor, dBot;
	if (detectCollision(ball, player1)) {
		player1.numTouches++;
		dTop = ball.y + ballHeight - player1.y;
		dHor = player1.x + playerWidth - ball.x;
		dBot = player1.y + playerHeight - ball.y;
		if (dTop < dHor && dTop < dBot) {
			// if collision was on top of player 1
			ball.y -= dTop;
			ball.x += (-dTop * ball.vX) / ball.vY;
			// vertical collision update on vY
			if (player1.speed != 0) {
				ball.vY += player1.speed;
			} else {
				ball.vY *= -1;
			}
		} else if (dHor < dTop && dHor < dBot) {
			// if collision was horizontal of player 1
			ball.x += dHor;
			ball.y += (dHor * ball.vY) / ball.vX;
			ball.vX *= -1;
		} else {
			// if collision was on bottom of player 1
			ball.y += dBot;
			ball.x += (dBot * ball.vX) / ball.vY;
			// vertical collision update on vY
			if (player1.speed != 0) {
				ball.vY += player1.speed;
			} else {
				ball.vY *= -1;
			}
		}
	} else if (detectCollision(ball, player2)) {
		player2.numTouches++;
		dTop = ball.y + ballHeight - player2.y;
		dHor = ball.x + ballWidth - player2.x;
		dBot = player2.y + playerHeight - ball.y;
		if (dTop < dHor && dTop < dBot) {
			// if collision was on top of player 2
			ball.y -= dTop;
			ball.x += (-dTop * ball.vX) / ball.vY;
			// vertical collision update on vY
			if (player2.speed != 0) {
				ball.vY += player2.speed;
			} else {
				ball.vY *= -1;
			}
		} else if (dHor < dTop && dHor < dBot) {
			// if collision was horizontal of player 2
			ball.x -= dHor;
			ball.y += (-dHor * ball.vY) / ball.vX;
			ball.vX *= -1;
		} else {
			// if collision was on bottom of player 2
			ball.y += dBot;
			ball.x += (dBot * ball.vX) / ball.vY;
			// vertical collision update on vY
			if (player2.speed != 0) {
				ball.vY += player2.speed;
			} else {
				ball.vY *= -1;
			}
		}
	}

	// * speed up the game after even number of touches
	if (
		player1.numTouches != 0 &&
		!(player1.numTouches % 2) &&
		player2.numTouches != 0 &&
		!(player2.numTouches % 2)
	) {
		ball.vX *= 1.15;
		ball.vY *= 1.15;
		player1.numTouches = 0;
		player2.numTouches = 0;
	}

	// * add score and reset
	if (ball.x < 0) {
		player2Score++;
		resetGameState(2);
	} else if (ball.x + ballWidth > boardWidth) {
		player1Score++;
		resetGameState(-2);
	}

	// score
	context.font = "45px sans-serif";
	context.fillText(String(player1Score), boardWidth / 5, 45);
	context.fillText(String(player2Score), (boardWidth * 4) / 5 - 45, 45);

	// midfield
	for (let i = 10; i < boardHeight; i += 25) {
		context.fillRect((boardWidth - 2) / 2, i, 4, 4);
	}
}

function movePlayer(event: KeyboardEvent) {
	if (event.code == "KeyW") {
		player1.speed = -3;
	} else if (event.code == "KeyS") {
		player1.speed = 3;
	}

	if (event.code == "ArrowUp") {
		player2.speed = -3;
	} else if (event.code == "ArrowDown") {
		player2.speed = 3;
	}
}

function stopMovement(event: KeyboardEvent) {
	if (event.code == "KeyW") {
		player1.speed = 0;
	} else if (event.code == "KeyS") {
		player1.speed = 0;
	}

	if (event.code == "ArrowUp") {
		player2.speed = 0;
	} else if (event.code == "ArrowDown") {
		player2.speed = 0;
	}
}

function outOfBounds(yPosition: number, height: number) {
	return yPosition < 0 || yPosition + height > boardHeight;
}

function detectCollision(
	ball: { x: number; y: number },
	player: { x: number; y: number }
) {
	return (
		ball.x <= player.x + playerWidth &&
		ball.x + ballWidth >= player.x &&
		ball.y + ballHeight >= player.y &&
		ball.y <= player.y + playerHeight
	);
}

function generateRandomAngle() {
	const positive = Math.floor(Math.random() * 2);
	const angle = (Math.floor(Math.random() * 4) + 1) * 15;
	const direction = positive === 0 ? -angle : angle;
	return (direction * Math.PI) / 180;
}

function resetGameState(direction: number) {
	const randomDirection = generateRandomAngle();
	ball = {
		x: (boardWidth - ballWidth) / 2,
		y: (boardHeight - ballHeight) / 2,
		width: ballWidth,
		height: ballHeight,
		vX: direction * Math.cos(randomDirection),
		vY: -2 * Math.sin(randomDirection),
	};
	player1.numTouches = 0;
	player2.numTouches = 0;
}

function recreateGame() {
	player1 = {
		x: 10,
		y: (boardHeight - playerHeight) / 2,
		width: playerWidth,
		height: playerHeight,
		speed: 0,
		numTouches: 0,
	};

	player2 = {
		x: boardWidth - playerWidth - 10,
		y: (boardHeight - playerHeight) / 2,
		width: playerWidth,
		height: playerHeight,
		speed: 0,
		numTouches: 0,
	};

	ball = {
		x: (boardWidth - ballWidth) / 2,
		y: (boardHeight - ballHeight) / 2,
		width: ballWidth,
		height: ballHeight,
		vX: 2 * Math.cos(Math.PI / 4),
		vY: -2 * Math.sin(Math.PI / 4),
	};

	player1.numTouches = 0;
	player2.numTouches = 0;

	player1Score = 0;
	player2Score = 0;
}
