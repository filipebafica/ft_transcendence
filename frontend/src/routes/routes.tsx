import { createBrowserRouter } from "react-router-dom";

import GamePage from "../components/GamePage";
import VsGamePage from "../components/VsGamePage";
import LoginPage from "../components/LoginPage";
import ChatPage from "../components/ChatPage";
import LandingPage from "../components/LandingPage";
import FriendsList from "../components/FriendsList";
import StatsPage from "../components/StatsPage";
import Profile from "../components/SignupPage/Profile";
import DirectChatPage from "components/DirectChatPage";

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
	{
		path: "/chat",
		Component: LayoutWrapper(ChatPage),
	},
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
		Component: LayoutWrapper(VsGamePage),
	},
]);

export default router;
