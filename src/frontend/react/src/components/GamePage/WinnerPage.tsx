import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { getMatchResult } from "api/matchResult";
import styles from "./style.module.css";

function WinnerPage() {
	const [winnerResults, setWinnerResults] = useState({
		result: "",
		winnerId: 0,
	});
	const navigate = useNavigate();
	const { gameId, playerId } = useParams();

	useEffect(() => {
		if (!gameId) return;
		const fetchWinnerResults = async () => {
			let matchResult;
			try {
				matchResult = await getMatchResult(gameId);
			} catch (err) {
				console.log(err);
			}
			setWinnerResults(matchResult);
		};
		fetchWinnerResults();
	}, [gameId]);

	let result = "";
	if (winnerResults.result === "draw") {
		result = "Empate!";
	} else if (winnerResults.result === "normal") {
		if (Number(playerId) === winnerResults.winnerId) {
			result = "You won! Congratulations!";
		} else {
			result = "You lose! :(";
		}
	}

	return (
		<div className={styles.winner}>
			<div className={styles.result}>{result}</div>
			{result !== "" && (
				<Button
					variant="outlined"
					size="large"
					onClick={() => navigate("/game")}
				>
					New Game
				</Button>
			)}
		</div>
	);
}

export default WinnerPage;
