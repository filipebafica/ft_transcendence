import React, { useState, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import styles from "./style.module.css";

import { gameSocket } from "socket";

import WinnerPage from "./WinnerPage";
import RemoteGame from "./RemoteGame";

interface LoadingProps {
	userName: string;
	playerId: string;
	gameId: string;
}

function LoadingPage(props: LoadingProps) {
	const [finishedDone, setFinishedDone] = useState(false);
	const [loadingDone, setLoadingDone] = useState(false);
	const [gameState, setGameState] = useState({} as any);

	const gameId = props.gameId;
	const playerId = props.playerId;

	useEffect(() => {
		gameSocket.on(gameId, (newGameState) => {
			if (newGameState.status === 2) {
				setFinishedDone(true);
			}
			if (newGameState.status === 1) {
				setLoadingDone(true);
				setGameState(newGameState);
			}
		});
	}, [gameId]);

	if (finishedDone) {
		return <WinnerPage gameId={gameId} playerId={playerId} />;
	}

	if (loadingDone) {
		return <RemoteGame gameState={gameState} playerId={playerId} />;
	}

	return (
		<div className={styles.loading}>
			<CircularProgress size={100} />
			<Button
				variant="outlined"
				onClick={() => window.location.reload()}
				color="error"
			>
				Cancel
			</Button>
		</div>
	);
}

export default LoadingPage;
