import React from "react";
import styles from "./style.module.css";
import Score from "./Score";
import Board from "./Board";

import fans1 from "../../../assets/fan_1.png";
import fans2 from "../../../assets/fan_3.png";

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
					<div className={styles.playerFans}>
						<img src={fans1} alt="" width={100} height={100} />
						<img src={fans1} alt="" width={100} height={100} />
						<img src={fans1} alt="" width={100} height={100} />
						<img src={fans1} alt="" width={100} height={100} />
					</div>
					<div className={styles.playerFans}>
						<img src={fans2} alt="" width={100} height={100} />
						<img src={fans2} alt="" width={100} height={100} />
						<img src={fans2} alt="" width={100} height={100} />
						<img src={fans2} alt="" width={100} height={100} />
					</div>
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
