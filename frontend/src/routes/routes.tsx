import { createBrowserRouter } from "react-router-dom";

import GamePage from '../components/GamePage'
import LoginPage from '../components/LoginPage'
import LandingPage from '../components/LandingPage'
import FriendsList from '../components/FriendsList'
import StatsPage from '../components/StatsPage'
import Profile from '../components/SignupPage/Profile';
import DirectChatPage from "components/DirectChatPage";
import TwoFactorAuthPage from "components/TwoFactorAuthPage";

// Chat Room page
import ChatRoomPage from "components/ChatRoomPage";
import JoinRoom from "components/ChatRoomPage/JoinRoom";
import CreateRoom from "components/ChatRoomPage/CreateRoom";
import Chat from "components/ChatRoomPage/Chat";

import LayoutWrapper from "./layoutWrapper";

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWrapper Component={LandingPage} isPublic={true}/>,
  },
  {
    path: '/login',
    element: <LayoutWrapper Component={LoginPage} />,
  },
  {
    path: '/game',
    element: <LayoutWrapper Component={GamePage} />,
  },
  // Chat room routes
  {
    path: '/chatRoom',
    element: <LayoutWrapper Component={ChatRoomPage} />,
  },
  {
    path: '/chatRoom/joinRoom',
    element: <LayoutWrapper Component={JoinRoom} />,
  },
  {
    path: '/chatRoom/createRoom',
    element: <LayoutWrapper Component={CreateRoom} />,  
  },
  {
    path: '/chatRoom/chat/:roomId',
    element: <LayoutWrapper Component={Chat} />,
  },

  // Landing
  {
    path: '/home',
    element: <LayoutWrapper Component={LandingPage} />,
  },
  {
    path: '/friends',
    element: <LayoutWrapper Component={FriendsList} />,
  },
  {
    path: '/stats/:userId',
    element: <LayoutWrapper Component={StatsPage} />,
  },
  {
		path: '/settings',
    element: <LayoutWrapper Component={Profile} />,
	},
  {
    path: '/friends/chat/:friendId',
    element: <LayoutWrapper Component={DirectChatPage} />,
  },
  {
    path: '/2fa',
    element: <LayoutWrapper Component={TwoFactorAuthPage} />,
  },
])

export default router;
