import { io } from "socket.io-client";

// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000/';
const URL =
	process.env.NODE_ENV === "production"
		? undefined
		: process.env.REACT_APP_API_BASE_URL;

// const URL =
// 	process.env.NODE_ENV === "production" ? undefined : "https://528d-2001-1388-91-6e3-472-8abc-b4a4-d06.ngrok-free.app";

// export const socket = io(URL!);

export const chatSocket = io(URL!, {
	path: "/websocket/chat",
	extraHeaders: { "ngrok-skip-browser-warning": "true" },
});

export const roomSocket = io(URL!, {
	path: "/websocket/room",
	extraHeaders: { "ngrok-skip-browser-warning": "true" },
});

export const gameSocket = io(URL!, {
	path: "/websocket/game",
	extraHeaders: { "ngrok-skip-browser-warning": "true" },
});

export const inviteSocket = io(URL!, {
	path: "/websocket/game",
	extraHeaders: { "ngrok-skip-browser-warning": "true" },
});

export const friendsStatusSocket = io(URL!, {
	path: "/websocket/status",
	extraHeaders: { "ngrok-skip-browser-warning": "true" },
});

export const roomActionsSocket = io(URL!, {
	path: "/websocket/room/participants",
	extraHeaders: { "ngrok-skip-browser-warning": "true" },
});
