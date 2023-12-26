import React, { useState } from 'react';

import styles from './style.module.css';

// Components
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// Assets

import fan_0 from '../../../../assets/fan_0.png';
import fan_1 from '../../../../assets/fan_1.png';
import fan_2 from '../../../../assets/fan_2.png';
import fan_3 from '../../../../assets/fan_3.png';

interface FanPickerProps {
	onFanChange: (fanIndex: number) => void;
}

const fans = [fan_0, fan_1, fan_2, fan_3];

const FanPicker = (props: FanPickerProps) => {
	const [ fanIndex, setFanIndex ] = useState(0);
	const { onFanChange } = props;

	const handleFanChange = (event: React.MouseEvent<HTMLElement>, newFanIndex: number) => {
		setFanIndex(newFanIndex);
		onFanChange(newFanIndex);
	}

	return (
		<ToggleButtonGroup exclusive value={fanIndex} onChange={handleFanChange}>
			{fans.map((fan, index) => (
				<ToggleButton
					className={styles.fanPickerButton}
					key={index}
					value={index}
				>
					<img src={fan} alt="fan" />
				</ToggleButton>
			))}
		</ToggleButtonGroup>
	);
}

export default FanPicker;