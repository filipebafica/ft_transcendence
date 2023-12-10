import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";

import { gameSocket } from "../../../socket/index";

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
	id: string;
	player1: Player;
	player2: Player;
	ball: Ball;
	player1Score: number;
	player2Score: number;
	board: Canvas;
}

interface BoardProps {
	player1Score: number;
	player2Score: number;
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
			if (event.key === "ArrowUp" || event.key === "ArrowDown") {
				gameSocket.emit('playerAction', { gameId: gameId, playerId: playerId, action: `KeyDown${event.key}` })
			}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			if (event.key === "ArrowUp" || event.key === "ArrowDown") {
				gameSocket.emit('playerAction', { gameId: gameId, playerId: playerId, action: `KeyUp${event.key}` })
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	// Game Render
	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext("2d");
		if (!context) return;

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

			context.fillStyle = "black";
			for (let i = 10; i < boardHeight; i += 25) {
				context.fillRect((boardWidth - 2) / 2, i, 4, 4);
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
