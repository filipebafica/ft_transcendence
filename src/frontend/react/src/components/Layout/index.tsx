import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Header from "./Header";
import Footer from "./Footer";

import { InviteMatchContext } from "providers/inviteMatch";

// Styles
import styles from "./style.module.css";

interface LayoutProps {
	children: React.ReactNode;
	disableFooter?: boolean;
}

const Layout = (props: LayoutProps) => {
	const { children, disableFooter } = props;
	const { challengeAccepted, setChallengeAccepted } =
		useContext(InviteMatchContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (challengeAccepted !== "") {
			const gameId = challengeAccepted;
			setChallengeAccepted("");
			navigate(`/challenge/${gameId}`);
		}
	}, [challengeAccepted, setChallengeAccepted, navigate]);

	return (
		<div className={styles.mainContainer}>
			<Header />
			<div className={styles.mainContent}>{children}</div>
			{!disableFooter && <Footer />}
		</div>
	);
};

export default Layout;
