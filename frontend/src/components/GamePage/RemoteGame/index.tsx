import React, { useState } from "react";
import styles from "./style.module.css";
import Score from "./Score";
import Board from "./Board";

interface PlayersProps {
	player1UserName: string;
	player2UserName: string;
}

function PongGame(props: PlayersProps) {
	const [player1Score, setPlayer1Score] = useState<number>(0);
	const [player2Score, setPlayer2Score] = useState<number>(0);

	return (
		<div className={styles.screen}>
			<Score player={props.player1UserName} score={player1Score} />
			<Board
				player1Score={player1Score}
				setPlayer1Score={setPlayer1Score}
				player2Score={player2Score}
				setPlayer2Score={setPlayer2Score}
			/>
			<Score player={props.player2UserName} score={player2Score} />
		</div>
	);
}

export default PongGame;
