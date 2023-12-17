import React, { useState } from "react";
import { Button } from "@mui/material";
import styles from "./style.module.css";

import GamePage from ".";

interface WinnerProps {
	gameId: string;
	playerId: string;
}

function WinnerPage(props: WinnerProps) {
	const [returnGamePage, setReturnGamePage] = useState(false);

	const handleGamePage = () => {
		setReturnGamePage(true);
	};

	if (returnGamePage) {
		return <GamePage />;
	}

	const gameId = props.gameId;
	const playerId = Number(props.playerId);
	let result: string;

	// TODO: get result from backend
	const winnerId = 1;
	if (!winnerId) {
		result = "Empate!";
	} else if (playerId === winnerId) {
		result = "You won! Congratulations!";
	} else {
		result = "You lose! :(";
	}

	return (
		<div className={styles.winner}>
			<div>gameId: {gameId}</div>
			<div className={styles.result}>{result}</div>
			<Button variant="outlined" size="large" onClick={handleGamePage}>
				New Game
			</Button>
		</div>
	);
}

export default WinnerPage;
