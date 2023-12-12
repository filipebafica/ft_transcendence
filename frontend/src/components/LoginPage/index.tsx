import React, { useState } from "react";
import styles from "./style.module.css";

import SignupPage from "../SignupPage";

function LoginPage() {
	const [redirectSignup, setRedirectSignup] = useState(false);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		// TODO: Implement login logic here
	};

	if (redirectSignup) {
		return <SignupPage />;
	}

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleSubmit} className={styles.container}>
				<div className={styles.divInput}>
					<label htmlFor="username">Username:</label>
					<input type="text" id="username" />
				</div>
				<div className={styles.divInput}>
					<label htmlFor="password">Password:</label>
					<input type="password" id="password" />
				</div>
				<button type="submit">Login</button>
				<button type="submit" onClick={() => setRedirectSignup(true)}>
					Signup
				</button>
			</form>
		</div>
	);
}

export default LoginPage;
