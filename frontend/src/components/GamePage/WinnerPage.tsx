import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import styles from "./style.module.css";

import GamePage from ".";

interface WinnerProps {
	gameId: string;
	playerId: string;
}

function WinnerPage(props: WinnerProps) {
	const [winnerResults, setWinnerResults] = useState({
		result: "",
		winnerId: 0,
	});
	const [returnGamePage, setReturnGamePage] = useState(false);

	const handleGamePage = () => {
		setReturnGamePage(true);
	};

	if (returnGamePage) {
		return <GamePage />;
	}

	axios
		.get(`http://localhost:8080/game/${props.gameId}/winner`)
		.then((response) => setWinnerResults(response.data));

	let result: string;
	if (winnerResults.result === "draw") {
		result = "Empate!";
	} else if (Number(props.playerId) === winnerResults.winnerId) {
		result = "You won! Congratulations!";
	} else {
		result = "You lose! :(";
	}

	return (
		<div className={styles.winner}>
			<div className={styles.result}>{result}</div>
			<Button variant="outlined" size="large" onClick={handleGamePage}>
				New Game
			</Button>
		</div>
	);
}

export default WinnerPage;
