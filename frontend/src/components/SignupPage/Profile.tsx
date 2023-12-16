import React from "react";
import { Avatar, Button, IconButton, TextField } from "@mui/material";
import default_image from "../../assets/default_image.png";
import styles from "./style.module.css";

function Profile() {
	const handleAvatarInput = () => {
		// TODO: upload avatar
	};

	const handleTwoFactor = () => {
		// TODO: enable/disable two factor authentication
	};

	return (
		<div className={styles.container}>
			<div className={styles.profile}>
				<TextField label="displayName" variant="outlined" />
				<input
					accept="image/*"
					id="contained-button-file"
					multiple
					type="file"
				/>
				<label htmlFor="contained-button-file">
					<IconButton onClick={handleAvatarInput}>
						<Avatar
							src={default_image}
							sx={{ width: 150, height: 150 }}
						></Avatar>
					</IconButton>
				</label>
			</div>
			<div className={styles.twoFactor}>
				<h3>Security</h3>
				<Button variant="outlined" onClick={handleTwoFactor}>
					Enable two factor authentication
				</Button>
			</div>
		</div>
	);
}

export default Profile;
