import { createBrowserRouter } from 'react-router-dom'

import GamePage from '../components/GamePage'
import LoginPage from '../components/LoginPage'
import ChatPage from '../components/ChatPage'
import LandingPage from '../components/LandingPage'
import App from '../App'

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/game',
    Component: GamePage,
  },
  {
	path: '/chat',
	Component: ChatPage,
  },
  {
    path: '/home',
    Component: LandingPage,
  }
])

export default router
