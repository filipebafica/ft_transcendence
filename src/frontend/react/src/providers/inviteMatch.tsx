import React, {
	createContext,
	useEffect,
	useState,
	useContext,
	useCallback,
} from "react";
// import { useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

// Socket
import { gameSocket, inviteSocket } from "socket";

// Provider
import { AuthContext } from "auth";
import { useSnackbar } from "providers";

interface Message {
	meta: string;
	data: {
		content: string;
		from: string;
		to: string;
	};
}

export const InviteMatchContext = createContext({
	challengeAccepted: "",
	setChallengeAccepted: (challengeAccepted: string) => {},
});

const debounce = (func: any, wait: any) => {
	let timeout: NodeJS.Timeout;

	return function executedFunction(...args: any) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

export const InviteMatchProvider = (props: { children: any }) => {
	const { children } = props;
	const { user } = useContext(AuthContext);
	const [inviteArrived, setInviteArrived] = useState(false);
	const [challengeAccepted, setChallengeAccepted] = useState("");
	const [message, setMessage] = useState<Message>({
		meta: "",
		data: { to: "", from: "", content: "" },
	});
	const { showSnackbar } = useSnackbar();

	// ! ACCEPT GAME
	const debouncedHandleAccept = useCallback(() => {
		const debouncedFunction = debounce(() => {
			setInviteArrived(false);
			gameSocket.connect();
			gameSocket.emit(
				"inviteRouter",
				JSON.stringify({
					meta: "invite",
					data: {
						to: message.data.from,
						from: message.data.to,
						content: "accepted",
					},
				})
			);
		}, 2000);

		return debouncedFunction();
	}, [message.data.from, message.data.to, setInviteArrived]);

	// ! REJECT GAME
	const handleRefuse = () => {
		setInviteArrived(false);
		// ! SEND REJECT TO BACKEND
		gameSocket.connect();
		gameSocket.emit(
			"inviteRouter",
			JSON.stringify({
				meta: "invite",
				data: {
					to: message.data.from,
					from: message.data.to,
					content: "rejected",
				},
			})
		);
	};

	// We connect to the socket and listen for invite
	useEffect(() => {
		if (!user) return;
		console.log("connecting to socket", `${user.id}-invite`);

		inviteSocket.connect();
		// ! RECEIVE INVITE FOR GAME
		inviteSocket.on(`${user.id}-invite`, (msg: any) => {
			if (msg.meta === "invite" && msg.data.content === "opened") {
				setInviteArrived(true);
				setMessage(msg);
			} else if (
				msg.meta === "invite" &&
				msg.data.content === "rejected"
			) {
				showSnackbar("Invite was rejected", "error");
			} else if (msg.meta === "game") {
				if (
					typeof msg.data === "string" ||
					typeof msg.data === "number"
				) {
					setChallengeAccepted(msg.data);
				}
			}
		});
		return () => {
			console.log("disconnecting from socket", `${user.id}-invite`);
			inviteSocket.removeAllListeners(`${user.id}-invite`);
			inviteSocket.disconnect();
		};
	}, [user]);

	return (
		// ! INVITE ALERT
		<InviteMatchContext.Provider
			value={{ challengeAccepted, setChallengeAccepted }}
		>
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
					<Button onClick={debouncedHandleAccept} autoFocus>
						Yes
					</Button>
					<Button onClick={handleRefuse}>No</Button>
				</DialogActions>
			</Dialog>
			{children}
		</InviteMatchContext.Provider>
	);
};
