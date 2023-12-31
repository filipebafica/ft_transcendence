import React, { useState, useEffect, useContext } from "react";
import styles from "./style.module.css";

// Socket
import { gameSocket } from "../../socket/index";
import { friendsStatusSocket } from "socket";

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
		paddleColor: number;
		fans: number;
		fieldColor: number;
	}) => {
		if (user && user.id) {
			console.log("Joining game");
			friendsStatusSocket.emit(
				"statusRouter",
				JSON.stringify({
					userId: user.id,
					status: "in-game",
				})
			);
			gameSocket.connect();
			gameSocket.emit(
				"joinGame",
				JSON.stringify({
					uuid: user.id,
					customization: config,
				})
			);
		} else {
			alert("Please enter your username");
		}
	};

	useEffect(() => {
		if (!user || !user.id) return;
		gameSocket.connect();
		gameSocket.on(user.id.toString(), (newGameId) => {
			if (typeof newGameId === "number") {
				setGameId(String(newGameId));
				setIsConfigComplete(true);
			}
		});
		return () => {
			console.log("disconnecting from socket GamePage user", `${user.id}`);
			gameSocket.off(`${user.id.toString()}`);
			gameSocket.disconnect();
		};
	}, [user]);

	if (isConfigComplete && gameId && user) {
		return (
			<LoadingPage
				userName={user.nick_name}
				playerId={user.id.toString()}
				gameId={gameId}
			/>
		);
	}

	return (
		<div className={styles.container}>
			<GameConfig
				onJoinGame={(paddle, fan, field) =>
					handleMatching({
						paddleColor: paddle,
						fans: fan,
						fieldColor: field,
					})
				}
			/>
		</div>
	);
}

export default GamePage;
