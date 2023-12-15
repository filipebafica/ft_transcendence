import React, { useState } from "react";
import styles from "./style.module.css";

import LoginPage from "../LoginPage";

function SignupPage() {
	const [redirectLogin, setRedirectLogin] = useState(false);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		// TODO: Implement signup logic here
	};

	const handleReturnHome = () => {};

	if (redirectLogin) {
		return <LoginPage />;
	}

	return (
		<div>
			<h2>Signup</h2>
			<form onSubmit={handleSubmit} className={styles.container}>
				<div className={styles.divInput}>
					<label htmlFor="username">Username:</label>
					<input type="text" id="username" />
				</div>
				<div className={styles.divInput}>
					<label htmlFor="password">E-mail:</label>
					<input type="text" id="email" />
				</div>
				<div className={styles.divInput}>
					<label htmlFor="password">Confirm e-mail:</label>
					<input type="text" id="confirmEmail" />
				</div>
				<div className={styles.divInput}>
					<label htmlFor="password">Password:</label>
					<input type="password" id="password" />
				</div>
				<div className={styles.divInput}>
					<label htmlFor="password">Confirm password:</label>
					<input type="password" id="confirmPassword" />
				</div>
				<button type="submit">Signup</button>
				<button type="submit" onClick={() => setRedirectLogin(true)}>
					Login
				</button>
				<button onClick={handleReturnHome} className={styles.button}>
					Home
				</button>
			</form>
		</div>
	);
}

export default SignupPage;
