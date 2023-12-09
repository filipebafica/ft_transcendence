import React, { useState } from "react";
import styles from "./style.module.css";

import LoadingPage from "./LoadingPage";

interface GamePageProps {
	// Define the props for the GamePage component here
}

function GamePage(props: GamePageProps) {
	const [user, setUser] = useState({ name: "", id: "" });
	const [isConfigComplete, setIsConfigComplete] = useState(false);

	const handleMatching = () => {
		if (user.name) {
			setIsConfigComplete(true);
		} else {
			alert("Please enter your username");
		}
	};

	if (isConfigComplete) {
		return <LoadingPage userName={user.name} playerId={user.id} />;
	}

	return (
		<div className={styles.container}>
			<input
				type="text"
				value={user.name}
				onChange={(e) => setUser({ ...user, name: e.target.value })}
				placeholder="Username"
			/>
			<button onClick={handleMatching} className={styles.button}>
				Find Match
			</button>
		</div>
	);
}

export default GamePage;
