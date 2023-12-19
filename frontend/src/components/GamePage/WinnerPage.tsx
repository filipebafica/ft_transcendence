import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { getMatchResult } from "api/matchResult";
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

	useEffect(() => {
		const fetchWinnerResults = async () => {
			let matchResult;
			try {
				matchResult = await getMatchResult(props.gameId);
			} catch (err) {
				console.log(err);
			}
			setWinnerResults(matchResult);
		};

		fetchWinnerResults();
	}, [props.gameId]);

	const handleGamePage = () => {
		setReturnGamePage(true);
	};

	if (returnGamePage) {
		return <GamePage />;
	}

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
