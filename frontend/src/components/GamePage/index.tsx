import React, { useState, useEffect, useContext } from "react";
import styles from "./style.module.css";

import { gameSocket } from "../../socket/index";

// Context
import { AuthContext } from "../../auth";

// Components
import LoadingPage from "./LoadingPage";
import GameConfig from "./GameConfig";

interface GamePageProps {
	// Define the props for the GamePage component here
}

function GamePage(props: GamePageProps) {
	const { user } = useContext(AuthContext);
	const [isConfigComplete, setIsConfigComplete] = useState(false);
	const [gameId, setGameId] = useState("");

	const handleMatching = (config: {
		paddle: number;
		fan: number;
		field: number;
	}) => {
		if (user && user.id) {
			console.log("Joining game");
			gameSocket.emit("joinGame", {
				userId: user.id,
				config: config,
			});
		} else {
			alert("Please enter your username");
		}
	};

	useEffect(() => {
		if (!user || !user.id) return;
		gameSocket.on(user.id, (newGameId) => {
			setGameId(newGameId);
			setIsConfigComplete(true);
		});
	}, [user]);

	if (isConfigComplete && gameId && user) {
		return (
			<LoadingPage
				userName={user.name}
				playerId={user.id}
				gameId={gameId}
			/>
		);
	}

	return (
		<div className={styles.container}>
			<GameConfig
				onJoinGame={(paddle, fan, field) =>
					handleMatching({
						paddle: paddle,
						fan: fan,
						field: field,
					})
				}
			/>
		</div>
	);
}

export default GamePage;
