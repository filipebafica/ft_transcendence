import React, { useState } from "react";
import styles from "./style.module.css";

import LocalGame from "./LocalGame";
import RemoteGame from "./RemoteGame";

interface GamePageProps {
	// Define the props for the GamePage component here
}

function GamePage(props: GamePageProps) {
	const [game, setGame] = useState<boolean>(true);

	const handleSwitchGame = () => {
		setGame(!game);
	};

	return (
		<div className={styles.container}>
			{game ? <RemoteGame /> : <LocalGame />}
			<button onClick={handleSwitchGame} className={styles.button}>
				Switch Game
			</button>
		</div>
	);
}

export default GamePage;
