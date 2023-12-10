import React, { useState } from "react";
import { io } from "socket.io-client";
import styles from "./style.module.css";
import loading from "../../assets/loading.gif";

import RemoteGame from "./RemoteGame";

interface PlayerProps {
	userName: string;
	playerId: string;
}

function LoadingPage(props: PlayerProps) {
	const [loadingDone, setLoadingDone] = useState(false);

	const gameSocket = io("/game");
	const userName = props.userName;
	const playerId = props.playerId;

	// console.log("UserName: ", userName, "\nPlayerID: ", playerId);

	// gameSocket.on("connect", () => {
	// 	document.getElementById("gameStatus").innerText = "Connected to Game";
	// });

	gameSocket.emit("joinGame", playerId);

	gameSocket.on(playerId, (gameID) => {
		gameSocket.on(gameID, () => {
			setLoadingDone(true);
		});

		// document.addEventListener("keydown", function (event) {
		// 	gameSocket.emit("playerAction", {
		// 		gameID: gameID,
		// 		action: event.key,
		// 	});
		// });
	});

	if (loadingDone) {
		return <RemoteGame player1UserName={userName} player2UserName="someone" />;
	}

	// https://loading.io/
	return (
		<div className={styles.center}>
			{/* <div className={styles.wave}></div>
			<div className={styles.wave}></div>
			<div className={styles.wave}></div>
			<div className={styles.wave}></div>
			<div className={styles.wave}></div>
			<div className={styles.wave}></div>
			<div className={styles.wave}></div> */}
			<img src={loading} alt="loading..." />
		</div>
	);
}

export default LoadingPage;
