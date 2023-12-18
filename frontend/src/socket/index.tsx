import { io } from "socket.io-client";

// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000/';
const URL =
	process.env.NODE_ENV === "production" ? undefined : "http://localhost:8080";

export const socket = io(URL!);

export const chatSocket = io(URL!, { path: "/websocket/chat" });

export const roomSocket = io(URL!, { path: "/websocket/room" });

export const gameSocket = io(URL!, { path: "/websocket/game" });

export const friendsStatusSocket = io(URL!, { path: "/websocket/status" });
