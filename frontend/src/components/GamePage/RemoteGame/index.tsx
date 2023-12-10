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
			<Score player={gameState.player1.id} score={gameState.player1Score} />
			<Board
				player1Score={gameState.player1Score}
				player2Score={gameState.player2Score}
				gameState={gameState}
				playerId={props.playerId}
			/>
			<Score player={gameState.player2.id} score={gameState.player2Score} />
		</div>
	);
}

export default PongGame;
