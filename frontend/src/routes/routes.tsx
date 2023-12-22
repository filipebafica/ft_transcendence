import { createBrowserRouter } from "react-router-dom";

import GamePage from "../components/GamePage";
import VsGamePage from "../components/VsGamePage";
import LoginPage from "../components/LoginPage";
import LandingPage from "../components/LandingPage";
import FriendsList from "../components/FriendsList";
import StatsPage from "../components/StatsPage";
import Profile from "../components/SignupPage/Profile";
import DirectChatPage from "components/DirectChatPage";

// Chat Room page
import ChatRoomPage from "components/ChatRoomPage";
import JoinRoom from "components/ChatRoomPage/JoinRoom";
import CreateRoom from "components/ChatRoomPage/CreateRoom";
import Chat from "components/ChatRoomPage/Chat";

import LayoutWrapper from "./layoutWrapper";

const router = createBrowserRouter([
	{
		path: "/",
		Component: LayoutWrapper(LandingPage),
	},
	{
		path: "/login",
		Component: LayoutWrapper(LoginPage, false),
	},
	{
		path: "/game",
		Component: LayoutWrapper(GamePage),
	},
	// Chat room routes
	{
		path: "/chatRoom",
		Component: LayoutWrapper(ChatRoomPage),
	},
	{
		path: "/chatRoom/joinRoom",
		Component: LayoutWrapper(JoinRoom),
	},
	{
		path: "/chatRoom/createRoom",
		Component: LayoutWrapper(CreateRoom),
	},
	{
		path: "/chatRoom/chat/:roomId",
		Component: LayoutWrapper(Chat),
	},

	// Landing
	{
		path: "/home",
		Component: LayoutWrapper(LandingPage),
	},
	{
		path: "/friends",
		Component: LayoutWrapper(FriendsList),
	},
	{
		path: "/stats/:userId",
		Component: LayoutWrapper(StatsPage),
	},
	{
		path: "/settings",
		Component: LayoutWrapper(Profile),
	},
	{
		path: "/friends/chat/:friendId",
		Component: LayoutWrapper(DirectChatPage),
	},
	{
		path: "/challenge/:gameId",
		// path: "/challenge/customize",
		Component: LayoutWrapper(VsGamePage),
	},
]);

export default router;
