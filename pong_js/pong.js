// board
let board;
let boardWidth = 800;
let boardHeight = 600;
let context;

// paddles
let playerWidth = 10;
let playerHeight = 90;
let playerSpeed = 0;

let player1 = {
	x: 10,
	y: (boardHeight - playerHeight) / 2,
	width: playerWidth,
	height: playerHeight,
	speed: playerSpeed,
	numTouches: 0,
};

let player2 = {
	x: boardWidth - playerWidth - 10,
	y: (boardHeight - playerHeight) / 2,
	width: playerWidth,
	height: playerHeight,
	speed: playerSpeed,
	numTouches: 0,
};

// ball
let ballWidth = 10;
let ballHeight = 10;

let ball = {
	x: (boardWidth - ballWidth) / 2,
	y: (boardHeight - ballHeight) / 2,
	width: ballWidth,
	height: ballHeight,
	vX: 2,
	vY: 2,
};

let player1Score = 0;
let player2Score = 0;

window.onload = function () {
	board = document.getElementById("board");
	board.width = boardWidth;
	board.height = boardHeight;
	context = board.getContext("2d");

	const button = document.querySelector("button");
	button.addEventListener("click", recreateGame);

	context.fillStyle = "white";
	// draw initial player1
	context.fillRect(player1.x, player1.y, player1.width, player1.height);

	// draw initial player2
	context.fillRect(player2.x, player2.y, player2.width, player2.height);

	requestAnimationFrame(update);
	document.addEventListener("keydown", movePlayer);
	document.addEventListener("keyup", stopMovement);
};

function update() {
	// end game
	if (player1Score === 5) {
		context.fillText("Player 1 wins!", (boardWidth - 300) / 2, 100);
		cancelRequestAnimationFrame();
	} else if (player2Score === 5) {
		context.fillText("Player 2 wins!", (boardWidth - 300) / 2, 100);
		cancelRequestAnimationFrame();
	}

	requestAnimationFrame(update);
	context.clearRect(0, 0, boardWidth, boardHeight);

	context.fillStyle = "white";
	// player1
	let newPlayer1Y = player1.y + player1.speed;
	// do not allow player1 to exit canvas
	if (!outOfBounds(newPlayer1Y, playerHeight)) {
		player1.y = newPlayer1Y;
	}
	context.fillRect(player1.x, player1.y, player1.width, player1.height);

	// player2
	let newPlayer2Y = player2.y + player2.speed;
	// do not allow player2 to exit canvas
	if (!outOfBounds(newPlayer2Y, playerHeight)) {
		player2.y = newPlayer2Y;
	}
	context.fillRect(player2.x, player2.y, player2.width, player2.height);

	// move ball
	ball.x += ball.vX;
	ball.y += ball.vY;
	context.fillRect(ball.x, ball.y, ball.width, ball.height);

	// ball touches top or bottom of canvas
	if (outOfBounds(ball.y, ballHeight)) {
		ball.vY *= -1;
	}

	// ball touches paddles
	// find distances where ball is inside paddle
	// when distance is minimum, that is where collision happened
	// ball is dislocated to position when touching paddle
	// if collision is at the top or bottom:
	//  - if paddle is not moving, ball speed on y is inverted
	//  - else, ball speed is added to player speed
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

	// speed up the game after even number of touches
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

	// add score and reset
	if (ball.x < 0) {
		player2Score++;
		resetGameState(2);
	} else if (ball.x + ballWidth > boardWidth) {
		player1Score++;
		resetGameState(-2);
	}

	// score
	context.font = "45px sans-serif";
	context.fillText(player1Score, boardWidth / 5, 45);
	context.fillText(player2Score, (boardWidth * 4) / 5 - 45, 45);

	// midfield
	for (let i = 10; i < boardHeight; i += 25) {
		context.fillRect((boardWidth - 2) / 2, i, 4, 4);
	}
}

function movePlayer(event) {
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

function stopMovement(event) {
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

function outOfBounds(yPosition, height) {
	return yPosition < 0 || yPosition + height > boardHeight;
}

function detectCollision(ball, player) {
	return (
		ball.x <= player.x + playerWidth &&
		ball.x + ballWidth >= player.x &&
		ball.y + ballHeight >= player.y &&
		ball.y <= player.y + playerHeight
	);
}

function resetGameState(direction) {
	ball = {
		x: (boardWidth - ballWidth) / 2,
		y: (boardHeight - ballHeight) / 2,
		width: ballWidth,
		height: ballHeight,
		vX: direction,
		vY: 2,
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
		speed: playerSpeed,
		numTouches: 0,
	};

	player2 = {
		x: boardWidth - playerWidth - 10,
		y: (boardHeight - playerHeight) / 2,
		width: playerWidth,
		height: playerHeight,
		speed: playerSpeed,
		numTouches: 0,
	};

	ball = {
		x: (boardWidth - ballWidth) / 2,
		y: (boardHeight - ballHeight) / 2,
		width: ballWidth,
		height: ballHeight,
		vX: 2,
		vY: 2,
	};

	player1Score = 0;
	player2Score = 0;
	requestAnimationFrame(update);
}
