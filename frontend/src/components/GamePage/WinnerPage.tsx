import styles from "./style.module.css";
import GamePage from ".";

interface WinnerProps {
	gameId: string;
	playerId: string;
}

function WinnerPage(props: WinnerProps) {
	const handleGamePage = () => {
		return <GamePage />;
	};

	const gameId = props.gameId;
	const playerId = props.playerId;

	// TODO: get result from backend
	let matchResult = 1;
	// single page
	if (matchResult === 0) {
		console.log("Empate!");
	} else if (matchResult === 1) {
		console.log("Jogador 1 venceu!");
	} else {
		console.log("Jogador 2 venceu!");
	}

	return (
		<div className={styles.container}>
			<span>
				gameId: {gameId}; playerId: {playerId} - Fim de Jogo
			</span>
			<button onClick={handleGamePage} className={styles.button}>
				New Game
			</button>
		</div>
	);
}

export default WinnerPage;
