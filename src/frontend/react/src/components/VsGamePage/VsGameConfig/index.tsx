import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./style.module.css";

import { gameSocket } from "../../../socket/index";
import { friendsStatusSocket } from "../../../socket/index";

// Constants

import { paddleColors, fieldColors } from "constants/colors";

// Components
import VsLoadingPage from "../VsLoadingPage";
import ColorPicker from "./ColorPicker";
import FanPicker from "./FanPicker";
import Button from "@mui/material/Button";

interface GameConfigProps {
	playerId: string | undefined;
	user: any;
	gameId: string | undefined;
	onJoinGame: (
		paddleColorIndex: number,
		fanIndex: number,
		fieldColorIndex: number
	) => void;
	isConfigComplete: boolean;
}

const VsGameConfig = (props: GameConfigProps) => {
	const [paddleColorIndex, setPaddleColorIndex] = useState(0);
	const [fanIndex, setFanIndex] = useState(0);
	const [fieldColorIndex, setFieldColorIndex] = useState(0);
	const [loadingDone, setLoadingDone] = useState(false);
	const [gameState, setGameState] = useState({} as any);
	const navigate = useNavigate();

	const { playerId, user, gameId, onJoinGame, isConfigComplete } = props;

	useEffect(() => {
		if (!gameId || !playerId) return;
		gameSocket.connect();
		gameSocket.on(gameId, (newGameState) => {
			if (
				newGameState.status === 2 &&
				Math.max(
					newGameState.player1Score,
					newGameState.player2Score
				) !== 3
			) {
				friendsStatusSocket.emit(
					"statusRouter",
					JSON.stringify({
						userId: playerId,
						status: "online",
					})
				);
				navigate("/home");
			} else if (newGameState.status === 2) {
				friendsStatusSocket.emit(
					"statusRouter",
					JSON.stringify({
						userId: playerId,
						status: "online",
					})
				);
				navigate(`/game/winner/${gameId}/${playerId}`);
			}
			if (newGameState.status === 1) {
				setLoadingDone(true);
				setGameState(newGameState);
			}
		});
		return () => {
			console.log("disconnecting from socket game", `${gameId}`);
			gameSocket.off(`${gameId}`);
			gameSocket.disconnect();
		};
	}, [playerId, gameId, navigate]);

	if (isConfigComplete && gameId && user) {
		return (
			<VsLoadingPage
				playerId={user.id.toString()}
				loadingDone={loadingDone}
				gameState={gameState}
			/>
		);
	}

	return (
		<div className={styles.gameConfigContainer}>
			<h1>Customize your game!</h1>
			<div className={styles.field}>
				<label>Choose a paddle color:</label>
				<ColorPicker
					colors={paddleColors}
					onColorChange={(index) => setPaddleColorIndex(index)}
				/>
			</div>
			<div className={styles.field}>
				<label>Choose a fan type:</label>
				<FanPicker onFanChange={(index) => setFanIndex(index)} />
			</div>
			<div className={styles.field}>
				<label>Choose a field color:</label>
				<ColorPicker
					colors={fieldColors}
					onColorChange={(index) => setFieldColorIndex(index)}
				/>
			</div>
			<Button
				variant="outlined"
				className={styles.joinGameButton}
				onClick={() =>
					onJoinGame(paddleColorIndex, fanIndex, fieldColorIndex)
				}
			>
				Play Game
			</Button>
		</div>
	);
};

export default VsGameConfig;
