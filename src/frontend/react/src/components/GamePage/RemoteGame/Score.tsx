// import { Avatar } from "@mui/material";
import styles from "./style.module.css";

interface PlayerScore {
	player: string;
	score: number;
}

function Score(props: PlayerScore) {
	return (
		<div className={styles.score}>
			{/* <Avatar sx={{ width: 100, height: 100 }}></Avatar> */}
			<span>{props.player}</span>
			<span>Score: {props.score}</span>
		</div>
	);
}

export default Score;
