import { useEffect, useRef } from "react";
import styles from "./style.module.css";

import { paddleColors, fieldColors } from "constants/colors";

import { gameSocket } from "../../../socket/index";

interface Customization {
	fans: number;
	fieldColor: number;
	paddleColor: number;
}

interface Player {
	customization: Customization;
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
	id: string;
	player1: Player;
	player2: Player;
	ball: Ball;
	player1Score: number;
	player2Score: number;
	board: Canvas;
}

interface BoardProps {
	gameState: GameState;
	playerId: string;
}

function Board(props: BoardProps) {
	const boardWidth = props.gameState.board.width;
	const boardHeight = props.gameState.board.height;

	const { id: gameId } = props.gameState;
	const playerId = props.playerId;

	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Key Handles
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			event.preventDefault();
			if (event.key === "ArrowUp" || event.key === "ArrowDown") {
				gameSocket.emit("playerAction", {
					gameId: gameId,
					playerId: playerId,
					action: `KeyDown${event.key}`,
				});
			}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			event.preventDefault();
			if (event.key === "ArrowUp" || event.key === "ArrowDown") {
				gameSocket.emit("playerAction", {
					gameId: gameId,
					playerId: playerId,
					action: `KeyUp${event.key}`,
				});
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, [gameId, playerId]);

	// Game Render
	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext("2d");
		if (!context) return;

		const renderGameState = (gameState: GameState) => {
			context.fillStyle =
				fieldColors[gameState.player1.customization.fieldColor];
			context.fillRect(0, 0, boardWidth / 2 + 1, boardHeight);

			context.fillStyle =
				fieldColors[gameState.player2.customization.fieldColor];
			context.fillRect(
				boardWidth / 2 + 1,
				0,
				boardWidth / 2,
				boardHeight
			);

			context.fillStyle =
				paddleColors[gameState.player1.customization.paddleColor];
			context.fillRect(
				gameState.player1.x,
				gameState.player1.y,
				gameState.player1.width,
				gameState.player1.height
			);

			context.fillStyle =
				paddleColors[gameState.player2.customization.paddleColor];
			context.fillRect(
				gameState.player2.x,
				gameState.player2.y,
				gameState.player2.width,
				gameState.player2.height
			);

			context.fillStyle = "white";
			context.fillRect(
				gameState.ball.x,
				gameState.ball.y,
				gameState.ball.width,
				gameState.ball.height
			);

			context.fillStyle = "white";
			for (let i = 10; i < boardHeight; i += 25) {
				context.fillRect(boardWidth / 2 - 2, i, 5, 5);
			}
		};

		renderGameState(props.gameState);

		return () => {};
	}, [props.gameState, boardWidth, boardHeight]);

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
