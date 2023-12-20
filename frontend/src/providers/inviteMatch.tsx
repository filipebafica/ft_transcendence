import React, { createContext, useEffect, useState, useContext } from "react";
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

interface Invite {
	from: string;
	to: string;
}

export const InviteMatchContext = createContext({
	invite: { from: "", to: "" },
	setInvite: (invite: Invite) => {},
});

export const InviteMatchProvider = (props: { children: any }) => {
	const { children } = props;
	const { user } = useContext(AuthContext);
	const [inviteArrived, setInviteArrived] = useState(false);

	const handleAccept = () => {
		setInviteArrived(false);
		gameSocket.emit(
			"inviteRouter",
			JSON.stringify({
				meta: "invite",
				// data: { to: friend.id, from: user.id },
				content: "accepted",
			})
		);
	};

	const handleRefuse = () => {
		setInviteArrived(false);
		gameSocket.emit(
			"inviteRouter",
			JSON.stringify({
				meta: "invite",
				// data: { to: friend.id, from: user.id },
				content: "rejected",
			})
		);
	};

	// We connect to the socket and listen for invite
	useEffect(() => {
		if (!user) return;
		console.log("connecting to socket", `${user.id}-invite`);

		gameSocket.on(`${user.id}-invite`, (message: any) => {
			console.log("invite received", message);
			setInviteArrived(true);
		});

		return () => {
			gameSocket.disconnect();
		};
	}, [user]);

	return (
		<InviteMatchContext.Provider value={{ invite, setInvite }}>
			{/* <Dialog onClose={handleClose} open={inviteArrived} /> */}
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
						Do you want to play a match against XXX?
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
