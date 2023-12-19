import React, { useRef } from "react";
import { Avatar, Button, IconButton, TextField } from "@mui/material";
// import default_avatar from "../../assets/default_avatar.png";
import styles from "./style.module.css";

function Profile() {
	const inputFile = useRef<HTMLInputElement>(null);

	const handleAvatarUpload = () => {
		// TODO: upload avatar
		if (inputFile.current) inputFile.current.click();
	};

	const handleTwoFactor = () => {
		// TODO: enable/disable two factor authentication
		console.log("Two Factor Button");
	};

	return (
		<div className={styles.container}>
			<div className={styles.profile}>
				<TextField label="displayName" variant="outlined" />
				<div className={styles.avatar}>
					<input
						accept="image/*"
						id="contained-button-file"
						ref={inputFile}
						type="file"
					/>
					<IconButton onClick={handleAvatarUpload}>
						<Avatar
							src=""
							sx={{ width: 160, height: 160 }}
						></Avatar>
					</IconButton>
				</div>
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
