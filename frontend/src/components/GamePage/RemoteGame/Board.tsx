import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";

function newGameState(gameState: GameState) {
	const outOfBounds = (yPosition: number, height: number): boolean => {
		return yPosition < 0 || yPosition + height > gameState.board.height;
	};

	const updatePlayer = (player: Player) => {
		if (!outOfBounds(player.y + player.speed, player.height)) {
			player.y += player.speed;
		}
		return player;
	};

	const detectCollision = (ball: Ball, player: Player): boolean => {
		return (
			ball.x <= player.x + player.width &&
			ball.x + ball.width >= player.x &&
			ball.y + ball.height >= player.y &&
			ball.y <= player.y + player.height
		);
	};

	const handleCollision = (ball: Ball, player: Player) => {
		const dist = [
			{ type: "t", value: player.y - ball.y - ball.height },
			{ type: "b", value: player.y + player.height - ball.y },
			{ type: "l", value: player.x + player.width - ball.x },
			{ type: "r", value: player.x - ball.x - ball.width },
		];

		let min_dist = dist.reduce((prev, curr) => {
			return Math.abs(prev.value) < Math.abs(curr.value) ? prev : curr;
		});

		if (min_dist.type === "t" || min_dist.type === "b") {
			ball.y += min_dist.value;
			ball.x += (min_dist.value * ball.vX) / ball.vY;
			ball.vX *= 1.1;
			ball.vY = ball.vY * -1.1 + player.speed;
		} else {
			ball.x += min_dist.value;
			ball.y += (min_dist.value * ball.vY) / ball.vX;
			ball.vX *= -1.1;
			ball.vY *= 1.1;
		}

		return ball;
	};

	const updateBall = (ball: Ball) => {
		ball.x += ball.vX;
		ball.y += ball.vY;

		if (outOfBounds(ball.y, ball.height)) {
			ball.vY *= -1;
		}

		if (detectCollision(ball, gameState.player1)) {
			ball = handleCollision(ball, gameState.player1);
		} else if (detectCollision(ball, gameState.player2)) {
			ball = handleCollision(ball, gameState.player2);
		}

		return ball;
	};

	const resetGameState = (direction: number): void => {
		gameState.ball = {
			x: (gameState.board.width - gameState.ball.width) / 2,
			y: (gameState.board.height - gameState.ball.height) / 2,
			width: gameState.ball.width,
			height: gameState.ball.height,
			vX: direction,
			vY: 2,
		};
	};

	// Update score
	if (gameState.ball.x < 0) {
		gameState.player2Score += 1;
		resetGameState(2);
	} else if (gameState.ball.x + gameState.ball.width > gameState.board.width) {
		gameState.player1Score += 1;
		resetGameState(-2);
	}

	gameState.player1 = updatePlayer(gameState.player1);
	gameState.player2 = updatePlayer(gameState.player2);
	gameState.ball = updateBall(gameState.ball);

	return gameState;
}

interface Player {
	x: number;
	y: number;
	width: number;
	height: number;
	speed: number;
}

interface Ball {
	x: number;
	y: number;
	width: number;
	height: number;
	vX: number;
	vY: number;
}

interface Canvas {
	width: number;
	height: number;
}

interface GameState {
	player1: Player;
	player2: Player;
	ball: Ball;
	player1Score: number;
	player2Score: number;
	board: Canvas;
}

interface ScoreProps {
	player1Score: number;
	setPlayer1Score: (score: number) => any;
	player2Score: number;
	setPlayer2Score: (score: number) => any;
}

function Board(props: ScoreProps) {
	const boardWidth = 800;
	const boardHeight = 600;
	const playerWidth = 10;
	const playerHeight = 90;
	const ballWidth = 10;
	const ballHeight = 10;
	const initialPlayerSpeed = 0;

	const [player1, setPlayer1] = useState<Player>({
		x: 10,
		y: (boardHeight - playerHeight) / 2,
		width: playerWidth,
		height: playerHeight,
		speed: initialPlayerSpeed,
	});

	const [player2, setPlayer2] = useState<Player>({
		x: boardWidth - playerWidth - 10,
		y: (boardHeight - playerHeight) / 2,
		width: playerWidth,
		height: playerHeight,
		speed: initialPlayerSpeed,
	});

	const [ball, setBall] = useState<Ball>({
		x: (boardWidth - ballWidth) / 2,
		y: (boardHeight - ballHeight) / 2,
		width: ballWidth,
		height: ballHeight,
		vX: 2,
		vY: 2,
	});

	let player1Score = props.player1Score;
	const setPlayer1Score = props.setPlayer1Score;
	let player2Score = props.player2Score;
	const setPlayer2Score = props.setPlayer2Score;

	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "w") {
				setPlayer1((prevState) => ({
					...prevState,
					speed: -2,
				}));
			} else if (event.key === "s") {
				setPlayer1((prevState) => ({
					...prevState,
					speed: 2,
				}));
			} else if (event.key === "ArrowUp") {
				setPlayer2((prevState) => ({
					...prevState,
					speed: -2,
				}));
			} else if (event.key === "ArrowDown") {
				setPlayer2((prevState) => ({
					...prevState,
					speed: 2,
				}));
			}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			if (event.key === "w" || event.key === "s") {
				setPlayer1((prevState) => ({
					...prevState,
					speed: initialPlayerSpeed,
				}));
			} else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
				setPlayer2((prevState) => ({
					...prevState,
					speed: initialPlayerSpeed,
				}));
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext("2d");
		if (!context) return;

		let animationFrameId: number;

		const renderGameState = (gameState: GameState) => {
			context.clearRect(0, 0, boardWidth, boardHeight);

			context.fillStyle = "rebeccapurple";

			context.fillRect(
				gameState.player1.x,
				gameState.player1.y,
				gameState.player1.width,
				gameState.player1.height
			);
			context.fillRect(
				gameState.player2.x,
				gameState.player2.y,
				gameState.player2.width,
				gameState.player2.height
			);
			context.fillRect(
				gameState.ball.x,
				gameState.ball.y,
				gameState.ball.width,
				gameState.ball.height
			);
			// midfield
			context.fillStyle = "black";
			for (let i = 10; i < boardHeight; i += 25) {
				context.fillRect((boardWidth - 2) / 2, i, 4, 4);
			}
		};

		const gameLoop = () => {
			// Prepare the current game state
			const gameState = {
				player1,
				player2,
				ball,
				player1Score,
				player2Score,
				board: { width: boardWidth, height: boardHeight },
			};
			const updatedGameState = newGameState(gameState); // simulacao do servidor
			setBall(() => updatedGameState.ball);
			setPlayer1Score(updatedGameState.player1Score);
			setPlayer2Score(updatedGameState.player2Score);
			renderGameState(updatedGameState);

			animationFrameId = requestAnimationFrame(gameLoop);
		};

		// Start the game loop
		animationFrameId = requestAnimationFrame(gameLoop);

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [
		player1,
		player2,
		ball,
		player1Score,
		player2Score,
		setPlayer1Score,
		setPlayer2Score,
	]);

	return (
		<canvas
			ref={canvasRef}
			width={boardWidth}
			height={boardHeight}
			className={styles.canvasGame}
		/>
	);
}

export default Board;
