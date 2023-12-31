import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import styles from "./style.module.css";

// Socket
import { gameSocket } from "../../socket/index";
import { friendsStatusSocket } from "socket";

// Context
import { AuthContext } from "../../auth";

// Components
import VsGameConfig from "./VsGameConfig";

interface GamePageProps {
	// Define the props for the GamePage component here
}

function VsGamePage(props: GamePageProps) {
	const { user } = useContext(AuthContext);
	const [isConfigComplete, setIsConfigComplete] = useState(false);
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
			gameSocket.connect();
			gameSocket.emit(
				"inviteRouter",
				JSON.stringify({
					meta: "customize",
					data: {
						playerId: user.id,
						gameId: Number(gameId),
						customization: config,
					},
				})
			);
			setIsConfigComplete(true);
		} else {
			alert("Please enter your username");
		}
	};

	// if (isConfigComplete && gameId && user) {
	// 	return (
	// 		<LoadingPage
	// 			userName={user.nick_name}
	// 			playerId={user.id.toString()}
	// 			gameId={gameId}
	// 		/>
	// 	);
	// }

	return (
		<div className={styles.container}>
			<VsGameConfig
				playerId={user?.id.toString()}
				user={user}
				gameId={gameId}
				onJoinGame={(paddle, fan, field) =>
					handleMatching({
						paddleColor: paddle,
						fans: fan,
						fieldColor: field,
					})
				}
				isConfigComplete={isConfigComplete}
			/>
		</div>
	);
}

export default VsGamePage;
