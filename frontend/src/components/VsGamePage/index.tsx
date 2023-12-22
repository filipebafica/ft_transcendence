import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./style.module.css";

// Socket
import { gameSocket } from "../../socket/index";
import { friendsStatusSocket } from "socket";

// Context
import { AuthContext } from "../../auth";

// Components
import LoadingPage from "../GamePage/LoadingPage";
import VsGameConfig from "./VsGameConfig";

interface GamePageProps {
	// Define the props for the GamePage component here
}

function VsGamePage(props: GamePageProps) {
	const { user } = useContext(AuthContext);
	const [isConfigComplete, setIsConfigComplete] = useState(false);
	// const [gameId, setGameId] = useState("0");

	const { gameId } = useParams();

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
			gameSocket.emit(
				"inviteRouter",
				JSON.stringify({
					meta: "customize",
					data: {
						playerId: user.id,
						customization: config,
					},
				})
			);
			setIsConfigComplete(true);
		} else {
			alert("Please enter your username");
		}
	};

	// useEffect(() => {
	// 	if (!user) return;
	// 	gameSocket.on(`${user.id}-invite`, (msg: any) => {
	// 		if (msg.meta === "game") {
	// 			setGameId(gameId);
	// 		}
	// 	});
	// }, [user, gameId]);

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
			<VsGameConfig
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

export default VsGamePage;
