import styles from "./style.module.css";

interface PlayerScore {
	player: number;
	score: number;
}

function Score(props: PlayerScore) {
	return (
		<div className={styles.score}>
			<span>player: {props.player}</span>
			<span>score: {props.score}</span>
		</div>
	);
}

export default Score;
