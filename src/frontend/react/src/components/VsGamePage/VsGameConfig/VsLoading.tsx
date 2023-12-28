import React from "react";
import { Button, CircularProgress } from "@mui/material";
import styles from "./style.module.css";

import RemoteGame from "../../GamePage/RemoteGame";

interface LoadingProps {
	playerId: string;
	// gameId: string; -> no need?
	loadingDone: boolean;
	gameState: any;
}

function VsLoadingPage(props: LoadingProps) {
	const { playerId, loadingDone, gameState } = props;

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

export default VsLoadingPage;
