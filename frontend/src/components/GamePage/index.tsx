import React, { useState, useEffect } from "react";
import styles from "./style.module.css";

import { gameSocket } from "../../socket/index";

import LoadingPage from "./LoadingPage";

interface GamePageProps {
	// Define the props for the GamePage component here
}

function GamePage(props: GamePageProps) {
	const [user, setUser] = useState({ name: "", id: "" });
	const [isConfigComplete, setIsConfigComplete] = useState(false);
	const [gameId, setGameId] = useState("");

	const handleMatching = () => {
		if (user.id) {
			console.log('Joining game');
			gameSocket.emit("joinGame", user.id);
		} else {
			alert("Please enter your username");
		}
	};

	useEffect(() => {
		gameSocket.on(user.id, (newGameId) => {
			setGameId(newGameId);
			setIsConfigComplete(true);	
		});
	}, [user.id]);

	if (isConfigComplete) {
		return <LoadingPage userName={user.name} playerId={user.id} gameId={gameId} />;
	}

	return (
		<div className={styles.container}>
			<input
				type="text"
				value={user.name}
				onChange={(e) => setUser({ ...user, name: e.target.value })}
				placeholder="Username"
			/>
			<input
				type="id"
				value={user.id}
				onChange={(e) => setUser({ ...user, id: e.target.value })}
				placeholder="User ID"
			/>
			<button onClick={handleMatching} className={styles.button}>
				Find Match
			</button>
		</div>
	);
}

export default GamePage;
