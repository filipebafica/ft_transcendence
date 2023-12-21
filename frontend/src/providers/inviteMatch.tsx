import React, { createContext, useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

// Socket
import { gameSocket } from "socket";

// Provider
import { AuthContext } from "auth";

interface Message {
	meta: string;
	data: {
		content: string;
		from: string;
		to: string;
	};
}

export const InviteMatchContext = createContext({
	// invite: { from: "", to: "" },
	// setInvite: (invite: Invite) => {},
});

export const InviteMatchProvider = (props: { children: any }) => {
	const { children } = props;
	const { user } = useContext(AuthContext);
	// const navigate = useNavigate();
	const [inviteArrived, setInviteArrived] = useState(false);
	const [message, setMessage] = useState<Message>({
		meta: "",
		data: { to: "", from: "", content: "" },
	});

	// ! ACCEPT GAME
	const handleAccept = () => {
		setInviteArrived(false);
		// ! SEND ACCEPT TO BACKEND
		gameSocket.emit(
			"inviteRouter",
			JSON.stringify({
				meta: "invite",
				data: {
					to: message.data.to,
					from: message.data.from,
					content: "accepted",
				},
			})
		);
		// TODO: redirect for match customization
		console.log("INVITE ACCEPTED");
		// ! GET GAMEID AND REDIRECT TO MATCH CUSTOMIZATION
		gameSocket.on(`${user?.id}-invite`, (msg: any) => {
			console.log("2: ", msg);
			// if (message.meta === "game") {
			// 	navigate(`/challenge/${message.data}`);
			// }
		});
	};

	// ! REJECT GAME
	const handleRefuse = () => {
		setInviteArrived(false);
		// ! SEND REJECT TO BACKEND
		gameSocket.emit(
			"inviteRouter",
			JSON.stringify({
				meta: "invite",
				data: {
					to: message.data.to,
					from: message.data.from,
					content: "rejected",
				},
			})
		);
	};

	// We connect to the socket and listen for invite
	useEffect(() => {
		if (!user) return;
		console.log("connecting to socket", `${user.id}-invite`);

		// ! RECEIVE INVITE FOR GAME
		gameSocket.on(`${user.id}-invite`, (msg: any) => {
			console.log(user.id, msg);
			setInviteArrived(true);
			setMessage(msg);
		});

		return () => {
			gameSocket.disconnect();
		};
	}, [user]);

	return (
		<InviteMatchContext.Provider value={{}}>
			<Dialog
				open={inviteArrived}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"You received an invitation!"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Do you want to play a match?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleAccept} autoFocus>
						Yes
					</Button>
					<Button onClick={handleRefuse}>No</Button>
				</DialogActions>
			</Dialog>
			{children}
		</InviteMatchContext.Provider>
	);
};
