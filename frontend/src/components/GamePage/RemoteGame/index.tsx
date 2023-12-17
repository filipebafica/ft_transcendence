import React from "react";
import styles from "./style.module.css";
import Score from "./Score";
import Board from "./Board";

interface PlayersProps {
	player1UserName?: string;
	player2UserName?: string;
	gameState: any;
	playerId: string;
}

function PongGame(props: PlayersProps) {
	const gameState = props.gameState;

	return (
		<div className={styles.screen}>
			<Score
				player={props.player1UserName}
				score={gameState.player1Score}
			/>
			<div className={styles.board}>
				<div className={styles.fans}>
					<h2>FANS</h2>
					<h2>FANS</h2>
					<h2>FANS</h2>
					<h2>FANS</h2>
				</div>
				<Board gameState={gameState} playerId={props.playerId} />
			</div>
			<Score
				player={props.player2UserName}
				score={gameState.player2Score}
			/>
		</div>
	);
}

export default PongGame;
