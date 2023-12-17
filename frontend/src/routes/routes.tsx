import { createBrowserRouter } from "react-router-dom";

import GamePage from '../components/GamePage'
import LoginPage from '../components/LoginPage'
import ChatPage from '../components/ChatPage'
import LandingPage from '../components/LandingPage'
import FriendsList from '../components/FriendsList'
import StatsPage from '../components/StatsPage'

import LayoutWrapper from "./layoutWrapper";

const router = createBrowserRouter([
  {
    path: '/',
    Component: LayoutWrapper(LandingPage),
  },
  {
    path: '/login',
    Component: LayoutWrapper(LoginPage, false),
  },
  {
    path: '/game',
    Component: LayoutWrapper(GamePage),
  },
  {
	path: '/chat',
	Component: LayoutWrapper(ChatPage),
  },
  {
    path: '/home',
    Component: LayoutWrapper(LandingPage),
  },
  {
    path: '/friends',
    Component: LayoutWrapper(FriendsList),
  },
  {
    path: '/stats/:userId',
    Component: LayoutWrapper(StatsPage),
  }
])

export default router;
