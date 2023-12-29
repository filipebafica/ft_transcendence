import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import styles from "./style.module.css";

import { gameSocket } from "socket";
import { friendsStatusSocket } from "socket";

import RemoteGame from "./RemoteGame";

interface LoadingProps {
	userName: string;
	playerId: string;
	gameId: string;
}

function LoadingPage(props: LoadingProps) {
	const [loadingDone, setLoadingDone] = useState(false);
	const [gameState, setGameState] = useState({} as any);
	const navigate = useNavigate();

	const gameId = props.gameId;
	const playerId = props.playerId;

	useEffect(() => {
		gameSocket.connect();
		gameSocket.on(gameId, (newGameState) => {
			if (newGameState.status === 2) {
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
	}, [gameId, playerId, navigate]);

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
