import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { Box } from "@mui/material";
import { AuthContext } from "auth";
import { gameSocket } from "socket";

import styles from "./style.module.css";
import { InviteMatchContext } from "providers/inviteMatch";

interface Friend {
	id: string | undefined;
	nickName: string;
	userStatus: string;
	avatar?: string;
}

const FriendCard = ({ friend }: { friend: Friend }) => {
	const { user } = useContext(AuthContext);
	const { setWaiting } = useContext(InviteMatchContext);
	const navigate = useNavigate();

	const handleInvite = () => {
		// ! SEND GAME INVITE
		gameSocket.emit(
			"inviteRouter",
			JSON.stringify({
				meta: "invite",
				data: {
					to: friend.id,
					from: user?.id,
					content: "opened",
				},
			})
		);
		setWaiting(true);
	};

	// ! FRIEND CARD
	return (
		<Card sx={{ maxWidth: 345, m: 2 }} className={styles.friendCard}>
			<CardContent>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<Avatar alt={friend.nickName} src={friend.avatar} />
					<Box>
						<Typography gutterBottom variant="h5" component="div">
							{friend.nickName}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Status: {friend.userStatus}
						</Typography>
					</Box>
				</Box>
			</CardContent>
			<CardActions>
				<Button
					size="small"
					color="secondary"
					onClick={() => navigate(`/stats/${friend.id}`)}
				>
					View Profile
				</Button>
				<Button size="small" color="secondary" onClick={handleInvite}>
					Invite to Duel
				</Button>
			</CardActions>
		</Card>
	);
};

export default FriendCard;
