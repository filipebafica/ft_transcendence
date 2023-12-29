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
				gameSocket.connect();
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
				gameSocket.connect();
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
			const scaleX = canvas!.width / boardWidth;
    		const scaleY = canvas!.height / boardHeight;
			
			context.fillStyle =
				fieldColors[gameState.player1.customization.fieldColor];
			context.fillRect(0, 0, (boardWidth / 2 + 1) * scaleX, boardHeight * scaleY);

			context.fillStyle =
				fieldColors[gameState.player2.customization.fieldColor];
			context.fillRect(
				(boardWidth / 2 + 1) * scaleX,
				0,
				(boardWidth / 2) * scaleX,
				(boardHeight) * scaleY
			);

			context.fillStyle =
				paddleColors[gameState.player1.customization.paddleColor];
			context.fillRect(
				gameState.player1.x * scaleX,
				gameState.player1.y * scaleY,
				gameState.player1.width * scaleX,
				gameState.player1.height * scaleY
			);

			context.fillStyle =
				paddleColors[gameState.player2.customization.paddleColor];
			context.fillRect(
				gameState.player2.x * scaleX,
				gameState.player2.y * scaleY,
				gameState.player2.width * scaleX,
				gameState.player2.height * scaleY
			);

			context.fillStyle = "white";
			context.fillRect(
				gameState.ball.x * scaleX,
				gameState.ball.y * scaleY,
				gameState.ball.width * scaleX,
				gameState.ball.height * scaleY
			);

			context.fillStyle = "white";
			for (let i = 10; i < boardHeight; i += 25) {
				context.fillRect(
					(boardWidth / 2 - 2) * scaleX, 
					i * scaleY, 
					5 * scaleX, 
					5 * scaleX
				);
			}
		};

		renderGameState(props.gameState);

		return () => {};
	}, [props.gameState, boardWidth, boardHeight]);

	return (
		<canvas
			ref={canvasRef}
			// width={boardWidth}
			// height={boardHeight}
			className={styles.canvasGame}
		/>
	);
}

export default Board;
