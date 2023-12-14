import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import loading from "../../assets/loading.gif";

import { gameSocket } from "socket";

import RemoteGame from "./RemoteGame";

interface LoadingProps {
	userName: string;
	playerId: string;
	gameId: string;
}

function LoadingPage(props: LoadingProps) {
	const [loadingDone, setLoadingDone] = useState(false);
	const [gameState, setGameState] = useState({} as any);

	const gameId = props.gameId;
	const playerId = props.playerId;

	useEffect(() => {
		gameSocket.on(gameId, (newGameState) => {
			if (newGameState.status === 1) {
				setLoadingDone(true);
				setGameState(newGameState);
			}
		});
	}, [gameId]);

	if (loadingDone) {
		return <RemoteGame gameState={gameState} playerId={playerId} />;
	}

	// https://loading.io/
	return (
		<div className={styles.center}>
			{/* <div className={styles.wave}></div>
			<div className={styles.wave}></div>
			<div className={styles.wave}></div>
			<div className={styles.wave}></div>
			<div className={styles.wave}></div>
			<div className={styles.wave}></div>
			<div className={styles.wave}></div> */}
			<img src={loading} alt="loading..." />
		</div>
	);
}

export default LoadingPage;
