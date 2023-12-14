import React, { useState } from "react";
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
	const playerId = props.playerId;
	let result;

	// TODO: get result from backend
	let matchResult = 1;
	// single page
	if (matchResult === 0) {
		result = "Empate!";
	} else if (matchResult === 1) {
		result = "Jogador 1 venceu!";
	} else {
		result = "Jogador 2 venceu!";
	}

	return (
		<div className={styles.container}>
			<div>
				gameId: {gameId}; playerId: {playerId}
			</div>
			<div>Result: {result}</div>
			<button onClick={handleGamePage} className={styles.button}>
				New Game
			</button>
		</div>
	);
}

export default WinnerPage;
