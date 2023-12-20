import React, { useState } from "react";

import styles from "./style.module.css";

// Constants

import { paddleColors, fieldColors } from "constants/colors";

// Components
import ColorPicker from "./ColorPicker";
import FanPicker from "./FanPicker";
import Button from "@mui/material/Button";

interface GameConfigProps {
	onJoinGame: (
		paddleColorIndex: number,
		fanIndex: number,
		fieldColorIndex: number
	) => void;
}

const VsGameConfig = (props: GameConfigProps) => {
	const [paddleColorIndex, setPaddleColorIndex] = useState(0);
	const [fanIndex, setFanIndex] = useState(0);
	const [fieldColorIndex, setFieldColorIndex] = useState(0);

	const { onJoinGame } = props;

	return (
		<div className={styles.gameConfigContainer}>
			<h1>Customize your game!</h1>
			<div className={styles.field}>
				<label>Choose a paddle color:</label>
				<ColorPicker
					colors={paddleColors}
					onColorChange={(index) => setPaddleColorIndex(index)}
				/>
			</div>
			<div className={styles.field}>
				<label>Choose a fan type:</label>
				<FanPicker onFanChange={(index) => setFanIndex(index)} />
			</div>
			<div className={styles.field}>
				<label>Choose a field color:</label>
				<ColorPicker
					colors={fieldColors}
					onColorChange={(index) => setFieldColorIndex(index)}
				/>
			</div>
			<Button
				variant="outlined"
				className={styles.joinGameButton}
				onClick={() =>
					onJoinGame(paddleColorIndex, fanIndex, fieldColorIndex)
				}
			>
				Play Game
			</Button>
		</div>
	);
};

export default VsGameConfig;
