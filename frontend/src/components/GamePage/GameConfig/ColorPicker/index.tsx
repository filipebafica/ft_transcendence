import React, { useState } from 'react';

import styles from './style.module.css';

// Components
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

interface ColorPickerProps {
	colors: string[];
	onColorChange: (colorIndex: number) => void;
}

const ColorPicker = (props: ColorPickerProps) => {
	const [ colorIndex, setColorIndex ] = useState(0);
	const { colors, onColorChange } = props;

	const handleColorChange = (event: React.MouseEvent<HTMLElement>, newColorIndex: number) => {
		setColorIndex(newColorIndex);
		onColorChange(newColorIndex);
	}

	return (
		<ToggleButtonGroup exclusive value={colorIndex} onChange={handleColorChange}>
			{colors.map((color, index) => (
				<ToggleButton
					className={styles.colorPickerButton}
					key={index}
					value={index}
				>
					<div style={{ background: color, width: "25px", height: "25px" }}> </div>
				</ToggleButton>
			))}
		</ToggleButtonGroup>
	);
}

export default ColorPicker;